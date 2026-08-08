export { complexB2bFixture } from './complex-b2b';
export { ambiguousFixture } from './ambiguous';
export { duplicateFixture } from './duplicate';
export { poorFitFixture } from './poor-fit';
export { enterpriseFixture } from './enterprise';
export { promptInjectionFixture } from './prompt-injection';
export { missingDataFixture } from './missing-data';
export { crmFailureFixture } from './crm-failure';

import { complexB2bFixture } from './complex-b2b';
import { ambiguousFixture } from './ambiguous';
import { duplicateFixture } from './duplicate';
import { poorFitFixture } from './poor-fit';
import { enterpriseFixture } from './enterprise';
import { promptInjectionFixture } from './prompt-injection';
import { missingDataFixture } from './missing-data';
import { crmFailureFixture } from './crm-failure';

import { LeadIntelligenceResult } from '@/lib/validation/intelligence';

export const SCENARIO_FIXTURES: Record<string, LeadIntelligenceResult> = {
  complex_b2b: complexB2bFixture,
  ambiguous: ambiguousFixture,
  duplicate: duplicateFixture,
  poor_fit: poorFitFixture,
  enterprise: enterpriseFixture,
  prompt_injection: promptInjectionFixture,
  missing_data: missingDataFixture,
  crm_failure: crmFailureFixture,
};

export function getScenarioFixture(scenario: string): LeadIntelligenceResult | undefined {
  return SCENARIO_FIXTURES[scenario];
}

export function getAllScenarioKeys(): string[] {
  return Object.keys(SCENARIO_FIXTURES);
}


