import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const execPromise = promisify(exec);

export async function POST() {
  try {
    const token = cookies().get('token')?.value;
    const userPayload = verifyToken(token || '');
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    console.log('[Demo Controls] Resetting database and seeding test scenarios...');
    await execPromise('npx tsx scripts/seed.ts');

    return NextResponse.json({
      success: true,
      message: 'Demo database reset and re-seeded successfully.',
    });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to reset demo database' }, { status: 500 });
  }
}
