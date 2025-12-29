import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { staticPlugin } from '@elysiajs/static';
import { env } from './config/env';
import { rateLimit } from './middleware/rateLimit';
import { authRoutes } from './routes/auth';
import { publicRoutes } from './routes/public';
import { adminProgramRoutes } from './routes/admin/programs';
import { adminNewsRoutes } from './routes/admin/news';
import { adminDonationRoutes } from './routes/admin/donations';
import { adminVolunteerRoutes } from './routes/admin/volunteers';
import { adminContactRoutes } from './routes/admin/contacts';
import { adminTeamRoutes } from './routes/admin/team';
import { uploadRoutes } from './routes/admin/upload';

const app = new Elysia()
  .use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        env.FRONTEND_URL
      ],
      credentials: true,
    })
  )
  // Global rate limiting: 100 requests per minute
  .use(
    rateLimit({
      max: 100,
      duration: 60 * 1000, // 1 minute
      message: 'Too many requests from this IP, please try again later.',
      skip: (request) => {
        // Skip rate limiting for localhost in development
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
        return env.NODE_ENV === 'development' && (ip === 'unknown' || ip.includes('127.0.0.1') || ip.includes('localhost'));
      }
    })
  )
  .use(staticPlugin({
    assets: 'public',
    prefix: '/',
  }))
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Sahabat Anak API',
          version: '1.0.0',
          description: 'API documentation for Sahabat Anak backend',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Public', description: 'Public endpoints' },
          { name: 'Admin', description: 'Admin endpoints (requires authentication)' },
        ],
      },
    })
  )
  .get('/', () => ({ message: 'Sahabat Anak API is running' }))
  .use(authRoutes)
  .use(publicRoutes)
  .use(uploadRoutes)
  .use(adminProgramRoutes)
  .use(adminNewsRoutes)
  .use(adminDonationRoutes)
  .use(adminVolunteerRoutes)
  .use(adminContactRoutes)
  .use(adminTeamRoutes)
  .listen(env.PORT);

console.log(`🚀 Server is running on http://localhost:${app.server?.port}`);
console.log(`📚 Swagger documentation: http://localhost:${app.server?.port}/swagger`);
console.log(`🌍 Environment: ${env.NODE_ENV}`);
console.log(`🔗 CORS enabled for: ${env.FRONTEND_URL}`);
