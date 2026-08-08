import { describe, it, expect, beforeAll } from 'vitest';
import { IntelligenceEngine } from '@/lib/intelligence/engine';
import { SCENARIOS } from '@/lib/scenarios';
import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

describe('Intelligence Engine - Scenario Tests', () => {
  let engine: IntelligenceEngine;

  beforeAll(() => {
    engine = new IntelligenceEngine({ mode: 'DEMO', demoFixtures: true });
  });

  describe('Complex B2B (VertexCare)', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.complex_b2b.leadData as any, 'complex_b2b');
    });

    it('should have correct company and contact', () => {
      expect(result.lead.companyName).toBe('VertexCare Clinics');
      expect(result.lead.fullName).toBe('Sarah Mitchell');
      expect(result.lead.workEmail).toBe('sarah.mitchell@vertexcare.com');
    });

    it('should have healthcare-specific business diagnosis', () => {
      expect(result.businessDiagnosis.primaryProblem.name).toBe('After-hours enquiry leakage');
      expect(result.businessDiagnosis.primaryProblem.severity).toBe('High');
      expect(result.businessDiagnosis.primaryProblem.evidence).toContain('~1,800 monthly enquiries across phone, web, WhatsApp');
      expect(result.businessDiagnosis.rootCauseSummary).toContain('manual qualification > routing > scheduling chain');
    });

    it('should have strong buying signals', () => {
      expect(result.buyingSignals.length).toBeGreaterThan(0);
      const volumeSignal = result.buyingSignals.find(s => s.signal.includes('1,800'));
      expect(volumeSignal).toBeDefined();
      expect(volumeSignal!.strength).toBe('Strong');
    });

    it('should have healthcare-specific objections', () => {
      const privacyObjection = result.objections.find(o => o.name.includes('Patient Data'));
      expect(privacyObjection).toBeDefined();
      expect(privacyObjection!.severity).toBe('High');
      expect(privacyObjection!.whyItMatters).toContain('HIPAA');
    });

    it('should have high qualification score', () => {
      expect(result.qualification.overallScore).toBeGreaterThanOrEqual(80);
      expect(result.qualification.stage).toBe('Sales Qualified');
      expect(result.qualification.priority).toBe('High');
    });

    it('should have high confidence', () => {
      expect(result.confidence.score).toBeGreaterThanOrEqual(80);
    });

    it('should have missing budget, authority, timeline', () => {
      const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
      expect(missingFields).toContain('budget');
      expect(missingFields).toContain('authority');
      expect(missingFields).toContain('timeline');
    });

    it('should not have fabricated budget when not provided in conversation', () => {
      // The fixture shows budget was provided in form but conversation didn't disclose it
      const budgetMissing = result.missingInformation.find(m => m.field === 'Budget');
      expect(budgetMissing).toBeDefined();
    });

    it('should have runId and traceId', () => {
      expect(result.runId).toMatch(/^run_/);
      expect(result.traceId).toMatch(/^trace_/);
    });

    it('should have audit events with current timestamps', () => {
      expect(result.auditEvents.length).toBeGreaterThan(0);
      result.auditEvents.forEach(event => {
        expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        expect(event.runId).toBe(result.runId);
        expect(event.traceId).toBe(result.traceId);
      });
    });
  });

  describe('Ambiguous Lead', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.ambiguous.leadData as any, 'ambiguous');
    });

    it('should have Review Required stage', () => {
      expect(result.qualification.stage).toBe('Review Required');
    });

    it('should have low confidence', () => {
      expect(result.confidence.score).toBeLessThanOrEqual(60);
    });

    it('should not fabricate VertexCare diagnosis', () => {
      expect(result.businessDiagnosis.primaryProblem.name).not.toContain('patient');
      expect(result.businessDiagnosis.primaryProblem.name).not.toContain('clinic');
      expect(result.companyIntelligence.industry).toBe('Software / SaaS');
      expect(result.lead.companyName).toBe('CloudScale Solutions');
    });

    it('should have minimal buying signals', () => {
      expect(result.buyingSignals.length).toBeLessThanOrEqual(2);
    });

    it('should list missing information appropriately', () => {
      const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
      expect(missingFields).toContain('budget');
      expect(missingFields).toContain('authority');
      expect(missingFields).toContain('timeline');
      expect(missingFields).toContain('company details');
    });
  });

  describe('Duplicate Lead', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.duplicate.leadData as any, 'duplicate');
    });

    it('should detect duplicate', () => {
      expect(result.duplicateCheck.isDuplicate).toBe(true);
      expect(result.duplicateCheck.matchType).toBe('email');
    });

    it('should have existing lead info', () => {
      expect(result.duplicateCheck.existingLead).toBeDefined();
      expect(result.duplicateCheck.existingLead!.name).toBe('Sarah Mitchell');
      expect(result.duplicateCheck.existingLead!.company).toBe('VertexCare Clinics');
    });

    it('should recommend update not create', () => {
      expect(result.dealStrategy.action).toContain('Update existing opportunity');
      expect(result.dealStrategy.avoidForNow).toContain('Do not create new CRM record');
    });

    it('should have Review Required stage due to duplicate', () => {
      expect(result.qualification.stage).toBe('Review Required');
    });

    it('CRM preview should show update action', () => {
      expect(result.crmPreview.nextStep).toContain('Update existing');
    });
  });

  describe('Poor-Fit Lead (Bakery)', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.poor_fit.leadData as any, 'poor_fit');
    });

    it('should have Disqualified stage', () => {
      expect(result.qualification.stage).toBe('Disqualified');
      expect(result.qualification.priority).toBe('Low');
    });

    it('should have low score', () => {
      expect(result.qualification.overallScore).toBeLessThanOrEqual(40);
    });

    it('should have bakery-specific diagnosis, NOT healthcare', () => {
      expect(result.lead.companyName).toBe("Thompson's Local Bakery");
      expect(result.companyIntelligence.industry).toBe('Food & Beverage');
      expect(result.businessDiagnosis.primaryProblem.name).toContain('order-processing');
      expect(result.businessDiagnosis.primaryProblem.name).not.toContain('patient');
      expect(result.businessDiagnosis.primaryProblem.name).not.toContain('clinic');
      expect(result.businessDiagnosis.rootCauseSummary).not.toContain('healthcare');
    });

    it('should have objections about budget/size/industry mismatch', () => {
      const budgetObjection = result.objections.find(o => o.name.includes('Budget'));
      expect(budgetObjection).toBeDefined();
      expect(budgetObjection!.severity).toBe('High');

      const sizeObjection = result.objections.find(o => o.name.includes('Size'));
      expect(sizeObjection).toBeDefined();

      const industryObjection = result.objections.find(o => o.name.includes('Industry'));
      expect(industryObjection).toBeDefined();
    });

    it('should recommend polite disqualification', () => {
      expect(result.dealStrategy.action).toContain('polite disqualification');
      expect(result.dealStrategy.avoidForNow).toContain('Do not schedule discovery call');
    });

    it('CRM preview should show bakery, not VertexCare', () => {
      expect(result.crmPreview.company).toBe("Thompson's Local Bakery");
      expect(result.crmPreview.contact).toBe('Mike Thompson');
    });

    it('follow-up should reference bakery context', () => {
      expect(result.followupDraft.body).toContain("Thompson's Local Bakery");
      expect(result.followupDraft.body).not.toContain('patient');
      expect(result.followupDraft.body).not.toContain('VertexCare');
    });
  });

  describe('Enterprise Lead', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.enterprise.leadData as any, 'enterprise');
    });

    it('should have Sales Qualified stage with high score', () => {
      expect(result.qualification.stage).toBe('Sales Qualified');
      expect(result.qualification.overallScore).toBeGreaterThanOrEqual(90);
      expect(result.qualification.priority).toBe('High');
    });

    it('should have enterprise-specific diagnosis', () => {
      expect(result.lead.companyName).toBe('Global Financial Services Inc.');
      expect(result.companyIntelligence.industry).toBe('FinTech / Financial Services');
      expect(result.companyIntelligence.locations).toBe(12);
      expect(result.businessDiagnosis.primaryProblem.name).toContain('Global lead routing');
      expect(result.businessDiagnosis.rootCauseSummary).toContain('Security, Legal, IT, and Sales Ops');
    });

    it('should have SOC2 and compliance objections', () => {
      const soc2Objection = result.objections.find(o => o.name.includes('SOC2'));
      expect(soc2Objection).toBeDefined();
      expect(soc2Objection!.severity).toBe('Critical');

      const residencyObjection = result.objections.find(o => o.name.includes('Data Residency'));
      expect(residencyObjection).toBeDefined();
    });

    it('should recommend executive alignment + technical deep-dive', () => {
      expect(result.dealStrategy.action).toContain('executive alignment');
      expect(result.dealStrategy.ownerType).toContain('Enterprise AE');
      expect(result.dealStrategy.avoidForNow).toContain('Do not send standard SMB proposal');
    });
  });

  describe('Prompt Injection', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.prompt_injection.leadData as any, 'prompt_injection');
    });

    it('should detect injection from content, not scenario name', () => {
      expect(result.security?.promptInjectionDetected).toBe(true);
      expect(result.security?.suspiciousPhrases.length).toBeGreaterThan(0);
    });

    it('should have zero score and blocked qualification', () => {
      expect(result.qualification.overallScore).toBe(0);
      expect(result.qualification.stage).toBe('Review Required');
      expect(result.qualification.priority).toBe('Low');
    });

    it('should have security objections', () => {
      const injectionObjection = result.objections.find(o => o.name.includes('Prompt Injection'));
      expect(injectionObjection).toBeDefined();
      expect(injectionObjection!.severity).toBe('Critical');

      const overrideObjection = result.objections.find(o => o.name.includes('Override'));
      expect(overrideObjection).toBeDefined();

      const exfilObjection = result.objections.find(o => o.name.includes('Exfiltration'));
      expect(exfilObjection).toBeDefined();
    });

    it('should block all external actions', () => {
      expect(result.dealStrategy.action).toContain('Block and log');
      expect(result.dealStrategy.avoidForNow).toContain('Do not process as legitimate lead');
      expect(result.dealStrategy.avoidForNow).toContain('Do not send any follow-up');
      expect(result.dealStrategy.avoidForNow).toContain('Do not create CRM record');
    });

    it('follow-up should be security alert, not sales email', () => {
      expect(result.followupDraft.subject).toContain('Security Alert');
      expect(result.followupDraft.body).toContain('blocked');
      expect(result.followupDraft.body).toContain('No qualification was performed');
    });

    it('CRM preview should show security event', () => {
      expect(result.crmPreview.nextStep).toContain('Security event logged');
    });
  });

  describe('Missing Data', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.missing_data.leadData as any, 'missing_data');
    });

    it('should have Review Required stage', () => {
      expect(result.qualification.stage).toBe('Review Required');
    });

    it('should have low confidence', () => {
      expect(result.confidence.score).toBeLessThanOrEqual(40);
    });

    it('should not fabricate company intelligence', () => {
      expect(result.companyIntelligence.operationalComplexity).toContain('insufficient data');
      expect(result.companyIntelligence.enriched).toBe(false);
    });

    it('should list all missing fields', () => {
      const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
      expect(missingFields).toContain('company name');
      expect(missingFields).toContain('phone number');
      expect(missingFields).toContain('company website');
      expect(missingFields).toContain('project description');
      expect(missingFields).toContain('current systems');
      expect(missingFields).toContain('volume metrics');
    });

    it('should not fabricate VertexCare data', () => {
      expect(result.lead.companyName).toBe('');
      expect(result.crmPreview.company).toContain('Unknown');
    });
  });

  describe('CRM Failure', () => {
    let result: LeadIntelligenceResult;

    beforeAll(async () => {
      result = await engine.analyzeLead(SCENARIOS.crm_failure.leadData as any, 'crm_failure');
    });

    it('should have CRM failure diagnosis', () => {
      expect(result.businessDiagnosis.primaryProblem.name).toContain('CRM integration failure');
      expect(result.businessDiagnosis.workflow).toContain('CRM Sync Attempt 1 → 503 Service Unavailable');
      expect(result.businessDiagnosis.workflow).toContain('CRM Sync Attempt 2 → SUCCESS');
    });

    it('should show zero duplicates from retry', () => {
      expect(result.businessDiagnosis.operationalConsequences).toContain('Zero duplicate CRM records despite retry');
    });

    it('should have audit events showing failure and retry', () => {
      const failedEvent = result.auditEvents.find(e => e.event.includes('CRM sync attempt 1') && e.status === 'failed');
      expect(failedEvent).toBeDefined();
      expect(failedEvent!.metadata).toBeDefined();

      const retryEvent = result.auditEvents.find(e => e.event.includes('CRM sync attempt 2') && e.status === 'completed');
      expect(retryEvent).toBeDefined();
    });

    it('should use same idempotency key for retry', () => {
      const retryEvent = result.auditEvents.find(e => e.event.includes('CRM sync attempt 2'));
      expect(retryEvent).toBeDefined();
      expect(retryEvent!.metadata).toBeDefined();
      expect((retryEvent!.metadata as any)?.idempotencyKey).toBeDefined();
    });

    it('follow-up should document the simulation trace', () => {
      expect(result.followupDraft.body).toContain('Idempotency Key');
      expect(result.followupDraft.body).toContain('Attempt 1');
      expect(result.followupDraft.body).toContain('Attempt 2');
      expect(result.followupDraft.body).toContain('Duplicate Objects Created: 0');
    });
  });
});
