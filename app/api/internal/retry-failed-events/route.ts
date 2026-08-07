import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { retryCRMSync } from '@/lib/crm/adapter';
import { createInAppNotification } from '@/lib/observability/logger';
import { ErrorClassification } from '@/lib/error-classification';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const failedEvents = await prisma.integrationEvent.findMany({
      where: {
        status: { in: ['FAILED', 'RETRYING', 'FAILED_PERMANENT'] },
        attempts: { lt: 3 },
      },
      include: { lead: true },
    });

    let retriedCount = 0;
    let recoveredCount = 0;
    let permanentFailureCount = 0;

    for (const event of failedEvents) {
      if (event.status === 'FAILED_PERMANENT') {
        continue;
      }

      retriedCount++;
      const currentAttempts = event.attempts + 1;

      const result = await retryCRMSync(
        {
          leadId: event.leadId,
          fullName: event.lead.fullName,
          workEmail: event.lead.workEmail,
          companyName: event.lead.companyName,
          industry: event.lead.industry,
          category: event.lead.category || 'HOT',
          totalScore: event.lead.totalScore || 80,
        },
        currentAttempts
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
        const isPermanent = result.classification === ErrorClassification.PERMANENT;
        const isFinalAttempt = currentAttempts >= event.maxAttempts;
        const nextStatus = isPermanent || isFinalAttempt ? 'FAILED_PERMANENT' : 'RETRYING';

        await prisma.integrationEvent.update({
          where: { id: event.id },
          data: {
            status: nextStatus,
            attempts: currentAttempts,
            lastError: result.error || 'Retry attempt failed',
          },
        });

        if (nextStatus === 'FAILED_PERMANENT') {
          permanentFailureCount++;
          await createInAppNotification({
            title: '❌ Integration Permanently Failed',
            message: `Event ${event.id} for lead ${event.lead.fullName} failed permanently after ${currentAttempts} attempts. Reason: ${result.error}`,
            type: 'SYNC_ERROR',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      retriedCount,
      recoveredCount,
      permanentFailureCount,
    });
  } catch (error) {
    console.error('Error retrying events:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}