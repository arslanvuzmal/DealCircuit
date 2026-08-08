"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, XCircle, ChevronDown, ChevronUp, Edit2, Trash2, Plus, Code2, BarChart2, Zap, Target, Users, Building2, DollarSign, Shield, Brain, Search, Filter, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Modal, AlertDialog } from "@/components/ui/Modal";

const CRITERION_ICONS: Record<string, React.ReactNode> = {
  jobTitle: <Briefcase className="w-4 h-4" />,
  companySize: <Building2 className="w-4 h-4" />,
  techStack: <Code2 className="w-4 h-4" />,
  funding: <DollarSign className="w-4 h-4" />,
  negative: <Shield className="w-4 h-4" />,
};

interface ScoringRule {
  id: string;
  name: string;
  criterionKey: string;
  weight: number;
  maxScore: number;
  active: boolean;
  configJson: string;
  updatedBy: string;
  updatedAt: string;
}

const mockRules: ScoringRule[] = [
  { id: "rule-1", name: "Job Title Match", criterionKey: "jobTitle", weight: 0.25, maxScore: 25, active: true, configJson: JSON.stringify({ titles: ["CTO", "VP Engineering", "Director", "Head of Engineering", "Engineering Manager"], partialMatch: true, caseInsensitive: true }, null, 2), updatedBy: "system", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  { id: "rule-2", name: "Company Size > 50", criterionKey: "companySize", weight: 0.20, maxScore: 20, active: true, configJson: JSON.stringify({ minEmployees: 50, maxEmployees: null, tiers: [{ min: 50, max: 200, score: 10 }, { min: 200, max: 1000, score: 15 }, { min: 1000, score: 20 }] }, null, 2), updatedBy: "jane.doe@company.com", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: "rule-3", name: "Tech Stack Match", criterionKey: "techStack", weight: 0.25, maxScore: 25, active: true, configJson: JSON.stringify({ technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Kubernetes", "Docker"], matchAny: true, weightPerMatch: 3 }, null, 2), updatedBy: "system", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() },
  { id: "rule-4", name: "Recent Funding", criterionKey: "funding", weight: 0.15, maxScore: 15, active: true, configJson: JSON.stringify({ monthsSinceFunding: 18, minAmount: 1000000, sources: ["Crunchbase", "PitchBook", "News API"] }, null, 2), updatedBy: "bob.wilson@company.com", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
  { id: "rule-5", name: "Negative: Competitor Domain", criterionKey: "negative", weight: -0.15, maxScore: 15, active: true, configJson: JSON.stringify({ competitorDomains: ["competitor1.com", "competitor2.com", "competitor3.com"], penalty: 25, checkEmailDomain: true, checkCompanyDomain: true }, null, 2), updatedBy: "system", updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString() },
];

const weightSum = mockRules.reduce((sum, r) => sum + Math.abs(r.weight), 0);
const maxScoreSum = mockRules.reduce((sum, r) => sum + r.maxScore, 0);

export default function ScoringRulesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  const filteredRules = mockRules
    .filter((rule) => {
      if (searchQuery && !rule.name.toLowerCase().includes(searchQuery.toLowerCase()) && !rule.criterionKey.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeFilter && rule.active !== (activeFilter === "active")) return false;
      return true;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Sliders className="w-6 h-6 text-brand-amber" /> Scoring Rules</h1>
          <p className="text-body-sm text-text-muted mt-1">Active 5-criteria qualification weights, max score caps, and tier thresholds.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">{mockRules.length} Rules Configured</Badge>
          <Badge variant="info" size="sm">{Math.round(weightSum * 100)}% Total Weight</Badge>
          <Badge variant="success" size="sm">{maxScoreSum} Max Score</Badge>
          <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Rule</Button>
        </div>
      </div>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-brand-blue" /> Scoring Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center">
              <p className="text-kpi-value text-text-primary font-mono">{Math.round(weightSum * 100)}%</p>
              <p className="text-caption text-text-muted">Total Weight</p>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center">
              <p className="text-kpi-value text-text-primary font-mono">{maxScoreSum}</p>
              <p className="text-caption text-text-muted">Max Possible Score</p>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center">
              <p className="text-kpi-value text-text-primary font-mono">{mockRules.filter(r => r.active).length} / {mockRules.length}</p>
              <p className="text-caption text-text-muted">Active Rules</p>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-4">
            <p className="text-body-sm font-medium text-text-primary mb-2">Tier Thresholds</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-status-success-bg/10 border border-status-success/30 rounded-lg"><p className="font-medium text-status-success">HOT: 80-100</p><p className="text-caption text-text-muted">Immediate outreach</p></div>
              <div className="p-3 bg-status-warning-bg/10 border border-status-warning/30 rounded-lg"><p className="font-medium text-status-warning">WARM: 60-79</p><p className="text-caption text-text-muted">Nurture sequence</p></div>
              <div className="p-3 bg-status-error-bg/10 border border-status-error/30 rounded-lg"><p className="font-medium text-status-error">REVIEW: \u003c 60</p><p className="text-caption text-text-muted">Human review required</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" /><Input placeholder="Search rule name, criterion..." className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select placeholder="All Rules" options={[{ value: "", label: "All Rules" }, { value: "active", label: "Active Only" }, { value: "inactive", label: "Inactive Only" }]} size="sm" className="w-40" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="space-y-3">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="border border-border-subtle rounded-lg overflow-hidden bg-surface-interactive">
              <div className="p-4 border-b border-border-subtle flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-brand-amber/20 rounded-lg text-brand-amber">{CRITERION_ICONS[rule.criterionKey] || <Zap className="w-5 h-5" />}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-text-primary truncate">{rule.name}</h4>
                      <Badge variant={rule.active ? "success" : "neutral"} size="sm">{rule.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-caption text-text-muted mt-1">
                      <span className="font-mono">Key: {rule.criterionKey}</span>
                      <span className="font-mono">Weight: {rule.weight > 0 ? "+" : ""}{Math.round(rule.weight * 100)}%</span>
                      <span className="font-mono">Max: {rule.maxScore} pts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}>
                    {expandedId === rule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-status-error" onClick={() => setShowDeleteDialog(rule.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              {expandedId === rule.id && (
                <div className="p-4 bg-bg-tertiary border-t border-border-subtle space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-caption">
                    <div><p className="text-text-muted">Updated By</p><p className="font-mono text-text-primary">{rule.updatedBy}</p></div>
                    <div><p className="text-text-muted">Last Updated</p><p className="font-mono text-text-primary">{new Date(rule.updatedAt).toLocaleDateString()}</p></div>
                  </div>
                  <div>
                    <p className="text-caption text-text-muted mb-2">Configuration (JSON)</p>
                    <pre className="bg-bg-tertiary rounded-lg p-3 text-caption text-text-secondary overflow-x-auto font-mono max-h-48">{rule.configJson}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">Data is simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data</a></span>
            </div>
          </div>
        </Card>
      )}

      {showCreateModal && (
        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Scoring Rule" size="lg">
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Rule Name</label><Input placeholder="e.g., Job Title Match" /></div>
            <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Criterion Key</label><Select options={[{ value: "jobTitle", label: "Job Title" }, { value: "companySize", label: "Company Size" }, { value: "techStack", label: "Tech Stack" }, { value: "funding", label: "Funding" }, { value: "negative", label: "Negative Signal" }]} placeholder="Select criterion" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Weight (%)</label><Input type="number" placeholder="25" /></div>
              <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Max Score</label><Input type="number" placeholder="25" /></div>
            </div>
            <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Configuration (JSON)</label><textarea className="w-full p-3 font-mono text-caption bg-bg-tertiary border border-border-subtle rounded-lg min-h-32" placeholder='{ "titles": ["CTO", "VP Engineering"], "partialMatch": true }' /></div>
            <div className="flex justify-end gap-2 pt-4 border-t border-border-subtle">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={() => setShowCreateModal(false)}>Create Rule</Button>
            </div>
          </div>
        </Modal>
      )}

      {showDeleteDialog && (
        <AlertDialog open={true} onClose={() => setShowDeleteDialog(null)} title="Delete Scoring Rule" description="Are you sure you want to delete this scoring rule? This action cannot be undone." confirmText="Delete" onConfirm={() => setShowDeleteDialog(null)} variant="danger" />
      )}
    </div>
  );
}