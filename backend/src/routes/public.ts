import { Elysia, t } from 'elysia';
import { ProgramController } from '../controllers/program.controller';
import { NewsController } from '../controllers/news.controller';
import { DonationController } from '../controllers/donation.controller';
import { VolunteerController } from '../controllers/volunteer.controller';
import { ContactController } from '../controllers/contact.controller';
import { TeamController } from '../controllers/team.controller';
import { secureFileUpload } from '../utils/secureUpload';

export const publicRoutes = new Elysia({ prefix: '/api' })
  // Programs routes
  .get('/programs', async () => {
    return await ProgramController.getAllActive();
  })
  .get('/programs/:slug', async ({ params, set }) => {
    try {
      return await ProgramController.getBySlug(params.slug);
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Program not found' };
    }
  })
  
  // News routes
  .get('/news', async () => {
    return await NewsController.getAll();
  })
  .get('/news/:slug', async ({ params, set }) => {
    try {
      return await NewsController.getBySlug(params.slug);
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'News not found' };
    }
  })
  
  // Team routes (PUBLIC)
  .get('/team', async () => {
    return await TeamController.getAllActive();
  })
  
  // Donations routes
  .post(
    '/donations',
    async ({ body, set }) => {
      try {
        let paymentProofPath;
        
        // Handle file upload if present with secure validation
        if (body.paymentProof) {
          paymentProofPath = await secureFileUpload(
            body.paymentProof,
            'payment-proofs',
            'image'
          );
        }
        
        // Remove paymentProof file from body and add the path instead
        const { paymentProof, ...donationData } = body;
        
        return await DonationController.create({
          ...donationData,
          paymentProof: paymentProofPath,
        });
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create donation' };
      }
    },
    {
      body: t.Object({
        programId: t.Optional(t.Number()),
        donorName: t.String(),
        donorEmail: t.String(),
        donorPhone: t.Optional(t.String()),
        amount: t.String(),
        isAnonymous: t.Optional(t.Number()),
        paymentMethod: t.Optional(t.String()),
        paymentProof: t.Optional(t.File({
          type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          maxSize: 5 * 1024 * 1024 // 5MB
        })),
        message: t.Optional(t.String()),
      }),
    }
  )
  
  // Volunteers routes
  .post(
    '/volunteers',
    async ({ body }) => {
      try {
        return await VolunteerController.create(body);
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to submit volunteer form' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        skills: t.Optional(t.String()),
        motivation: t.Optional(t.String()),
        availability: t.Optional(t.String()),
      }),
    }
  )
  
  // Contact routes
  .post(
    '/contact',
    async ({ body }) => {
      try {
        return await ContactController.create(body);
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to send message' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        subject: t.Optional(t.String()),
        message: t.String(),
      }),
    }
  );