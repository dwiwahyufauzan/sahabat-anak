import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '../config/env';

export const authMiddleware = (app: Elysia) =>
  app
    .use(
      jwt({
        name: 'jwt',
        secret: env.JWT_SECRET,
      })
    )
    .derive(async ({ headers, jwt, set }) => {
      const authHeader = headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        throw new Error('No token provided');
      }

      const token = authHeader.substring(7);
      const payload = await jwt.verify(token);

      if (!payload) {
        set.status = 401;
        throw new Error('Invalid token');
      }

      return { user: payload };
    });
