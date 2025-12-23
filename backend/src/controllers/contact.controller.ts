import { db } from '../db';
import { contactMessages } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export class ContactController {
  // Public methods
  static async create(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const result = await db.insert(contactMessages).values(data);
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

  static async delete(id: number) {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Message not found');
    }

    return { success: true };
  }
}
