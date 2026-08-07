import { env, isDemoMode } from './env';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  total: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: isDemoMode ? 100 : 30,
  keyPrefix: 'rl:lead:submit',
};

const STRICT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 60 * 1000,
  maxRequests: isDemoMode ? 20 : 10,
  keyPrefix: 'rl:lead:email',
};

class InMemoryRateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const fullKey = `${config.keyPrefix}:${key}`;
    const record = this.store.get(fullKey);

    if (!record || record.resetTime < now) {
      const resetTime = now + config.windowMs;
      this.store.set(fullKey, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
        total: config.maxRequests,
      };
    }

    if (record.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        total: config.maxRequests,
      };
    }

    record.count++;
    this.store.set(fullKey, record);
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
      total: config.maxRequests,
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}

let rateLimiter: InMemoryRateLimiter | null = null;

function getRateLimiter(): InMemoryRateLimiter {
  if (!rateLimiter) {
    rateLimiter = new InMemoryRateLimiter();
    if (typeof setInterval !== 'undefined') {
      setInterval(() => rateLimiter?.cleanup(), 5 * 60 * 1000);
    }
  }
  return rateLimiter;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

export async function checkRateLimit(
  request: Request,
  email?: string
): Promise<{ ipResult: RateLimitResult; emailResult?: RateLimitResult }> {
  const ip = getClientIp(request);
  const limiter = getRateLimiter();

  const ipResult = await limiter.check(ip, DEFAULT_CONFIG);

  let emailResult: RateLimitResult | undefined;
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    emailResult = await limiter.check(normalizedEmail, STRICT_CONFIG);
  }

  return { ipResult, emailResult };
}

export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.total.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

export function createRateLimitErrorResponse(
  result: RateLimitResult,
  type: 'ip' | 'email'
): Response {
  const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests from this ${type === 'ip' ? 'IP address' : 'email address'}. Please try again later.`,
        retryAfter,
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        ...createRateLimitHeaders(result),
      },
    }
  );
}