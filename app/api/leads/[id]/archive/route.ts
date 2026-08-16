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

    const lead = await prisma.lead.findUnique({ where: { id: params.id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'ARCHIVED' },
    });

    await logAuditEvent({
      userId: userPayload.userId,
      userEmail: userPayload.email,
      action: 'ARCHIVE_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      previousValue: { status: lead.status },
      newValue: { status: 'ARCHIVED' },
      reason: 'Reviewer archived lead',
    });

    return NextResponse.json({ success: true, message: 'Lead archived.' });
  } catch (error) {
    console.error('Error archiving lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
