import { Elysia, t } from 'elysia';
import { ProgramController } from '../controllers/program.controller';
import { NewsController } from '../controllers/news.controller';
import { DonationController } from '../controllers/donation.controller';
import { VolunteerController } from '../controllers/volunteer.controller';
import { ContactController } from '../controllers/contact.controller';
import { TeamController } from '../controllers/team.controller';
import { EventController } from '../controllers/event.controller';
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
  
  // Events routes
  .get('/events', async () => {
    return await EventController.getAllActive();
  })
  .get('/events/upcoming', async () => {
    return await EventController.getUpcoming();
  })
  .get('/events/completed', async () => {
    return await EventController.getCompleted();
  })
  .get('/events/:slug', async ({ params, set }) => {
    try {
      return await EventController.getBySlug(params.slug);
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Event not found' };
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
    async ({ body, set, headers }) => {
      try {
        let photoPath;
        
        // Check if it's a multipart/form-data request (file upload)
        const contentType = headers['content-type'] || '';
        const isFormData = contentType.includes('multipart/form-data');
        
        console.log('Content-Type:', contentType);
        console.log('Is FormData:', isFormData);
        
        // Handle file upload if present with secure validation
        // Type assertion for accessing photo property
        const bodyWithPhoto = body as any;
        console.log('Body has photo:', !!bodyWithPhoto.photo);
        
        if (bodyWithPhoto.photo && typeof bodyWithPhoto.photo === 'object') {
          console.log('Photo object:', {
            name: bodyWithPhoto.photo.name,
            type: bodyWithPhoto.photo.type,
            size: bodyWithPhoto.photo.size
          });
          
          try {
            photoPath = await secureFileUpload(
              bodyWithPhoto.photo,
              'volunteers',
              'image'
            );
            console.log('Photo uploaded to:', photoPath);
          } catch (uploadError) {
            console.error('Photo upload error:', uploadError);
            // Continue without photo if upload fails
          }
        }
        
        // Remove photo file from body and add the path instead
        const { photo, ...volunteerData } = bodyWithPhoto;
        
        return await VolunteerController.create({
          ...volunteerData,
          photo: photoPath,
        });
      } catch (error) {
        console.error('Volunteer creation error:', error);
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to submit volunteer form' };
      }
    },
    {
      body: t.Any() // Use t.Any() to accept any body format
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