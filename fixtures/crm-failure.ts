import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const crmFailureFixture: LeadIntelligenceResult = {
  runId: 'run_crm_failure',
  traceId: 'trace_crm_failure',
  mode: 'DEMO',
  lead: {
    fullName: 'Test User',
    workEmail: 'test@crmfail.test',
    phoneNumber: '+1 555-0999',
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
  },
  validation: {
    email: 'Valid',
    company: 'CRM Fail Test Co',
    duplicateCheck: 'No exact duplicate',
    requiredFields: '5 / 5 available',
    missing: undefined,
  },
  duplicateCheck: {
    isDuplicate: false,
    matchType: undefined,
    existingLead: undefined,
  },
  companyIntelligence: {
    industry: 'Software / SaaS',
    companySize: '51-200',
    locations: 1,
    operationalComplexity: 'Medium - demo CRM failure simulation',
    existingSystems: ['Demo CRM'],
    leadSource: 'Website Form',
    enriched: true,
  },
  contactIntelligence: {
    role: 'Test User',
    seniority: 'C-Level / Founder',
    influenceLevel: 'High',
    department: 'Operations',
    decisionMakingCertainty: 'High - Final Decision Maker',
    inferred: ['Test scenario - synthetic data'],
  },
  businessDiagnosis: {
    primaryProblem: {
      name: 'CRM integration failure simulation',
      severity: 'High',
      evidence: [
        'Simulated downstream CRM 503 Service Unavailable',
        'Exponential backoff retry configured',
        'Idempotency key protection active',
      ],
      consequence: 'Demonstrates LeadPilot resilience to transient CRM failures without duplicate records',
    },
    secondaryProblems: [],
    rootCauseSummary: 'This scenario demonstrates LeadPilot\'s ability to handle transient CRM failures. When the CRM returns a 503 error, the system automatically retries with exponential backoff using the same idempotency key, ensuring exactly-once delivery semantics.',
    workflow: [
      'Lead Normalization',
      'Duplicate Check',
      'Qualification (Score: 82, HOT)',
      'Human Approval (Auto-approved in demo)',
      'CRM Sync Attempt 1 → 503 Service Unavailable',
      'Retry Scheduled (Exponential Backoff)',
      'CRM Sync Attempt 2 → SUCCESS',
      'Follow-up Generated',
      'Audit Trail Complete',
    ],
    operationalConsequences: [
      'Zero duplicate CRM records despite retry',
      'Automatic recovery without human intervention',
      'Full audit trail of both attempts',
      'Bounded retry prevents infinite loops',
    ],
  },
  buyingSignals: [
    {
      signal: 'Testing CRM failure simulation',
      strength: 'Medium',
      evidence: 'Explicit test scenario for failure handling',
      interpretation: 'Evaluating platform resilience capabilities',
    },
  ],
  objections: [
    {
      name: 'CRM Failure Risk',
      severity: 'High',
      evidence: 'Simulated 503 Service Unavailable on first CRM attempt',
      whyItMatters: 'Downstream failures could cause data loss or duplicates without proper handling',
      recommendedNextStep: 'Verify retry logic and idempotency protection in production',
    },
    {
      name: 'Retry Timing',
      severity: 'Medium',
      evidence: 'Exponential backoff with jitter (15min base, max 24hr)',
      whyItMatters: 'Retry delays affect lead response SLA',
      recommendedNextStep: 'Configure retry policy per CRM SLA requirements',
    },
    {
      name: 'Idempotency Key Reuse',
      severity: 'Medium',
      evidence: 'Same idempotency key used across retry attempts',
      whyItMatters: 'Ensures exactly-once semantics; prevents duplicate CRM objects',
      recommendedNextStep: 'Verify idempotency key generation includes lead fingerprint + action + run context',
    },
  ],
  qualification: {
    overallScore: 82,
    stage: 'Sales Qualified',
    priority: 'High',
    dimensions: [
      { name: 'Problem Severity', score: 18, maxScore: 20, evidence: ['Demonstrates real failure handling need'], missing: ['Simulated scenario'] },
      { name: 'Commercial Intent', score: 18, maxScore: 20, evidence: ['Growth budget', 'Active evaluation'], missing: [] },
      { name: 'Authority', score: 15, maxScore: 20, evidence: ['Final Decision Maker'], missing: [] },
      { name: 'Solution Fit', score: 16, maxScore: 20, evidence: ['CRM integration is core capability'], missing: ['Simulated test'] },
      { name: 'Urgency', score: 15, maxScore: 20, evidence: ['1-3 month timeline'], missing: [] },
    ],
  },
  confidence: {
    score: 95,
    supportingFactors: [
      'Controlled test scenario with known expected behavior',
      'Deterministic failure injection',
      'Clear success criteria (retry succeeds, no duplicates)',
      'Full audit trail verification possible',
    ],
    uncertaintyFactors: [
      'Simulated environment - production CRM behavior may vary',
    ],
  },
  missingInformation: [],
  recommendedQuestions: [
    { question: 'What is your production CRM SLA for availability?', reason: 'Configures retry policy to match CRM contract', priority: 'High' },
    { question: 'How are idempotency keys generated in your integration layer?', reason: 'Verifies exactly-once semantics match requirements', priority: 'High' },
    { question: 'What is your acceptable retry window for CRM sync?', reason: 'Bounds exponential backoff configuration', priority: 'Medium' },
  ],
  dealStrategy: {
    action: 'Demonstrate CRM failure → retry → recovery with idempotency protection',
    priority: 'Immediate (demo)',
    ownerType: 'System Demo',
    objective: [
      'Show CRM failure detection',
      'Demonstrate exponential backoff retry',
      'Show idempotency protection (zero duplicates)',
      'Display recovery audit trail',
    ],
    avoidForNow: [],
    reasoning: 'Demonstration of LeadPilot\'s resilience to downstream failures. CRM returns 503, system retries with exponential backoff, succeeds on retry without duplicate records.',
  },
  crmPreview: {
    company: 'CRM Fail Test Co',
    contact: 'Test User',
    stage: 'Sales Qualified',
    priority: 'High',
    opportunityScore: 82,
    confidence: 95,
    primaryRequirement: 'CRM failure resilience demonstration',
    primaryPain: 'Simulated CRM 503 timeout',
    currentSystems: ['Demo CRM (failure injection enabled)'],
    knownRisks: ['CRM failure (simulated)', 'Retry timing', 'Idempotency verification'],
    missingQualification: [],
    nextStep: 'Execute CRM failure simulation workflow',
  },
  followupDraft: {
    subject: 'CRM Failure Simulation Complete - LeadPilot AI',
    body: `CRM Failure Simulation Results

Test Scenario: CRM Failure Injection
Lead: Test User (CRM Fail Test Co)
Idempotency Key: lp_demo_crm_fail_${Date.now()}

Execution Trace:
1. Lead Normalization - ✓ COMPLETED
2. Duplicate Check - ✓ COMPLETED  
3. Qualification - ✓ COMPLETED (Score: 82, HOT)
4. Human Review - ✓ AUTO-APPROVED (demo mode)

CRM Sync Attempt 1:
  Status: FAILED
  Error: HTTP 503 Service Unavailable
  Classification: RETRYABLE
  Idempotency Key: lp_demo_crm_fail_${Date.now()}
  Action: Scheduled exponential backoff retry

CRM Sync Attempt 2 (Retry):
  Status: SUCCESS
  External ID: crm_deal_demo_recovery
  Same Idempotency Key: lp_demo_crm_fail_${Date.now()}
  Duplicate Objects Created: 0

Follow-up: ✓ GENERATED
Audit Trail: ✓ COMPLETE

Result: Exactly one logical CRM record created despite transient failure.

This demonstrates LeadPilot's bounded retry with idempotency protection - a critical capability for production revenue operations.`,
    personalizationEvidence: [
      'Documents full execution trace',
      'Shows idempotency key reuse',
      'Confirms zero duplicate objects',
      'References demo-specific identifiers',
    ],
  },
  auditEvents: [
    { timestamp: '', event: 'Lead received', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Validation completed', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Duplicate lookup completed', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Qualification started', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Business problem diagnosed', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Buying signals extracted', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Risk analysis completed', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Qualification generated', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'CRM sync attempt 1', status: 'failed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo', retryCount: 1, metadata: { error: 'HTTP 503 Service Unavailable', classification: 'RETRYABLE' } },
    { timestamp: '', event: 'CRM sync retry scheduled', status: 'pending', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo', metadata: { backoffMs: 900000 } },
    { timestamp: '', event: 'CRM sync attempt 2', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo', retryCount: 2, metadata: { idempotencyKey: 'lp_demo_crm_fail', externalId: 'crm_deal_demo_recovery' } },
    { timestamp: '', event: 'Follow-up generated', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
    { timestamp: '', event: 'Workflow completed', status: 'completed', traceId: 'trace_crm_failure', runId: 'run_crm_failure', executionType: 'demo' },
  ],
  businessImpact: {
    traditionalManualMinutes: 12,
    leadPilotAutomatedSeconds: 8,
    humanReviewMinutes: 0.75,
    illustrativeStaffTimeSaved: '~10-11 minutes per qualified enquiry',
    disclaimer: 'Illustrative estimate based on this demo workflow. Actual results vary by organization, process maturity, and integration complexity. Not a guarantee of future performance.',
  },
  scenario: 'crm_failure',
  simulation: {
    externalActionsExecuted: false,
    message: 'Simulation Mode - CRM failure injected for demonstration; no real external CRM was called',
  },
  security: {
    suspiciousPhrases: [],
    promptInjectionDetected: false,
    sanitizedFields: [],
  },
};


