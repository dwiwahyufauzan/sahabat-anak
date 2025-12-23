import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { VolunteerController } from '../../controllers/volunteer.controller';

export const adminVolunteerRoutes = new Elysia({ prefix: '/api/admin/volunteers' })
  .use(authMiddleware)
  .get('/', async () => {
    return await VolunteerController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await VolunteerController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Volunteer not found' };
    }
  })
  .put(
    '/:id/status',
    async ({ params, body, set }) => {
      try {
        return await VolunteerController.updateStatus(parseInt(params.id), body.status);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Volunteer not found' };
      }
    },
    {
      body: t.Object({
        status: t.Union([t.Literal('pending'), t.Literal('approved'), t.Literal('rejected')]),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await VolunteerController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Volunteer not found' };
    }
  });
