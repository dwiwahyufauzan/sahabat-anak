import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { TeamController } from '../../controllers/team.controller';

export const adminTeamRoutes = new Elysia({ prefix: '/api/admin/team' })
  .use(authMiddleware)
  .get('/', async () => {
    return await TeamController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await TeamController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Team member not found' };
    }
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const result = await TeamController.create(body);
        return { success: true, ...result };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create team member' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        role: t.String(),
        bio: t.Optional(t.String()),
        photo: t.Optional(t.String()),
        teamType: t.Optional(t.Union([t.Literal('leadership'), t.Literal('coordinators')])),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Number()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        return await TeamController.update(parseInt(params.id), body);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Team member not found' };
      }
    },
    {
      body: t.Partial(
        t.Object({
          name: t.String(),
          role: t.String(),
          bio: t.String(),
          photo: t.String(),
          teamType: t.Union([t.Literal('leadership'), t.Literal('coordinators')]),
          order: t.Number(),
          isActive: t.Number(),
        })
      ),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await TeamController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Team member not found' };
    }
  });