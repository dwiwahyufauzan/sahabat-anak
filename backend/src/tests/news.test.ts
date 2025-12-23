import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import { publicRoutes } from '../routes/public';
import { db } from '../db';
import { news } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('News Tests', () => {
  let app: any;
  let testNewsId: number;

  beforeAll(() => {
    app = new Elysia().use(publicRoutes) as any;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testNewsId) {
      await db.delete(news).where(eq(news.id, testNewsId));
    }
  });

  test('GET /api/news - should return all news articles', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/news')
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/news/:slug - should return news by slug', async () => {
    // Create test news
    const slug = 'test-news-' + Date.now();
    const [result] = await db.insert(news).values({
      slug,
      title: 'Test News Article',
      excerpt: 'Test excerpt',
      content: 'Test content',
      category: 'Program',
      author: 'Test Author'
    });

    testNewsId = result.insertId;

    const response = await app.handle(
      new Request(`http://localhost/api/news/${slug}`)
    );

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.slug).toBe(slug);
    expect(data.title).toBe('Test News Article');
  });

  test('GET /api/news/:slug - should return 404 for non-existent news', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/news/non-existent-news')
    );

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('News should have required fields', async () => {
    const [article] = await db.select().from(news).limit(1);
    
    if (article) {
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('content');
      expect(article).toHaveProperty('createdAt');
    }
  });
});
