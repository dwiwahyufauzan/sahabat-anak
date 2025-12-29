import { Elysia } from 'elysia';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the duration
   */
  max: number;
  
  /**
   * Duration in milliseconds
   */
  duration: number;
  
  /**
   * Custom error message
   */
  message?: string;
  
  /**
   * Skip rate limiting for certain IPs (e.g., localhost in development)
   */
  skip?: (request: Request) => boolean;
}

/**
 * Simple in-memory rate limiter for Elysia
 * For production with multiple instances, consider using Redis
 */
export class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: Timer;

  constructor() {
    // Cleanup old entries every 1 minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  /**
   * Check if request should be rate limited
   */
  check(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.store[identifier];

    // No entry or expired entry
    if (!entry || entry.resetTime < now) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + config.duration,
      };
      return false; // Not limited
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.max) {
      return true; // Limited
    }

    return false; // Not limited
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemaining(identifier: string, config: RateLimitConfig): number {
    const entry = this.store[identifier];
    if (!entry || entry.resetTime < Date.now()) {
      return config.max;
    }
    return Math.max(0, config.max - entry.count);
  }

  /**
   * Get reset time in seconds
   */
  getResetTime(identifier: string): number {
    const entry = this.store[identifier];
    if (!entry) return 0;
    return Math.ceil((entry.resetTime - Date.now()) / 1000);
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    delete this.store[identifier];
  }

  /**
   * Destroy the rate limiter
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store = {};
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter();

/**
 * Rate limiting middleware for Elysia
 */
export const rateLimit = (config: RateLimitConfig) => {
  return (app: Elysia) =>
    app.derive(({ request, set }) => {
      // Skip if configured
      if (config.skip?.(request)) {
        return {};
      }

      // Get client identifier (IP address)
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
      
      // Check rate limit
      const isLimited = globalRateLimiter.check(ip, config);

      if (isLimited) {
        const resetTime = globalRateLimiter.getResetTime(ip);
        
        set.status = 429;
        set.headers['Retry-After'] = String(resetTime);
        set.headers['X-RateLimit-Limit'] = String(config.max);
        set.headers['X-RateLimit-Remaining'] = '0';
        set.headers['X-RateLimit-Reset'] = String(resetTime);
        
        throw new Error(
          config.message || 
          `Too many requests. Please try again in ${resetTime} seconds.`
        );
      }

      // Set rate limit headers
      const remaining = globalRateLimiter.getRemaining(ip, config);
      set.headers['X-RateLimit-Limit'] = String(config.max);
      set.headers['X-RateLimit-Remaining'] = String(remaining);
      set.headers['X-RateLimit-Reset'] = String(globalRateLimiter.getResetTime(ip));

      return {};
    });
};

/**
 * Create a new isolated rate limiter instance
 * Useful for endpoint-specific rate limiting
 */
export const createRateLimiter = () => new RateLimiter();

export { globalRateLimiter };
