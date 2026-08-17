import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  Flame,
  TrendingUp,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/Avatar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchDashboardData() {
  const [
    totalLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    reviewRequired,
    crmSynced,
    crmFailed,
    crmPending,
    statusApproved,
    statusScored,
    statusInReview,
    statusRejected,
    sourcesGroup,
    scoreAggregate,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { category: 'HOT' } }),
    prisma.lead.count({ where: { category: 'WARM' } }),
    prisma.lead.count({ where: { category: 'COLD' } }),
    prisma.lead.count({ where: { category: 'REVIEW_REQUIRED' } }),
    prisma.lead.count({ where: { crmSyncStatus: 'SYNCED' } }),
    prisma.lead.count({ where: { crmSyncStatus: 'FAILED' } }),
    prisma.lead.count({ where: { crmSyncStatus: 'PENDING' } }),
    prisma.lead.count({ where: { status: 'APPROVED' } }),
    prisma.lead.count({ where: { status: 'SCORED' } }),
    prisma.lead.count({ where: { status: 'IN_REVIEW' } }),
    prisma.lead.count({ where: { status: 'REJECTED' } }),
    prisma.lead.groupBy({ by: ['leadSource'], _count: { id: true } }),
    prisma.lead.aggregate({ _avg: { totalScore: true } }),
    prisma.lead.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
  ]);

  return {
    totalLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    reviewRequired,
    crmSynced,
    crmFailed,
    crmPending,
    statusApproved,
    statusScored,
    statusInReview,
    statusRejected,
    sourcesGroup,
    avgScore: scoreAggregate._avg.totalScore ? Math.round(scoreAggregate._avg.totalScore) : 0,
    recentLeads,
  };
}

