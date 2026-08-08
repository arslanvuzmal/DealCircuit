import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const missingDataFixture: LeadIntelligenceResult = {
  runId: 'run_missing_data',
  traceId: 'trace_missing_data',
  mode: 'DEMO',
  lead: {
    fullName: 'Alex Rivera',
    workEmail: 'alex@startup.io',
    phoneNumber: '',
    companyName: '',
    companyWebsite: '',
    industry: 'Software / SaaS',
    companySize: '1-10',
    serviceRequired: 'AI Lead Scoring & CRM Automation',
    budgetRange: '$10k-$25k (Mid-market)',
    desiredTimeline: '1-3 Months',
    decisionAuthority: 'Final Decision Maker (C-Level / Founder / Owner)',
    projectDescription: 'We need lead automation.',
    leadSource: 'Website Form',
  },
  validation: {
    email: 'Valid',
    company: 'Missing',
    duplicateCheck: 'Unable to check (no company name)',
    requiredFields: '3 / 5 available',
    missing: 'Company name, phone number, company website, detailed project description',
  },
  duplicateCheck: {
    isDuplicate: false,
    matchType: undefined,
    existingLead: undefined,
  },
  companyIntelligence: {
    industry: 'Software / SaaS',
    companySize: '1-10',
    locations: undefined,
    operationalComplexity: 'Unknown - insufficient data for assessment',
    existingSystems: [],
    leadSource: 'Website Form',
    enriched: false,
  },
  contactIntelligence: {
    role: 'Unknown - not provided',
    seniority: 'C-Level / Founder / Owner (self-reported)',
    influenceLevel: 'Unknown',
    department: 'Unknown',
    decisionMakingCertainty: 'Claimed: High - Final Decision Maker',
    inferred: ['Decision authority self-reported but unverified'],
  },
  businessDiagnosis: {
    primaryProblem: {
      name: 'Insufficient information to diagnose business problem',
      severity: 'Low',
      evidence: [
        'Project description only 7 words: "We need lead automation."',
        'No company name provided',
        'No current systems disclosed',
        'No specific pain points mentioned',
      ],
      consequence: 'Cannot identify operational bottlenecks, automation opportunities, or solution fit',
    },
    secondaryProblems: [],
    rootCauseSummary: 'The submission lacks the minimum operational context required for business problem diagnosis. Without company identity, current tech stack, volume metrics, or specific pain points, any diagnosis would be entirely speculative.',
    workflow: [],
    operationalConsequences: [
      'Cannot assess problem severity or urgency',
      'Cannot extract buying signals',
      'Cannot evaluate solution fit or integration complexity',
      'Cannot size opportunity or forecast revenue',
    ],
  },
  buyingSignals: [
    {
      signal: 'Self-reported final decision maker authority',
      strength: 'Weak',
      evidence: 'Decision authority field claims "Final Decision Maker (C-Level / Founder / Owner)"',
      interpretation: 'If verified, removes procurement barrier but no other signals present',
    },
    {
      signal: 'Mid-market budget range selected',
      strength: 'Weak',
      evidence: 'Budget range $10k-$25k selected',
      interpretation: 'Budget tier indicated but no requirements to validate against',
    },
  ],
  objections: [
    {
      name: 'Company Identity Unknown',
      severity: 'High',
      evidence: 'Company name field empty',
      whyItMatters: 'Cannot verify company legitimacy, scale, or enrich with external data',
      recommendedNextStep: 'Request company name and website for verification',
    },
    {
      name: 'No Contact Phone Number',
      severity: 'Medium',
      evidence: 'Phone number field empty',
      whyItMatters: 'Cannot verify contact or enrich via phone lookup',
      recommendedNextStep: 'Request phone number for contact verification',
    },
    {
      name: 'No Company Website',
      severity: 'Medium',
      evidence: 'Company website field empty',
      whyItMatters: 'Cannot verify company legitimacy, scale, or enrich',
      recommendedNextStep: 'Request company website URL',
    },
    {
      name: 'Minimal Project Description',
      severity: 'High',
      evidence: 'Only 7 words provided: "We need lead automation."',
      whyItMatters: 'Cannot diagnose business problem, extract buying signals, or assess fit',
      recommendedNextStep: 'Request detailed project description with current volume, systems, and pain points',
    },
    {
      name: 'No Current Systems Disclosed',
      severity: 'Medium',
      evidence: 'No CRM, communication tools, or tech stack mentioned',
      whyItMatters: 'Cannot assess integration requirements or solution fit',
      recommendedNextStep: 'Request current tech stack in discovery',
    },
  ],
  qualification: {
    overallScore: 45,
    stage: 'Review Required',
    priority: 'Medium',
    dimensions: [
      { name: 'Problem Severity', score: 5, maxScore: 20, evidence: [], missing: ['No business problem described'] },
      { name: 'Commercial Intent', score: 12, maxScore: 20, evidence: ['Mid-market budget selected', '1-3 month timeline'], missing: ['No requirements to validate against'] },
      { name: 'Authority', score: 15, maxScore: 20, evidence: ['Self-reported Final Decision Maker'], missing: ['Unverified - no company to verify against'] },
      { name: 'Solution Fit', score: 8, maxScore: 20, evidence: ['SaaS industry aligns with target'], missing: ['No requirements', 'No systems', 'No volume data'] },
      { name: 'Urgency', score: 5, maxScore: 20, evidence: ['1-3 month timeline selected'], missing: ['No active pain signals', 'Generic description'] },
    ],
  },
  confidence: {
    score: 35,
    supportingFactors: [
      'Valid email format',
      'Industry aligns with target market (SaaS)',
      'Decision authority claimed',
      'Budget range in target tier',
    ],
    uncertaintyFactors: [
      'Company name missing',
      'Phone number missing',
      'Website missing',
      'Project description minimal (7 words)',
      'No current systems disclosed',
      'No volume metrics provided',
      'Decision authority unverified',
    ],
  },
  missingInformation: [
    { field: 'Company Name', reason: 'Not provided', impact: 'Cannot identify or enrich company' },
    { field: 'Phone Number', reason: 'Not provided', impact: 'Cannot verify contact or enrich' },
    { field: 'Company Website', reason: 'Not provided', impact: 'Cannot verify company legitimacy or enrich' },
    { field: 'Project Description', reason: 'Only 7 words provided', impact: 'Cannot diagnose business problem or extract buying signals' },
    { field: 'Current Systems', reason: 'Not disclosed', impact: 'Cannot assess integration requirements or solution fit' },
    { field: 'Volume Metrics', reason: 'Not provided', impact: 'Cannot size opportunity or assess problem severity' },
  ],
  recommendedQuestions: [
    { question: 'What is your company name and website?', reason: 'Enables company verification and enrichment', priority: 'Critical' },
    { question: 'What is your current monthly lead volume and channels?', reason: 'Establishes operational scale and automation surface area', priority: 'Critical' },
    { question: 'Which CRM and communication tools does your team currently use?', reason: 'Determines integration requirements and technical feasibility', priority: 'Critical' },
    { question: 'What specific pain points are driving the automation evaluation?', reason: 'Identifies business problem and urgency', priority: 'High' },
    { question: 'Can you provide a phone number for contact verification?', reason: 'Enables contact verification and enrichment', priority: 'Medium' },
  ],
  dealStrategy: {
    action: 'Request missing information before qualification',
    priority: 'Within 2 business days',
    ownerType: 'SDR / Junior Sales',
    objective: [
      'Obtain company name and verification',
      'Collect detailed project requirements',
      'Identify current tech stack',
      'Assess volume and pain points',
    ],
    avoidForNow: [
      'Do not send proposal',
      'Do not schedule demo',
      'Do not engage solutions engineer',
      'Do not create CRM opportunity',
    ],
    reasoning: 'Critical information gaps prevent meaningful qualification. Automated external follow-up paused pending information collection.',
  },
  crmPreview: {
    company: 'Unknown - Not Provided',
    contact: 'Alex Rivera',
    stage: 'Review Required',
    priority: 'Medium',
    opportunityScore: 45,
    confidence: 35,
    primaryRequirement: 'Lead automation - specifics not provided',
    primaryPain: 'Not disclosed',
    currentSystems: ['Unknown'],
    knownRisks: ['Company identity unknown', 'Requirements unknown', 'Systems unknown', 'Volume unknown'],
    missingQualification: ['Company verification', 'Requirements detail', 'Systems detail', 'Volume metrics'],
    nextStep: 'Information collection required before qualification',
  },
  followupDraft: {
    subject: '[Information Needed] LeadPilot AI - Submission Follow-up',
    body: `Hi Alex,

Thank you for your interest in LeadPilot AI for lead automation.

To provide you with a meaningful qualification and relevant next steps, we need a bit more information:

1. **Company name and website** - so we can verify and understand your business
2. **Current lead volume and channels** - monthly volume across phone, web, email, etc.
3. **Current tech stack** - CRM, communication tools, calendar/scheduling systems
4. **Specific pain points** - what's driving the automation evaluation?

Once we have these details, we can provide a tailored assessment of how LeadPilot could help your specific situation.

Best regards,
LeadPilot AI Team`,
    personalizationEvidence: [
      'References submitted name (Alex)',
      'Acknowledges interest in lead automation',
      'Requests specific missing information',
      'Does not invent company details or requirements',
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
  scenario: 'missing_data',
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


