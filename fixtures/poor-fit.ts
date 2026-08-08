import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const poorFitFixture: LeadIntelligenceResult = {
  runId: 'run_poor_fit',
  traceId: 'trace_poor_fit',
  mode: 'DEMO',
  lead: {
    fullName: 'Mike Thompson',
    workEmail: 'm.thompson@localbakery.com',
    phoneNumber: '+1 555-0199',
    companyName: "Thompson's Local Bakery",
    companyWebsite: 'https://thompsonsbakery.com',
    industry: 'Food & Beverage',
    companySize: '1-10',
    serviceRequired: 'Custom AI Lead Scoring & CRM Automation',
    budgetRange: 'Under $10k (Starter)',
    desiredTimeline: 'Exploratory',
    decisionAuthority: 'Final Decision Maker (C-Level / Founder / Owner)',
    projectDescription: 'We run a small local bakery and want to automate our customer orders. We get about 20 orders a week. Not sure if AI is right for us but wanted to explore.',
    leadSource: 'Website Form',
  },
  validation: {
    email: 'Valid',
    company: "Thompson's Local Bakery",
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
    industry: 'Food & Beverage',
    companySize: '1-10',
    locations: 1,
    operationalComplexity: 'Low - single location, simple order flow',
    existingSystems: ['POS System', 'Basic Website'],
    leadSource: 'Website Form',
    enriched: true,
  },
  contactIntelligence: {
    role: 'Owner / Founder',
    seniority: 'C-Level / Founder',
    influenceLevel: 'High',
    department: 'Operations',
    decisionMakingCertainty: 'High - Final Decision Maker (Owner)',
    inferred: ['Owner has full decision authority'],
  },
  businessDiagnosis: {
    primaryProblem: {
      name: 'Small business order-processing inefficiency',
      severity: 'Low',
      evidence: [
        '~20 orders per week (low volume)',
        'Manual order entry from website/phone',
        'Single location operation',
      ],
      consequence: 'Minor time savings possible but not at scale that justifies enterprise automation investment',
    },
    secondaryProblems: [
      {
        name: 'Limited automation surface area',
        severity: 'Low',
        evidence: ['Simple order flow', 'Low weekly volume'],
        consequence: 'ROI unlikely for custom AI solution at this scale',
      },
    ],
    rootCauseSummary: 'The business operates at a scale where manual processes are still efficient. The volume (20 orders/week) does not create the operational bottleneck that enterprise automation solves.',
    workflow: [
      'Customer places order (Website/Phone/Walk-in)',
      'Manual order entry in POS',
      'Kitchen prepares order',
      'Customer pickup/delivery',
    ],
    operationalConsequences: [
      'Manual entry errors possible but low frequency',
      'No after-hours leakage at this volume',
      'Staff capacity sufficient for current volume',
    ],
  },
  buyingSignals: [
    {
      signal: 'Interested in exploring automation for customer orders',
      strength: 'Weak',
      evidence: 'Explicit mention of wanting to explore AI automation',
      interpretation: 'Curiosity about automation but no active pain or budget',
    },
    {
      signal: 'Owner is final decision maker',
      strength: 'Medium',
      evidence: 'C-Level / Founder / Owner decision authority',
      interpretation: 'No procurement barrier, but no budget authority either',
    },
  ],
  objections: [
    {
      name: 'Budget Mismatch',
      severity: 'High',
      evidence: 'Starter budget (<$10k) vs enterprise solution ($25k+)',
      whyItMatters: 'LeadPilot\'s custom delivery model requires minimum engagement size that exceeds this budget',
      recommendedNextStep: 'Recommend self-serve resources or partner ecosystem for smaller businesses',
    },
    {
      name: 'Company Size Mismatch',
      severity: 'High',
      evidence: '1-10 employees vs target 50+',
      whyItMatters: 'Solution designed for multi-user, multi-channel operations at scale',
      recommendedNextStep: 'Direct to appropriate self-serve tier or partner solution',
    },
    {
      name: 'Industry Mismatch',
      severity: 'Medium',
      evidence: 'Food & Beverage vs SaaS/Tech/Healthcare focus',
      whyItMatters: 'Domain expertise and integrations optimized for target verticals',
      recommendedNextStep: 'Acknowledge limitation; suggest vertical-appropriate alternatives',
    },
    {
      name: 'Volume Mismatch',
      severity: 'High',
      evidence: '20 orders/week vs 1,800+ enquiries/month target profile',
      whyItMatters: 'Problem severity insufficient to justify enterprise automation investment',
      recommendedNextStep: 'Polite disqualification with resource referral',
    },
  ],
  qualification: {
    overallScore: 32,
    stage: 'Disqualified',
    priority: 'Low',
    dimensions: [
      { name: 'Problem Severity', score: 5, maxScore: 20, evidence: ['Low order volume (20/week)', 'Single location', 'No after-hours leakage'], missing: ['No significant operational bottleneck'] },
      { name: 'Commercial Intent', score: 8, maxScore: 20, evidence: ['Expressed curiosity about AI'], missing: ['No budget for enterprise tier', 'Exploratory timeline'] },
      { name: 'Authority', score: 15, maxScore: 20, evidence: ['Owner / Founder - full decision authority'], missing: [] },
      { name: 'Solution Fit', score: 2, maxScore: 20, evidence: [], missing: ['Volume too low', 'Industry mismatch', 'Budget mismatch', 'Single location'] },
      { name: 'Urgency', score: 2, maxScore: 20, evidence: [], missing: ['Exploratory timeline', 'No active pain'] },
    ],
  },
  confidence: {
    score: 78,
    supportingFactors: [
      'Clear budget mismatch (starter budget vs enterprise solution)',
      'Company size mismatch (1-10 vs target 50+)',
      'Industry mismatch (Food & Beverage vs SaaS/Tech focus)',
      'Low enquiry volume (20/week vs 1,800+/month target)',
      'Explicit statement of uncertainty about AI fit',
    ],
    uncertaintyFactors: [
      'Could be early-stage company that will scale',
      'Owner may have other ventures not disclosed',
    ],
  },
  missingInformation: [],
  recommendedQuestions: [
    { question: 'What is your projected order volume in 12-18 months?', reason: 'Assesses whether business is in growth trajectory that would justify future automation', priority: 'Medium' },
    { question: 'Are you currently using any CRM or order management system?', reason: 'Determines current tech stack and integration requirements', priority: 'Medium' },
  ],
  dealStrategy: {
    action: 'Send polite disqualification with self-serve resources',
    priority: 'Within 24 hours',
    ownerType: 'SDR / Marketing',
    objective: [
      'Maintain goodwill',
      'Direct to self-serve resources',
      'Keep door open for future',
    ],
    avoidForNow: [
      'Do not schedule discovery call',
      'Do not engage solutions engineer',
      'Do not send proposal',
    ],
    reasoning: 'Clear mismatch between prospect needs and LeadPilot target market. Polite disqualification preserves brand reputation while directing to appropriate resources.',
  },
  crmPreview: {
    company: "Thompson's Local Bakery",
    contact: 'Mike Thompson',
    stage: 'Disqualified',
    priority: 'Low',
    opportunityScore: 32,
    confidence: 78,
    primaryRequirement: 'Basic order automation for small bakery',
    primaryPain: 'Manual order entry (low volume)',
    currentSystems: ['POS System', 'Basic Website'],
    knownRisks: ['Budget mismatch', 'Company size mismatch', 'Industry mismatch', 'Volume mismatch'],
    missingQualification: [],
    nextStep: 'Disqualification email with self-serve resource links',
  },
  followupDraft: {
    subject: 'Thank you for your interest in LeadPilot AI',
    body: `Hi Mike,

Thank you for reaching out to LeadPilot AI about automating customer orders for Thompson's Local Bakery.

Based on the details you've shared - approximately 20 orders per week at a single location with a starter budget - our current enterprise custom delivery model isn't the right fit for your needs at this stage.

However, we'd love to point you toward resources that may be more suitable:
- Our self-serve automation templates: https://leadpilot.ai/resources
- Partner ecosystem for small business automation: https://leadpilot.ai/partners

If your volume grows significantly or you expand to multiple locations, we'd be happy to revisit the conversation.

Best regards,
LeadPilot AI Team`,
    personalizationEvidence: [
      'References specific order volume (20/week)',
      'Acknowledges single location',
      'Respects budget constraints',
      'Provides appropriate alternative resources',
      'Leaves door open for future engagement',
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
  scenario: 'poor_fit',
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


