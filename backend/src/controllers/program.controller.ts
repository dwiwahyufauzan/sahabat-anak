import { db } from '../db';
import { programs } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export class ProgramController {
  // Public methods
  static async getAllActive() {
    return await db.select().from(programs).where(eq(programs.status, 'active'));
  }

  static async getBySlug(slug: string) {
    const [program] = await db.select().from(programs).where(eq(programs.slug, slug)).limit(1);
    
    if (!program) {
      throw new Error('Program not found');
    }
    
    return program;
  }

  // Admin methods
  static async getAll() {
    return await db.select().from(programs).orderBy(desc(programs.createdAt));
  }

  static async getById(id: number) {
    const [program] = await db.select().from(programs).where(eq(programs.id, id)).limit(1);
    
    if (!program) {
      throw new Error('Program not found');
    }
    
    return program;
  }

  static async create(data: {
    slug: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    targetAmount?: string;
    currentAmount?: string;
    location?: string;
    status?: 'active' | 'completed' | 'archived';
  }) {
    const result = await db.insert(programs).values(data);
    return { id: result[0].insertId };
  }

  static async update(id: number, data: Partial<{
    slug: string;
    title: string;
    description: string;
    category: string;
    image: string;
    targetAmount: string;
    currentAmount: string;
    location: string;
    status: 'active' | 'completed' | 'archived';
  }>) {
    const result = await db.update(programs).set(data).where(eq(programs.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Program not found');
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(programs).where(eq(programs.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Program not found');
    }

    return { success: true };
  }
}
