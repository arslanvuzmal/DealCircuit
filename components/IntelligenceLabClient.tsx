'use client';
import Link from "next/link";

import React, { useState } from 'react';
import { Zap, Brain, Search, Filter, ChevronDown, MoreHorizontal, X, CheckCircle2, XCircle, Zap as ZapIcon, AlertTriangle, FileText, Download, Upload, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/Avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/DropdownMenu';
import { ProvenanceBadge, ScoreRow } from '@/components/lead-detail/LeadBadges';

const SCENARIOS = [
  { id: 'enterprise', label: 'Enterprise SaaS Lead', company: 'VertexCare Health', industry: 'Healthcare', description: 'We need to automate patient intake across 12 clinics. Currently using paper forms and manual data entry into Epic EHR. Budget: $200k-$500k. Timeline: 3-6 months. Decision maker: CTO.' },
  { id: 'agency', label: 'Marketing Agency Lead', company: 'GrowthStack Digital', industry: 'Marketing', description: 'Managing 50+ client campaigns. Need unified dashboard for lead attribution. Budget: $50k-$100k. Timeline: 1-2 months. Decision maker: VP Operations.' },
  { id: 'manufacturing', label: 'Manufacturing Lead', company: 'Apex Industrial', industry: 'Manufacturing', description: 'Need to automate quote-to-cash for custom machinery orders. ERP integration required. Budget: $100k-$200k. Timeline: 6+ months. Decision maker: COO.' },
  { id: 'custom', label: 'Custom Lead', company: '', industry: '', description: '' },
];

const SCENARIO_DATA: Record<string, { company: string; industry: string; description: string }> = {
  enterprise: { company: 'VertexCare Health', industry: 'Healthcare', description: 'We need to automate patient intake across 12 clinics. Currently using paper forms and manual data entry into Epic EHR. Budget: $200k-$500k. Timeline: 3-6 months. Decision maker: CTO.' },
  agency: { company: 'GrowthStack Digital', industry: 'Marketing', description: 'Managing 50+ client campaigns. Need unified dashboard for lead attribution. Budget: $50k-$100k. Timeline: 1-2 months. Decision maker: VP Operations.' },
  manufacturing: { company: 'Apex Industrial', industry: 'Manufacturing', description: 'Need to automate quote-to-cash for custom machinery orders. ERP integration required. Budget: $100k-$200k. Timeline: 6+ months. Decision maker: COO.' },
};

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <Badge variant="info" size="sm">PENDING</Badge>;
  return <Badge variant={category === 'HOT' ? 'success' : category === 'WARM' ? 'warning' : category === 'COLD' ? 'neutral' : 'error'} size="sm">{category}</Badge>;
}

interface IntelligenceLabClientProps {
  leads: any[];
}

