import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { syncLeadToCRM } from '@/lib/crm/adapter';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, forceFailure } = body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const result = await syncLeadToCRM(
      {
        leadId: lead.id,
        fullName: lead.fullName,
        workEmail: lead.workEmail,
        phoneNumber: lead.phoneNumber || undefined,
        companyName: lead.companyName,
        industry: lead.industry,
        category: lead.category || 'WARM',
        totalScore: lead.totalScore || 70,
      },
      forceFailure
    );

    return NextResponse.json({ success: result.success, crmResult: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
