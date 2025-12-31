import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { EventController } from '../../controllers/event.controller';
import { secureFileUpload } from '../../utils/secureUpload';

export const adminEventRoutes = new Elysia({ prefix: '/api/admin/events' })
  .use(authMiddleware)
  .get('/', async () => {
    return await EventController.getAll();
  })
  .get('/:id', async ({ params, set }) => {
    try {
      return await EventController.getById(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Event not found' };
    }
  })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        console.log('Received event data:', body);
        
        let imagePath;
        
        // Handle file upload if present
        const bodyWithImage = body as any;
        if (bodyWithImage.image && typeof bodyWithImage.image === 'object') {
          imagePath = await secureFileUpload(
            bodyWithImage.image,
            'events',
            'image'
          );
        }
        
        // Remove image file from body and add the path instead
        const { image, ...eventData } = bodyWithImage;
        
        // Generate slug if not provided
        if (!eventData.slug) {
          eventData.slug = EventController.generateSlug(eventData.name);
        }
        
        console.log('Creating event with data:', { ...eventData, image: imagePath });
        
        const result = await EventController.create({
          ...eventData,
          image: imagePath || eventData.imageUrl, // Use uploaded path or URL
        });
        
        console.log('Event created successfully:', result);
        return { success: true, ...result };
      } catch (error) {
        console.error('Event creation error:', error);
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create event' };
      }
    },
    {
      body: t.Any() // Use t.Any() to handle multipart/form-data
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        let imagePath;
        
        // Handle file upload if present
        const bodyWithImage = body as any;
        if (bodyWithImage.image && typeof bodyWithImage.image === 'object') {
          imagePath = await secureFileUpload(
            bodyWithImage.image,
            'events',
            'image'
          );
        }
        
        // Remove image file from body and add the path instead
        const { image, ...eventData } = bodyWithImage;
        
        return await EventController.update(parseInt(params.id), {
          ...eventData,
          image: imagePath || eventData.imageUrl || undefined,
        });
      } catch (error) {
        set.status = 404;
        return { error: error instanceof Error ? error.message : 'Event not found' };
      }
    },
    {
      body: t.Any() // Use t.Any() to handle multipart/form-data
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      return await EventController.delete(parseInt(params.id));
    } catch (error) {
      set.status = 404;
      return { error: error instanceof Error ? error.message : 'Event not found' };
    }
  });
