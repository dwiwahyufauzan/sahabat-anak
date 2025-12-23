import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import { publicRoutes } from '../routes/public';
import { adminProgramRoutes } from '../routes/admin/programs';
import { authRoutes } from '../routes/auth';
import { db } from '../db';
import { programs, admins } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Programs Tests', () => {
  let publicApp: any;
  let adminApp: any;
  let authApp: any;
  let testProgramId: number;
  let authToken = '';
  let testAdminId: number;

  beforeAll(async () => {
    publicApp = new Elysia().use(publicRoutes) as any;
    authApp = new Elysia().use(authRoutes) as any;
    adminApp = new Elysia().use(adminProgramRoutes) as any;
    
    // Clean up test admin if exists
    await db.delete(admins).where(eq(admins.username, 'testprogramadmin'));
    
    // Create test admin
    const hashedPassword = await Bun.password.hash('TestPass123!');
    const [admin] = await db.insert(admins).values({
      username: 'testprogramadmin',
      email: 'programtest@admin.com',
      password: hashedPassword,
      fullName: 'Test Program Admin'
    }).$returningId();
    
    testAdminId = admin.id;
    
    // Login to get real token
    const loginResponse = await authApp.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testprogramadmin',
          password: 'TestPass123!'
        })
      })
    );
    
    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  afterAll(async () => {
    // Cleanup
    if (testProgramId) {
      await db.delete(programs).where(eq(programs.id, testProgramId));
    }
    await db.delete(admins).where(eq(admins.username, 'testprogramadmin'));
  });

  test('GET /api/programs - should return all active programs', async () => {
    const response = await publicApp.handle(
      new Request('http://localhost/api/programs')
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST /api/admin/programs - should create new program', async () => {
    const newProgram = {
      slug: 'test-program-' + Date.now(),
      title: 'Test Program',
      description: 'This is a test program',
      category: 'Pendidikan',
      image: 'https://example.com/image.jpg',
      targetAmount: '10000000',
      location: 'Jakarta',
      status: 'active'
    };

    const response = await adminApp.handle(
      new Request('http://localhost/api/admin/programs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newProgram)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    testProgramId = data.id;
  });

  test('GET /api/programs/:slug - should return program by slug', async () => {
    // First create a program
    const slug = 'test-program-get-' + Date.now();
    await db.insert(programs).values({
      slug,
      title: 'Get Test Program',
      description: 'Test description',
      category: 'Kesehatan',
      status: 'active'
    });

    const response = await publicApp.handle(
      new Request(`http://localhost/api/programs/${slug}`)
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.slug).toBe(slug);
    expect(data.title).toBe('Get Test Program');
    
    // Cleanup
    await db.delete(programs).where(eq(programs.slug, slug));
  });

  test('GET /api/programs/:slug - should return 404 for non-existent program', async () => {
    const response = await publicApp.handle(
      new Request('http://localhost/api/programs/non-existent-slug')
    );

    expect(response.status).toBe(404);
  });

  test('PUT /api/admin/programs/:id - should update program', async () => {
    // Create program first
    const [result] = await db.insert(programs).values({
      slug: 'update-test-' + Date.now(),
      title: 'Original Title',
      description: 'Original description',
      category: 'Pendidikan',
      status: 'active'
    });

    const programId = result.insertId;

    const updateData = {
      title: 'Updated Title',
      description: 'Updated description'
    };

    const response = await adminApp.handle(
      new Request(`http://localhost/api/admin/programs/${programId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      })
    );

    expect(response.status).toBe(200);
    
    // Verify update
    const [updated] = await db.select().from(programs).where(eq(programs.id, programId));
    expect(updated.title).toBe('Updated Title');
    
    // Cleanup
    await db.delete(programs).where(eq(programs.id, programId));
  });

  test('DELETE /api/admin/programs/:id - should delete program', async () => {
    // Create program first
    const [result] = await db.insert(programs).values({
      slug: 'delete-test-' + Date.now(),
      title: 'Delete Test',
      description: 'To be deleted',
      category: 'Pendidikan',
      status: 'active'
    });

    const programId = result.insertId;

    const response = await adminApp.handle(
      new Request(`http://localhost/api/admin/programs/${programId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      })
    );

    expect(response.status).toBe(200);
    
    // Verify deletion
    const deleted = await db.select().from(programs).where(eq(programs.id, programId));
    expect(deleted.length).toBe(0);
  });
});
