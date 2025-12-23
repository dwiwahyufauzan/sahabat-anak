import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { staticPlugin } from '@elysiajs/static';
import { authRoutes } from './routes/auth';
import { publicRoutes } from './routes/public';
import { adminProgramRoutes } from './routes/admin/programs';
import { adminNewsRoutes } from './routes/admin/news';
import { adminDonationRoutes } from './routes/admin/donations';
import { adminVolunteerRoutes } from './routes/admin/volunteers';
import { adminContactRoutes } from './routes/admin/contacts';
import { adminTeamRoutes } from './routes/admin/team';

const app = new Elysia()
  .use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL || 'http://localhost:5173'
      ],
      credentials: true,
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
  .use(adminProgramRoutes)
  .use(adminNewsRoutes)
  .use(adminDonationRoutes)
  .use(adminVolunteerRoutes)
  .use(adminContactRoutes)
  .use(adminTeamRoutes)
  .listen(parseInt(process.env.PORT || '3000'));

console.log(`🚀 Server is running on http://localhost:${app.server?.port}`);
console.log(`📚 Swagger documentation: http://localhost:${app.server?.port}/swagger`);
