import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { seedDemoData } from '@/lib/seedDemoData';

export async function POST(request: Request) {
  const secret = request.headers.get('x-internal-secret');
  if (secret !== env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
  }

  try {
    const result = await seedDemoData(prisma);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
