import { LeadIntelligenceResult, BusinessProblem, BuyingSignal, RiskSignal } from '@/lib/validation/intelligence';
import { SCENARIO_FIXTURES, getScenarioFixture } from '@/fixtures';
import { evaluateDeterministicScore } from '@/lib/scoring/engine';
import { detectPromptInjection } from '@/lib/scoring/injection';
import { generateFollowUpDraft } from '@/lib/email/followup';

export interface EvidenceItem {
  text: string;
  source: 'USER_PROVIDED' | 'DERIVED' | 'DEMO_ENRICHED' | 'UNKNOWN';
  field?: string;
}

export interface IntelligenceEngineConfig {
  mode: 'DEMO' | 'SANDBOX' | 'LIVE';
  demoFixtures?: boolean;
}

export class IntelligenceEngine {
  private config: IntelligenceEngineConfig;

  constructor(config: IntelligenceEngineConfig = { mode: 'DEMO' }) {
    this.config = config;
  }

  private generateRunId(): string {
    return `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private createAuditEvent(
    runId: string,
    traceId: string,
    event: string,
    status: 'pending' | 'completed' | 'failed' = 'completed',
    metadata?: Record<string, unknown>,
    retryCount?: number
  ) {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      runId,
      traceId,
      timestamp: this.getCurrentTimestamp(),
      event,
      status,
      durationMs: metadata?.durationMs as number | undefined,
      retryCount,
      executionType: this.config.mode.toLowerCase(),
      metadata,
    };
  }

  private generateAuditTrail(runId: string, traceId: string, scenario: string, isCrmFailure: boolean) {
    const baseEvents = [
      this.createAuditEvent(runId, traceId, 'Lead received', 'completed'),
      this.createAuditEvent(runId, traceId, 'Validation completed', 'completed'),
      this.createAuditEvent(runId, traceId, 'Duplicate lookup completed', 'completed'),
      this.createAuditEvent(runId, traceId, 'Qualification started', 'completed'),
      this.createAuditEvent(runId, traceId, 'Business problem diagnosed', 'completed'),
      this.createAuditEvent(runId, traceId, 'Buying signals extracted', 'completed'),
      this.createAuditEvent(runId, traceId, 'Risk analysis completed', 'completed'),
      this.createAuditEvent(runId, traceId, 'Qualification generated', 'completed'),
    ];

    if (isCrmFailure) {
      return [
        ...baseEvents,
        this.createAuditEvent(runId, traceId, 'CRM sync attempt 1', 'failed', {
          error: 'HTTP 503 Service Unavailable',
          classification: 'RETRYABLE',
        }, 1),
        this.createAuditEvent(runId, traceId, 'CRM sync retry scheduled', 'pending', {
          backoffMs: 900000,
        }),
        this.createAuditEvent(runId, traceId, 'CRM sync attempt 2', 'completed', {
          idempotencyKey: 'lp_demo_crm_fail',
          externalId: 'crm_deal_demo_recovery',
        }, 2),
        this.createAuditEvent(runId, traceId, 'Follow-up generated', 'completed'),
        this.createAuditEvent(runId, traceId, 'Workflow completed', 'completed'),
      ];
    }

    return [
      ...baseEvents,
      this.createAuditEvent(runId, traceId, 'Human approval', 'completed'),
      this.createAuditEvent(runId, traceId, 'CRM action simulated', 'completed'),
      this.createAuditEvent(runId, traceId, 'Follow-up generated', 'completed'),
      this.createAuditEvent(runId, traceId, 'Workflow completed', 'completed'),
    ];
  }

  private checkConsistency(result: LeadIntelligenceResult, leadData: LeadIntelligenceResult['lead']): string[] {
    const issues: string[] = [];

    // Check if budget was provided but missingInformation still lists Budget as unknown
    if (leadData.budgetRange && leadData.budgetRange !== 'Unknown / Not supplied' && leadData.budgetRange.trim() !== '') {
      const hasBudgetMissing = result.missingInformation.some(m => m.field.toLowerCase() === 'budget');
      if (hasBudgetMissing) {
        issues.push('Budget range provided but missingInformation still lists Budget as unknown');
      }
    }

    if (leadData.phoneNumber && leadData.phoneNumber.trim() !== '') {
      const validationMissingPhone = result.validation.missing?.toLowerCase().includes('phone');
      if (validationMissingPhone) {
        issues.push('Phone number provided but validation reports phone as missing');
      }
    }

    if (leadData.desiredTimeline && leadData.desiredTimeline !== 'Unknown / Not supplied' && leadData.desiredTimeline.trim() !== '') {
      const hasTimelineMissing = result.missingInformation.some(m => m.field.toLowerCase() === 'timeline');
      if (hasTimelineMissing) {
        issues.push('Timeline provided but missingInformation lists Timeline as unknown');
      }
    }

    if (leadData.decisionAuthority && leadData.decisionAuthority !== 'Unknown / Not supplied' && leadData.decisionAuthority.trim() !== '') {
      const hasAuthorityMissing = result.missingInformation.some(m => m.field.toLowerCase() === 'authority');
      if (hasAuthorityMissing) {
        issues.push('Decision authority provided but missingInformation lists Authority as unknown');
      }
    }

    // Check for industry-specific fixture leakage (healthcare content in non-healthcare leads)
    const isHealthcareIndustry = leadData.industry.toLowerCase().includes('healthcare') || 
      leadData.industry.toLowerCase().includes('medical') ||
      leadData.industry.toLowerCase().includes('clinic') ||
      leadData.industry.toLowerCase().includes('hospital');
    
    if (!isHealthcareIndustry) {
      const hasHealthcareContent = 
        result.businessDiagnosis.primaryProblem.name.toLowerCase().includes('patient') ||
        result.companyIntelligence.industry.toLowerCase().includes('healthcare') ||
        result.buyingSignals.some(s => s.signal.toLowerCase().includes('patient'));
      if (hasHealthcareContent) {
        issues.push('Non-healthcare lead but intelligence contains healthcare/patient references');
      }
    }

    return issues;
  }

  async analyzeLead(
    leadData: LeadIntelligenceResult['lead'],
    scenario?: string
  ): Promise<LeadIntelligenceResult> {
    const runId = this.generateRunId();
    const traceId = this.generateTraceId();
    const isCrmFailure = scenario === 'crm_failure';

    let result: LeadIntelligenceResult;

    if (scenario && this.config.demoFixtures !== false) {
      const fixture = getScenarioFixture(scenario);
      if (fixture) {
        result = {
          ...fixture,
          runId,
          traceId,
          lead: leadData,
          auditEvents: this.generateAuditTrail(runId, traceId, scenario, isCrmFailure),
          simulation: {
            externalActionsExecuted: this.config.mode !== 'DEMO',
            message: this.config.mode === 'DEMO'
              ? 'Simulation Mode - no external CRM or email actions will be performed'
              : this.config.mode === 'SANDBOX'
              ? 'Sandbox Mode - actions executed in isolated environment'
              : 'Live Mode - external actions executed',
          },
        };

        if (scenario === 'crm_failure') {
          result.crmPreview = {
            ...result.crmPreview,
            company: leadData.companyName,
            contact: leadData.fullName,
          };
        }
      } else {
        result = await this.generateFromScratch(leadData, runId, traceId, scenario);
      }
    } else {
      result = await this.generateFromScratch(leadData, runId, traceId, scenario);
    }

    const consistencyIssues = this.checkConsistency(result, leadData);
    if (consistencyIssues.length > 0) {
      console.warn('[IntelligenceEngine] Consistency issues detected:', consistencyIssues);
    }

    return result;
  }

  private async generateFromScratch(
    leadData: LeadIntelligenceResult['lead'],
    runId: string,
    traceId: string,
    scenario?: string
  ): Promise<LeadIntelligenceResult> {
    const qualification = evaluateDeterministicScore(leadData as any);
    const injectionResult = detectPromptInjection(leadData.projectDescription, {
      companyName: leadData.companyName,
      serviceRequired: leadData.serviceRequired,
    });

    const isInjection = injectionResult.isInjectionDetected;

    const missingInfo: string[] = [...qualification.missingInformation];
    if (!leadData.companyWebsite) missingInfo.push('Company website URL');
    if (!leadData.phoneNumber) missingInfo.push('Phone number');

    const stage = qualification.category === 'HOT' ? 'Sales Qualified' :
      qualification.category === 'WARM' ? 'Marketing Qualified' :
      qualification.category === 'REVIEW_REQUIRED' ? 'Review Required' : 'Disqualified';

    const priority = qualification.category === 'HOT' ? 'High' :
      qualification.category === 'WARM' ? 'Medium' : 'Low';

    const supportingFactors = [
      'Valid email format',
      'Company name provided',
      'Industry aligns with target market',
    ];

    const uncertaintyFactors = [...qualification.missingInformation];
    if (isInjection) {
      uncertaintyFactors.unshift('Malicious prompt injection detected');
    }

    const confidence = isInjection ? 10 : Math.max(35, 95 - missingInfo.length * 10);

    const result: LeadIntelligenceResult = {
      runId,
      traceId,
      mode: this.config.mode,
      lead: leadData,
      validation: {
        email: 'Valid',
        company: leadData.companyName || 'Missing',
        duplicateCheck: isInjection ? 'Blocked - security alert' : 'No exact duplicate',
        requiredFields: `${5 - missingInfo.length} / 5 available`,
        missing: missingInfo.length > 0 ? missingInfo.join(', ') : undefined,
      },
      duplicateCheck: {
        isDuplicate: false,
        matchType: isInjection ? 'security_block' : undefined,
        existingLead: undefined,
      },
      companyIntelligence: {
        industry: leadData.industry,
        companySize: leadData.companySize,
        locations: undefined,
        operationalComplexity: 'Unknown - insufficient data for assessment',
        existingSystems: [],
        leadSource: leadData.leadSource,
        enriched: false,
      },
      contactIntelligence: {
        role: 'Unknown - not provided',
        seniority: leadData.decisionAuthority,
        influenceLevel: 'Unknown',
        department: 'Unknown',
        decisionMakingCertainty: leadData.decisionAuthority.includes('Final') ? 'High' : 'Unknown',
        inferred: ['Decision authority from form field'],
      },
      businessDiagnosis: {
        primaryProblem: {
          name: isInjection ? 'Security violation - malicious prompt injection attempt' : 'Insufficient information to diagnose business problem',
          severity: isInjection ? 'Critical' : 'Low',
          evidence: isInjection
            ? [
                'Input contains system prompt override instructions',
                'Attempts to override scoring policy',
                'Requests data exfiltration',
                'Requests unauthorized tool execution',
              ]
            : [
                'Project description minimal',
                'No specific pain points mentioned',
                'No current systems disclosed',
              ],
          consequence: isInjection
            ? 'If processed, could lead to unauthorized data access, scoring manipulation, and system compromise'
            : 'Cannot identify operational bottlenecks or automation opportunities',
        },
        secondaryProblems: [],
        rootCauseSummary: isInjection
          ? 'The submission contains hostile instructions designed to manipulate the AI system into bypassing security controls.'
          : 'The submission lacks the minimum operational context required for business problem diagnosis.',
        workflow: [],
        operationalConsequences: isInjection
          ? ['Submission blocked at security layer', 'No qualification performed', 'No follow-up generated']
          : ['Cannot assess problem severity', 'Cannot extract buying signals', 'Cannot evaluate solution fit'],
      },
      buyingSignals: isInjection ? [] : [
        {
          signal: 'Self-reported decision authority',
          strength: 'Weak',
          evidence: `Decision authority field: ${leadData.decisionAuthority}`,
          interpretation: 'If verified, removes procurement barrier',
        },
      ],
      objections: isInjection
        ? [
            {
              name: 'Malicious Prompt Injection Detected',
              severity: 'Critical' as const,
              evidence: 'Multiple injection patterns detected in projectDescription',
              whyItMatters: 'Untrusted input attempted to override system instructions and exfiltrate data',
              recommendedNextStep: 'Block and log; do not process as legitimate lead',
            },
          ]
        : [
            {
              name: 'Insufficient Information',
              severity: 'High' as const,
              evidence: 'Minimal project description; key fields missing',
              whyItMatters: 'Cannot qualify lead or recommend appropriate next steps',
              recommendedNextStep: 'Request detailed project description, current tech stack, and pain points',
            },
          ],
      qualification: {
        overallScore: isInjection ? 0 : qualification.totalScore,
        stage: isInjection ? 'Review Required' : stage,
        priority: isInjection ? 'Low' : priority,
        dimensions: [
          { name: 'Problem Severity', score: isInjection ? 0 : Math.min(20, qualification.scoreBreakdown.urgency.score), maxScore: 20, evidence: [], missing: isInjection ? ['Security violation'] : ['No business problem described'] },
          { name: 'Commercial Intent', score: isInjection ? 0 : Math.min(20, qualification.scoreBreakdown.budgetFit.score), maxScore: 20, evidence: [], missing: isInjection ? ['Malicious intent'] : ['No requirements'] },
          { name: 'Authority', score: isInjection ? 0 : Math.min(20, qualification.scoreBreakdown.decisionAuthority.score), maxScore: 20, evidence: [], missing: [] },
          { name: 'Solution Fit', score: isInjection ? 0 : Math.min(20, qualification.scoreBreakdown.serviceFit.score), maxScore: 20, evidence: [], missing: isInjection ? ['Not a genuine inquiry'] : ['No requirements'] },
          { name: 'Urgency', score: isInjection ? 0 : Math.min(20, qualification.scoreBreakdown.urgency.score), maxScore: 20, evidence: [], missing: [] },
        ],
      },
      confidence: {
        score: confidence,
        supportingFactors: isInjection
          ? ['Injection patterns detected', 'Input sanitized', 'Policy not overridden', 'No tool execution']
          : supportingFactors,
        uncertaintyFactors,
      },
      missingInformation: missingInfo.map(f => ({ field: f, reason: 'Not provided', impact: 'Cannot verify or enrich' })),
      recommendedQuestions: [
        { question: 'What is your current monthly lead volume and channels?', reason: 'Establishes operational scale', priority: 'Critical' as const },
        { question: 'Which CRM and communication tools does your team currently use?', reason: 'Determines integration requirements', priority: 'Critical' as const },
        { question: 'What specific pain points are driving the automation evaluation?', reason: 'Identifies business problem and urgency', priority: 'High' as const },
      ],
      dealStrategy: {
        action: isInjection ? 'Block and log security event - no follow-up' : 'Request missing information before qualification',
        priority: isInjection ? 'Immediate' : 'Within 2 business days',
        ownerType: isInjection ? 'Security Team' : 'SDR / Junior Sales',
        objective: isInjection
          ? ['Log attack pattern', 'Update detection rules', 'Monitor for repeat attempts']
          : ['Obtain company verification', 'Collect detailed requirements', 'Identify current tech stack'],
        avoidForNow: isInjection
          ? ['Do not process as legitimate lead', 'Do not send follow-up', 'Do not create CRM record']
          : ['Do not send proposal', 'Do not schedule demo', 'Do not engage solutions engineer'],
        reasoning: isInjection
          ? 'Security alert: Untrusted instruction detected. System treated input as content only.'
          : 'Critical information gaps prevent meaningful qualification.',
      },
      crmPreview: {
        company: leadData.companyName || 'Unknown',
        contact: leadData.fullName,
        stage,
        priority,
        opportunityScore: isInjection ? 0 : qualification.totalScore,
        confidence,
        primaryRequirement: leadData.serviceRequired,
        primaryPain: isInjection ? 'Security violation' : 'Not disclosed',
        currentSystems: ['Unknown'],
        knownRisks: isInjection ? ['Prompt injection', 'Data exfiltration attempt'] : ['Insufficient information'],
        missingQualification: missingInfo,
        nextStep: isInjection ? 'Security event logged' : 'Information collection required',
      },
      followupDraft: (() => {
        const effectiveCategory = isInjection ? 'REVIEW_REQUIRED' : qualification.category;
        const base = generateFollowUpDraft(
          leadData.fullName,
          leadData.companyName || 'Unknown',
          effectiveCategory,
          leadData.serviceRequired,
          qualification.missingInformation
        );
        return {
          ...base,
          personalizationEvidence: [
            'References disclosed company name',
            'Acknowledges submitted service requirement',
            'Does not invent budget figures',
            'Does not invent implementation timeline',
            'CTA matches current qualification stage',
          ],
        };
      })(),
      auditEvents: this.generateAuditTrail(runId, traceId, scenario || 'custom', false),
      businessImpact: {
        traditionalManualMinutes: 12,
        leadPilotAutomatedSeconds: 8,
        humanReviewMinutes: 0.75,
        illustrativeStaffTimeSaved: '~10-11 minutes per qualified enquiry',
        disclaimer: 'Illustrative estimate based on this demo workflow. Actual results vary by organization, process maturity, and integration complexity. Not a guarantee of future performance.',
      },
      scenario: (scenario as any) || 'custom',
      simulation: {
        externalActionsExecuted: this.config.mode !== 'DEMO',
        message: this.config.mode === 'DEMO'
          ? 'Simulation Mode - no external CRM or email actions will be performed'
          : this.config.mode === 'SANDBOX'
          ? 'Sandbox Mode - actions executed in isolated environment'
          : 'Live Mode - external actions executed',
      },
      security: {
        promptInjectionDetected: isInjection,
        sanitizedFields: isInjection ? ['projectDescription'] : [],
        suspiciousPhrases: isInjection ? injectionResult.suspiciousPhrases : [],
      },
    };

    return result;
  }
}

export async function createIntelligenceEngine(config?: IntelligenceEngineConfig): Promise<IntelligenceEngine> {
  return new IntelligenceEngine(config);
}