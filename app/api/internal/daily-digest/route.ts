import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { totalScore: 'desc' },
      take: 50,
      select: {
        id: true,
        fullName: true,
        companyName: true,
        workEmail: true,
        category: true,
        totalScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      totalLeads: leads.length,
      leads,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
