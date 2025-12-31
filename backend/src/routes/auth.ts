import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '../config/env';
import { createRateLimiter, RateLimitConfig } from '../middleware/rateLimit';
import { AuthController } from '../controllers/auth.controller';

// Create dedicated rate limiters for auth endpoints
const loginRateLimiter = createRateLimiter();
const registerRateLimiter = createRateLimiter();

// Helper function to check rate limit
const checkRateLimit = (identifier: string, limiter: ReturnType<typeof createRateLimiter>, config: RateLimitConfig, set: any) => {
  const isLimited = limiter.check(identifier, config);
  
  if (isLimited) {
    const resetTime = limiter.getResetTime(identifier);
    set.status = 429;
    set.headers['Retry-After'] = String(resetTime);
    set.headers['X-RateLimit-Limit'] = String(config.max);
    set.headers['X-RateLimit-Remaining'] = '0';
    set.headers['X-RateLimit-Reset'] = String(resetTime);
    throw new Error(config.message || `Too many requests. Please try again in ${resetTime} seconds.`);
  }

  // Set rate limit headers
  const remaining = limiter.getRemaining(identifier, config);
  set.headers['X-RateLimit-Limit'] = String(config.max);
  set.headers['X-RateLimit-Remaining'] = String(remaining);
  set.headers['X-RateLimit-Reset'] = String(limiter.getResetTime(identifier));
};

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
      exp: '7d',
    })
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

        return payload;
      } catch (error) {
        set.status = 401;
        return { error: 'Invalid token' };
      }
    }
  )
  .post(
    '/login',
    async ({ body, jwt, set, request }) => {
      // Rate limiting: 5 attempts per 15 minutes
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
      
      checkRateLimit(ip, loginRateLimiter, {
        max: 5,
        duration: 15 * 60 * 1000, // 15 minutes
        message: 'Too many login attempts. Please try again in 15 minutes.',
      }, set);

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
    async ({ body, jwt, set, request }) => {
      // Rate limiting: 3 attempts per hour
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
      
      checkRateLimit(ip, registerRateLimiter, {
        max: 3,
        duration: 60 * 60 * 1000, // 1 hour
        message: 'Too many registration attempts. Please try again later.',
      }, set);

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
