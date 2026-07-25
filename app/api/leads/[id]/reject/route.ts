import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/observability/logger';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    const userPayload = verifyToken(token || '');
    if (!userPayload || (userPayload.role !== 'ADMIN' && userPayload.role !== 'REVIEWER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { notes } = body;

    const lead = await prisma.lead.findUnique({ where: { id: params.id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.approval.create({
      data: {
        leadId: lead.id,
        userId: userPayload.userId,
        action: 'REJECT',
        previousCategory: lead.category,
        newCategory: 'COLD',
        notes: notes || 'Lead rejected by reviewer.',
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'REJECTED', category: 'COLD' },
    });

    await logAuditEvent({
      userId: userPayload.userId,
      userEmail: userPayload.email,
      action: 'REJECT_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      reason: notes || 'Reviewer rejected lead',
    });

    return NextResponse.json({ success: true, message: 'Lead rejected.' });
  } catch (error) {
    console.error('Error rejecting lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
