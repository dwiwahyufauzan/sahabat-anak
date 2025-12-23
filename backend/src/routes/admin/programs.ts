import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { ProgramController } from '../../controllers/program.controller';

export const adminProgramRoutes = new Elysia({ prefix: '/api/admin/programs' })
  .use(authMiddleware)
  .get('/', async () => {
    return await ProgramController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await ProgramController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Program not found' };
    }
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const result = await ProgramController.create(body);
        return { success: true, ...result };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create program' };
      }
    },
    {
      body: t.Object({
        slug: t.String(),
        title: t.String(),
        description: t.String(),
        category: t.String(),
        image: t.Optional(t.String()),
        targetAmount: t.Optional(t.String()),
        currentAmount: t.Optional(t.String()),
        location: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('active'), t.Literal('completed'), t.Literal('archived')])),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        return await ProgramController.update(parseInt(params.id), body);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Program not found' };
      }
    },
    {
      body: t.Partial(
        t.Object({
          slug: t.String(),
          title: t.String(),
          description: t.String(),
          category: t.String(),
          image: t.String(),
          targetAmount: t.String(),
          currentAmount: t.String(),
          location: t.String(),
          status: t.Union([t.Literal('active'), t.Literal('completed'), t.Literal('archived')]),
        })
      ),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await ProgramController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Program not found' };
    }
  });
