import { prisma } from '../db';

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
}

export async function syncLeadToCRM(payload: CRMSyncPayload, forceSimulateFailure: boolean = false): Promise<CRMSyncResult> {
  console.log(`[Demo CRM Adapter] Syncing lead ${payload.leadId} (${payload.workEmail}) to CRM...`);

  if (forceSimulateFailure) {
    const errorMsg = 'Simulated CRM connection timeout (HTTP 504 Gateway Timeout)';
    await prisma.integrationEvent.create({
      data: {
        leadId: payload.leadId,
        system: 'CRM',
        eventType: 'SYNC_CONTACT',
        status: 'FAILED',
        attempts: 1,
        maxAttempts: 3,
        lastError: errorMsg,
        nextRetryAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins later
        payloadJson: JSON.stringify(payload),
      },
    });

    await prisma.lead.update({
      where: { id: payload.leadId },
      data: { crmSyncStatus: 'FAILED' },
    });

    return { success: false, error: errorMsg };
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
}
