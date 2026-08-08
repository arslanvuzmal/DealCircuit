'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Sparkles, Loader2, X, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { SCENARIOS, getAllScenarios, ScenarioKey } from '@/lib/scenarios';
import ValidationPanel from '@/components/intelligence/ValidationPanel';
import CompanyIntelligencePanel from '@/components/intelligence/CompanyIntelligencePanel';
import ContactIntelligencePanel from '@/components/intelligence/ContactIntelligencePanel';
import BusinessProblemPanel from '@/components/intelligence/BusinessProblemPanel';
import BuyingSignalsPanel from '@/components/intelligence/BuyingSignalsPanel';
import ObjectionsPanel from '@/components/intelligence/ObjectionsPanel';
import QualificationScoreCard from '@/components/intelligence/QualificationScoreCard';
import ConfidenceModelPanel from '@/components/intelligence/ConfidenceModelPanel';
import MissingInformationPanel from '@/components/intelligence/MissingInformationPanel';
import NextBestQuestionsPanel from '@/components/intelligence/NextBestQuestionsPanel';
import DealStrategyPanel from '@/components/intelligence/DealStrategyPanel';
import HumanReviewPanel from '@/components/intelligence/HumanReviewPanel';
import WorkflowSimulationPanel from '@/components/intelligence/WorkflowSimulationPanel';
import CRMPreviewPanel from '@/components/intelligence/CRMPreviewPanel';
import FollowupPanel from '@/components/intelligence/FollowupPanel';
import AuditTimelinePanel from '@/components/intelligence/AuditTimelinePanel';
import BusinessImpactPanel from '@/components/intelligence/BusinessImpactPanel';
import WhatIfComparisonPanel from '@/components/intelligence/WhatIfComparisonPanel';

interface LeadIntelligenceResult {
  runId: string;
  traceId: string;
  mode: string;
  lead: any;
  validation: any;
  duplicateCheck: any;
  companyIntelligence: any;
  contactIntelligence: any;
  businessDiagnosis: any;
  buyingSignals: any[];
  objections: any[];
  qualification: any;
  confidence: any;
  missingInformation: any[];
  recommendedQuestions: any[];
  dealStrategy: any;
  crmPreview: any;
  followupDraft: any;
  auditEvents: any[];
  businessImpact: any;
  scenario: string;
  simulation: {
    externalActionsExecuted: boolean;
    message: string;
  };
  security?: {
    promptInjectionDetected: boolean;
    sanitizedFields: string[];
    suspiciousPhrases: string[];
  };
}

