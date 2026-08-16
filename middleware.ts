import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { validateCSRFToken, isCSRFExempt } from '@/lib/csrf';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isCSRFExempt(pathname)) {
    return NextResponse.next();
  }

  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const csrfValid = await validateCSRFToken(request);
  if (!csrfValid) {
    return NextResponse.json(
      { error: { code: 'CSRF_INVALID', message: 'Invalid or missing CSRF token' } },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/leads/:id/approve',
    '/api/leads/:id/reject',
    '/api/leads/:id/reprocess',
    '/api/leads/:id/archive',
    '/api/dashboard/:path*',
    '/api/internal/:path*',
  ],
};