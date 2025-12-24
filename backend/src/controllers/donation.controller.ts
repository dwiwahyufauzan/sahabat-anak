import { db } from '../db';
import { donations } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { emailService } from '../services/email.service';

export class DonationController {
  // Public methods
  static async create(data: {
    programId?: number;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    amount: string;
    isAnonymous?: number;
    paymentMethod?: string;
    paymentProof?: string;
    message?: string;
  }) {
    const result = await db.insert(donations).values(data);
    const donationId = result[0].insertId;

    // Send auto-reply thank you email
    try {
      await emailService.sendDonationThankYouEmail({
        name: data.donorName,
        email: data.donorEmail,
        amount: data.amount,
        programName: data.programId ? `Program #${data.programId}` : undefined,
      });
      console.log(`Auto-reply email sent to ${data.donorEmail}`);
    } catch (error) {
      console.error('Error sending donation auto-reply email:', error);
      // Don't throw error, donation should still be created
    }

    return { id: donationId };
  }

  // Admin methods
  static async getAll() {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  static async getById(id: number) {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id)).limit(1);
    
    if (!donation) {
      throw new Error('Donation not found');
    }
    
    return donation;
  }

  static async updateStatus(id: number, status: 'pending' | 'completed' | 'failed') {
    const result = await db
      .update(donations)
      .set({ paymentStatus: status })
      .where(eq(donations.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Donation not found');
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(donations).where(eq(donations.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Donation not found');
    }

    return { success: true };
  }

  static async sendThankYouEmail(id: number) {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id)).limit(1);
    
    if (!donation) {
      throw new Error('Donation not found');
    }

    try {
      await emailService.sendDonationThankYouEmail({
        name: donation.donorName,
        email: donation.donorEmail,
        amount: donation.amount.toString(),
        programName: donation.programId ? `Program #${donation.programId}` : undefined,
      });
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send thank you email:', error);
      throw new Error('Failed to send email');
    }
  }
}
