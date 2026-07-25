import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { syncLeadToCRM } from '@/lib/crm/adapter';
import { sendEmailViaMailpit } from '@/lib/email/mailpit';
import { logAuditEvent } from '@/lib/observability/logger';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    const userPayload = verifyToken(token || '');
    if (!userPayload || (userPayload.role !== 'ADMIN' && userPayload.role !== 'REVIEWER')) {
      return NextResponse.json({ error: 'Unauthorized reviewer access required' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { newCategory, newScore, notes, followUpBody } = body;

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: { followUps: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updatedCategory = newCategory || lead.category || 'WARM';
    const updatedScore = typeof newScore === 'number' ? newScore : lead.totalScore || 75;

    // Record Approval action
    await prisma.approval.create({
      data: {
        leadId: lead.id,
        userId: userPayload.userId,
        action: 'APPROVE',
        previousCategory: lead.category,
        newCategory: updatedCategory,
        previousScore: lead.totalScore,
        newScore: updatedScore,
        notes: notes || 'Lead approved by human reviewer.',
      },
    });

    // Update Lead status
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: 'APPROVED',
        category: updatedCategory,
        totalScore: updatedScore,
      },
    });

    // Update follow-up draft content if edited
    if (lead.followUps.length > 0) {
      const followUp = lead.followUps[0];
      await prisma.followUp.update({
        where: { id: followUp.id },
        data: {
          body: followUpBody || followUp.body,
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      // Dispatch via Mailpit
      await sendEmailViaMailpit({
        to: lead.workEmail,
        subject: followUp.subject,
        body: followUpBody || followUp.body,
        leadId: lead.id,
      });
    }

    // Dispatch CRM Sync
    await syncLeadToCRM({
      leadId: lead.id,
      fullName: lead.fullName,
      workEmail: lead.workEmail,
      companyName: lead.companyName,
      industry: lead.industry,
      category: updatedCategory,
      totalScore: updatedScore,
    });

    await logAuditEvent({
      userId: userPayload.userId,
      userEmail: userPayload.email,
      action: 'APPROVE_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      previousValue: { category: lead.category, status: lead.status },
      newValue: { category: updatedCategory, status: 'APPROVED' },
      reason: notes || 'Reviewer approved lead',
    });

    return NextResponse.json({
      success: true,
      message: 'Lead approved, follow-up sent, and CRM synchronized.',
    });
  } catch (error) {
    console.error('Error approving lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
