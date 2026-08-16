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
import { checkRateLimit, createRateLimitHeaders, createRateLimitErrorResponse } from '@/lib/rate-limit';
import { leadIntelligenceResultSchema } from '@/lib/validation/intelligence';
import { IntelligenceEngine } from '@/lib/intelligence/engine';
import { env, isDemoMode } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const idempotencyKey = request.headers.get('x-idempotency-key') || rawBody.idempotencyKey || null;

    // Rate limiting - check before any processing
    const { ipResult, emailResult } = await checkRateLimit(request, rawBody.workEmail);
    
    if (!ipResult.allowed) {
      return createRateLimitErrorResponse(ipResult, 'ip');
    }
    
    if (emailResult && !emailResult.allowed) {
      return createRateLimitErrorResponse(emailResult, 'email');
    }

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

    // 5. Duplicate check (includes idempotency-key match)
    const dupResult = await detectDuplicateLead(
      leadData.normalizedEmail,
      leadData.normalizedPhone,
      leadData.companyName,
      leadData.fullName,
      idempotencyKey
    );

    // 5a. Idempotent replay: same key already processed
    if (dupResult.matchType === 'idempotency' && dupResult.duplicateOfId) {
      const existingLead = await prisma.lead.findUnique({ where: { id: dupResult.duplicateOfId } });
      if (existingLead) {
        return NextResponse.json({
          success: true,
          leadId: existingLead.id,
          category: existingLead.category,
          score: existingLead.totalScore,
          message: 'Lead already processed (idempotent replay).',
        }, { status: 200 });
      }
    }

    // 6. Run Intelligence Engine
    const scenario = rawBody.scenario;
    const engine = new IntelligenceEngine({ mode: isDemoMode ? 'DEMO' : 'LIVE', demoFixtures: isDemoMode });
    const intelligenceResult = await engine.analyzeLead(leadData, scenario);

    // Extract qualification from intelligence result
    const finalCategory = intelligenceResult.qualification.stage === 'Sales Qualified' ? 'HOT' :
      intelligenceResult.qualification.stage === 'Marketing Qualified' ? 'WARM' :
      intelligenceResult.qualification.stage === 'Disqualified' ? 'COLD' : 'REVIEW_REQUIRED';
    
    const finalScore = intelligenceResult.qualification.overallScore;

    // Force REVIEW_REQUIRED if injection or duplicate detected
    if (injectionResult.isInjectionDetected || dupResult.isDuplicate) {
      // Category already handled in engine
    }

    const followUpDraft = intelligenceResult.followupDraft;

    // 7. Persist Lead + LeadScore + FollowUp atomically
    const { lead, followUpRecord } = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
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
          status: finalCategory === 'REVIEW_REQUIRED' ? 'IN_REVIEW' : 'SCORED',
          category: finalCategory,
          totalScore: finalScore,
        },
      });

      await tx.leadScore.create({
        data: {
          leadId: lead.id,
          budgetFitScore: intelligenceResult.qualification.dimensions[0]?.score ?? 0,
          serviceFitScore: intelligenceResult.qualification.dimensions[1]?.score ?? 0,
          urgencyScore: intelligenceResult.qualification.dimensions[2]?.score ?? 0,
          authorityScore: intelligenceResult.qualification.dimensions[3]?.score ?? 0,
          infoQualityScore: intelligenceResult.qualification.dimensions[4]?.score ?? 0,
          totalScore: finalScore,
          category: finalCategory,
          confidence: intelligenceResult.confidence.score / 100,
          summary: injectionResult.isInjectionDetected
            ? `[FLAGGED - Prompt Injection Attack Detected] ${intelligenceResult.dealStrategy.reasoning}`
            : dupResult.isDuplicate
            ? `[FLAGGED - Duplicate Submission (${dupResult.reason})] ${intelligenceResult.dealStrategy.reasoning}`
            : intelligenceResult.dealStrategy.reasoning,
          scoreBreakdownJson: JSON.stringify(intelligenceResult.qualification.dimensions),
          risksJson: JSON.stringify(intelligenceResult.objections.map(o => o.name)),
          missingInfoJson: JSON.stringify(intelligenceResult.missingInformation.map(m => m.field)),
          recommendedAction: intelligenceResult.dealStrategy.action,
          aiProvider: 'DealCircuit Intelligence Engine',
          aiModel: 'leadpilot-demo-v1',
          promptVersion: 'v1.0.0',
          isDemoMode: isDemoMode,
        },
      });

      const followUpRecord = await tx.followUp.create({
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

      return { lead, followUpRecord };
    });

    // 8. Dispatch Integrations for non-review leads
    if (finalCategory !== 'REVIEW_REQUIRED' && !isDemoMode) {
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
        body: followUpRecord.body,
        leadId: lead.id,
      });
    }

    // 9. Create Notifications & Audit Log
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

    const rateLimitHeaders = createRateLimitHeaders(ipResult);

    // Return enhanced intelligence response
    const intelligenceResponse = {
      success: true,
      leadId: lead.id,
      category: finalCategory,
      score: finalScore,
      message: 'Lead submitted and qualified successfully.',
      runId: intelligenceResult.runId,
      traceId: intelligenceResult.traceId,
      intelligence: intelligenceResult,
    };

    // Validate response against schema
    const validatedResponse = leadIntelligenceResultSchema.parse(intelligenceResult);

    return NextResponse.json({
      ...intelligenceResponse,
      intelligence: validatedResponse,
    }, { 
      status: 201,
      headers: rateLimitHeaders,
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Response Validation Error', 
        details: error.message 
      }, { status: 500 });
    }
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