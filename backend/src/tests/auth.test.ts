import { describe, test, expect, beforeAll } from 'bun:test';
import { Elysia } from 'elysia';
import { authRoutes } from '../routes/auth';
import { db } from '../db';
import { admins } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Authentication Tests', () => {
  let app: any;
  let testAdmin = {
    username: 'testadmin',
    email: 'test@admin.com',
    password: 'Test123!@#',
    fullName: 'Test Admin'
  };
  let authToken = '';

  beforeAll(async () => {
    app = new Elysia().use(authRoutes);
    
    // Clean up test admin if exists
    await db.delete(admins).where(eq(admins.username, testAdmin.username));
  });

  test('POST /api/auth/register - should register new admin', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAdmin)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('token');
    expect(data.admin.username).toBe(testAdmin.username);
    expect(data.admin.email).toBe(testAdmin.email);
    
    authToken = data.token;
  });

  test('POST /api/auth/register - should reject duplicate username', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAdmin)
      })
    );

    expect(response.status).toBe(400);
  });

  test('POST /api/auth/login - should login with correct credentials', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testAdmin.username,
          password: testAdmin.password
        })
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('token');
    expect(data.admin.username).toBe(testAdmin.username);
  });

  test('POST /api/auth/login - should reject wrong password', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testAdmin.username,
          password: 'wrongpassword'
        })
      })
    );

    expect(response.status).toBe(401);
  });

  test('POST /api/auth/login - should reject non-existent user', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'nonexistent',
          password: 'password'
        })
      })
    );

    expect(response.status).toBe(401);
  });

  test('GET /api/auth/me - should get admin profile with valid token', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.username).toBe(testAdmin.username);
    expect(data.email).toBe(testAdmin.email);
  });

  test('GET /api/auth/me - should reject invalid token', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer invalid-token'
        }
      })
    );

    expect(response.status).toBe(401);
  });

  test('GET /api/auth/me - should reject missing token', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET'
      })
    );

    expect(response.status).toBe(401);
  });
});
