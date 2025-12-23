import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { ContactController } from '../../controllers/contact.controller';

export const adminContactRoutes = new Elysia({ prefix: '/api/admin/contacts' })
  .use(authMiddleware)
  .get('/', async () => {
    return await ContactController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await ContactController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Message not found' };
    }
  })
  .put(
    '/:id/status',
    async ({ params, body, set }) => {
      try {
        return await ContactController.updateStatus(parseInt(params.id), body.status);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Message not found' };
      }
    },
    {
      body: t.Object({
        status: t.Union([t.Literal('unread'), t.Literal('read'), t.Literal('replied')]),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await ContactController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Message not found' };
    }
  });
