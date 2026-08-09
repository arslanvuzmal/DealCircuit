'use client';

import React from 'react';
import { Building2, Users, Globe, Zap, Server, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface CompanyIntelligencePanelProps {
  data: {
    industry: string;
    companySize: string;
    locations?: number;
    operationalComplexity: string;
    existingSystems: string[];
    leadSource: string;
    enriched: boolean;
  };
}

export default function CompanyIntelligencePanel({ data }: CompanyIntelligencePanelProps) {
  return (
    <Card variant="padded" className="space-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-body-sm">Company Intelligence</h3>
            <p className="text-caption text-text-muted">Automated company profiling</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4">
            <div className="flex items-center gap-2 text-text-muted text-caption mb-1">
              <Building2 className="w-3.5 h-3.5" /> Industry
            </div>
            <div className="font-medium text-text-primary">{data.industry}</div>
          </div>

          <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4">
            <div className="flex items-center gap-2 text-text-muted text-caption mb-1">
              <Users className="w-3.5 h-3.5" /> Company Size
            </div>
            <div className="font-medium text-text-primary">{data.companySize}</div>
          </div>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4">
          <div className="flex items-center gap-2 text-text-muted text-caption mb-1">
            <Zap className="w-3.5 h-3.5" /> Operational Complexity
          </div>
          <div className="font-medium text-text-primary">{data.operationalComplexity}</div>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4">
          <div className="flex items-center gap-2 text-text-muted text-caption mb-2">
            <Server className="w-3.5 h-3.5" /> Existing Systems
          </div>
          <div className="flex flex-wrap gap-2">
            {data.existingSystems.map((system, index) => (
              <Badge key={index} variant="neutral" size="sm">
                {system}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4">
          <div className="flex items-center gap-2 text-text-muted text-caption mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Lead Source
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-text-primary">{data.leadSource}</span>
            {data.enriched && (
              <Badge variant="neutral" size="sm" style={{ backgroundColor: 'var(--color-provenance-demo-enriched-bg)', color: 'var(--color-provenance-demo-enriched-text)', borderColor: 'var(--color-provenance-demo-enriched-border)' }}>
                DEMO ENRICHED
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}