import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDemoMode } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  let dbStatus = 'UP';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'DOWN';
  }

  return NextResponse.json(
    {
      status: 'healthy',
      mode: isDemoMode ? 'DEMO' : 'PRODUCTION',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        mailpit: 'UP',
        demoCrmAdapter: 'UP',
      },
    },
    { status: 200 }
  );
}
