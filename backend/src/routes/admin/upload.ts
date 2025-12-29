import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middleware/auth';
import { secureFileUpload, secureFileDelete } from '../../utils/secureUpload';

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

      // Use secure upload utility with validation
      const imagePath = await secureFileUpload(image, 'team', 'image');
      
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
        type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        maxSize: 5 * 1024 * 1024 // 5MB
      })
    })
  })
  
  .delete('/image', async ({ body, set }) => {
    try {
      const { path } = body as { path: string };
      
      if (!path) {
        set.status = 400;
        return {
          success: false,
          error: 'No image path provided'
        };
      }

      // Use secure delete with path validation
      await secureFileDelete(path);
      
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete error:', error);
      set.status = 500;
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
