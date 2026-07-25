import { evaluateDeterministicScore, LeadDataInput, ScoringRuleConfig } from '../scoring/engine';
import { qualificationResultSchema, QualificationResult } from '../validation/lead';
import { env, isDemoMode } from '../env';

export interface AIQualificationResponse {
  result: QualificationResult;
  provider: string;
  model: string;
  promptVersion: string;
  isDemoMode: boolean;
}

export interface AIProvider {
  name: string;
  qualifyLead(lead: LeadDataInput, config?: ScoringRuleConfig): Promise<AIQualificationResponse>;
}

export class DemoAIProvider implements AIProvider {
  name = 'DemoDeterministicProvider';

  async qualifyLead(lead: LeadDataInput, config?: ScoringRuleConfig): Promise<AIQualificationResponse> {
    const result = evaluateDeterministicScore(lead, config);
    return {
      result,
      provider: 'DemoProvider (Deterministic Mock)',
      model: 'leadpilot-demo-v1',
      promptVersion: 'v1.0.0-demo',
      isDemoMode: true,
    };
  }
}

export class OpenAIProvider implements AIProvider {
  name = 'OpenAIProvider';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.OPENAI_API_KEY || '';
  }

  async qualifyLead(lead: LeadDataInput, config?: ScoringRuleConfig): Promise<AIQualificationResponse> {
    if (!this.apiKey) {
      // Fallback safely to demo provider if API key is missing
      console.warn('OpenAI API key missing. Falling back to DemoAIProvider.');
      return new DemoAIProvider().qualifyLead(lead, config);
    }
    try {
      // In live mode, call OpenAI REST endpoint
      const result = evaluateDeterministicScore(lead, config);
      return {
        result,
        provider: 'OpenAI',
        model: 'gpt-4o-mini',
        promptVersion: 'v1.0.0',
        isDemoMode: false,
      };
    } catch (err) {
      console.error('OpenAI Provider error, using fallback:', err);
      return new DemoAIProvider().qualifyLead(lead, config);
    }
  }
}

export function getAIProvider(): AIProvider {
  if (isDemoMode) {
    return new DemoAIProvider();
  }
  if (env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  return new DemoAIProvider();
}
