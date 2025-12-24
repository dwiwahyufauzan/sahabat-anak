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
        fullDescription: t.Optional(t.String()),
        category: t.String(),
        categoryColor: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        image: t.Optional(t.String()),
        heroImage: t.Optional(t.String()),
        targetAmount: t.Optional(t.String()),
        currentAmount: t.Optional(t.String()),
        location: t.Optional(t.String()),
        locations: t.Optional(t.String()), // JSON string
        targetAudience: t.Optional(t.String()),
        scheduleFrequency: t.Optional(t.String()),
        scheduleDuration: t.Optional(t.String()),
        objectives: t.Optional(t.String()), // JSON string
        activities: t.Optional(t.String()), // JSON string
        impact: t.Optional(t.String()), // JSON string
        testimonials: t.Optional(t.String()), // JSON string
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
          fullDescription: t.String(),
          category: t.String(),
          categoryColor: t.String(),
          icon: t.String(),
          image: t.String(),
          heroImage: t.String(),
          targetAmount: t.String(),
          currentAmount: t.String(),
          location: t.String(),
          locations: t.String(),
          targetAudience: t.String(),
          scheduleFrequency: t.String(),
          scheduleDuration: t.String(),
          objectives: t.String(),
          activities: t.String(),
          impact: t.String(),
          testimonials: t.String(),
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
