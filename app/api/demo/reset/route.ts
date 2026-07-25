import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { seedDemoData } from '@/lib/seedDemoData';

export async function POST() {
  try {
    const token = cookies().get('token')?.value;
    const userPayload = verifyToken(token || '');
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    console.log('[Demo Controls] Resetting database and seeding test scenarios...');
    const result = await seedDemoData(prisma);

    return NextResponse.json({
      success: true,
      message: 'Demo database reset and re-seeded successfully.',
      ...result,
    });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to reset demo database' }, { status: 500 });
  }
}
