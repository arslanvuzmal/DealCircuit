import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { IntelligenceEngine } from '@/lib/intelligence/engine';
import { SCENARIOS } from '@/lib/scenarios';
import { syncLeadToCRM, retryCRMSync } from '@/lib/crm/adapter';
import { prisma } from '@/lib/db';

const hasDatabase = !!process.env.DATABASE_URL;

describe('CRM Failure Retry & Idempotency', () => {
  let engine: IntelligenceEngine;

  beforeAll(() => {
    engine = new IntelligenceEngine({ mode: 'DEMO', demoFixtures: true });
  });

  it('should simulate CRM failure and retry with same idempotency key', async () => {
    const result = await engine.analyzeLead(SCENARIOS.crm_failure.leadData as any, 'crm_failure');

    const workflow = result.businessDiagnosis.workflow;
    expect(workflow).toContain('CRM Sync Attempt 1 → 503 Service Unavailable');
    expect(workflow).toContain('Retry Scheduled (Exponential Backoff)');
    expect(workflow).toContain('CRM Sync Attempt 2 → SUCCESS');
  });

  it('should demonstrate zero duplicates from retry', async () => {
    const result = await engine.analyzeLead(SCENARIOS.crm_failure.leadData as any, 'crm_failure');

    expect(result.businessDiagnosis.operationalConsequences).toContain(
      'Zero duplicate CRM records despite retry'
    );
  });

  it('should reuse idempotency key across retry attempts', async () => {
    const result = await engine.analyzeLead(SCENARIOS.crm_failure.leadData as any, 'crm_failure');

    const retryEvent = result.auditEvents.find(e => e.event.includes('CRM sync attempt 2'));
    expect(retryEvent).toBeDefined();
    expect(retryEvent!.metadata).toBeDefined();
    expect((retryEvent!.metadata as any)?.idempotencyKey).toBeDefined();
    expect((retryEvent!.metadata as any)?.idempotencyKey).toContain('lp_demo_crm_fail');
  });

  it('should show exactly one logical CRM record in follow-up', async () => {
    const result = await engine.analyzeLead(SCENARIOS.crm_failure.leadData as any, 'crm_failure');

    expect(result.followupDraft.body).toContain('Duplicate Objects Created: 0');
    expect(result.followupDraft.body).toContain('Exactly one logical CRM record created');
  });

  // Test the CRM adapter directly with failure injection (requires database)
  describe.skipIf(!hasDatabase)('CRM Adapter Failure Injection', () => {
    let testLeadId: string;

    beforeAll(async () => {
      const lead = await prisma.lead.create({
        data: {
          fullName: 'Test User',
          workEmail: 'test@crmfail.test',
          normalizedEmail: 'test@crmfail.test',
          phoneNumber: '+1 555-0999',
          normalizedPhone: '+15550999',
          companyName: 'CRM Fail Test Co',
          companyWebsite: 'https://crmfail.test',
          industry: 'Software / SaaS',
          companySize: '51-200',
          serviceRequired: 'Custom AI Lead Scoring & CRM Automation',
          budgetRange: '$25k-$50k (Growth)',
          desiredTimeline: '1-3 Months',
          decisionAuthority: 'Final Decision Maker (C-Level / Founder / Owner)',
          projectDescription: 'Testing CRM failure simulation with LeadPilot AI.',
          leadSource: 'Website Form',
          status: 'SCORED',
          category: 'HOT',
          totalScore: 82,
        },
      });
      testLeadId = lead.id;
    });

    afterAll(async () => {
      await prisma.integrationEvent.deleteMany({ where: { leadId: testLeadId } });
      await prisma.lead.delete({ where: { id: testLeadId } });
    });

    it('should fail first attempt and succeed on retry with same key', async () => {
      const payload = {
        leadId: testLeadId,
        fullName: 'Test User',
        workEmail: 'test@crmfail.test',
        phoneNumber: '+1 555-0999',
        companyName: 'CRM Fail Test Co',
        industry: 'Software / SaaS',
        category: 'HOT',
        totalScore: 82,
      };

      const firstResult = await syncLeadToCRM(payload, true);
      expect(firstResult.success).toBe(false);
      expect(firstResult.error).toContain('504');
      expect(firstResult.classification).toBe('RETRYABLE');

      const integrationEvent = await prisma.integrationEvent.findFirst({
        where: { leadId: testLeadId, status: 'FAILED' },
        orderBy: { createdAt: 'desc' },
      });
      expect(integrationEvent).toBeDefined();
      expect(integrationEvent!.attempts).toBe(1);

      const retryResult = await retryCRMSync(payload, 2);
      expect(retryResult.success).toBe(true);
      expect(retryResult.externalId).toBeDefined();

      const successEvents = await prisma.integrationEvent.findMany({
        where: { leadId: testLeadId, status: 'SUCCESS' },
      });
      expect(successEvents.length).toBe(1);
    });
  });
});