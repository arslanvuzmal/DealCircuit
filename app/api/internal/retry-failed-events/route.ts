import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { syncLeadToCRM } from '@/lib/crm/adapter';
import { createInAppNotification } from '@/lib/observability/logger';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const failedEvents = await prisma.integrationEvent.findMany({
      where: {
        status: { in: ['FAILED', 'RETRYING'] },
        attempts: { lt: 3 },
      },
      include: { lead: true },
    });

    let retriedCount = 0;
    let recoveredCount = 0;

    for (const event of failedEvents) {
      retriedCount++;
      const currentAttempts = event.attempts + 1;

      // Retry CRM sync for demo
      const result = await syncLeadToCRM(
        {
          leadId: event.leadId,
          fullName: event.lead.fullName,
          workEmail: event.lead.workEmail,
          companyName: event.lead.companyName,
          industry: event.lead.industry,
          category: event.lead.category || 'HOT',
          totalScore: event.lead.totalScore || 80,
        },
        false // Do not force failure during retry execution
      );

      if (result.success) {
        recoveredCount++;
        await prisma.integrationEvent.update({
          where: { id: event.id },
          data: {
            status: 'SUCCESS',
            attempts: currentAttempts,
            lastError: null,
          },
        });
      } else {
        const nextStatus = currentAttempts >= event.maxAttempts ? 'FAILED' : 'RETRYING';
        await prisma.integrationEvent.update({
          where: { id: event.id },
          data: {
            status: nextStatus,
            attempts: currentAttempts,
            lastError: result.error || 'Retry attempt failed',
          },
        });

        if (nextStatus === 'FAILED') {
          await createInAppNotification({
            title: '❌ Integration Retry Exhausted',
            message: `Event ${event.id} for lead ${event.lead.fullName} failed after ${currentAttempts} attempts.`,
            type: 'SYNC_ERROR',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      retriedCount,
      recoveredCount,
    });
  } catch (error) {
    console.error('Error retrying events:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
