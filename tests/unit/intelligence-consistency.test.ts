import { describe, it, expect, beforeAll } from 'vitest';
import { IntelligenceEngine } from '@/lib/intelligence/engine';

describe('Intelligence Engine - Consistency Validation', () => {
  let engine: IntelligenceEngine;

  beforeAll(() => {
    engine = new IntelligenceEngine({ mode: 'DEMO', demoFixtures: false });
  });

  it('should not report budget missing when budget range provided', async () => {
    const leadData = {
      fullName: 'Test User',
      workEmail: 'test@example.com',
      phoneNumber: '+1 555-0100',
      companyName: 'Test Company',
      companyWebsite: 'https://test.com',
      industry: 'Software / SaaS',
      companySize: '51-200',
      serviceRequired: 'AI Lead Scoring',
      budgetRange: '$50k-$100k+ (Enterprise)',
      desiredTimeline: '1-3 Months',
      decisionAuthority: 'Final Decision Maker',
      projectDescription: 'We need lead automation for our sales team.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
    expect(missingFields).not.toContain('budget');
  });

  it('should not report phone missing when phone provided', async () => {
    const leadData = {
      fullName: 'Test User',
      workEmail: 'test@example.com',
      phoneNumber: '+1 555-0100',
      companyName: 'Test Company',
      companyWebsite: '',
      industry: 'Software / SaaS',
      companySize: '51-200',
      serviceRequired: 'AI Lead Scoring',
      budgetRange: '$25k-$50k',
      desiredTimeline: '1-3 Months',
      decisionAuthority: 'Final Decision Maker',
      projectDescription: 'We need lead automation for our sales team.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    expect(result.validation.missing?.toLowerCase()).not.toContain('phone');
    expect(result.validation.missing).toBeDefined();
  });

  it('should not report timeline missing when timeline provided', async () => {
    const leadData = {
      fullName: 'Test User',
      workEmail: 'test@example.com',
      phoneNumber: '+1 555-0100',
      companyName: 'Test Company',
      companyWebsite: '',
      industry: 'Software / SaaS',
      companySize: '51-200',
      serviceRequired: 'AI Lead Scoring',
      budgetRange: '$25k-$50k',
      desiredTimeline: '<1 Month (Immediate)',
      decisionAuthority: 'Final Decision Maker',
      projectDescription: 'We need lead automation for our sales team.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
    expect(missingFields).not.toContain('timeline');
  });

  it('should not report authority missing when decision authority provided', async () => {
    const leadData = {
      fullName: 'Test User',
      workEmail: 'test@example.com',
      phoneNumber: '+1 555-0100',
      companyName: 'Test Company',
      companyWebsite: '',
      industry: 'Software / SaaS',
      companySize: '51-200',
      serviceRequired: 'AI Lead Scoring',
      budgetRange: '$25k-$50k',
      desiredTimeline: '1-3 Months',
      decisionAuthority: 'Final Decision Maker (C-Level / Founder / Owner)',
      projectDescription: 'We need lead automation for our sales team.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
    expect(missingFields).not.toContain('authority');
  });

  it('should not produce healthcare diagnosis for bakery', async () => {
    const leadData = {
      fullName: 'Mike Thompson',
      workEmail: 'mike@bakery.com',
      phoneNumber: '+1 555-0199',
      companyName: "Thompson's Bakery",
      companyWebsite: 'https://bakery.com',
      industry: 'Food & Beverage',
      companySize: '1-10',
      serviceRequired: 'Order Automation',
      budgetRange: 'Under $10k (Starter)',
      desiredTimeline: 'Exploratory',
      decisionAuthority: 'Final Decision Maker',
      projectDescription: 'We run a small bakery with 20 orders per week.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    const diagnosisText = JSON.stringify(result.businessDiagnosis).toLowerCase();
    expect(diagnosisText).not.toContain('patient');
    expect(diagnosisText).not.toContain('clinic');
    expect(diagnosisText).not.toContain('hipaa');
    expect(diagnosisText).not.toContain('vertexcare');
    expect(result.companyIntelligence.industry.toLowerCase()).toContain('food');
  });

  it('should not produce healthcare diagnosis for logistics company', async () => {
    const leadData = {
      fullName: 'John Ahmed',
      workEmail: 'john@logistics.com',
      phoneNumber: '+1 555-0200',
      companyName: 'ABC Logistics',
      companyWebsite: '',
      industry: 'Logistics / Transportation',
      companySize: '51-200',
      serviceRequired: 'Dispatch Automation',
      budgetRange: '$25k-$50k',
      desiredTimeline: '1-3 Months',
      decisionAuthority: 'Final Decision Maker',
      projectDescription: 'We operate 50 delivery trucks. Dispatch requests arrive by email and WhatsApp and our team manually enters them into Zoho CRM. We want to reduce dispatch delays and duplicate entries.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    const diagnosisText = JSON.stringify(result.businessDiagnosis).toLowerCase();
    expect(diagnosisText).not.toContain('patient');
    expect(diagnosisText).not.toContain('clinic');
    expect(diagnosisText).not.toContain('hipaa');
    expect(result.companyIntelligence.industry.toLowerCase()).toContain('logistics');
    expect(result.followupDraft.body.toLowerCase()).toContain('logistics');
    expect(result.followupDraft.body.toLowerCase()).toContain('abc logistics');
  });

  it('should have consistent validation and missing information', async () => {
    const leadData = {
      fullName: 'Test User',
      workEmail: 'test@example.com',
      phoneNumber: '',
      companyName: 'Test Company',
      companyWebsite: '',
      industry: 'Software / SaaS',
      companySize: '1-10',
      serviceRequired: 'AI Lead Scoring',
      budgetRange: 'Under $10k (Starter)',
      desiredTimeline: 'Exploratory',
      decisionAuthority: 'Team Lead / Individual Contributor',
      projectDescription: 'We need lead automation.',
      leadSource: 'Website Form',
    };

    const result = await engine.analyzeLead(leadData);
    
    // Phone missing should be reflected in validation
    expect(result.validation.missing?.toLowerCase()).toContain('phone');
    
    // Website missing should be reflected in validation
    expect(result.validation.missing?.toLowerCase()).toContain('website');
    
    // Missing information should include phone and website
    const missingFields = result.missingInformation.map(m => m.field.toLowerCase());
    expect(missingFields).toContain('phone number');
    expect(missingFields.some(f => f.includes('company website') || f.includes('website url'))).toBe(true);
  });
});