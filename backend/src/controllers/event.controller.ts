import { db } from '../db';
import { events } from '../db/schema';
import { eq, desc, gte, and } from 'drizzle-orm';

export class EventController {
  // Public methods
  static async getAllActive() {
    // Get all upcoming and ongoing events
    return await db.select().from(events)
      .where(
        and(
          eq(events.status, 'upcoming'),
        )
      )
      .orderBy(events.startDate);
  }

  static async getAll() {
    // Get all events (for admin)
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  static async getBySlug(slug: string) {
    const [event] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  }

  static async getById(id: number) {
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  }

  static async create(data: any) {
    // Convert datetime strings to proper format
    const eventData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : new Date(),
    };
    
    await db.insert(events).values(eventData);
    
    // Get the created event
    const [created] = await db.select().from(events)
      .where(eq(events.slug, eventData.slug))
      .orderBy(desc(events.id))
      .limit(1);
    
    return created;
  }

  static async update(id: number, data: any) {
    // Convert datetime strings to proper format
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }
    
    await db.update(events)
      .set(updateData)
      .where(eq(events.id, id));
    
    return await this.getById(id);
  }

  static async delete(id: number) {
    await db.delete(events).where(eq(events.id, id));
    return { success: true };
  }

  // Helper method to generate slug from name
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Get upcoming events
  static async getUpcoming() {
    return await db.select().from(events)
      .where(eq(events.status, 'upcoming'))
      .orderBy(events.startDate)
      .limit(10);
  }

  // Get completed events
  static async getCompleted() {
    return await db.select().from(events)
      .where(eq(events.status, 'completed'))
      .orderBy(desc(events.endDate))
      .limit(10);
  }
}
