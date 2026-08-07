import { prisma } from '../db';
import { classifyError, isRetryableError, ErrorClassification } from '../error-classification';

export interface CRMSyncPayload {
  leadId: string;
  fullName: string;
  workEmail: string;
  phoneNumber?: string;
  companyName: string;
  industry: string;
  category: string;
  totalScore: number;
}

export interface CRMSyncResult {
  success: boolean;
  externalId?: string;
  error?: string;
  classification?: ErrorClassification;
  retryAfter?: number;
}

const BASE_RETRY_DELAY_MS = 15 * 60 * 1000;
const MAX_RETRY_DELAY_MS = 24 * 60 * 60 * 1000;

function calculateBackoff(attempt: number, retryAfter?: number): number {
  if (retryAfter) {
    return Math.min(retryAfter, MAX_RETRY_DELAY_MS);
  }
  const exponentialDelay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY_MS);
}

export async function syncLeadToCRM(
  payload: CRMSyncPayload,
  forceSimulateFailure: boolean = false
): Promise<CRMSyncResult> {
  console.log(`[Demo CRM Adapter] Syncing lead ${payload.leadId} (${payload.workEmail}) to CRM...`);

  try {
    if (forceSimulateFailure) {
      const errorMsg = 'Simulated CRM connection timeout (HTTP 504 Gateway Timeout)';
      const classified = classifyError(new Error(errorMsg));
      
      await prisma.integrationEvent.create({
        data: {
          leadId: payload.leadId,
          system: 'CRM',
          eventType: 'SYNC_CONTACT',
          status: 'FAILED',
          attempts: 1,
          maxAttempts: 3,
          lastError: errorMsg,
          nextRetryAt: new Date(Date.now() + calculateBackoff(1, classified.retryAfter)),
          payloadJson: JSON.stringify(payload),
        },
      });

      await prisma.lead.update({
        where: { id: payload.leadId },
        data: { crmSyncStatus: 'FAILED' },
      });

      return { 
        success: false, 
        error: errorMsg,
        classification: classified.classification,
        retryAfter: classified.retryAfter,
      };
    }

    const externalId = `crm_deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await prisma.integrationEvent.create({
      data: {
        leadId: payload.leadId,
        system: 'CRM',
        eventType: 'SYNC_CONTACT',
        status: 'SUCCESS',
        attempts: 1,
        maxAttempts: 3,
        payloadJson: JSON.stringify({ ...payload, externalId }),
      },
    });

    await prisma.lead.update({
      where: { id: payload.leadId },
      data: {
        crmSyncStatus: 'SYNCED',
        crmExternalId: externalId,
      },
    });

    return { success: true, externalId };
  } catch (error) {
    const classified = classifyError(error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    await prisma.integrationEvent.create({
      data: {
        leadId: payload.leadId,
        system: 'CRM',
        eventType: 'SYNC_CONTACT',
        status: classified.classification === ErrorClassification.PERMANENT ? 'FAILED_PERMANENT' : 'FAILED',
        attempts: 1,
        maxAttempts: 3,
        lastError: errorMsg,
        nextRetryAt: classified.classification === ErrorClassification.RETRYABLE
          ? new Date(Date.now() + calculateBackoff(1, classified.retryAfter))
          : null,
        payloadJson: JSON.stringify(payload),
      },
    });

    await prisma.lead.update({
      where: { id: payload.leadId },
      data: { crmSyncStatus: 'FAILED' },
    });

    return { 
      success: false, 
      error: errorMsg,
      classification: classified.classification,
      retryAfter: classified.retryAfter,
    };
  }
}

export async function retryCRMSync(payload: CRMSyncPayload, attempt: number): Promise<CRMSyncResult> {
  console.log(`[Demo CRM Adapter] Retry attempt ${attempt} for lead ${payload.leadId}...`);

  try {
    const externalId = `crm_deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await prisma.integrationEvent.create({
      data: {
        leadId: payload.leadId,
        system: 'CRM',
        eventType: 'SYNC_CONTACT',
        status: 'SUCCESS',
        attempts: attempt,
        maxAttempts: 3,
        payloadJson: JSON.stringify({ ...payload, externalId }),
      },
    });

    await prisma.lead.update({
      where: { id: payload.leadId },
      data: {
        crmSyncStatus: 'SYNCED',
        crmExternalId: externalId,
      },
    });

    return { success: true, externalId };
  } catch (error) {
    const classified = classifyError(error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isFinalAttempt = attempt >= 3;
    const nextStatus = isFinalAttempt || classified.classification === ErrorClassification.PERMANENT
      ? 'FAILED_PERMANENT'
      : 'FAILED';

    await prisma.integrationEvent.create({
      data: {
        leadId: payload.leadId,
        system: 'CRM',
        eventType: 'SYNC_CONTACT',
        status: nextStatus,
        attempts: attempt,
        maxAttempts: 3,
        lastError: errorMsg,
        nextRetryAt: !isFinalAttempt && classified.classification === ErrorClassification.RETRYABLE
          ? new Date(Date.now() + calculateBackoff(attempt, classified.retryAfter))
          : null,
        payloadJson: JSON.stringify(payload),
      },
    });

    if (nextStatus === 'FAILED_PERMANENT') {
      await prisma.lead.update({
        where: { id: payload.leadId },
        data: { crmSyncStatus: 'FAILED_PERMANENT' },
      });
    } else {
      await prisma.lead.update({
        where: { id: payload.leadId },
        data: { crmSyncStatus: 'FAILED' },
      });
    }

    return { 
      success: false, 
      error: errorMsg,
      classification: classified.classification,
      retryAfter: classified.retryAfter,
    };
  }
}