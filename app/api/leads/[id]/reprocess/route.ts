import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getAIProvider } from '@/lib/ai/provider';
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

    const aiProvider = getAIProvider();
    const qualification = await aiProvider.qualifyLead({
      fullName: lead.fullName,
      workEmail: lead.workEmail,
      phoneNumber: lead.phoneNumber || undefined,
      companyName: lead.companyName,
      companyWebsite: lead.companyWebsite || undefined,
      industry: lead.industry,
      companySize: lead.companySize,
      serviceRequired: lead.serviceRequired,
      budgetRange: lead.budgetRange,
      desiredTimeline: lead.desiredTimeline,
      decisionAuthority: lead.decisionAuthority,
      projectDescription: lead.projectDescription,
    });

    await prisma.leadScore.create({
      data: {
        leadId: lead.id,
        budgetFitScore: qualification.result.scoreBreakdown.budgetFit.score,
        serviceFitScore: qualification.result.scoreBreakdown.serviceFit.score,
        urgencyScore: qualification.result.scoreBreakdown.urgency.score,
        authorityScore: qualification.result.scoreBreakdown.decisionAuthority.score,
        infoQualityScore: qualification.result.scoreBreakdown.informationQuality.score,
        totalScore: qualification.result.totalScore,
        category: qualification.result.category,
        confidence: qualification.result.confidence,
        summary: `[Reprocessed by ${userPayload.email}] ${qualification.result.summary}`,
        scoreBreakdownJson: JSON.stringify(qualification.result.scoreBreakdown),
        risksJson: JSON.stringify(qualification.result.risks),
        missingInfoJson: JSON.stringify(qualification.result.missingInformation),
        recommendedAction: qualification.result.recommendedAction,
        aiProvider: qualification.provider,
        aiModel: qualification.model,
        promptVersion: qualification.promptVersion,
        isDemoMode: qualification.isDemoMode,
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        category: qualification.result.category,
        totalScore: qualification.result.totalScore,
        status: qualification.result.category === 'REVIEW_REQUIRED' ? 'IN_REVIEW' : 'SCORED',
      },
    });

    await logAuditEvent({
      userId: userPayload.userId,
      userEmail: userPayload.email,
      action: 'REPROCESS_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      newValue: { category: qualification.result.category, score: qualification.result.totalScore },
    });

    return NextResponse.json({
      success: true,
      category: qualification.result.category,
      score: qualification.result.totalScore,
      message: 'Lead reprocessed successfully.',
    });
  } catch (error) {
    console.error('Error reprocessing lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
