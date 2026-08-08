"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, BarChart2, TrendingUp, TrendingDown, Users, DollarSign, Clock, Target, ArrowRight, Download, Settings } from "lucide-react";
import { formatRelativeTime, formatNumber } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

function EmptyAnalytics() {
  return <div className="p-12 text-center"><BarChart2 className="w-12 h-12 text-text-muted mx-auto mb-4" /><p className="text-body text-text-secondary">No analytics data available.</p></div>;
}

function KPICard({ label, value, icon, iconBg, iconColor, trend, trendLabel, description, isPositive }: { label: string; value: string | number; icon: React.ReactNode; iconBg: string; iconColor: string; trend?: string; trendLabel?: string; description?: string; isPositive?: boolean }) {
  return (
    <Card variant="hover" className="p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className={iconBg}>{icon}</div>
        {trend && (<Badge variant={isPositive !== false ? "success" : "error"} size="sm" className="self-start flex items-center gap-1">
          {isPositive !== false ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </Badge>)}
      </div>
      <div className="space-y-1">
        <p className="text-kpi-value text-text-primary">{value}</p>
        <p className="text-kpi-label text-text-muted">{label}</p>
        {description && <p className="text-caption text-text-muted">{description}</p>}
      </div>
      {trendLabel && <p className="text-caption text-text-muted mt-1">{trendLabel}</p>}
    </Card>
  );
}

interface AnalyticsClientProps { data: any; }

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState("30d");
  const [viewMode, setViewMode] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><BarChart2 className="w-6 h-6 text-brand-blue" /> Analytics</h1>
          <p className="text-body-sm text-text-muted mt-1">Business-purpose metrics — pipeline, conversion, velocity, and quality.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select placeholder="Date Range" options={[{ value: "7d", label: "Last 7 Days" }, { value: "30d", label: "Last 30 Days" }, { value: "90d", label: "Last 90 Days" }]} size="sm" className="w-40" value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
          <Select placeholder="View" options={[{ value: "overview", label: "Overview" }, { value: "pipeline", label: "Pipeline" }, { value: "conversion", label: "Conversion" }, { value: "quality", label: "Lead Quality" }]} size="sm" className="w-40" value={viewMode} onChange={(e) => setViewMode(e.target.value)} />
          <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Leads" value={formatNumber(data.totalLeads)} icon={<Users className="w-5 h-5" />} iconBg="bg-brand-cyan-dim text-brand-cyan" iconColor="#38BDF8" trend="+12%" trendLabel="vs prev period" description="Ingested via webhooks" />
        <KPICard label="Pipeline Value" value={`$${formatNumber(data.pipelineValue)}`} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-status-success-bg text-status-success" iconColor="#10B981" trend="+8%" trendLabel="vs prev period" description="Estimated from qualified leads" />
        <KPICard label="Avg Deal Velocity" value={`${data.avgVelocity}d`} icon={<Clock className="w-5 h-5" />} iconBg="bg-brand-blue/10 text-brand-blue" iconColor="#3B82F6" trend="-2d" trendLabel="improved" isPositive={true} description="Lead ingest → Approved" />
        <KPICard label="Conversion Rate" value={`${data.conversionRate}%`} icon={<Target className="w-5 h-5" />} iconBg="bg-status-warning-bg text-status-warning" iconColor="#F59E0B" trend="+1.5%" trendLabel="vs prev period" description="Approved / Total Ingested" />
        <KPICard label="Avg Score (Approved)" value={data.avgApprovedScore} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-brand-cyan/20 text-brand-cyan" iconColor="#38BDF8" description="Quality of approved leads" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-brand-cyan" /> Lead Volume by Week</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.weeklyVolume.map((w: any) => (
              <div key={w.week} className="flex items-center gap-4">
                <span className="text-caption text-text-muted w-24">{w.week}</span>
                <div className="flex-1 h-8 bg-border-subtle rounded-full overflow-hidden relative">
                  <div className="h-full bg-brand-cyan rounded-full transition-all" style={{ width: `${Math.max(5, (w.count / data.maxWeeklyVolume) * 100)}%` }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-caption font-mono text-text-primary">{w.count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-brand-blue" /> Conversion Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.funnel.map((f: any) => (
              <div key={f.stage} className="flex items-center gap-4">
                <span className="text-body-sm text-text-secondary w-32">{f.stage}</span>
                <div className="flex-1 h-8 bg-border-subtle rounded-full overflow-hidden relative">
                  <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${(f.count / data.funnel[0].count) * 100}%` }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-caption font-mono text-text-primary">{f.count} ({(f.count / data.funnel[0].count * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-brand-cyan" /> Top Sources by Conversion</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHeadCell>Source</TableHeadCell><TableHeadCell className="text-center">Leads</TableHeadCell><TableHeadCell className="text-center">Approved</TableHeadCell><TableHeadCell className="text-center">Rate</TableHeadCell><TableHeadCell className="text-center">Avg Score</TableHeadCell></TableRow></TableHeader>
              <TableBody>{data.sourcePerformance.map((s: any) => (<TableRow key={s.source}><TableCell className="font-medium text-text-primary">{s.source}</TableCell><TableCell className="text-center font-mono">{s.leads}</TableCell><TableCell className="text-center font-mono text-status-success">{s.approved}</TableCell><TableCell className="text-center font-mono">{s.rate}%</TableCell><TableCell className="text-center font-mono">{s.avgScore}</TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card variant="padded" className="space-y-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-brand-blue" /> Velocity by Category</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHeadCell>Category</TableHeadCell><TableHeadCell className="text-center">Avg Days</TableHeadCell><TableHeadCell className="text-center">Leads</TableHeadCell><TableHeadCell className="text-center">Fastest</TableHeadCell><TableHeadCell className="text-center">Slowest</TableHeadCell></TableRow></TableHeader>
              <TableBody>{data.velocityByCategory.map((v: any) => (<TableRow key={v.category}><TableCell><Badge variant={v.category === "HOT" ? "success" : v.category === "WARM" ? "warning" : "neutral"} size="sm">{v.category}</Badge></TableCell><TableCell className="text-center font-mono">{v.avgDays}d</TableCell><TableCell className="text-center font-mono">{v.count}</TableCell><TableCell className="text-center font-mono">{v.minDays}d</TableCell><TableCell className="text-center font-mono">{v.maxDays}d</TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card variant="padded" className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-brand-blue" /> Scoring Rule Effectiveness</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHeadCell>Rule</TableHeadCell><TableHeadCell className="text-center">Triggered</TableHeadCell><TableHeadCell className="text-center">Avg Impact</TableHeadCell><TableHeadCell className="text-center">Correlation</TableHeadCell><TableHeadCell className="text-center">Status</TableHeadCell></TableRow></TableHeader>
            <TableBody>{data.scoringRules.map((r: any) => (<TableRow key={r.id}><TableCell className="font-medium text-text-primary">{r.name}</TableCell><TableCell className="text-center font-mono">{r.triggered}</TableCell><TableCell className="text-center font-mono">{r.avgImpact > 0 ? "+" : ""}{r.avgImpact}</TableCell><TableCell className="text-center font-mono">{r.correlation}</TableCell><TableCell className="text-center"><Badge variant={r.active ? "success" : "neutral"} size="sm">{r.active ? "Active" : "Inactive"}</Badge></TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between"><span className="text-caption text-text-muted">{data.scoringRules.length} rules configured</span><Button variant="secondary" size="sm"><ArrowRight className="w-4 h-4 mr-2" /> Manage Rules</Button></CardFooter>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (<Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="info" size="sm">DEMO MODE</Badge><span className="text-body-sm text-text-secondary">Data is simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</a></span></div></div></Card>)}
    </div>
  );
}