import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { VolunteerController } from '../../controllers/volunteer.controller';
import { secureFileUpload } from '../../utils/secureUpload';

export const adminVolunteerRoutes = new Elysia({ prefix: '/api/admin/volunteers' })
  .use(authMiddleware)
  .get('/', async () => {
    return await VolunteerController.getAll();
  })
  .post(
    '/',
    async ({ body, set, headers }) => {
      try {
        let photoPath;
        
        // Check if it's a multipart/form-data request (file upload)
        const contentType = headers['content-type'] || '';
        const isFormData = contentType.includes('multipart/form-data');
        
        console.log('[Admin] Content-Type:', contentType);
        console.log('[Admin] Is FormData:', isFormData);
        
        // Handle file upload if present with secure validation
        // Type assertion for accessing photo property
        const bodyWithPhoto = body as any;
        console.log('[Admin] Body has photo:', !!bodyWithPhoto.photo);
        
        if (bodyWithPhoto.photo && typeof bodyWithPhoto.photo === 'object') {
          console.log('[Admin] Photo object:', {
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
            console.log('[Admin] Photo uploaded to:', photoPath);
          } catch (uploadError) {
            console.error('[Admin] Photo upload error:', uploadError);
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
        console.error('[Admin] Volunteer creation error:', error);
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create volunteer' };
      }
    },
    {
      body: t.Any() // Use t.Any() to accept any body format
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
