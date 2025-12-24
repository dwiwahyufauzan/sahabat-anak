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
  .post(
    '/:id/reply',
    async ({ params, body, set, user }) => {
      try {
        if (!user || !user.id) {
          set.status = 401;
          return { error: 'Unauthorized' };
        }
        return await ContactController.sendReply(parseInt(params.id), {
          reply: body.reply,
          repliedBy: typeof user.id === 'number' ? user.id : parseInt(user.id as string)
        });
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to send reply' };
      }
    },
    {
      body: t.Object({
        reply: t.String({ minLength: 1 }),
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
