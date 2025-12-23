import { db } from '../db';
import { news } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export class NewsController {
  // Public methods
  static async getAll() {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }

  static async getBySlug(slug: string) {
    const [article] = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
    
    if (!article) {
      throw new Error('News not found');
    }
    
    return article;
  }

  // Admin methods
  static async getAllAdmin() {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }

  static async getById(id: number) {
    const [article] = await db.select().from(news).where(eq(news.id, id)).limit(1);
    
    if (!article) {
      throw new Error('News not found');
    }
    
    return article;
  }

  static async create(data: {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    image?: string;
    category?: string;
    author?: string;
  }) {
    const result = await db.insert(news).values(data);
    return { id: result[0].insertId };
  }

  static async update(id: number, data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
  }>) {
    const result = await db.update(news).set(data).where(eq(news.id, id));

    if (!result[0].affectedRows) {
      throw new Error('News not found');
    }

    return { success: true };
  }

  static async delete(id: number) {
    const result = await db.delete(news).where(eq(news.id, id));

    if (!result[0].affectedRows) {
      throw new Error('News not found');
    }

    return { success: true };
  }
}
