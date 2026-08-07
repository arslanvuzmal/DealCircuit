import { describe, it, expect } from 'vitest';
import { classifyError, isRetryableError, isPermanentError, ErrorClassification } from '@/lib/error-classification';

describe('Error Classification', () => {
  describe('classifyError', () => {
    it('should classify timeout errors as retryable', () => {
      const error = new Error('ETIMEDOUT: Connection timed out');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.RETRYABLE);
    });

    it('should classify 504 gateway timeout as retryable', () => {
      const error = new Error('504 Gateway Timeout');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.RETRYABLE);
    });

    it('should classify 429 rate limit as retryable', () => {
      const error = new Error('429 Too Many Requests');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.RETRYABLE);
    });

    it('should classify network errors as retryable', () => {
      const error = new Error('Network error: fetch failed');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.RETRYABLE);
    });

    it('should classify 401 unauthorized as permanent', () => {
      const error = new Error('401 Unauthorized: Invalid credentials');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.PERMANENT);
    });

    it('should classify 403 forbidden as permanent', () => {
      const error = new Error('403 Forbidden: Permission denied');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.PERMANENT);
    });

    it('should classify 404 not found as permanent', () => {
      const error = new Error('404 Not Found');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.PERMANENT);
    });

    it('should classify invalid API key as permanent', () => {
      const error = new Error('Invalid API key provided');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.PERMANENT);
    });

    it('should classify schema validation errors as permanent', () => {
      const error = new Error('Schema validation failed: invalid field');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.PERMANENT);
    });

    it('should classify unknown errors as UNKNOWN', () => {
      const error = new Error('Some random error');
      const result = classifyError(error);
      expect(result.classification).toBe(ErrorClassification.UNKNOWN);
    });

    it('should extract retry-after from message', () => {
      const error = new Error('Rate limited. Retry after 60 seconds');
      const result = classifyError(error);
      expect(result.retryAfter).toBe(60000);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for timeout errors', () => {
      expect(isRetryableError(new Error('ETIMEDOUT'))).toBe(true);
    });

    it('should return false for auth errors', () => {
      expect(isRetryableError(new Error('401 Unauthorized'))).toBe(false);
    });
  });

  describe('isPermanentError', () => {
    it('should return true for auth errors', () => {
      expect(isPermanentError(new Error('401 Unauthorized'))).toBe(true);
    });

    it('should return false for timeout errors', () => {
      expect(isPermanentError(new Error('ETIMEDOUT'))).toBe(false);
    });
  });
});