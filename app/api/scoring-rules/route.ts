import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/observability/logger';

export async function GET() {
  try {
    const rules = await prisma.scoringRule.findMany({
      orderBy: { criterionKey: 'asc' },
    });
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    const userPayload = verifyToken(token || '');
    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { criterionKey, maxScore, weight } = body;

    if (!criterionKey) {
      return NextResponse.json({ error: 'criterionKey is required' }, { status: 400 });
    }

    const updated = await prisma.scoringRule.update({
      where: { criterionKey },
      data: {
        ...(typeof maxScore === 'number' ? { maxScore } : {}),
        ...(typeof weight === 'number' ? { weight } : {}),
        updatedBy: userPayload.userId,
      },
    });

    await logAuditEvent({
      userId: userPayload.userId,
      userEmail: userPayload.email,
      action: 'UPDATE_SCORING_RULE',
      entityType: 'ScoringRule',
      entityId: updated.id,
      newValue: { criterionKey, maxScore, weight },
    });

    return NextResponse.json({ success: true, rule: updated });
  } catch (error) {
    console.error('Error updating scoring rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
