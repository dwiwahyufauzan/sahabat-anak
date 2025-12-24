import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { saveImage, deleteImage } from '../../utils/imageUpload';

export const uploadRoutes = new Elysia({ prefix: '/api/admin/upload' })
  .use(authMiddleware)
  .post('/', async ({ body, set }) => {
    try {
      const { image } = body as { image: File };
      
      if (!image) {
        set.status = 400;
        return {
          success: false,
          error: 'No image file provided'
        };
      }

      const imagePath = await saveImage(image, 'team');
      
      // Extract just the filename
      const filename = imagePath.split('/').pop();
      
      return {
        success: true,
        filename: filename,
        url: imagePath,
        message: 'Image uploaded successfully'
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      set.status = 400;
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  }, {
    body: t.Object({
      image: t.File({
        type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 5 * 1024 * 1024 // 5MB
      })
    })
  })
  
  .delete('/image', async ({ body }) => {
    try {
      const { path } = body as { path: string };
      
      if (!path) {
        throw new Error('No image path provided');
      }

      await deleteImage(path);
      
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image'
      };
    }
  }, {
    body: t.Object({
      path: t.String()
    })
  });
