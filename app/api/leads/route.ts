import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicLeadSubmissionSchema, normalizeLeadData } from '@/lib/validation/lead';
import { detectPromptInjection } from '@/lib/scoring/injection';
import { detectDuplicateLead } from '@/lib/scoring/duplicate';
import { getAIProvider } from '@/lib/ai/provider';
import { generateFollowUpDraft } from '@/lib/email/followup';
import { sendEmailViaMailpit } from '@/lib/email/mailpit';
import { syncLeadToCRM } from '@/lib/crm/adapter';
import { createInAppNotification, logAuditEvent } from '@/lib/observability/logger';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const idempotencyKey = request.headers.get('x-idempotency-key') || rawBody.idempotencyKey || null;

    // 1. Honeypot check
    if (rawBody.websiteHoneypot) {
      console.log('[Spam Defense] Honeypot triggered, silently dropping submission.');
      return NextResponse.json({
        success: true,
        message: 'Lead received and queued for processing.',
        leadId: `spm_${Date.now()}`,
      }, { status: 201 });
    }

    // 2. Validate input
    const parseResult = publicLeadSubmissionSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    // 3. Normalise input
    const leadData = normalizeLeadData(parseResult.data);

    // 4. Prompt injection check
    const injectionResult = detectPromptInjection(leadData.projectDescription, {
      companyName: leadData.companyName,
      serviceRequired: leadData.serviceRequired,
    });

    // 5. Duplicate check
    const dupResult = await detectDuplicateLead(
      leadData.normalizedEmail,
      leadData.normalizedPhone,
      leadData.companyName,
      leadData.fullName,
      idempotencyKey
    );

    // 6. Save Lead to DB
    const lead = await prisma.lead.create({
      data: {
        fullName: leadData.fullName,
        workEmail: leadData.workEmail,
        normalizedEmail: leadData.normalizedEmail,
        phoneNumber: leadData.phoneNumber,
        normalizedPhone: leadData.normalizedPhone,
        companyName: leadData.companyName,
        companyWebsite: leadData.companyWebsite,
        industry: leadData.industry,
        companySize: leadData.companySize,
        serviceRequired: leadData.serviceRequired,
        budgetRange: leadData.budgetRange,
        desiredTimeline: leadData.desiredTimeline,
        decisionAuthority: leadData.decisionAuthority,
        projectDescription: leadData.projectDescription,
        leadSource: leadData.leadSource || 'Website Form',
        idempotencyKey: idempotencyKey,
        isDuplicate: dupResult.isDuplicate,
        duplicateOfId: dupResult.duplicateOfId,
        status: 'NEW',
      },
    });

    // 7. Qualify Lead
    const aiProvider = getAIProvider();
    const qualification = await aiProvider.qualifyLead({
      fullName: leadData.fullName,
      workEmail: leadData.workEmail,
      phoneNumber: leadData.phoneNumber,
      companyName: leadData.companyName,
      companyWebsite: leadData.companyWebsite,
      industry: leadData.industry,
      companySize: leadData.companySize,
      serviceRequired: leadData.serviceRequired,
      budgetRange: leadData.budgetRange,
      desiredTimeline: leadData.desiredTimeline,
      decisionAuthority: leadData.decisionAuthority,
      projectDescription: leadData.projectDescription,
    });

    let finalCategory = qualification.result.category;
    let finalScore = qualification.result.totalScore;

    // Force REVIEW_REQUIRED if injection or duplicate detected
    if (injectionResult.isInjectionDetected || dupResult.isDuplicate) {
      finalCategory = 'REVIEW_REQUIRED';
    }

    // 8. Save LeadScore
    await prisma.leadScore.create({
      data: {
        leadId: lead.id,
        budgetFitScore: qualification.result.scoreBreakdown.budgetFit.score,
        serviceFitScore: qualification.result.scoreBreakdown.serviceFit.score,
        urgencyScore: qualification.result.scoreBreakdown.urgency.score,
        authorityScore: qualification.result.scoreBreakdown.decisionAuthority.score,
        infoQualityScore: qualification.result.scoreBreakdown.informationQuality.score,
        totalScore: finalScore,
        category: finalCategory,
        confidence: qualification.result.confidence,
        summary: injectionResult.isInjectionDetected
          ? `[FLAGGED - Prompt Injection Attack Detected] ${qualification.result.summary}`
          : dupResult.isDuplicate
          ? `[FLAGGED - Duplicate Submission (${dupResult.reason})] ${qualification.result.summary}`
          : qualification.result.summary,
        scoreBreakdownJson: JSON.stringify(qualification.result.scoreBreakdown),
        risksJson: JSON.stringify([
          ...qualification.result.risks,
          ...(injectionResult.isInjectionDetected ? ['Suspicious system prompt instructions detected in text'] : []),
          ...(dupResult.isDuplicate ? [`Duplicate match: ${dupResult.reason}`] : []),
        ]),
        missingInfoJson: JSON.stringify(qualification.result.missingInformation),
        recommendedAction: qualification.result.recommendedAction,
        aiProvider: qualification.provider,
        aiModel: qualification.model,
        promptVersion: qualification.promptVersion,
        isDemoMode: qualification.isDemoMode,
      },
    });

    // 9. Generate FollowUp Draft
    const followUpDraft = generateFollowUpDraft(
      leadData.fullName,
      leadData.companyName,
      finalCategory,
      leadData.serviceRequired,
      qualification.result.missingInformation
    );

    const followUpRecord = await prisma.followUp.create({
      data: {
        leadId: lead.id,
        subject: followUpDraft.subject,
        body: followUpDraft.body,
        category: finalCategory,
        status: finalCategory === 'REVIEW_REQUIRED' ? 'DRAFT' : 'SENT',
        recipientEmail: leadData.workEmail,
        sentAt: finalCategory === 'REVIEW_REQUIRED' ? null : new Date(),
      },
    });

    // 10. Update Lead Status
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: finalCategory === 'REVIEW_REQUIRED' ? 'IN_REVIEW' : 'SCORED',
        category: finalCategory,
        totalScore: finalScore,
      },
    });

    // 11. Dispatch Integrations for non-review leads
    if (finalCategory !== 'REVIEW_REQUIRED') {
      await syncLeadToCRM({
        leadId: lead.id,
        fullName: leadData.fullName,
        workEmail: leadData.workEmail,
        companyName: leadData.companyName,
        industry: leadData.industry,
        category: finalCategory,
        totalScore: finalScore,
      });

      await sendEmailViaMailpit({
        to: leadData.workEmail,
        subject: followUpDraft.subject,
        body: followUpDraft.body,
        leadId: lead.id,
      });
    }

    // 12. Create Notifications & Audit Log
    if (finalCategory === 'HOT') {
      await createInAppNotification({
        title: '🔥 Hot Lead Captured',
        message: `${leadData.fullName} (${leadData.companyName}) scored ${finalScore}/100.`,
        type: 'HOT_LEAD',
      });
    } else if (finalCategory === 'REVIEW_REQUIRED') {
      await createInAppNotification({
        title: '⚠️ Lead Review Required',
        message: `${leadData.fullName} (${leadData.companyName}) requires review (${injectionResult.isInjectionDetected ? 'Prompt Injection' : 'Missing Info/Duplicate'}).`,
        type: 'REVIEW_NEEDED',
      });
    }

    await logAuditEvent({
      action: 'SUBMIT_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      newValue: { category: finalCategory, score: finalScore },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      category: finalCategory,
      score: finalScore,
      message: 'Lead submitted and qualified successfully.',
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'ALL') where.category = category;
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { workEmail: { contains: search } },
        { companyName: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        scores: { orderBy: { createdAt: 'desc' }, take: 1 },
        followUps: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
