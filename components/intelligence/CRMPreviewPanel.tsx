'use client';

import React from 'react';
import { Building2, User, Mail, Zap, Globe, Database, ShieldCheck, AlertTriangle, ArrowRight, Target, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CRMPreviewPanelProps {
  data: {
    company: string;
    contact: string;
    stage: string;
    priority: string;
    opportunityScore: number;
    confidence: number;
    primaryRequirement: string;
    primaryPain: string;
    currentSystems: string[];
    knownRisks: string[];
    missingQualification: string[];
    nextStep: string;
  };
}

export default function CRMPreviewPanel({ data }: CRMPreviewPanelProps) {
  const stageVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
    'Sales Qualified': 'success',
    'Marketing Qualified': 'info',
    'Review Required': 'warning',
    'Disqualified': 'error',
  };

  const priorityVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
    High: 'error',
    Medium: 'warning',
    Low: 'success',
  };

  const stageVariant = stageVariants[data.stage] || 'warning';
  const priorityVariant = priorityVariants[data.priority] || 'warning';

  return (
    <div className="bg-surface-default border border-border-subtle rounded-xl p-6 space-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-body-sm">CRM Record Preview</h3>
            <p className="text-caption text-text-muted">Demo CRM record that would be prepared</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`bg-surface-interactive border border-border-subtle rounded-xl p-5`}>
            <div className="text-caption text-text-muted mb-1">Stage</div>
            <Badge variant={stageVariants[data.stage] || 'warning'} size="sm">{data.stage}</Badge>
          </div>
          <div className={`bg-surface-interactive border border-border-subtle rounded-xl p-5`}>
            <div className="text-caption text-text-muted mb-1">Priority</div>
            <Badge variant={priorityVariants[data.priority] || 'warning'} size="sm">{data.priority}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
            <div className="text-caption text-text-muted mb-1">Opportunity Score</div>
            <div className="text-kpi-value text-text-primary font-mono">{data.opportunityScore}/100</div>
          </div>
          <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
            <div className="text-caption text-text-muted mb-1">Confidence</div>
            <div className="text-kpi-value text-text-primary font-mono">{data.confidence}%</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <Target className="w-4 h-4" />
              <h4 className="font-semibold text-text-primary">Primary Requirement</h4>
            </div>
            <p className="text-text-secondary">{data.primaryRequirement}</p>
          </div>

          <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="font-semibold text-text-primary">Primary Pain Point</h4>
            </div>
            <p className="text-text-secondary">{data.primaryPain}</p>
          </div>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <Zap className="w-4 h-4" />
            <h4 className="font-semibold text-text-primary">Current Systems</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.currentSystems.map((system, index) => (
              <Badge key={index} variant="neutral" size="sm">{system}</Badge>
            ))}
          </div>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-semibold text-text-primary">Known Risks</h4>
          </div>
          <ul className="list-disc list-inside text-body-sm text-text-secondary space-y-1">
            {data.knownRisks.map((risk, index) => (
              <li key={index} className="text-text-secondary">{risk}</li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <HelpCircle className="w-4 h-4" />
            <h4 className="font-semibold text-text-primary">Missing Qualification</h4>
          </div>
          <ul className="list-disc list-inside text-body-sm text-text-secondary space-y-1">
            {data.missingQualification.map((item, index) => (
              <li key={index} className="text-text-secondary">{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-brand-blue mb-2">
            <ArrowRight className="w-4 h-4" />
            <h4 className="font-semibold text-text-primary">Recommended Next Step</h4>
          </div>
          <p className="text-text-secondary">{data.nextStep}</p>
        </div>

        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <div className="bg-brand-cyan-dim/20 border border-brand-cyan/30 rounded-lg p-3">
            <Badge variant="info" size="sm" className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Simulation Mode - Demo CRM record prepared, no external CRM write
            </Badge>
          </div>
        )}
      </CardContent>
    </div>
  );
}