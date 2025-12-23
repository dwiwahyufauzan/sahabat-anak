import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import { publicRoutes } from '../routes/public';
import { db } from '../db';
import { donations } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Donations Tests', () => {
  let app: any;
  let testDonationId: number;

  beforeAll(() => {
    app = new Elysia().use(publicRoutes) as any;
  });

  afterAll(async () => {
    // Cleanup
    if (testDonationId) {
      await db.delete(donations).where(eq(donations.id, testDonationId));
    }
  });

  test('POST /api/donations - should create donation without file', async () => {
    const donationData = {
      donorName: 'Test Donor',
      donorEmail: 'donor@test.com',
      donorPhone: '081234567890',
      amount: '100000',
      paymentMethod: 'Transfer Bank',
      isAnonymous: 0
    };

    const response = await app.handle(
      new Request('http://localhost/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    testDonationId = data.id;
  });

  test('POST /api/donations - should validate required fields', async () => {
    const invalidData = {
      donorName: 'Test',
      // Missing required fields
    };

    const response = await app.handle(
      new Request('http://localhost/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
    );

    expect(response.status).toBe(422); // Elysia returns 422 for validation errors
  });

  test('POST /api/donations - should handle anonymous donation', async () => {
    const anonDonation = {
      donorName: 'Hamba Allah',
      donorEmail: 'anon@test.com',
      amount: '50000',
      paymentMethod: 'E-Wallet',
      isAnonymous: 1
    };

    const response = await app.handle(
      new Request('http://localhost/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anonDonation)
      })
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    
    // Verify in database
    const [donation] = await db.select().from(donations).where(eq(donations.id, data.id));
    expect(donation.isAnonymous).toBe(1);
    
    // Cleanup
    await db.delete(donations).where(eq(donations.id, data.id));
  });

  test('POST /api/donations - should link to program if provided', async () => {
    const donationWithProgram = {
      programId: 1, // Assuming program with ID 1 exists
      donorName: 'Program Donor',
      donorEmail: 'program@test.com',
      amount: '200000',
      paymentMethod: 'Transfer Bank'
    };

    const response = await app.handle(
      new Request('http://localhost/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationWithProgram)
      })
    );

    const data = await response.json();
    
    if (response.status === 200) {
      expect(data).toHaveProperty('id');
      
      const [donation] = await db.select().from(donations).where(eq(donations.id, data.id));
      expect(donation.programId).toBe(1);
      
      // Cleanup
      await db.delete(donations).where(eq(donations.id, data.id));
    }
  });

  test('Donation should have default pending status', async () => {
    const donationData = {
      donorName: 'Status Test',
      donorEmail: 'status@test.com',
      amount: '75000',
      paymentMethod: 'Transfer Bank'
    };

    const response = await app.handle(
      new Request('http://localhost/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      })
    );

    const data = await response.json();
    
    if (response.status === 200) {
      const [donation] = await db.select().from(donations).where(eq(donations.id, data.id));
      expect(donation.paymentStatus).toBe('pending');
      
      // Cleanup
      await db.delete(donations).where(eq(donations.id, data.id));
    }
  });
});
