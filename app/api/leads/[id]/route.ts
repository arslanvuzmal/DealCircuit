import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        scores: { orderBy: { createdAt: 'desc' } },
        followUps: { orderBy: { createdAt: 'desc' } },
        approvals: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } },
        integrationEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error fetching lead details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
