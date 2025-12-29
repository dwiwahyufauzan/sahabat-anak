import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Database Configuration
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.string().regex(/^\d+$/, 'DB_PORT must be a number').transform(Number),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().optional().default(''),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),

  // Server Configuration
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number').transform(Number).default(3000),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // JWT Secret (MUST be set in production)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for security'),

  // Email Configuration (SMTP)
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.string().regex(/^\d+$/, 'SMTP_PORT must be a number').transform(Number),
  SMTP_SECURE: z.string().default('false').transform(val => val === 'true'),
  SMTP_USER: z.string().email('SMTP_USER must be a valid email'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    
    // Additional security checks for production
    if (env.NODE_ENV === 'production') {
      // Ensure JWT_SECRET is strong enough
      if (env.JWT_SECRET.includes('super-secret') || env.JWT_SECRET.includes('change')) {
        throw new Error('JWT_SECRET appears to be a default value. Please use a strong, unique secret in production!');
      }

      // Ensure FRONTEND_URL is HTTPS in production
      if (!env.FRONTEND_URL.startsWith('https://')) {
        console.warn('⚠️  WARNING: FRONTEND_URL should use HTTPS in production');
      }
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Please check your .env file and ensure all required variables are set.');
      console.error('📖 See .env.example for reference.\n');
    } else {
      console.error('❌ Environment validation error:', error);
    }
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe access to environment variables
export type Env = z.infer<typeof envSchema>;
