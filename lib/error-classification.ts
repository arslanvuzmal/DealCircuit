export enum ErrorClassification {
  RETRYABLE = 'RETRYABLE',
  PERMANENT = 'PERMANENT',
  UNKNOWN = 'UNKNOWN',
}

export interface ClassifiedError {
  classification: ErrorClassification;
  originalError: Error | string;
  message: string;
  retryAfter?: number;
  details?: Record<string, unknown>;
}

const RETRYABLE_PATTERNS = [
  /timeout/i,
  /ETIMEDOUT/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /EAI_AGAIN/i,
  /socket hang up/i,
  /network error/i,
  /fetch failed/i,
  /50[023]/i,
  /504/i,
  /429/i,
  /rate limit/i,
  /too many requests/i,
  /service unavailable/i,
  /temporarily unavailable/i,
  /gateway timeout/i,
  /bad gateway/i,
];

const PERMANENT_PATTERNS = [
  /unauthorized/i,
  /401/,
  /forbidden/i,
  /403/,
  /not found/i,
  /404/,
  /invalid credentials/i,
  /invalid api key/i,
  /authentication failed/i,
  /permission denied/i,
  /schema validation/i,
  /invalid request/i,
  /400/,
  /bad request/i,
  /unsupported media type/i,
  /415/,
  /unprocessable entity/i,
  /422/,
  /already exists/i,
  /409/,
  /conflict/i,
  /quota exceeded/i,
  /billing/i,
  /subscription/i,
];

export function classifyError(error: Error | string | unknown): ClassifiedError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();
  const originalError = error instanceof Error ? error : String(error);

  for (const pattern of PERMANENT_PATTERNS) {
    if (pattern.test(lowerMessage)) {
      return {
        classification: ErrorClassification.PERMANENT,
        originalError,
        message: errorMessage,
        details: { matchedPattern: pattern.toString() },
      };
    }
  }

  for (const pattern of RETRYABLE_PATTERNS) {
    if (pattern.test(lowerMessage)) {
      const retryAfter = extractRetryAfter(errorMessage);
      return {
        classification: ErrorClassification.RETRYABLE,
        originalError,
        message: errorMessage,
        retryAfter,
        details: { matchedPattern: pattern.toString() },
      };
    }
  }

  return {
    classification: ErrorClassification.UNKNOWN,
    originalError,
    message: errorMessage,
  };
}

function extractRetryAfter(message: string): number | undefined {
  const retryAfterMatch = message.match(/retry[-\s]?after[:\s]*(\d+)/i);
  if (retryAfterMatch) {
    return parseInt(retryAfterMatch[1], 10) * 1000;
  }
  const rateLimitMatch = message.match(/rate limit.*?(\d+)\s*(seconds?|minutes?)/i);
  if (rateLimitMatch) {
    const value = parseInt(rateLimitMatch[1], 10);
    const unit = rateLimitMatch[2].toLowerCase();
    return unit.startsWith('min') ? value * 60 * 1000 : value * 1000;
  }
  return undefined;
}

export function isRetryableError(error: Error | string | unknown): boolean {
  return classifyError(error).classification === ErrorClassification.RETRYABLE;
}

export function isPermanentError(error: Error | string | unknown): boolean {
  return classifyError(error).classification === ErrorClassification.PERMANENT;
}