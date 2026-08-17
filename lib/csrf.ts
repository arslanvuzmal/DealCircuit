import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

const CSRF_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

export interface CSRFTokenPayload {
  sessionId: string;
  iat: number;
  exp: number;
}

export async function generateCSRFToken(sessionId: string): Promise<string> {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(CSRF_SECRET);
}

export async function verifyCSRFToken(token: string): Promise<CSRFTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, CSRF_SECRET);
    return payload as unknown as CSRFTokenPayload;
  } catch {
    return null;
  }
}

export function getCSRFTokenFromRequest(request: Request): string | null {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${CSRF_TOKEN_NAME}=`)) {
        return cookie.substring(CSRF_TOKEN_NAME.length + 1);
      }
    }
  }
  return null;
}

export function setCSRFTokenCookie(response: Response, token: string): void {
  const isProduction = env.NODE_ENV === 'production';
  response.headers.append(
    'Set-Cookie',
    `${CSRF_TOKEN_NAME}=${token}; HttpOnly; Secure=${isProduction}; SameSite=Lax; Path=/; Max-Age=3600`
  );
}

export function createCSRFErrorResponse(): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: 'CSRF_INVALID',
        message: 'Invalid or missing CSRF token. Please refresh the page and try again.',
      },
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function validateCSRFToken(request: Request): Promise<boolean> {
  const token = getCSRFTokenFromRequest(request);
  if (!token) return false;
  
  const payload = await verifyCSRFToken(token);
  return payload !== null;
}

export const CSRF_EXEMPT_PATHS = [
  '/api/leads',
  '/api/public/health',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  // Internal/service-to-service routes authenticate themselves via the
  // x-internal-secret header (see each route's own check against
  // env.INTERNAL_API_SECRET) rather than a browser session cookie, so the
  // session-cookie gate in middleware.ts doesn't apply to them.
  '/api/internal',
];

export function isCSRFExempt(path: string): boolean {
  return CSRF_EXEMPT_PATHS.some(exempt => path.startsWith(exempt));
}