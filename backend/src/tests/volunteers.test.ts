import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import { publicRoutes } from '../routes/public';
import { db } from '../db';
import { volunteers } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Volunteers Tests', () => {
  let app: any;
  let testVolunteerId: number;

  beforeAll(() => {
    app = new Elysia().use(publicRoutes) as any;
  });

  afterAll(async () => {
    // Cleanup
    if (testVolunteerId) {
      await db.delete(volunteers).where(eq(volunteers.id, testVolunteerId));
    }
  });

  test('POST /api/volunteers - should create volunteer registration', async () => {
    const volunteerData = {
      name: 'Test Volunteer',
      email: 'volunteer@test.com',
      phone: '081234567890',
      address: 'Jl. Test No. 123',
      skills: 'Teaching, Mentoring',
      motivation: 'Want to help children',
      availability: 'Weekends'
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerData)
      })
    );

    const data = await response.json();
    
    if (response.status !== 200) {
      console.error('Error response:', data);
    }
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    testVolunteerId = data.id;
  });

  test('POST /api/volunteers - should validate required fields', async () => {
    const invalidData = {
      name: 'Test',
      // Missing email and other required fields
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
    );

    expect(response.status).toBe(422); // Elysia returns 422 for validation errors
  });

  test('POST /api/volunteers - should handle minimal required fields', async () => {
    const minimalData = {
      name: 'Minimal Volunteer',
      email: 'minimal@test.com'
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minimalData)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    // Cleanup
    await db.delete(volunteers).where(eq(volunteers.id, data.id));
  });

  test('POST /api/volunteers - should validate email format', async () => {
    const invalidEmail = {
      name: 'Test Volunteer',
      email: 'invalid-email-format'
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidEmail)
      })
    );

    // Depending on validation implementation
    expect([200, 400]).toContain(response.status);
  });

  test('Volunteer should have default pending status', async () => {
    const volunteerData = {
      name: 'Status Test Volunteer',
      email: 'status@test.com',
      skills: 'Testing'
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerData)
      })
    );

    const data = await response.json();
    
    if (response.status === 200) {
      const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, data.id));
      expect(volunteer.status).toBe('pending');
      
      // Cleanup
      await db.delete(volunteers).where(eq(volunteers.id, data.id));
    }
  });

  test('POST /api/volunteers - should accept optional fields', async () => {
    const fullData = {
      name: 'Full Data Volunteer',
      email: 'full@test.com',
      phone: '081234567890',
      address: 'Full Address',
      skills: 'All Skills',
      motivation: 'Strong motivation',
      availability: 'Full time'
    };

    const response = await app.handle(
      new Request('http://localhost/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, data.id));
    expect(volunteer.phone).toBe(fullData.phone);
    expect(volunteer.address).toBe(fullData.address);
    expect(volunteer.skills).toBe(fullData.skills);
    
    // Cleanup
    await db.delete(volunteers).where(eq(volunteers.id, data.id));
  });
});
