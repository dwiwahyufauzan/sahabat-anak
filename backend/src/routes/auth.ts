import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { AuthController } from '../controllers/auth.controller';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      exp: '7d',
    })
  )
  .post(
    '/login',
    async ({ body, jwt, set }) => {
      try {
        const admin = await AuthController.login(body.username, body.password);

        // Generate JWT token
        const token = await jwt.sign({
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        });

        return {
          token,
          admin,
        };
      } catch (error) {
        set.status = error instanceof Error && error.message === 'Account is disabled' ? 403 : 401;
        return { error: error instanceof Error ? error.message : 'Login failed' };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    '/register',
    async ({ body, jwt, set }) => {
      try {
        const admin = await AuthController.register(body);

        // Generate JWT token
        const token = await jwt.sign({
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        });

        return {
          token,
          admin,
        };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Registration failed' };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String(),
        fullName: t.String(),
        role: t.Optional(t.Union([t.Literal('super_admin'), t.Literal('admin'), t.Literal('editor')])),
      }),
    }
  )
  .get(
    '/me',
    async ({ headers, jwt, set }) => {
      try {
        const authHeader = headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          set.status = 401;
          return { error: 'No token provided' };
        }

        const token = authHeader.substring(7);
        const payload = await jwt.verify(token);

        if (!payload) {
          set.status = 401;
          return { error: 'Invalid token' };
        }

        const admin = await AuthController.getProfile(payload.id as number);
        return admin;
      } catch (error) {
        set.status = 401;
        return { error: error instanceof Error ? error.message : 'Invalid token' };
      }
    }
  );
