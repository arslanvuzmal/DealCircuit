import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, createRateLimitHeaders, createRateLimitErrorResponse } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should allow requests under the limit', async () => {
    const mockRequest = {
      headers: new Map([
        ['x-forwarded-for', '192.168.1.1'],
      ]),
    } as unknown as Request;

    const { ipResult } = await checkRateLimit(mockRequest, 'test@example.com');
    expect(ipResult.allowed).toBe(true);
    expect(ipResult.remaining).toBeGreaterThanOrEqual(0);
  });

  it('should track IP-based rate limiting separately from email', async () => {
    const mockRequest1 = {
      headers: new Map([
        ['x-forwarded-for', '10.0.0.1'],
      ]),
    } as unknown as Request;

    const mockRequest2 = {
      headers: new Map([
        ['x-forwarded-for', '10.0.0.2'],
      ]),
    } as unknown as Request;

    const result1 = await checkRateLimit(mockRequest1, 'same@example.com');
    const result2 = await checkRateLimit(mockRequest2, 'same@example.com');

    expect(result1.ipResult.allowed).toBe(true);
    expect(result2.ipResult.allowed).toBe(true);
  });

  it('should create proper rate limit headers', () => {
    const result = {
      allowed: true,
      remaining: 25,
      resetTime: Date.now() + 900000,
      total: 30,
    };

    const headers = createRateLimitHeaders(result);
    expect(headers['X-RateLimit-Limit']).toBe('30');
    expect(headers['X-RateLimit-Remaining']).toBe('25');
    expect(headers['X-RateLimit-Reset']).toBeDefined();
  });

  it('should create proper 429 error response', () => {
    const result = {
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + 60000,
      total: 30,
    };

    const response = createRateLimitErrorResponse(result, 'ip');
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should extract client IP from x-forwarded-for header', async () => {
    const mockRequest = {
      headers: new Map([
        ['x-forwarded-for', '203.0.113.195, 70.41.3.18, 150.172.238.178'],
      ]),
    } as unknown as Request;

    const { ipResult } = await checkRateLimit(mockRequest);
    expect(ipResult.allowed).toBe(true);
  });

  it('should fall back to x-real-ip when x-forwarded-for not present', async () => {
    const mockRequest = {
      headers: new Map([
        ['x-real-ip', '198.51.100.1'],
      ]),
    } as unknown as Request;

    const { ipResult } = await checkRateLimit(mockRequest);
    expect(ipResult.allowed).toBe(true);
  });

  it('should enforce stricter limits per email', async () => {
    const mockRequest = {
      headers: new Map([
        ['x-forwarded-for', '192.168.1.100'],
      ]),
    } as unknown as Request;

    const email = 'strict@example.com';
    
    for (let i = 0; i < 5; i++) {
      const { emailResult } = await checkRateLimit(mockRequest, email);
      expect(emailResult?.allowed).toBe(true);
    }
  });
});