export default function IntelligenceLabClient({ leads }: IntelligenceLabClientProps) {
  const [selectedScenario, setSelectedScenario] = useState('enterprise');
  const [customLead, setCustomLead] = useState({ fullName: '', workEmail: '', companyName: '', industry: '', companySize: '', serviceRequired: '', budgetRange: '', desiredTimeline: '', decisionAuthority: '', projectDescription: '' });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('scenario');

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    if (scenarioId !== 'custom') {
      const data = SCENARIO_DATA[scenarioId];
      setCustomLead({ fullName: '', workEmail: '', companyName: data.company, industry: data.industry, companySize: '', serviceRequired: '', budgetRange: '', desiredTimeline: '', decisionAuthority: '', projectDescription: data.description });
    } else {
      setCustomLead({ fullName: '', workEmail: '', companyName: '', industry: '', companySize: '', serviceRequired: '', budgetRange: '', desiredTimeline: '', decisionAuthority: '', projectDescription: '' });
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const leadData = selectedScenario === 'custom' ? customLead : { ...SCENARIO_DATA[selectedScenario], fullName: 'Demo Contact', workEmail: 'demo@example.com', companySize: '51-200', serviceRequired: 'AI Automation', budgetRange: '$100k-$200k', desiredTimeline: '1-3 months', decisionAuthority: 'CTO' };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadData, consent: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysisResult(data);
    } catch (err: any) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scenarioLead = selectedScenario === 'custom' ? customLead : { ...SCENARIO_DATA[selectedScenario], fullName: 'Demo Contact', workEmail: 'demo@example.com', companySize: '51-200', serviceRequired: 'AI Automation', budgetRange: '$100k-$200k', desiredTimeline: '1-3 months', decisionAuthority: 'CTO' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Brain className="w-6 h-6 text-brand-cyan" /> Intelligence Lab</h1>
          <p className="text-body-sm text-text-muted mt-1">Analyze leads with AI — test scenarios or submit custom leads for instant qualification</p>
        </div>
        <div className="flex items-center gap-2"><Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" /> Export Results</Button><Button variant="secondary" size="sm"><Upload className="w-4 h-4 mr-2" /> Import Scenario</Button></div>
      </div>

      {/* Input Panel */}
      <Card variant="padded" className="space-y-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand-cyan" /> Lead Analysis Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Selector */}
          <div className="space-y-4">
            <p className="text-caption text-text-muted">Select a scenario or create a custom lead</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select scenario">
              {SCENARIOS.map(s => (
                <button key={s.id} onClick={() => handleScenarioChange(s.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedScenario === s.id ? 'bg-brand-cyan text-brand-navy border-brand-cyan' : 'bg-surface-interactive text-text-secondary border-border-subtle hover:bg-surface-highlight'}`} role="radio" aria-checked={selectedScenario === s.id}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input label="Full Name" placeholder="John Doe" value={customLead.fullName} onChange={e => setCustomLead({ ...customLead, fullName: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Input label="Work Email" placeholder="john@company.com" value={customLead.workEmail} onChange={e => setCustomLead({ ...customLead, workEmail: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Input label="Company" placeholder="Acme Corp" value={customLead.companyName} onChange={e => setCustomLead({ ...customLead, companyName: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Input label="Industry" placeholder="Technology" value={customLead.industry} onChange={e => setCustomLead({ ...customLead, industry: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Select label="Company Size" options={[{ value: '', label: 'Select' }, { value: '1-10', label: '1-10' }, { value: '11-50', label: '11-50' }, { value: '51-200', label: '51-200' }, { value: '201-500', label: '201-500' }, { value: '501-1000', label: '501-1000' }, { value: '1000+', label: '1000+' }]} value={customLead.companySize} onChange={e => setCustomLead({ ...customLead, companySize: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Input label="Service Required" placeholder="AI Lead Scoring" value={customLead.serviceRequired} onChange={e => setCustomLead({ ...customLead, serviceRequired: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Select label="Budget Range" options={[{ value: '', label: 'Select' }, { value: '<$10k', label: '<$10k' }, { value: '$10k-$50k', label: '$10k-$50k' }, { value: '$50k-$100k', label: '$50k-$100k' }, { value: '$100k-$200k', label: '$100k-$200k' }, { value: '$200k-$500k', label: '$200k-$500k' }, { value: '$500k+', label: '$500k+' }]} value={customLead.budgetRange} onChange={e => setCustomLead({ ...customLead, budgetRange: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Select label="Timeline" options={[{ value: '', label: 'Select' }, { value: '<1 month', label: '<1 month' }, { value: '1-3 months', label: '1-3 months' }, { value: '3-6 months', label: '3-6 months' }, { value: '6+ months', label: '6+ months' }]} value={customLead.desiredTimeline} onChange={e => setCustomLead({ ...customLead, desiredTimeline: e.target.value })} disabled={selectedScenario !== 'custom'} />
            <Select label="Decision Authority" options={[{ value: '', label: 'Select' }, { value: 'Individual Contributor', label: 'Individual Contributor' }, { value: 'Team Lead', label: 'Team Lead' }, { value: 'Director', label: 'Director' }, { value: 'VP', label: 'VP' }, { value: 'C-Level', label: 'C-Level' }]} value={customLead.decisionAuthority} onChange={e => setCustomLead({ ...customLead, decisionAuthority: e.target.value })} disabled={selectedScenario !== 'custom'} />
          </div>

          <Textarea label="Project Description" placeholder="Describe the business problem, current process, desired outcome..." value={customLead.projectDescription} onChange={e => setCustomLead({ ...customLead, projectDescription: e.target.value })} rows={4} disabled={selectedScenario !== 'custom'} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" size="lg" onClick={handleAnalyze} disabled={isAnalyzing} loading={isAnalyzing}><ZapIcon className="w-4 h-4 mr-2" /> Analyze Lead</Button>
        </CardFooter>
      </Card>

      {/* Analysis Result */}
      {analysisResult && (
        <Card variant="padded" className="space-y-6 border-brand-cyan/30 bg-brand-cyan-dim/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand-cyan" /> Analysis Result</span>
              <Badge variant={analysisResult.category === 'HOT' ? 'success' : analysisResult.category === 'WARM' ? 'warning' : analysisResult.category === 'COLD' ? 'neutral' : 'error'} size="sm">{analysisResult.category} ({analysisResult.score}/100)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-caption text-text-muted">Opportunity Score</p><p className="text-kpi-value text-text-primary font-mono">{analysisResult.score}/100</p></div>
              <div><p className="text-caption text-text-muted">Confidence</p><p className="text-kpi-value text-text-primary font-mono">{analysisResult.confidence}%</p></div>
            </div>
            <div className="space-y-2"><p className="text-caption text-text-muted">Primary Business Problem</p><p className="text-body text-text-primary font-medium">{analysisResult.summary}</p></div>
            <div className="space-y-2"><p className="text-caption text-text-muted">Recommended Action</p><p className="text-body text-text-primary font-medium">{analysisResult.recommendedAction}</p></div>
            <div className="flex flex-wrap gap-2"><ProvenanceBadge source="DERIVED" /><Badge variant="info" size="sm">AI: Demo Provider (gpt-4)</Badge><Badge variant="neutral" size="sm">Analyzed {formatRelativeTime(new Date())}</Badge></div>
            <ScoreRow label="Budget Fit (25%)" score={analysisResult.budgetFitScore || 0} max={25} color="#10B981" />
            <ScoreRow label="Service Fit (25%)" score={analysisResult.serviceFitScore || 0} max={25} color="#3B82F6" />
            <ScoreRow label="Urgency & Timeline (20%)" score={analysisResult.urgencyScore || 0} max={20} color="#F59E0B" />
            <ScoreRow label="Decision Authority (15%)" score={analysisResult.authorityScore || 0} max={15} color="#8B5CF6" />
            <ScoreRow label="Info Completeness (15%)" score={analysisResult.infoQualityScore || 0} max={15} color="#6B7C96" />
          </CardContent>
        </Card>
      )}

      {/* Recent Analyses */}
      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2"><Brain className="w-5 h-5 text-brand-cyan" /> Recent Analyses</span><Badge variant="neutral" size="sm">{leads.length} leads</Badge></CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHeadCell className="w-64">Contact</TableHeadCell><TableHeadCell className="w-56">Company</TableHeadCell><TableHeadCell className="w-28 text-center">Category</TableHeadCell><TableHeadCell className="w-28 text-center">Score</TableHeadCell><TableHeadCell className="w-28 text-center">Confidence</TableHeadCell><TableHeadCell className="w-28 text-center">Stage</TableHeadCell><TableHeadCell className="w-36 text-right">Updated</TableHeadCell></TableRow></TableHeader>
          <TableBody>{leads.slice(0, 10).map((lead) => (<TableRow key={lead.id}><TableCell className="table-cell-primary"><div className="flex items-center gap-3"><Avatar name={lead.fullName} size="sm" /><div className="min-w-0"><div className="font-medium text-text-primary truncate">{lead.fullName}</div><div className="text-mono-sm text-text-muted truncate">{lead.workEmail}</div></div></div></TableCell><TableCell><div className="min-w-0"><div className="font-medium text-text-primary truncate">{lead.companyName}</div><div className="text-caption text-text-muted truncate">{lead.industry}</div></div></TableCell><TableCell className="text-center"><Badge variant={lead.category === 'HOT' ? 'success' : lead.category === 'WARM' ? 'warning' : lead.category === 'COLD' ? 'neutral' : 'error'} size="sm">{lead.category || 'PENDING'}</Badge></TableCell><TableCell className="text-center font-mono font-bold text-text-primary">{lead.totalScore !== null ? `${lead.totalScore}/100` : '—'}</TableCell><TableCell className="text-center"><Badge variant="neutral" size="sm">—</Badge></TableCell><TableCell className="text-center"><Badge variant={lead.status === 'APPROVED' ? 'success' : lead.status === 'IN_REVIEW' ? 'warning' : lead.status === 'REJECTED' ? 'error' : 'info'} size="sm">{lead.status}</Badge></TableCell><TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(lead.createdAt)}</TableCell></TableRow>))}</TableBody></Table>
        </CardContent>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="info" size="sm">DEMO MODE</Badge><span className="text-body-sm text-text-secondary">Data is simulated. <Link href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</Link></span></div></div></Card>
      )}
    </div>
  );
}