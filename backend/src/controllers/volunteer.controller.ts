import { db } from '../db';
import { volunteers } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { emailService } from '../services/email.service';

export class VolunteerController {
  // Public methods
  static async create(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    skills?: string;
    motivation?: string;
    availability?: string;
  }) {
    const result = await db.insert(volunteers).values(data);
    return { id: result[0].insertId };
  }

  // Admin methods
  static async getAll() {
    return await db.select().from(volunteers).orderBy(desc(volunteers.createdAt));
  }

  static async getById(id: number) {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, id)).limit(1);
    
    if (!volunteer) {
      throw new Error('Volunteer not found');
    }
    
    return volunteer;
  }

  static async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
    // Get volunteer data first to send email
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, id)).limit(1);
    
    if (!volunteer) {
      throw new Error('Volunteer not found');
    }

    // Update status
    const result = await db
      .update(volunteers)
      .set({ status })
      .where(eq(volunteers.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Volunteer not found');
    }

    // Send email notification
    try {
      await emailService.sendVolunteerStatusEmail({
        name: volunteer.name,
        email: volunteer.email,
        status,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't fail the request if email fails
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(volunteers).where(eq(volunteers.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Volunteer not found');
    }

    return { success: true };
  }
}