export default function IntelligenceLabPage() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof SCENARIOS>('complex_b2b');
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<LeadIntelligenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customLeadData, setCustomLeadData] = useState({
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    companyName: '',
    companyWebsite: '',
    industry: 'Software / SaaS',
    companySize: '51-200',
    serviceRequired: 'Custom AI Lead Scoring & CRM Automation',
    budgetRange: '$25k-$50k',
    desiredTimeline: '1-3 Months',
    decisionAuthority: 'Final Decision Maker',
    projectDescription: '',
    leadSource: 'Website Form',
    consent: true,
    websiteHoneypot: '',
  });

  const scenarios = getAllScenarios();

  const handleAnalyze = async () => {
    setLoading(true);
    setCurrentStep(1);
    setResult(null);
    setError(null);

    const leadData = showCustomForm ? customLeadData : SCENARIOS[selectedScenario].leadData;

    const steps = [
      'Validating & normalizing input...',
      'Checking for duplicates...',
      'Running intelligence analysis...',
      'Diagnosing business problems...',
      'Extracting buying signals...',
      'Analyzing risks & objections...',
      'Calculating qualification scores...',
      'Building deal strategy...',
      'Generating follow-up...',
      'Preparing CRM preview...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(r => setTimeout(r, 200 + Math.random() * 200));
    }

    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          scenario: showCustomForm ? 'custom' : selectedScenario,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.intelligence);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (updates: { stage: string; score: number; reason: string }) => {
    await new Promise(r => setTimeout(r, 500));
    if (result) {
      setResult(prev => prev ? {
        ...prev,
        qualification: {
          ...prev.qualification,
          stage: updates.stage,
          overallScore: updates.score,
        },
        auditEvents: [
          ...prev.auditEvents,
          {
            id: `evt_${Date.now()}`,
            runId: prev.runId,
            traceId: prev.traceId,
            timestamp: new Date().toISOString(),
            event: 'Human approval',
            status: 'completed',
            executionType: 'demo',
          }
        ]
      } : null);
    }
  };

  const handleReject = async (reason: string) => {
    await new Promise(r => setTimeout(r, 300));
    if (result) {
      setResult(prev => prev ? {
        ...prev,
        qualification: {
          ...prev.qualification,
          stage: 'Disqualified',
        },
        auditEvents: [
          ...prev.auditEvents,
          {
            id: `evt_${Date.now()}`,
            runId: prev.runId,
            traceId: prev.traceId,
            timestamp: new Date().toISOString(),
            event: 'Lead rejected by reviewer',
            status: 'completed',
            executionType: 'demo',
          }
        ]
      } : null);
    }
  };

  const handleReprocess = async () => {
    setLoading(true);
    await handleAnalyze();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                LP
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LeadPilot AI</h1>
                <p className="text-xs text-gray-500">Lead Intelligence Lab</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 transition"
              >
                Admin Console
              </Link>
              <Link
                href="/submit"
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition flex items-center gap-2 shadow"
              >
                <Zap className="w-3.5 h-3.5" /> Public Form
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result && !error && (
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Demo
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
                Lead Intelligence Lab
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Turn a raw enquiry into a qualified, explainable and action-ready sales opportunity.
                Select a scenario or enter your own lead to see LeadPilot&apos;s intelligence pipeline in action.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Simulation Mode - no external CRM or email actions will be performed
              </div>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 text-left">Choose a Scenario</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.key}
                    onClick={() => {
                      setSelectedScenario(scenario.key);
                      setShowCustomForm(false);
                    }}
                    className={`relative p-5 rounded-xl border-2 transition-all ${
                      selectedScenario === scenario.key
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{scenario.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{scenario.label}</h4>
                        <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
                      </div>
                    </div>
                    {selectedScenario === scenario.key && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✏️</span>
                </span>
                <span className="font-medium">Enter Your Own Lead</span>
              </button>
            </div>
          </div>
        )}

        {showCustomForm && !result && !error && (
          <div className="max-w-2xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Custom Lead Entry</h2>
              <button
                onClick={() => setShowCustomForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customLeadData.fullName}
                    onChange={(e) => setCustomLeadData({...customLeadData, fullName: e.target.value})}
                    className="w-full input"
                    placeholder="Sarah Mitchell"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={customLeadData.workEmail}
                    onChange={(e) => setCustomLeadData({...customLeadData, workEmail: e.target.value})}
                    className="w-full input"
                    placeholder="sarah@vertexcare.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customLeadData.phoneNumber}
                    onChange={(e) => setCustomLeadData({...customLeadData, phoneNumber: e.target.value})}
                    className="w-full input"
                    placeholder="+1 555-0147"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={customLeadData.companyName}
                    onChange={(e) => setCustomLeadData({...customLeadData, companyName: e.target.value})}
                    className="w-full input"
                    placeholder="VertexCare Clinics"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company Website</label>
                  <input
                    type="text"
                    value={customLeadData.companyWebsite}
                    onChange={(e) => setCustomLeadData({...customLeadData, companyWebsite: e.target.value})}
                    className="w-full input"
                    placeholder="vertexcare.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Industry *</label>
                  <select
                    value={customLeadData.industry}
                    onChange={(e) => setCustomLeadData({...customLeadData, industry: e.target.value})}
                    className="w-full input"
                  >
                    <option>Software / SaaS</option>
                    <option>FinTech / Financial Services</option>
                    <option>Healthcare / BioTech</option>
                    <option>E-commerce / Retail</option>
                    <option>Real Estate & PropTech</option>
                    <option>Agency / Consulting</option>
                    <option>Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company Size *</label>
                  <select
                    value={customLeadData.companySize}
                    onChange={(e) => setCustomLeadData({...customLeadData, companySize: e.target.value})}
                    className="w-full input"
                  >
                    <option>1-10 Employees</option>
                    <option>11-50 Employees</option>
                    <option>51-200 Employees</option>
                    <option>201-500 Employees</option>
                    <option>500+ Employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Budget Range *</label>
                  <select
                    value={customLeadData.budgetRange}
                    onChange={(e) => setCustomLeadData({...customLeadData, budgetRange: e.target.value})}
                    className="w-full input"
                  >
                    <option>$50k-$100k+ (Enterprise)</option>
                    <option>$25k-$50k (Growth)</option>
                    <option>$10k-$25k (Mid-market)</option>
                    <option>Under $10k (Starter)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Desired Timeline *</label>
                  <select
                    value={customLeadData.desiredTimeline}
                    onChange={(e) => setCustomLeadData({...customLeadData, desiredTimeline: e.target.value})}
                    className="w-full input"
                  >
                    <option>{"<1 Month (Immediate)"}</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                    <option>Exploratory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Decision Authority *</label>
                  <select
                    value={customLeadData.decisionAuthority}
                    onChange={(e) => setCustomLeadData({...customLeadData, decisionAuthority: e.target.value})}
                    className="w-full input"
                  >
                    <option>Final Decision Maker (C-Level / Founder / Owner)</option>
                    <option>Evaluator & Recommender (VP / Director / Manager)</option>
                    <option>Team Lead / Individual Contributor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Project Description & Goals *</label>
                <textarea
                  rows={4}
                  required
                  value={customLeadData.projectDescription}
                  onChange={(e) => setCustomLeadData({...customLeadData, projectDescription: e.target.value})}
                  className="w-full input"
                  placeholder="Describe your current lead volume, CRM stack, automation requirements, and specific business goals..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={customLeadData.consent}
                  onChange={(e) => setCustomLeadData({...customLeadData, consent: e.target.checked})}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <label htmlFor="consent" className="text-xs text-gray-500">
                  I consent to LeadPilot AI processing my project requirements and generating automated follow-up communications.
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Lead...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Analyze Lead with LeadPilot AI
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Analysis Failed</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Intelligence Report</h2>
                <p className="text-gray-500 mt-1">
                  {result.scenario === 'complex_b2b' && 'Complex B2B Lead - VertexCare Clinics'}
                  {result.scenario === 'ambiguous' && 'Ambiguous Lead - CloudScale Solutions'}
                  {result.scenario === 'duplicate' && 'Duplicate Lead - VertexCare Clinics (Duplicate)'}
                  {result.scenario === 'poor_fit' && "Poor-Fit Lead - Thompson&apos;s Local Bakery"}
                  {result.scenario === 'enterprise' && 'Enterprise Lead - Global Financial Services'}
                  {result.scenario === 'prompt_injection' && 'Security Alert - Prompt Injection Attempt'}
                  {result.scenario === 'missing_data' && 'Missing Data - Incomplete Lead'}
                  {result.scenario === 'crm_failure' && 'CRM Failure Simulation'}
                  {result.scenario === 'custom' && `Custom Lead - ${result.lead.companyName || result.lead.fullName}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DEMO_MODE = true
                </span>
                {result.simulation?.externalActionsExecuted === false && (
                  <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-mono">
                    Simulation Mode
                  </span>
                )}
                {result.security?.promptInjectionDetected && (
                  <span className="px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Security Alert
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Intelligence Pipeline</h3>
                <span className="text-sm text-gray-500">Step {currentStep} of 10</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  'Input',
                  'Validate',
                  'Dedupe',
                  'Qualify',
                  'Diagnose',
                  'Signals',
                  'Risks',
                  'Score',
                  'Strategy',
                  'Complete'
                ].map((stage, index) => (
                  <div key={index} className={`flex flex-col items-center gap-1 px-2 ${
                    index + 1 < currentStep ? 'text-green-600' :
                    index + 1 === currentStep ? 'text-blue-600 font-medium' :
                    'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index + 1 < currentStep ? 'bg-green-100 text-green-600' :
                      index + 1 === currentStep ? 'bg-blue-100 text-blue-600 animate-pulse' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-[10px] text-center whitespace-nowrap">{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <ValidationPanel data={result.validation} isLoading={loading} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompanyIntelligencePanel data={result.companyIntelligence} />
                <ContactIntelligencePanel data={result.contactIntelligence} />
              </div>

              <BusinessProblemPanel data={result.businessDiagnosis} />

              <BuyingSignalsPanel data={result.buyingSignals} />

              <ObjectionsPanel data={result.objections} />

              <QualificationScoreCard data={result.qualification} />

              <ConfidenceModelPanel data={result.confidence} />

              <MissingInformationPanel data={result.missingInformation} />

              <NextBestQuestionsPanel data={result.recommendedQuestions} />

              <DealStrategyPanel data={result.dealStrategy} />

              <HumanReviewPanel
                leadId={result.lead.id || 'demo'}
                aiStage={result.qualification.stage}
                aiScore={result.qualification.overallScore}
                onApprove={handleApprove}
                onReject={handleReject}
                onReprocess={handleReprocess}
              />

              <WorkflowSimulationPanel
                isRunning={loading}
                onRun={async () => {}}
                simulationMode={result.simulation?.externalActionsExecuted === false}
              />

              <CRMPreviewPanel data={result.crmPreview} />

              <FollowupPanel data={result.followupDraft} />

              <AuditTimelinePanel data={result.auditEvents} />

              <BusinessImpactPanel data={result.businessImpact} />

              <WhatIfComparisonPanel
                traditionalSteps={[
                  'Lead form submission',
                  'Salesperson reads email',
                  'Researches company on LinkedIn',
                  'Checks CRM for duplicates',
                  'Manually scores lead (subjective)',
                  'Creates opportunity in CRM',
                  'Writes personalized email from scratch',
                  'Sets follow-up task in calendar',
                  'Logs activity in CRM',
                  'Notifies manager via Slack/email',
                ]}
                leadPilotSteps={[
                  'Lead auto-captured via form/webhook',
                  'Validation & normalization (instant)',
                  'Duplicate check across CRM (instant)',
                  'AI qualification with evidence (seconds)',
                  'Business problem diagnosis (seconds)',
                  'Buying signals extracted (seconds)',
                  'Risk analysis with evidence (seconds)',
                  'Human review (45 sec)',
                  'CRM sync + follow-up + audit (instant)',
                ]}
              />
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => { setResult(null); setCurrentStep(1); }}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" /> Analyze Another Lead
              </button>
              <Link href="/dashboard" className="btn-primary">
                View in Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
          LeadPilot AI * AI Lead Operations & n8n Automation * Demo Mode Enabled
        </div>
      </footer>
    </div>
  );
}