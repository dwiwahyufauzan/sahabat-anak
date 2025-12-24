import { db } from '../db';
import { teamMembers } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

export class TeamController {
  // Public methods
  static async getAllActive() {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, 1))
      .orderBy(asc(teamMembers.order));
  }

  // Admin methods
  static async getAll() {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
  }

  static async getById(id: number) {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
    
    if (!member) {
      throw new Error('Team member not found');
    }
    
    return member;
  }

  static async create(data: {
    name: string;
    role: string;
    bio?: string;
    photo?: string;
    teamType?: 'leadership' | 'coordinators';
    order?: number;
    isActive?: number;
  }) {
    const result = await db.insert(teamMembers).values(data);
    return { id: result[0].insertId };
  }

  static async update(id: number, data: Partial<{
    name: string;
    role: string;
    bio: string;
    photo: string;
    teamType: 'leadership' | 'coordinators';
    order: number;
    isActive: number;
  }>) {
    const result = await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Team member not found');
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));

    if (!result[0].affectedRows) {
      throw new Error('Team member not found');
    }

    return { success: true };
  }
}