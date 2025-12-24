import { db } from '../db';
import { contactMessages } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { emailService } from '../services/email.service';

export class ContactController {
  // Public methods
  static async create(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const result = await db.insert(contactMessages).values(data);
    
    // Kirim email balasan otomatis kepada pengirim
    try {
      await emailService.sendContactReplyEmail({
        name: data.name,
        email: data.email,
        subject: data.subject
      });
      console.log(`Auto-reply email sent to ${data.email}`);
    } catch (error) {
      console.error('Failed to send auto-reply email:', error);
      // Tetap return success karena pesan sudah tersimpan
    }
    
    return { id: result[0].insertId };
  }

  // Admin methods
  static async getAll() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  static async getById(id: number) {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    return message;
  }

  static async updateStatus(id: number, status: 'unread' | 'read' | 'replied') {
    const result = await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Message not found');
    }

    return { success: true };
  }

  static async sendReply(id: number, replyData: { reply: string; repliedBy: number }) {
    // Get the original message
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    if (!message) {
      throw new Error('Message not found');
    }

    // Update with reply
    const result = await db
      .update(contactMessages)
      .set({
        reply: replyData.reply,
        repliedBy: replyData.repliedBy,
        repliedAt: new Date(),
        status: 'replied'
      })
      .where(eq(contactMessages.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Failed to send reply');
    }

    // Send reply email
    try {
      await emailService.sendContactManualReply({
        name: message.name,
        email: message.email,
        subject: message.subject || 'Pesan Anda',
        originalMessage: message.message,
        reply: replyData.reply
      });
      console.log(`Manual reply email sent to ${message.email}`);
    } catch (error) {
      console.error('Failed to send reply email:', error);
      throw new Error('Reply saved but failed to send email');
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Message not found');
    }

    return { success: true };
  }
}
