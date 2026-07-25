import { QualificationResult } from '../validation/lead';

export interface LeadDataInput {
  fullName: string;
  workEmail: string;
  phoneNumber?: string;
  companyName: string;
  companyWebsite?: string;
  industry: string;
  companySize: string;
  serviceRequired: string;
  budgetRange: string;
  desiredTimeline: string;
  decisionAuthority: string;
  projectDescription: string;
}

export interface ScoringRuleConfig {
  budgetFitMax: number;
  serviceFitMax: number;
  urgencyMax: number;
  authorityMax: number;
  infoQualityMax: number;
  hotThreshold: number;
  warmThreshold: number;
}

export const DEFAULT_SCORING_CONFIG: ScoringRuleConfig = {
  budgetFitMax: 25,
  serviceFitMax: 25,
  urgencyMax: 20,
  authorityMax: 15,
  infoQualityMax: 15,
  hotThreshold: 80,
  warmThreshold: 60,
};

export function evaluateDeterministicScore(
  lead: LeadDataInput,
  config: ScoringRuleConfig = DEFAULT_SCORING_CONFIG
): QualificationResult {
  const missingInformation: string[] = [];
  const risks: string[] = [];

  // 1. Budget Fit (Max 25)
  let budgetFitScore = 10;
  let budgetReason = 'Moderate budget alignment.';
  const budget = lead.budgetRange.toLowerCase();
  if (budget.includes('100k') || budget.includes('50k+') || budget.includes('$50k') || budget.includes('$100k')) {
    budgetFitScore = config.budgetFitMax;
    budgetReason = 'Enterprise budget level ($50k+). Excellent fit.';
  } else if (budget.includes('25k') || budget.includes('10k') || budget.includes('$25k')) {
    budgetFitScore = 18;
    budgetReason = 'Mid-tier budget range ($10k-$50k). Strong fit.';
  } else if (budget.includes('5k') || budget.includes('<5k') || budget.includes('under')) {
    budgetFitScore = 5;
    budgetReason = 'Low budget range. May require standardized solution.';
    risks.push('Low budget for custom delivery scope.');
  }

  // 2. Service Fit (Max 25)
  let serviceFitScore = 15;
  let serviceReason = 'General service query.';
  const service = lead.serviceRequired.toLowerCase();
  const desc = lead.projectDescription.toLowerCase();
  if (service.includes('ai') || service.includes('automation') || desc.includes('workflow') || desc.includes('crm')) {
    serviceFitScore = config.serviceFitMax;
    serviceReason = 'Direct alignment with core AI & Workflow Automation offerings.';
  } else if (service.includes('consulting') || service.includes('custom')) {
    serviceFitScore = 20;
    serviceReason = 'High alignment with custom development capabilities.';
  }

  // 3. Urgency & Timeline (Max 20)
  let urgencyScore = 10;
  let urgencyReason = 'Standard timeline requirement.';
  const timeline = lead.desiredTimeline.toLowerCase();
  if (timeline.includes('immediate') || timeline.includes('asap') || timeline.includes('<1 month') || timeline.includes('1 month')) {
    urgencyScore = config.urgencyMax;
    urgencyReason = 'High urgency (Immediate / <1 Month). High buying velocity.';
  } else if (timeline.includes('1-3 months') || timeline.includes('quarter')) {
    urgencyScore = 15;
    urgencyReason = 'Active roadmap requirement (1-3 months).';
  } else if (timeline.includes('exploratory') || timeline.includes('6+ months')) {
    urgencyScore = 5;
    urgencyReason = 'Long-term exploratory phase.';
  }

  // 4. Decision Authority (Max 15)
  let authorityScore = 8;
  let authorityReason = 'Stakeholder involvement noted.';
  const authority = lead.decisionAuthority.toLowerCase();
  if (authority.includes('final') || authority.includes('ceo') || authority.includes('cto') || authority.includes('owner') || authority.includes('decision maker')) {
    authorityScore = config.authorityMax;
    authorityReason = 'Contact is primary decision maker / C-level executive.';
  } else if (authority.includes('recommender') || authority.includes('evaluator') || authority.includes('manager')) {
    authorityScore = 10;
    authorityReason = 'Contact is influencer / lead evaluator.';
  } else {
    missingInformation.push('Decision authority details unclear');
  }

  // 5. Information Quality (Max 15)
  let infoQualityScore = 10;
  let infoReason = 'Sufficient project details provided.';
  if (lead.projectDescription.length > 80 && lead.companyWebsite) {
    infoQualityScore = config.infoQualityMax;
    infoReason = 'Comprehensive submission with verified website and detailed description.';
  } else if (lead.projectDescription.length < 30) {
    infoQualityScore = 5;
    infoReason = 'Brief project description.';
    missingInformation.push('Detailed project specification');
  }

  if (!lead.companyWebsite) {
    missingInformation.push('Company website URL');
  }

  // Application-side score recalculation & clamps
  const clampedBudget = Math.min(budgetFitScore, config.budgetFitMax);
  const clampedService = Math.min(serviceFitScore, config.serviceFitMax);
  const clampedUrgency = Math.min(urgencyScore, config.urgencyMax);
  const clampedAuthority = Math.min(authorityScore, config.authorityMax);
  const clampedInfo = Math.min(infoQualityScore, config.infoQualityMax);

  const totalScore = clampedBudget + clampedService + clampedUrgency + clampedAuthority + clampedInfo;

  let category: 'HOT' | 'WARM' | 'COLD' | 'REVIEW_REQUIRED' = 'COLD';
  if (missingInformation.length >= 2 || lead.projectDescription.length < 15) {
    category = 'REVIEW_REQUIRED';
  } else if (totalScore >= config.hotThreshold) {
    category = 'HOT';
  } else if (totalScore >= config.warmThreshold) {
    category = 'WARM';
  } else {
    category = 'COLD';
  }

  return {
    scoreBreakdown: {
      budgetFit: { score: clampedBudget, maxScore: config.budgetFitMax, reason: budgetReason },
      serviceFit: { score: clampedService, maxScore: config.serviceFitMax, reason: serviceReason },
      urgency: { score: clampedUrgency, maxScore: config.urgencyMax, reason: urgencyReason },
      decisionAuthority: { score: clampedAuthority, maxScore: config.authorityMax, reason: authorityReason },
      informationQuality: { score: clampedInfo, maxScore: config.infoQualityMax, reason: infoReason },
    },
    totalScore,
    category,
    confidence: 0.95,
    summary: `Lead scored ${totalScore}/100 based on ${category} category criteria. Budget fit (${clampedBudget}/${config.budgetFitMax}), Service fit (${clampedService}/${config.serviceFitMax}).`,
    risks,
    missingInformation,
    recommendedAction:
      category === 'HOT'
        ? 'Schedule immediate discovery call within 2 hours.'
        : category === 'WARM'
        ? 'Send qualification survey and schedule call within 24 hours.'
        : category === 'COLD'
        ? 'Add to automated nurture campaign.'
        : 'Route to human reviewer to verify submission details.',
    recommendedFollowUpDelay:
      category === 'HOT' ? '2 Hours' : category === 'WARM' ? '24 Hours' : '3 Days',
  };
}
