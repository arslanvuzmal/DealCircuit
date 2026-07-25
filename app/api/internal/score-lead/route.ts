import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { getAIProvider } from '@/lib/ai/provider';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId } = body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
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

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      category: qualification.result.category,
      totalScore: qualification.result.totalScore,
      breakdown: qualification.result.scoreBreakdown,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
