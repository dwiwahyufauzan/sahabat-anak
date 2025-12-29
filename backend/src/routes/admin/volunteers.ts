import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { VolunteerController } from '../../controllers/volunteer.controller';

export const adminVolunteerRoutes = new Elysia({ prefix: '/api/admin/volunteers' })
  .use(authMiddleware)
  .get('/', async () => {
    return await VolunteerController.getAll();
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        return await VolunteerController.create(body);
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create volunteer' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        phone: t.String(),
        address: t.Optional(t.String()),
        skills: t.Optional(t.String()),
        motivation: t.Optional(t.String()),
        availability: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('pending'), t.Literal('approved'), t.Literal('rejected')]))
      }),
    }
  )
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
