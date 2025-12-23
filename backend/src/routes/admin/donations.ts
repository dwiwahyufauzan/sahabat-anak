import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { DonationController } from '../../controllers/donation.controller';

export const adminDonationRoutes = new Elysia({ prefix: '/api/admin/donations' })
  .use(authMiddleware)
  .get('/', async () => {
    return await DonationController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await DonationController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Donation not found' };
    }
  })
  .put(
    '/:id/status',
    async ({ params, body, set }) => {
      try {
        return await DonationController.updateStatus(parseInt(params.id), body.status);
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Donation not found' };
      }
    },
    {
      body: t.Object({
        status: t.Union([t.Literal('pending'), t.Literal('completed'), t.Literal('failed')]),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await DonationController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Donation not found' };
    }
  })
  .post('/:id/send-email', async ({ params, set }) => {
    try {
      return await DonationController.sendThankYouEmail(parseInt(params.id));
    } catch (error) {
      set.status = 500;
      return { error: error instanceof Error ? error.message : 'Failed to send email' };
    }
  });
