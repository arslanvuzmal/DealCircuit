import { z } from 'zod';

export const businessProblemSchema = z.object({
  name: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  evidence: z.array(z.string()),
  consequence: z.string(),
});

export const rootCauseSchema = z.object({
  summary: z.string(),
  workflow: z.array(z.string()),
  operationalConsequences: z.array(z.string()),
});

export const buyingSignalSchema = z.object({
  signal: z.string(),
  strength: z.enum(['Strong', 'Medium', 'Weak']),
  evidence: z.string(),
  interpretation: z.string(),
});

export const riskSignalSchema = z.object({
  name: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Unknown']),
  evidence: z.string(),
  whyItMatters: z.string(),
  recommendedNextStep: z.string(),
});

export const qualificationDimensionSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(20),
  maxScore: z.number().min(1).max(20),
  evidence: z.array(z.string()),
  missing: z.array(z.string()).optional(),
});

export const confidenceSchema = z.object({
  score: z.number().min(0).max(100),
  supportingFactors: z.array(z.string()),
  uncertaintyFactors: z.array(z.string()),
});

export const missingInformationSchema = z.object({
  field: z.string(),
  reason: z.string(),
  impact: z.string(),
});

export const discoveryQuestionSchema = z.object({
  question: z.string(),
  reason: z.string(),
  priority: z.enum(['Critical', 'High', 'Medium']),
});

export const dealStrategySchema = z.object({
  action: z.string(),
  priority: z.string(),
  ownerType: z.string(),
  objective: z.array(z.string()),
  avoidForNow: z.array(z.string()),
  reasoning: z.string(),
});

export const crmPreviewSchema = z.object({
  company: z.string(),
  contact: z.string(),
  stage: z.string(),
  priority: z.string(),
  opportunityScore: z.number(),
  confidence: z.number(),
  primaryRequirement: z.string(),
  primaryPain: z.string(),
  currentSystems: z.array(z.string()),
  knownRisks: z.array(z.string()),
  missingQualification: z.array(z.string()),
  nextStep: z.string(),
});

export const followupDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
  personalizationEvidence: z.array(z.string()),
});

export const auditEventSchema = z.object({
  timestamp: z.string(),
  event: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
  traceId: z.string().optional(),
  actionId: z.string().optional(),
  executionType: z.string().optional(),
  retryCount: z.number().optional(),
});

export const businessImpactSchema = z.object({
  traditionalManualMinutes: z.number(),
  leadPilotAutomatedSeconds: z.number(),
  humanReviewMinutes: z.number(),
  illustrativeStaffTimeSaved: z.string(),
  disclaimer: z.string(),
});

export const scenarioTypeSchema = z.enum([
  'complex_b2b',
  'ambiguous',
  'duplicate',
  'poor_fit',
  'enterprise',
  'prompt_injection',
  'missing_data',
  'crm_failure',
]);

export const leadIntelligenceResultSchema = z.object({
  lead: z.object({
    fullName: z.string(),
    workEmail: z.string(),
    phoneNumber: z.string().optional(),
    companyName: z.string(),
    companyWebsite: z.string().optional(),
    industry: z.string(),
    companySize: z.string(),
    serviceRequired: z.string(),
    budgetRange: z.string(),
    desiredTimeline: z.string(),
    decisionAuthority: z.string(),
    projectDescription: z.string(),
    leadSource: z.string(),
  }),
  validation: z.object({
    email: z.string(),
    company: z.string(),
    duplicateCheck: z.string(),
    requiredFields: z.string(),
    missing: z.string().optional(),
  }),
  duplicateCheck: z.object({
    isDuplicate: z.boolean(),
    matchType: z.string().optional(),
    existingLead: z.object({
      name: z.string(),
      company: z.string(),
      lastInteraction: z.string(),
    }).optional(),
  }),
  companyIntelligence: z.object({
    industry: z.string(),
    companySize: z.string(),
    locations: z.number().optional(),
    operationalComplexity: z.string(),
    existingSystems: z.array(z.string()),
    leadSource: z.string(),
    enriched: z.boolean(),
  }),
  contactIntelligence: z.object({
    role: z.string(),
    seniority: z.string(),
    influenceLevel: z.string(),
    department: z.string(),
    decisionMakingCertainty: z.string(),
    inferred: z.array(z.string()).optional(),
  }),
  businessDiagnosis: z.object({
    primaryProblem: businessProblemSchema,
    secondaryProblems: z.array(businessProblemSchema),
    rootCauseSummary: z.string(),
    workflow: z.array(z.string()),
    operationalConsequences: z.array(z.string()),
  }),
  buyingSignals: z.array(buyingSignalSchema),
  objections: z.array(riskSignalSchema),
  qualification: z.object({
    overallScore: z.number().min(0).max(100),
    stage: z.enum(['Sales Qualified', 'Marketing Qualified', 'Review Required', 'Disqualified']),
    priority: z.enum(['High', 'Medium', 'Low']),
    dimensions: z.array(qualificationDimensionSchema),
  }),
  confidence: confidenceSchema,
  missingInformation: z.array(missingInformationSchema),
  recommendedQuestions: z.array(discoveryQuestionSchema),
  dealStrategy: dealStrategySchema,
  crmPreview: crmPreviewSchema,
  followupDraft: followupDraftSchema,
  auditEvents: z.array(auditEventSchema),
  businessImpact: businessImpactSchema,
  scenario: scenarioTypeSchema,
  simulationMode: z.boolean(),
});

export type LeadIntelligenceResult = z.infer<typeof leadIntelligenceResultSchema>;
export type ScenarioType = z.infer<typeof scenarioTypeSchema>;
export type BusinessProblem = z.infer<typeof businessProblemSchema>;
export type RootCause = z.infer<typeof rootCauseSchema>;
export type BuyingSignal = z.infer<typeof buyingSignalSchema>;
export type RiskSignal = z.infer<typeof riskSignalSchema>;
export type QualificationDimension = z.infer<typeof qualificationDimensionSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;
export type MissingInformation = z.infer<typeof missingInformationSchema>;
export type DiscoveryQuestion = z.infer<typeof discoveryQuestionSchema>;
export type DealStrategy = z.infer<typeof dealStrategySchema>;
export type CRMPreview = z.infer<typeof crmPreviewSchema>;
export type FollowupDraft = z.infer<typeof followupDraftSchema>;
export type AuditEvent = z.infer<typeof auditEventSchema>;
export type BusinessImpact = z.infer<typeof businessImpactSchema>;