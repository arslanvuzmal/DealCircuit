"use client";

import React from "react";
import { Zap, AlertTriangle, Search, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProvenanceBadge } from "./LeadBadges";
import { ScoreRow } from "./LeadBadges";

interface LeadIntelligenceTabProps {
  latestScore: any;
}

export function LeadIntelligenceTab({ latestScore }: LeadIntelligenceTabProps) {
  if (!latestScore) {
    return (
      <Card variant="padded" className="text-center py-12">
        <Zap className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-body text-text-secondary">No intelligence analysis available for this lead.</p>
        <Button variant="primary" className="mt-4"><Zap className="w-4 h-4 mr-2" /> Run Analysis</Button>
      </Card>
    );
  }

  return (
    <>
      {/* Executive Summary */}
      <Card variant="padded" className="space-y-4 border-brand-cyan/30 bg-brand-cyan-dim/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand-cyan" /> Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-caption text-text-muted">Opportunity Score</p><p className="text-kpi-value text-text-primary font-mono">{latestScore.totalScore}/100</p></div>
            <div><p className="text-caption text-text-muted">Confidence</p><p className="text-kpi-value text-text-primary font-mono">{Math.round((latestScore.confidence || 0) * 100)}%</p></div>
          </div>
          <div className="space-y-2"><p className="text-caption text-text-muted">Primary Business Problem</p><p className="text-body text-text-primary font-medium">{latestScore.summary}</p></div>
          <div className="space-y-2"><p className="text-caption text-text-muted">Recommended Action</p><p className="text-body text-text-primary font-medium">{latestScore.recommendedAction}</p></div>
          <div className="flex flex-wrap gap-2">
            <ProvenanceBadge source="DERIVED" />
            <Badge variant="info" size="sm">AI: {latestScore.aiProvider} ({latestScore.aiModel})</Badge>
            <Badge variant="neutral" size="sm">{formatDateTime(latestScore.createdAt)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card variant="padded" className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand-blue" /> 5-Criteria Score Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <ScoreRow label="Budget Fit (25%)" score={latestScore.budgetFitScore} max={25} color="#10B981" />
          <ScoreRow label="Service Fit (25%)" score={latestScore.serviceFitScore} max={25} color="#3B82F6" />
          <ScoreRow label="Urgency & Timeline (20%)" score={latestScore.urgencyScore} max={20} color="#F59E0B" />
          <ScoreRow label="Decision Authority (15%)" score={latestScore.authorityScore} max={15} color="#8B5CF6" />
          <ScoreRow label="Info Completeness (15%)" score={latestScore.infoQualityScore} max={15} color="#6B7C96" />
          <div className="pt-2 border-t border-border-subtle"><p className="text-caption text-text-muted">Total: <span className="font-mono font-bold text-text-primary">{latestScore.totalScore}/100</span></p></div>
        </CardContent>
      </Card>

      {/* Risks & Missing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-status-warning" /> Risks & Objections</CardTitle></CardHeader>
          <CardContent>
            {latestScore.risksJson ? (
              <ul className="space-y-2">{JSON.parse(latestScore.risksJson).map((risk: string, i: number) => <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary"><AlertCircle className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" /><span>{risk}</span></li>)}</ul>
            ) : <p className="text-caption text-text-muted">No risks identified.</p>}
          </CardContent>
        </Card>

        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5 text-brand-blue" /> Missing Information</CardTitle></CardHeader>
          <CardContent>
            {latestScore.missingInfoJson ? (
              <ul className="space-y-2">{JSON.parse(latestScore.missingInfoJson).map((info: string, i: number) => <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary"><Search className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" /><span>{info}</span></li>)}</ul>
            ) : <p className="text-caption text-text-muted">No missing information identified.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}