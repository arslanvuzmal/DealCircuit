'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Sparkles, Loader2, X, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { SCENARIOS, getAllScenarios } from '@/lib/scenarios';
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
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Logo } from '@/components/Logo';

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
      setCurrentStep(10);
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
    <div className="min-h-screen animate-fade-in" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h1 className="text-heading-lg text-text-primary">LeadPilot AI</h1>
                <p className="text-caption text-text-muted">Lead Intelligence Lab</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost btn-sm">
                Admin Console
              </Link>
              <Link href="/submit" className="btn-primary btn-sm gap-2">
                <Zap className="w-3.5 h-3.5" /> Public Form
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result && !error && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge variant="info" size="sm" className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Demo
              </Badge>
              <h2 className="text-display text-text-primary tracking-tighter leading-tight">
                Lead Intelligence Lab
              </h2>
              <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
                Turn a raw enquiry into a qualified, explainable and action-ready sales opportunity.
                Select a scenario or enter your own lead to see LeadPilot&apos;s intelligence pipeline in action.
              </p>
              <Badge variant="info" size="sm" className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Simulation Mode - no external CRM or email actions will be performed
              </Badge>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h3 className="text-heading-md text-text-primary">Choose a Scenario</h3>
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
                        ? 'border-brand-cyan bg-brand-cyan-dim shadow-lg'
                        : 'border-border-subtle hover:border-brand-cyan hover:bg-surface-interactive'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{scenario.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary truncate">{scenario.label}</h4>
                        <p className="text-caption text-text-muted mt-1">{scenario.description}</p>
                      </div>
                    </div>
                    {selectedScenario === scenario.key && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-cyan rounded-full flex items-center justify-center text-brand-navy text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-3 border-2 border-dashed border-border-subtle rounded-xl text-text-muted hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan-dim transition flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-interactive)' }}>
                  <span className="text-xl">✏️</span>
                </span>
                <span className="font-medium">Enter Your Own Lead</span>
              </button>
            </div>
          </div>
        )}

        {showCustomForm && !result && !error && (
          <Card variant="hover" className="max-w-2xl mx-auto mt-8 space-y-6 animate-slide-up">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Custom Lead Entry</CardTitle>
              <button onClick={() => setShowCustomForm(false)} className="btn-ghost btn-sm">
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">Full Name *</label>
                    <Input
                      required
                      value={customLeadData.fullName}
                      onChange={(e) => setCustomLeadData({...customLeadData, fullName: e.target.value})}
                      placeholder="Sarah Mitchell"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Work Email *</label>
                    <Input
                      type="email"
                      required
                      value={customLeadData.workEmail}
                      onChange={(e) => setCustomLeadData({...customLeadData, workEmail: e.target.value})}
                      placeholder="sarah@vertexcare.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Phone Number</label>
                    <Input
                      value={customLeadData.phoneNumber}
                      onChange={(e) => setCustomLeadData({...customLeadData, phoneNumber: e.target.value})}
                      placeholder="+1 555-0147"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Company Name *</label>
                    <Input
                      required
                      value={customLeadData.companyName}
                      onChange={(e) => setCustomLeadData({...customLeadData, companyName: e.target.value})}
                      placeholder="VertexCare Clinics"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Company Website</label>
                    <Input
                      value={customLeadData.companyWebsite}
                      onChange={(e) => setCustomLeadData({...customLeadData, companyWebsite: e.target.value})}
                      placeholder="vertexcare.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Industry *</label>
                    <Select
                      value={customLeadData.industry}
                      onChange={(e) => setCustomLeadData({...customLeadData, industry: e.target.value})}
                      options={[
                        { value: 'Software / SaaS', label: 'Software / SaaS' },
                        { value: 'FinTech / Financial Services', label: 'FinTech / Financial Services' },
                        { value: 'Healthcare / BioTech', label: 'Healthcare / BioTech' },
                        { value: 'E-commerce / Retail', label: 'E-commerce / Retail' },
                        { value: 'Real Estate & PropTech', label: 'Real Estate & PropTech' },
                        { value: 'Agency / Consulting', label: 'Agency / Consulting' },
                        { value: 'Professional Services', label: 'Professional Services' },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Company Size *</label>
                    <Select
                      value={customLeadData.companySize}
                      onChange={(e) => setCustomLeadData({...customLeadData, companySize: e.target.value})}
                      options={[
                        { value: '1-10 Employees', label: '1-10 Employees' },
                        { value: '11-50 Employees', label: '11-50 Employees' },
                        { value: '51-200 Employees', label: '51-200 Employees' },
                        { value: '201-500 Employees', label: '201-500 Employees' },
                        { value: '500+ Employees', label: '500+ Employees' },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Budget Range *</label>
                    <Select
                      value={customLeadData.budgetRange}
                      onChange={(e) => setCustomLeadData({...customLeadData, budgetRange: e.target.value})}
                      options={[
                        { value: '$50k-$100k+ (Enterprise)', label: '$50k-$100k+ (Enterprise)' },
                        { value: '$25k-$50k (Growth)', label: '$25k-$50k (Growth)' },
                        { value: '$10k-$25k (Mid-market)', label: '$10k-$25k (Mid-market)' },
                        { value: 'Under $10k (Starter)', label: 'Under $10k (Starter)' },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Desired Timeline *</label>
                    <Select
                      value={customLeadData.desiredTimeline}
                      onChange={(e) => setCustomLeadData({...customLeadData, desiredTimeline: e.target.value})}
                      options={[
                        { value: '<1 Month (Immediate)', label: '<1 Month (Immediate)' },
                        { value: '1-3 Months', label: '1-3 Months' },
                        { value: '3-6 Months', label: '3-6 Months' },
                        { value: 'Exploratory', label: 'Exploratory' },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Decision Authority *</label>
                    <Select
                      value={customLeadData.decisionAuthority}
                      onChange={(e) => setCustomLeadData({...customLeadData, decisionAuthority: e.target.value})}
                      options={[
                        { value: 'Final Decision Maker (C-Level / Founder / Owner)', label: 'Final Decision Maker (C-Level / Founder / Owner)' },
                        { value: 'Evaluator & Recommender (VP / Director / Manager)', label: 'Evaluator & Recommender (VP / Director / Manager)' },
                        { value: 'Team Lead / Individual Contributor', label: 'Team Lead / Individual Contributor' },
                      ]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label">Project Description & Goals *</label>
                  <textarea
                    rows={4}
                    required
                    value={customLeadData.projectDescription}
                    onChange={(e) => setCustomLeadData({...customLeadData, projectDescription: e.target.value})}
                    className="w-full p-3 font-mono text-caption" style={{
                      backgroundColor: 'var(--color-surface-default)',
                      color: 'var(--color-text-primary)',
                      borderColor: 'var(--color-border-default)',
                      borderRadius: 'var(--radius-md)',
                      borderWidth: '1px',
                    }}
                    placeholder="Describe your current lead volume, CRM stack, automation requirements, and specific business goals..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={customLeadData.consent}
                    onChange={(e) => setCustomLeadData({...customLeadData, consent: e.target.checked})}
                    className="w-4 h-4 rounded" style={{ accentColor: 'var(--color-brand-cyan)' }}
                  />
                  <label htmlFor="consent" className="text-caption text-text-muted">
                    I consent to LeadPilot AI processing my project requirements and generating automated follow-up communications.
                  </label>
                </div>
                <Button type="submit" className="w-full gap-2" size="lg" disabled={loading} style={{ background: 'linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-purple))' }}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing Lead...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Analyze Lead with LeadPilot AI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card variant="hover" className="max-w-2xl mx-auto mt-8 animate-slide-up" style={{ borderColor: 'var(--color-border-error)', backgroundColor: 'var(--color-status-error-bg)' }}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3 text-status-error-text">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-text-primary">Analysis Failed</h3>
                  <p className="text-body-sm text-text-secondary">{error}</p>
                </div>
              </div>
              <Button onClick={() => setError(null)} variant="danger" className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-page-title text-text-primary">Intelligence Report</h2>
                <p className="text-body-sm text-text-muted mt-1">
                  {result.scenario === 'complex_b2b' && 'Complex B2B Lead - VertexCare Clinics'}
                  {result.scenario === 'ambiguous' && 'Ambiguous Lead - CloudScale Solutions'}
                  {result.scenario === 'duplicate' && 'Duplicate Lead - VertexCare Clinics (Duplicate)'}
                  {result.scenario === 'poor_fit' && "Poor-Fit Lead - Thompson's Local Bakery"}
                  {result.scenario === 'enterprise' && 'Enterprise Lead - Global Financial Services'}
                  {result.scenario === 'prompt_injection' && 'Security Alert - Prompt Injection Attempt'}
                  {result.scenario === 'missing_data' && 'Missing Data - Incomplete Lead'}
                  {result.scenario === 'crm_failure' && 'CRM Failure Simulation'}
                  {result.scenario === 'custom' && `Custom Lead - ${result.lead.companyName || result.lead.fullName}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DEMO_MODE = true
                </Badge>
                {result.simulation?.externalActionsExecuted === false && (
                  <Badge variant="info" size="sm">Simulation Mode</Badge>
                )}
                {result.security?.promptInjectionDetected && (
                  <Badge variant="error" size="sm" className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Security Alert
                  </Badge>
                )}
              </div>
            </div>

            <Card variant="compact" className="space-y-4">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text-primary">Intelligence Pipeline</h3>
                  <span className="text-caption text-text-muted">Step {currentStep} of 10</span>
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
                    <div key={index} className={`flex flex-col items-center gap-1 px-2 ${index + 1 < currentStep ? 'text-status-success' : index + 1 === currentStep ? 'text-brand-cyan font-medium' : 'text-text-muted'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold ${index + 1 < currentStep ? 'bg-status-success-bg text-status-success' : index + 1 === currentStep ? 'bg-brand-cyan-dim text-brand-cyan animate-pulse' : 'bg-surface-interactive text-text-muted'}`}>
                        {index + 1}
                      </div>
                      <span className="text-[10px] text-center whitespace-nowrap">{stage}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
              <Button variant="secondary" onClick={() => { setResult(null); setCurrentStep(1); }} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Analyze Another Lead
              </Button>
              <Link href="/dashboard">
                <Button variant="primary" className="gap-2">
                  View in Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {loading && !result && (
          <Card variant="compact" className="max-w-xl mx-auto mt-8 animate-fade-in">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Zap className="w-12 h-12 text-brand-cyan animate-pulse" />
              <h3 className="text-heading-md text-text-primary">Analyzing Lead...</h3>
              <p className="text-body-sm text-text-muted">Running intelligence pipeline</p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t mt-12" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-caption text-text-muted">
          LeadPilot AI · Lead Intelligence & Revenue Operations · Demo Mode Enabled
        </div>
      </footer>
    </div>
  );
}