import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { NewsController } from '../../controllers/news.controller';

export const adminNewsRoutes = new Elysia({ prefix: '/api/admin/news' })
  .use(authMiddleware)
  .get('/', async () => {
    return await NewsController.getAllAdmin();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await NewsController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'News not found' };
    }
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const result = await NewsController.create(body);
        return { success: true, ...result };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create news' };
      }
    },
    {
      body: t.Object({
        slug: t.String(),
        title: t.String(),
        excerpt: t.Optional(t.String()),
        content: t.String(),
        image: t.Optional(t.String()),
        category: t.Optional(t.String()),
        author: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        return await NewsController.update(parseInt(params.id), body);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'News not found' };
      }
    },
    {
      body: t.Partial(
        t.Object({
          slug: t.String(),
          title: t.String(),
          excerpt: t.String(),
          content: t.String(),
          image: t.String(),
          category: t.String(),
          author: t.String(),
        })
      ),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await NewsController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'News not found' };
    }
  });
