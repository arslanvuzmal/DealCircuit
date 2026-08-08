import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const complexB2bFixture: LeadIntelligenceResult = {
  runId: 'run_complex_b2b',
  traceId: 'trace_complex_b2b',
  mode: 'DEMO',
  lead: {
    fullName: 'Sarah Mitchell',
    workEmail: 'sarah.mitchell@vertexcare.com',
    phoneNumber: '+1 555-0147',
    companyName: 'VertexCare Clinics',
    companyWebsite: 'https://vertexcare.com',
    industry: 'Healthcare Services',
    companySize: '51-200',
    serviceRequired: 'AI Lead Scoring & CRM Automation',
    budgetRange: '$50k-$100k+ (Enterprise)',
    desiredTimeline: '<1 Month (Immediate)',
    decisionAuthority: 'Final Decision Maker (C-Level / Founder / Owner)',
    projectDescription: 'We currently receive around 1,800 patient enquiries every month across phone, forms and WhatsApp. Our front desk manually routes most of them and we\'re losing enquiries after hours. We use HubSpot and Google Calendar. I\'m exploring AI automation but we have concerns around patient data, integrations and whether this could work across all locations. We would probably need to start with one clinic first. Can you show us what implementation might look like?',
    leadSource: 'Website Form',
  },
  validation: {
    email: 'Valid',
    company: 'VertexCare Clinics',
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
    industry: 'Healthcare Services',
    companySize: '51-200',
    locations: 6,
    operationalComplexity: 'High - multi-location, multi-channel, regulated',
    existingSystems: ['HubSpot', 'Google Calendar', 'WhatsApp'],
    leadSource: 'Website Form',
    enriched: true,
  },
  contactIntelligence: {
    role: 'Operations Director',
    seniority: 'C-Level / VP',
    influenceLevel: 'High',
    department: 'Operations',
    decisionMakingCertainty: 'High - C-Level / Founder / Owner',
    inferred: ['Department inferred from role', 'Decision certainty inferred from title'],
  },
  businessDiagnosis: {
    primaryProblem: {
      name: 'After-hours enquiry leakage',
      severity: 'High',
      evidence: [
        '~1,800 monthly enquiries across phone, web, WhatsApp',
        'Front desk manually routes all enquiries',
        'No after-hours coverage mentioned',
      ],
      consequence: 'Significant revenue loss from missed after-hours enquiries; front desk overwhelmed during peak hours',
    },
    secondaryProblems: [
      {
        name: 'Fragmented enquiry routing',
        severity: 'Medium',
        evidence: ['Phone, web forms, WhatsApp all handled separately'],
        consequence: 'Inconsistent qualification, duplicate data entry, missed follow-ups',
      },
      {
        name: 'Manual data entry burden',
        severity: 'Medium',
        evidence: ['Manual CRM entry', 'Manual calendar scheduling'],
        consequence: 'Staff time wasted on repetitive tasks; data entry errors',
      },
    ],
    rootCauseSummary: 'The primary constraint is not lead generation - VertexCare already has significant enquiry volume. The operational bottleneck is the manual qualification > routing > scheduling chain that cannot scale across 6 locations and 3 channels.',
    workflow: [
      'Enquiry Capture (Phone/Web/WhatsApp)',
      'Manual Front Desk Review',
      'Manual Qualification',
      'Manual Routing to Clinic',
      'Manual HubSpot Entry',
      'Manual Calendar Scheduling',
    ],
    operationalConsequences: [
      'Delayed response times (especially after-hours)',
      'Inconsistent qualification criteria',
      'Duplicate data entry across HubSpot/Calendar',
      'Staff burnout from repetitive manual tasks',
      'Revenue leakage from missed after-hours enquiries',
    ],
  },
  buyingSignals: [
    {
      signal: 'We currently receive around 1,800 patient enquiries every month...',
      strength: 'Strong',
      evidence: 'Explicit volume disclosure indicates meaningful operational scale',
      interpretation: 'Meaningful operational volume exists - not a tire-kicker',
    },
    {
      signal: "We're losing enquiries after hours",
      strength: 'Strong',
      evidence: 'Direct admission of active operational/revenue problem',
      interpretation: 'The prospect has identified an active operational/revenue problem',
    },
    {
      signal: 'We use HubSpot and Google Calendar',
      strength: 'Strong',
      evidence: 'Specific systems named - integration environment is known',
      interpretation: 'Existing integration environment is identifiable and compatible',
    },
    {
      signal: 'We would probably need to start with one clinic first',
      strength: 'Strong',
      evidence: 'Prospect is thinking about deployment strategy, not just researching',
      interpretation: 'Prospect is in solution-evaluation territory, not just researching',
    },
    {
      signal: 'Can you show us what implementation might look like?',
      strength: 'Medium',
      evidence: 'Explicit request for implementation vision',
      interpretation: 'Prospect is entering solution-evaluation territory',
    },
  ],
  objections: [
    {
      name: 'Patient Data / Privacy',
      severity: 'High',
      evidence: 'Explicitly mentioned "concerns around patient data"',
      whyItMatters: 'Healthcare data requires HIPAA compliance; failure = legal/regulatory risk',
      recommendedNextStep: 'Provide HIPAA compliance documentation and BA agreement early in discovery',
    },
    {
      name: 'Integration Complexity',
      severity: 'Medium',
      evidence: 'HubSpot + Calendar + WhatsApp across 6 locations',
      whyItMatters: 'Multi-system, multi-location integration increases implementation risk',
      recommendedNextStep: 'Map current data flows in discovery; propose phased integration approach',
    },
    {
      name: 'Multi-location Rollout Complexity',
      severity: 'Medium',
      evidence: '6 clinics, 3 channels, phased rollout desired',
      whyItMatters: 'Phased rollout requires change management across locations',
      recommendedNextStep: 'Define pilot clinic criteria and success metrics in discovery',
    },
    {
      name: 'Budget Unknown',
      severity: 'Unknown',
      evidence: 'No budget range disclosed in conversation',
      whyItMatters: 'Cannot confirm commercial viability without budget confirmation',
      recommendedNextStep: 'Ask directly in discovery: "What budget range has been allocated for this initiative?"',
    },
  ],
  qualification: {
    overallScore: 87,
    stage: 'Sales Qualified',
    priority: 'High',
    dimensions: [
      { name: 'Problem Severity', score: 19, maxScore: 20, evidence: ['Significant enquiry volume (1,800/month)', 'After-hours leakage confirmed', 'Manual handling at scale', '6 locations affected'], missing: [] },
      { name: 'Commercial Intent', score: 18, maxScore: 20, evidence: ['Actively evaluating automation', 'Asked about implementation', 'Discussed pilot structure'], missing: ['Budget not disclosed'] },
      { name: 'Authority', score: 14, maxScore: 20, evidence: ['Operations Director title', 'Likely operational influence'], missing: ['Final procurement authority unclear'] },
      { name: 'Solution Fit', score: 19, maxScore: 20, evidence: ['Repetitive workflow automation', 'HubSpot + Calendar compatible', 'Multi-channel enquiry flow'], missing: ['WhatsApp integration scope unclear'] },
      { name: 'Urgency', score: 17, maxScore: 20, evidence: ['Current leakage = active pain', 'Implementation conversation initiated'], missing: ['Explicit target implementation date'] },
    ],
  },
  confidence: {
    score: 92,
    supportingFactors: [
      'Several explicit facts provided by prospect',
      'Concrete systems named (HubSpot, Google Calendar, WhatsApp)',
      'Operational volume disclosed with specificity',
      'Business problem directly stated by prospect',
      'Implementation conversation already initiated by prospect',
    ],
    uncertaintyFactors: [
      'Budget not disclosed',
      'Final procurement authority not confirmed',
      'Implementation timeline not specified',
      'Exact compliance requirements (HIPAA scope) not detailed',
      'WhatsApp integration scope not defined',
    ],
  },
  missingInformation: [
    { field: 'Budget', reason: 'No implementation budget supplied', impact: 'Cannot confirm commercial viability or size opportunity' },
    { field: 'Authority', reason: 'Operations Director identified, but final procurement authority unknown', impact: 'Decision-making process unclear; may need additional stakeholders' },
    { field: 'Timeline', reason: 'Problem is active but implementation date unknown', impact: 'Cannot forecast revenue or resource allocation' },
    { field: 'Compliance', reason: 'Patient-data concerns raised but exact regulatory/security requirements unspecified', impact: 'Cannot scope compliance effort or confirm feasibility' },
  ],
  recommendedQuestions: [
    { question: 'What percentage of the 1,800 monthly enquiries arrive outside staffed hours?', reason: 'Quantifies the after-hours leakage problem and sizes the opportunity', priority: 'Critical' },
    { question: 'Who would approve an automation pilot?', reason: 'Identifies final decision maker and procurement process', priority: 'Critical' },
    { question: 'Which systems currently receive or store patient information?', reason: 'Maps data flow for compliance and integration planning', priority: 'High' },
    { question: 'What outcome would define a successful one-clinic pilot?', reason: 'Defines success criteria and validates pilot approach', priority: 'High' },
    { question: 'What implementation timeline are you considering?', reason: 'Determines urgency and resource planning', priority: 'Medium' },
  ],
  dealStrategy: {
    action: 'Book a 30-minute technical discovery call',
    priority: 'Within 4 business hours',
    ownerType: 'Solutions Engineer / Senior Sales',
    objective: [
      'Validate after-hours enquiry volume and leakage rate',
      'Map patient-data boundary and compliance scope',
      'Audit HubSpot architecture and custom objects',
      'Document scheduling workflow and Calendar integration points',
      'Define pilot clinic selection criteria and success metrics',
    ],
    avoidForNow: [
      'Do not send generic pricing',
      'Do not propose full 6-clinic rollout',
      'Do not commit to HIPAA compliance without legal review',
    ],
    reasoning: 'The opportunity is technically promising (high score, strong signals), but budget, final authority, and compliance scope remain unresolved. A focused technical discovery call validates the highest-value assumptions before investing in a full proposal.',
  },
  crmPreview: {
    company: 'VertexCare Clinics',
    contact: 'Sarah Mitchell',
    stage: 'Sales Qualified',
    priority: 'High',
    opportunityScore: 87,
    confidence: 92,
    primaryRequirement: 'Multi-location enquiry automation with after-hours coverage',
    primaryPain: 'After-hours enquiry leakage across 6 clinics',
    currentSystems: ['HubSpot', 'Google Calendar', 'WhatsApp'],
    knownRisks: ['Patient data / HIPAA compliance', 'Integration complexity (HubSpot + Calendar + WhatsApp)', 'Multi-location rollout complexity', 'Budget unknown'],
    missingQualification: ['Budget', 'Final procurement authority', 'Implementation timeline', 'Exact HIPAA scope'],
    nextStep: 'Technical discovery call with Solutions Engineer',
  },
  followupDraft: {
    subject: 'Reducing after-hours enquiry leakage at VertexCare',
    body: `Hi Sarah,

The volume you mentioned - around 1,800 patient enquiries each month across phone, web and WhatsApp - makes the after-hours gap especially worth examining.

Rather than trying to automate all six clinics immediately, the one-clinic pilot you mentioned could be a practical way to validate the approach. We'd start by mapping your current HubSpot + Calendar + WhatsApp flow, then build a pilot that handles after-hours routing for one clinic.

A few things we'd explore in a 30-minute technical discovery call:

* What percentage of the 1,800 enquiries arrive outside staffed hours?
* Which systems currently receive or store patient information?
* What outcome would define a successful one-clinic pilot?
* What implementation timeline are you considering?

If this aligns with how you're thinking about the problem, I'd be glad to schedule a 30-minute technical discovery call this week. My calendar is here: [link].

Best regards,
Solutions Team
LeadPilot AI`,
    personalizationEvidence: [
      'References disclosed enquiry volume (1,800/month)',
      'Addresses pilot rollout strategy (one clinic first)',
      'Recognizes HubSpot + Google Calendar + WhatsApp stack',
      'Acknowledges privacy/compliance concerns (patient data)',
      'Does not invent budget figures',
      'Does not invent implementation timeline',
      'CTA matches current qualification stage (technical discovery)',
    ],
  },
  auditEvents: [],
  businessImpact: {
    traditionalManualMinutes: 12,
    leadPilotAutomatedSeconds: 8,
    humanReviewMinutes: 0.75,
    illustrativeStaffTimeSaved: '~10-11 minutes per qualified enquiry',
    disclaimer: 'Illustrative estimate based on this demo workflow. Actual results vary by organization, process maturity, and integration complexity. Not a guarantee of future performance.',
  },
  scenario: 'complex_b2b',
  simulation: {
    externalActionsExecuted: false,
    message: 'Simulation Mode - no external CRM or email actions will be performed',
  },
  security: {
    suspiciousPhrases: [],
    promptInjectionDetected: false,
    sanitizedFields: [],
  },
};


