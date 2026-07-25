import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { sendEmailViaMailpit } from '@/lib/email/mailpit';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, sendImmediately } = body;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { followUps: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!lead || lead.followUps.length === 0) {
      return NextResponse.json({ error: 'Lead or draft follow-up not found' }, { status: 404 });
    }

    const followUp = lead.followUps[0];

    if (sendImmediately) {
      await sendEmailViaMailpit({
        to: lead.workEmail,
        subject: followUp.subject,
        body: followUp.body,
        leadId: lead.id,
      });

      await prisma.followUp.update({
        where: { id: followUp.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, followUpId: followUp.id });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