function KPICard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendLabel,
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendLabel?: string;
  description?: string;
}) {
  return (
    <Card variant="hover" className="p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className={iconBg}>
          {icon}
        </div>
        {trend && (
          <Badge variant="success" size="sm" className="self-start">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-kpi-value text-text-primary">{value}</p>
        <p className="text-kpi-label text-text-muted">{label}</p>
        {description && <p className="text-caption text-text-muted">{description}</p>}
      </div>
      {trendLabel && (
        <p className="text-caption text-text-muted mt-1">{trendLabel}</p>
      )}
    </Card>
  );
}

function CategoryBar({
  label,
  count,
  total,
  color,
  badgeColor,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  badgeColor: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-text-secondary">{label}</span>
        <Badge variant={badgeColor as any} size="sm">{count} ({pct}%)</Badge>
      </div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function SourceBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-text-secondary truncate pr-2">{label}</span>
        <Badge variant="info" size="sm">{count} ({pct}%)</Badge>
      </div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 bg-brand-cyan"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatusGrid({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number; color: string; icon: React.ReactNode }[];
}) {
  return (
    <Card variant="padded" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-body-sm font-semibold text-text-primary">{title}</h3>
        <Badge variant="neutral" size="sm">Real-time</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-body-sm">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5 p-3 bg-surface-interactive rounded-lg border border-border-subtle">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-text-secondary flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-text-primary truncate">{item.label}</span>
            </div>
            <span className="text-body font-mono font-bold text-text-primary">{formatNumber(item.count)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default async function OverviewDashboard() {
  const data = await fetchDashboardData();

  const qualifiedCount = data.hotLeads + data.warmLeads;
  const qualificationRate = data.totalLeads > 0 ? Math.round((qualifiedCount / data.totalLeads) * 100) : 0;

  const categoryColors = [
    { label: 'HOT (80-100)', count: data.hotLeads, color: '#10B981', badgeColor: 'success' },
    { label: 'WARM (60-79)', count: data.warmLeads, color: '#F59E0B', badgeColor: 'warning' },
    { label: 'COLD (0-59)', count: data.coldLeads, color: '#6B7C96', badgeColor: 'neutral' },
    { label: 'REVIEW_REQUIRED', count: data.reviewRequired, color: '#EF4444', badgeColor: 'error' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Overview</h1>
          <p className="text-body-sm text-text-muted mt-1">Operations command center — real-time lead intelligence & workflow health</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/demo-controls" className="btn btn-ghost btn-sm">
            <Shield className="w-4 h-4 mr-2" />
            Demo Controls
          </Link>
          <Link href="/dashboard/review-queue" className="btn btn-primary btn-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Review Queue ({data.reviewRequired})
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          label="Leads Processed"
          value={formatNumber(data.totalLeads)}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-brand-cyan-dim text-brand-cyan"
          iconColor="#38BDF8"
          description="Across all channels & webhooks"
        />
        <KPICard
          label="Sales Qualified"
          value={formatNumber(qualifiedCount)}
          icon={<Flame className="w-5 h-5" />}
          iconBg="bg-status-success-bg text-status-success"
          iconColor="#10B981"
          trend="+12%"
          trendLabel="vs last week"
          description="Hot + Warm qualified leads"
        />
        <KPICard
          label="Review Required"
          value={formatNumber(data.reviewRequired)}
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-status-error-bg text-status-error"
          iconColor="#EF4444"
          trend="+3"
          trendLabel="pending action"
          description="Low confidence / duplicates / security"
        />
        <KPICard
          label="Avg Decision Time"
          value="2.4h"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-brand-blue/10 text-brand-blue"
          iconColor="#3B82F6"
          trend="-0.5h"
          trendLabel="improved"
          description="Time from ingest to review complete"
        />
        <KPICard
          label="Workflow Recovery"
          value="94%"
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-status-info-bg text-status-info"
          iconColor="#38BDF8"
          trend="+2%"
          trendLabel="vs last month"
          description="Failed events recovered via retry"
        />
        <KPICard
          label="Avg Score"
          value={`${data.avgScore}/100`}
          icon={<Zap className="w-5 h-5" />}
          iconBg="bg-status-warning-bg text-status-warning"
          iconColor="#F59E0B"
          description="5-Criteria aggregate"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Distribution + Sources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leads by Category */}
          <Card variant="padded" className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-brand-cyan" />
                Leads by Category
              </CardTitle>
              <Badge variant="neutral" size="sm">{data.totalLeads} Total Leads</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryColors.map((cat) => (
                <CategoryBar
                  key={cat.label}
                  label={cat.label}
                  count={cat.count}
                  total={data.totalLeads}
                  color={cat.color}
                  badgeColor={cat.badgeColor}
                />
              ))}
            </CardContent>
          </Card>

          {/* Leads by Source */}
          <Card variant="padded" className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-blue" />
                Leads by Source
              </CardTitle>
              <Badge variant="info" size="sm">{data.sourcesGroup.length} Channels</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.sourcesGroup.map((src) => (
                <SourceBar
                  key={src.leadSource}
                  label={src.leadSource}
                  count={src._count.id}
                  total={data.totalLeads}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Intelligence Rail + Health */}
        <div className="space-y-6">
          {/* CRM Sync Health */}
          <StatusGrid
            title="CRM Sync Health"
            items={[
              { label: 'Synced', count: data.crmSynced, color: '#10B981', icon: <CheckCircle2 className="w-4 h-4 text-status-success" /> },
              { label: 'Failed', count: data.crmFailed, color: '#EF4444', icon: <XCircle className="w-4 h-4 text-status-error" /> },
              { label: 'Pending', count: data.crmPending, color: '#F59E0B', icon: <Clock className="w-4 h-4 text-status-warning" /> },
            ]}
          />

          {/* Processing States */}
          <StatusGrid
            title="Processing States"
            items={[
              { label: 'Approved', count: data.statusApproved, color: '#10B981', icon: <CheckCircle2 className="w-4 h-4 text-status-success" /> },
              { label: 'Scored', count: data.statusScored, color: '#3B82F6', icon: <Zap className="w-4 h-4 text-brand-blue" /> },
              { label: 'In Review', count: data.statusInReview, color: '#F59E0B', icon: <Shield className="w-4 h-4 text-status-warning" /> },
              { label: 'Rejected', count: data.statusRejected, color: '#EF4444', icon: <XCircle className="w-4 h-4 text-status-error" /> },
            ]}
          />

          {/* Priority Work Area */}
          <Card variant="padded" className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-status-warning" />
                  Priority Work Area
                </span>
                <Link href="/dashboard/leads" className="btn btn-ghost btn-sm">
                  View All <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Contact</TableHeadCell>
                    <TableHeadCell>Company</TableHeadCell>
                    <TableHeadCell className="text-center">Score</TableHeadCell>
                    <TableHeadCell className="text-center">Confidence</TableHeadCell>
                    <TableHeadCell>Stage</TableHeadCell>
                    <TableHeadCell>Next Action</TableHeadCell>
                    <TableHeadCell className="text-right">Updated</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="table-cell-primary">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.fullName} size="sm" />
                          <div>
                            <div className="font-medium text-text-primary">{lead.fullName}</div>
                            <div className="text-mono-sm text-text-muted">{lead.workEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.companyName}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-text-primary">
                        {lead.totalScore !== null ? `${lead.totalScore}/100` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="neutral" size="sm">
                          —
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          lead.category === 'HOT' ? 'success' :
                          lead.category === 'WARM' ? 'warning' :
                          lead.category === 'COLD' ? 'neutral' : 'error'
                        } size="sm">
                          {lead.category || 'PENDING'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {lead.status === 'IN_REVIEW' ? 'Awaiting review' :
                         lead.status === 'SCORED' ? 'Ready for review' :
                         lead.status === 'APPROVED' ? 'CRM sync pending' : 'Review required'}
                      </TableCell>
                      <TableCell className="text-right text-caption text-text-muted">
                        {formatRelativeTime(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/leads" className="btn btn-ghost btn-sm w-full">
                View all leads <ArrowUpRight className="w-3 h-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
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
            <Button variant="ghost" size="sm">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}