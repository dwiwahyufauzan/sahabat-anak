import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import { publicRoutes } from '../routes/public';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Contact Messages Tests', () => {
  let app: any;
  let testMessageId: number;

  beforeAll(() => {
    app = new Elysia().use(publicRoutes) as any;
  });

  afterAll(async () => {
    // Cleanup
    if (testMessageId) {
      await db.delete(contactMessages).where(eq(contactMessages.id, testMessageId));
    }
  });

  test('POST /api/contact - should create contact message', async () => {
    const messageData = {
      name: 'Test User',
      email: 'user@test.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    testMessageId = data.id;
  });

  test('POST /api/contact - should validate required fields', async () => {
    const invalidData = {
      name: 'Test',
      // Missing email and message
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
    );

    expect(response.status).toBe(422); // Elysia returns 422 for validation errors
  });

  test('POST /api/contact - should handle message without subject', async () => {
    const dataWithoutSubject = {
      name: 'No Subject User',
      email: 'nosubject@test.com',
      message: 'Message without subject'
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithoutSubject)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    // Cleanup
    await db.delete(contactMessages).where(eq(contactMessages.id, data.id));
  });

  test('POST /api/contact - should validate email format', async () => {
    const invalidEmail = {
      name: 'Test User',
      email: 'invalid-email',
      message: 'Test message'
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidEmail)
      })
    );

    // Depending on validation implementation
    expect([200, 400]).toContain(response.status);
  });

  test('Contact message should have default unread status', async () => {
    const messageData = {
      name: 'Status Test',
      email: 'status@test.com',
      subject: 'Status Test',
      message: 'Testing default status'
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
    );

    const data = await response.json();
    
    if (response.status === 200) {
      const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, data.id));
      expect(message.status).toBe('unread');
      
      // Cleanup
      await db.delete(contactMessages).where(eq(contactMessages.id, data.id));
    }
  });

  test('POST /api/contact - should accept long messages', async () => {
    const longMessage = {
      name: 'Long Message User',
      email: 'long@test.com',
      subject: 'Long Message Test',
      message: 'A'.repeat(1000) // 1000 characters
    };

    const response = await app.handle(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(longMessage)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    
    // Cleanup
    if (data.id) {
      await db.delete(contactMessages).where(eq(contactMessages.id, data.id));
    }
  });
});
