import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const enterpriseFixture: LeadIntelligenceResult = {
  runId: 'run_enterprise',
  traceId: 'trace_enterprise',
  mode: 'DEMO',
  lead: {
    fullName: 'Patricia Chen',
    workEmail: 'p.chen@globalfinserv.com',
    phoneNumber: '+1 555-0234',
    companyName: 'Global Financial Services Inc.',
    companyWebsite: 'https://globalfinserv.com',
    industry: 'FinTech / Financial Services',
    companySize: '500+',
    serviceRequired: 'Custom AI Lead Scoring & CRM Automation',
    budgetRange: '$50k-$100k+ (Enterprise)',
    desiredTimeline: '1-3 Months',
    decisionAuthority: 'Evaluator & Recommender (VP / Director / Manager)',
    projectDescription: 'We process 50,000+ leads monthly across 12 countries. Need enterprise-grade automation with SOC2 compliance, SSO integration, and audit trails. Multiple stakeholders: Security, Legal, IT, Sales Ops. Pilot program starting with EMEA region.',
    leadSource: 'Referral',
  },
  validation: {
    email: 'Valid',
    company: 'Global Financial Services Inc.',
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
    industry: 'FinTech / Financial Services',
    companySize: '500+',
    locations: 12,
    operationalComplexity: 'Very High - global, regulated, multi-stakeholder',
    existingSystems: ['Salesforce', 'Okta SSO', 'Internal CRM', 'Data Warehouse'],
    leadSource: 'Referral',
    enriched: true,
  },
  contactIntelligence: {
    role: 'VP, Sales Operations',
    seniority: 'VP / Director',
    influenceLevel: 'High',
    department: 'Sales Operations',
    decisionMakingCertainty: 'Medium - Evaluator & Recommender (VP / Director / Manager)',
    inferred: ['VP Sales Ops has significant influence', 'Requires Security/Legal/IT approval'],
  },
  businessDiagnosis: {
    primaryProblem: {
      name: 'Global lead routing and compliance at scale',
      severity: 'Critical',
      evidence: [
        '50,000+ leads monthly across 12 countries',
        'Manual routing cannot maintain SLA across time zones',
        'Regulatory compliance (GDPR, financial regulations) required',
      ],
      consequence: 'Revenue leakage from delayed responses; compliance risk from inconsistent handling; stakeholder misalignment slows deals',
    },
    secondaryProblems: [
      {
        name: 'Multi-stakeholder approval complexity',
        severity: 'High',
        evidence: ['Security, Legal, IT, Sales Ops all required for approval'],
        consequence: 'Extended sales cycles; requirements drift during evaluation',
      },
      {
        name: 'Audit trail and compliance gaps',
        severity: 'High',
        evidence: ['SOC2 compliance required', 'Audit trails mandatory for financial services'],
        consequence: 'Cannot demonstrate regulatory compliance without automated logging',
      },
      {
        name: 'Integration complexity with existing stack',
        severity: 'Medium',
        evidence: ['Salesforce + Okta + Internal CRM + Data Warehouse'],
        consequence: 'Custom integration required for each system; data synchronization challenges',
      },
    ],
    rootCauseSummary: 'The core problem is not lead volume - it\'s the operational complexity of routing 50k+ leads across 12 countries while satisfying Security, Legal, IT, and Sales Ops requirements simultaneously. Manual processes cannot maintain compliance, auditability, and speed at this scale.',
    workflow: [
      'Lead Capture (Global Web Forms, Events, Referrals)',
      'Regional Compliance Check (GDPR, Local Regulations)',
      'Security Review (Data Residency, Encryption)',
      'Legal Review (Contractual Terms, Data Processing)',
      'IT Integration Assessment (SSO, API, Data Flow)',
      'Sales Ops Routing (Territory, Product, Tier)',
      'Manual CRM Entry (Salesforce)',
      'Audit Log Entry',
    ],
    operationalConsequences: [
      'SLA breaches during off-hours in global regions',
      'Inconsistent data handling across jurisdictions',
      'Extended procurement cycles (6-12 months typical)',
      'Shadow IT risk as teams bypass slow processes',
      'Audit failures due to incomplete logging',
    ],
  },
  buyingSignals: [
    {
      signal: 'We process 50,000+ leads monthly across 12 countries',
      strength: 'Strong',
      evidence: 'Explicit global volume disclosure indicates massive operational scale',
      interpretation: 'Enterprise-scale problem requiring enterprise-grade solution',
    },
    {
      signal: 'Need enterprise-grade automation with SOC2 compliance, SSO integration, and audit trails',
      strength: 'Strong',
      evidence: 'Specific technical and compliance requirements named',
      interpretation: 'Prospect has done technical evaluation and knows requirements',
    },
    {
      signal: 'Multiple stakeholders: Security, Legal, IT, Sales Ops',
      strength: 'Strong',
      evidence: 'Explicit stakeholder mapping indicates advanced buying process',
      interpretation: 'Organization is in vendor evaluation phase with defined decision framework',
    },
    {
      signal: 'Pilot program starting with EMEA region',
      strength: 'Strong',
      evidence: 'Defined pilot scope shows implementation thinking',
      interpretation: 'Prospect is planning deployment, not just researching',
    },
    {
      signal: 'Referral source',
      strength: 'Medium',
      evidence: 'Referred by existing contact/partner',
      interpretation: 'Warm introduction increases trust and close probability',
    },
  ],
  objections: [
    {
      name: 'SOC2 Compliance Requirements',
      severity: 'Critical',
      evidence: 'Explicitly requires SOC2 compliance',
      whyItMatters: 'SOC2 Type II certification required for financial services vendor management',
      recommendedNextStep: 'Provide SOC2 attestation and architecture documentation early',
    },
    {
      name: 'Multi-Region Data Residency',
      severity: 'High',
      evidence: '12 countries with varying data residency laws',
      whyItMatters: 'GDPR, UK GDPR, and local financial regulations require regional data handling',
      recommendedNextStep: 'Map data residency requirements per region in discovery',
    },
    {
      name: 'Complex Stakeholder Alignment',
      severity: 'High',
      evidence: 'Security, Legal, IT, Sales Ops all required for approval',
      whyItMatters: 'Any single stakeholder can block; alignment process is lengthy',
      recommendedNextStep: 'Map all stakeholders and their specific requirements in discovery',
    },
    {
      name: 'SSO/Integration Complexity',
      severity: 'Medium',
      evidence: 'Okta SSO + Salesforce + Internal CRM + Data Warehouse',
      whyItMatters: 'Multi-system integration increases implementation risk and timeline',
      recommendedNextStep: 'Technical deep-dive with Solutions Architect to map integration points',
    },
    {
      name: 'Budget Range Known But Exact Figure Unknown',
      severity: 'Unknown',
      evidence: 'Enterprise budget tier selected but exact allocation not disclosed',
      whyItMatters: 'Cannot confirm commercial terms without exact budget',
      recommendedNextStep: 'Discuss budget allocation in executive alignment call',
    },
  ],
  qualification: {
    overallScore: 91,
    stage: 'Sales Qualified',
    priority: 'High',
    dimensions: [
      { name: 'Problem Severity', score: 20, maxScore: 20, evidence: ['50k+ leads/month', '12 countries', 'Critical compliance requirements', 'Multi-stakeholder bottleneck'], missing: [] },
      { name: 'Commercial Intent', score: 20, maxScore: 20, evidence: ['Defined pilot scope (EMEA)', 'Specific compliance requirements', 'Referral source', 'Active stakeholder mapping'], missing: [] },
      { name: 'Authority', score: 15, maxScore: 20, evidence: ['VP Sales Operations title', 'Evaluator & Recommender role'], missing: ['Final budget authority with CFO/CISO'] },
      { name: 'Solution Fit', score: 19, maxScore: 20, evidence: ['Global routing automation', 'Compliance automation', 'Audit trail generation', 'SSO integration'], missing: ['Exact SOC2 scope validation'] },
      { name: 'Urgency', score: 17, maxScore: 20, evidence: ['Active pilot planning', 'Compliance deadlines', 'Revenue impact from delays'], missing: ['Exact implementation deadline'] },
    ],
  },
  confidence: {
    score: 88,
    supportingFactors: [
      'Explicit global volume with specificity (50k+/month, 12 countries)',
      'Detailed technical requirements (SOC2, SSO, audit trails)',
      'Clear stakeholder map (Security, Legal, IT, Sales Ops)',
      'Defined pilot scope (EMEA first)',
      'Referral source adds credibility',
    ],
    uncertaintyFactors: [
      'Complex multi-stakeholder decision process',
      'Compliance requirements (SOC2) need legal review',
      'Multi-region rollout (12 countries) adds complexity',
      'Budget range known but exact figure unknown',
    ],
  },
  missingInformation: [
    { field: 'Exact Budget', reason: 'Budget range known but exact allocation undisclosed', impact: 'Cannot finalize commercial terms' },
    { field: 'Final Authority', reason: 'VP Sales Ops is evaluator; CFO/CISO/CIO final approval needed', impact: 'Decision-making chain incomplete' },
    { field: 'SOC2 Scope', reason: 'SOC2 requirement stated but Type I vs Type II and trust criteria not specified', impact: 'Cannot confirm compliance deliverables' },
    { field: 'Data Residency Map', reason: '12 countries with varying regulations; specific requirements per region unknown', impact: 'Cannot design compliant architecture' },
  ],
  recommendedQuestions: [
    { question: 'What is the exact SOC2 scope required (Type I vs Type II, trust criteria)?', reason: 'Determines compliance deliverables and timeline', priority: 'Critical' },
    { question: 'Which stakeholders hold final veto authority?', reason: 'Identifies all decision makers and their specific requirements', priority: 'Critical' },
    { question: 'What are the data residency requirements per region?', reason: 'Maps architectural constraints for global deployment', priority: 'Critical' },
    { question: 'What is the allocated budget for the EMEA pilot phase?', reason: 'Confirms commercial viability for initial engagement', priority: 'High' },
    { question: 'What are the success criteria for the EMEA pilot?', reason: 'Defines measurable outcomes for pilot validation', priority: 'High' },
  ],
  dealStrategy: {
    action: 'Schedule executive alignment call + technical deep-dive',
    priority: 'Within 2 business hours',
    ownerType: 'Enterprise AE + Solutions Architect',
    objective: [
      'Map all stakeholders (Security, Legal, IT, Sales Ops)',
      'Define SOC2 compliance scope and timeline',
      'Design multi-region pilot (EMEA first)',
      'Align on SSO/integration requirements',
    ],
    avoidForNow: [
      'Do not send standard SMB proposal',
      'Do not skip legal/security review',
      'Do not assume single-threaded deal',
    ],
    reasoning: 'High-value enterprise opportunity with complex stakeholder landscape. Requires coordinated multi-threaded approach with executive sponsorship.',
  },
  crmPreview: {
    company: 'Global Financial Services Inc.',
    contact: 'Patricia Chen',
    stage: 'Sales Qualified',
    priority: 'High',
    opportunityScore: 91,
    confidence: 88,
    primaryRequirement: 'Global lead automation with SOC2 compliance and audit trails',
    primaryPain: '50k+ leads/month across 12 countries - manual routing fails compliance and SLA',
    currentSystems: ['Salesforce', 'Okta SSO', 'Internal CRM', 'Data Warehouse'],
    knownRisks: ['SOC2 compliance', 'Multi-region data residency', 'Stakeholder alignment', 'Integration complexity', 'Budget exact figure unknown'],
    missingQualification: ['Exact budget', 'Final authority (CFO/CISO)', 'SOC2 scope', 'Data residency map'],
    nextStep: 'Executive alignment call + technical deep-dive',
  },
  followupDraft: {
    subject: 'Enterprise Lead Automation for Global Financial Services - EMEA Pilot',
    body: `Hi Patricia,

Thank you for the detailed submission. The scale you describe - 50,000+ leads monthly across 12 countries with SOC2, SSO, and audit trail requirements - aligns directly with our enterprise delivery model.

A few thoughts on the EMEA pilot approach:

* We'd start by mapping the Security/Legal/IT/Sales Ops stakeholder requirements in a joint workshop
* SOC2 Type II architecture documentation can be shared under NDA prior to contract
* Okta SSO + Salesforce integration is a well-trodden path for us; we can share reference architecture
* Regional data residency (GDPR, UK GDPR, local financial regs) would be designed into the pilot from day one

We'd propose a 60-minute executive alignment call with your Security and IT leads, followed by a technical deep-dive with our Solutions Architect to map the EMEA pilot scope.

Available times this week: [calendar link]

Best regards,
Enterprise Team
LeadPilot AI`,
    personalizationEvidence: [
      'References specific volume (50k+/month, 12 countries)',
      'Addresses SOC2, SSO, audit trail requirements',
      'Acknowledges stakeholder map (Security, Legal, IT, Sales Ops)',
      'Proposes EMEA pilot scope',
      'Does not invent budget or timeline',
      'CTA matches enterprise sales motion (executive alignment)',
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
  scenario: 'enterprise',
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


