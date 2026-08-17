"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  Zap,
  ShieldCheck,
  Mail,
  Radio,
  AlertTriangle,
  FileText,
  Database,
  GitBranch,
  Clock,
  Search,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  MoreHorizontal,
} from "lucide-react";
import { formatNumber, formatRelativeTime, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Avatar } from "@/components/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";

import { LeadOverviewTab } from "./lead-detail/LeadOverviewTab";
import { LeadIntelligenceTab } from "./lead-detail/LeadIntelligenceTab";
import { LeadActivityTab } from "./lead-detail/LeadActivityTab";
import { LeadWorkflowTab } from "./lead-detail/LeadWorkflowTab";
import { LeadCRMTab } from "./lead-detail/LeadCRMTab";
import { LeadAuditTab } from "./lead-detail/LeadAuditTab";
import { LeadActions } from "./lead-detail/LeadActions";
import { CategoryBadge, StatusBadge, CRMStatusBadge } from "./lead-detail/LeadBadges";

interface LeadDetailClientProps {
  lead: any;
}

export default function LeadDetailClient({ lead }: LeadDetailClientProps) {
  const latestScore = lead.scores?.[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/dashboard/leads" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leads
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
            <Search className="w-3 h-3" />
            ID: <span className="font-mono">{lead.id.slice(0, 8)}...</span>
          </Badge>
          <LeadActions lead={lead} />
        </div>
      </div>

      {/* Lead Header */}
      <Card variant="padded" className="space-y-4">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar name={lead.fullName} size="lg" />
              <div>
                <h1 className="text-page-title text-text-primary">{lead.fullName}</h1>
                <p className="text-body-sm text-text-muted flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> {lead.companyName} &bull; {lead.workEmail}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={lead.category} />
              <Badge variant={lead.isDuplicate ? "error" : "neutral"} size="sm">
                {lead.isDuplicate ? "Duplicate" : "Original"}
              </Badge>
              <Badge variant="info" size="sm" className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Created {formatRelativeTime(lead.createdAt)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LeadActions lead={lead} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle">
              <p className="text-caption text-text-muted">Total Score</p>
              <p className="text-kpi-value text-text-primary font-mono">{lead.totalScore ?? "—"}/100</p>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle">
              <p className="text-caption text-text-muted">Confidence</p>
              <p className="text-kpi-value text-text-primary font-mono">{latestScore?.confidence ? `${Math.round(latestScore.confidence * 100)}%` : "—"}</p>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle">
              <p className="text-caption text-text-muted">Stage</p>
              <StatusBadge status={lead.status} />
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle">
              <p className="text-caption text-text-muted">CRM Sync</p>
              <CRMStatusBadge status={lead.crmSyncStatus} />
            </div>
          </div>

          {/* AI Recommendation */}
          {latestScore && (
            <div className="bg-brand-cyan-dim/30 border border-brand-cyan/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-cyan/20 rounded-lg"><Zap className="w-5 h-5 text-brand-cyan" /></div>
                <div className="flex-1">
                  <p className="text-body-sm font-semibold text-text-primary">AI Recommendation</p>
                  <p className="text-body-sm text-text-secondary mt-1">{latestScore.recommendedAction}</p>
                  <div className="flex items-center gap-4 mt-2 text-caption text-text-muted">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Provider: {latestScore.aiProvider} ({latestScore.aiModel})</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Scored {formatRelativeTime(latestScore.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <LeadOverviewTab lead={lead} latestScore={latestScore} />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6 animate-fade-in">
          <LeadIntelligenceTab latestScore={latestScore} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 animate-fade-in">
          <LeadActivityTab lead={lead} />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6 animate-fade-in">
          <LeadWorkflowTab lead={lead} />
        </TabsContent>

        <TabsContent value="crm" className="space-y-6 animate-fade-in">
          <LeadCRMTab lead={lead} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 animate-fade-in">
          <LeadAuditTab lead={lead} />
        </TabsContent>
      </Tabs>

      {/* Demo Mode Banner */}
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">
                Data is simulated. No external systems are modified.
                <Link href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">
                  Manage demo data →
                </Link>
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}