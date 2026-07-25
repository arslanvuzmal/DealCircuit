import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  Flame,
  Zap,
  Snowflake,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Activity,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OverviewDashboard() {
  const totalLeads = await prisma.lead.count();
  const hotLeads = await prisma.lead.count({ where: { category: 'HOT' } });
  const warmLeads = await prisma.lead.count({ where: { category: 'WARM' } });
  const coldLeads = await prisma.lead.count({ where: { category: 'COLD' } });
  const reviewRequired = await prisma.lead.count({ where: { category: 'REVIEW_REQUIRED' } });
  const crmSynced = await prisma.lead.count({ where: { crmSyncStatus: 'SYNCED' } });
  const crmFailed = await prisma.lead.count({ where: { crmSyncStatus: 'FAILED' } });
  const crmPending = await prisma.lead.count({ where: { crmSyncStatus: 'PENDING' } });

  const statusApproved = await prisma.lead.count({ where: { status: 'APPROVED' } });
  const statusScored = await prisma.lead.count({ where: { status: 'SCORED' } });
  const statusInReview = await prisma.lead.count({ where: { status: 'IN_REVIEW' } });
  const statusRejected = await prisma.lead.count({ where: { status: 'REJECTED' } });

  // Lead Source Groupings
  const sourcesGroup = await prisma.lead.groupBy({
    by: ['leadSource'],
    _count: { id: true },
  });

  const scoreAggregate = await prisma.lead.aggregate({
    _avg: { totalScore: true },
  });
  const avgScore = scoreAggregate._avg.totalScore ? Math.round(scoreAggregate._avg.totalScore) : 0;

  const qualifiedCount = hotLeads + warmLeads;
  const qualificationRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0;

  const recentLeads = await prisma.lead.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight">System Performance & Overview</h1>
          <p className="text-xs text-dark-muted mt-1">Real-time metrics calculated from database entities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/demo-controls"
            className="px-3.5 py-2 bg-dark-hover border border-dark-border text-dark-bright hover:border-brand-cyan text-xs font-medium rounded-lg transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-cyan" /> Demo Control Panel
          </Link>
          <Link
            href="/dashboard/review-queue"
            className="px-3.5 py-2 bg-gradient-to-r from-brand-cyan to-brand-purple text-white text-xs font-semibold rounded-lg shadow hover:opacity-90 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Review Queue ({reviewRequired})
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-dark-muted">Total Ingested Leads</span>
            <div className="p-2 bg-brand-cyan/10 text-brand-cyan rounded-lg border border-brand-cyan/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark-bright">{totalLeads}</div>
          <div className="text-[11px] text-dark-muted">Across all channels & webhooks</div>
        </div>

        {/* Hot Leads */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-dark-muted">Hot Qualified Leads</span>
            <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg border border-brand-emerald/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-brand-emerald">{hotLeads}</div>
          <div className="text-[11px] text-dark-muted">Score 80-100 &bull; Auto-contacted</div>
        </div>

        {/* Qualification Rate */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-dark-muted">Qualification Rate</span>
            <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg border border-brand-purple/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark-bright">{qualificationRate}%</div>
          <div className="text-[11px] text-dark-muted">{qualifiedCount} qualified of {totalLeads} total</div>
        </div>

        {/* Average Score */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-dark-muted">Average Qualification</span>
            <div className="p-2 bg-brand-amber/10 text-brand-amber rounded-lg border border-brand-amber/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark-bright">{avgScore} <span className="text-xs font-normal text-dark-muted">/100</span></div>
          <div className="text-[11px] text-dark-muted">5-Criteria aggregate score</div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Leads by Category */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h2 className="text-xs font-bold text-dark-bright flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-brand-cyan" /> Leads by Category
            </h2>
            <span className="text-[10px] text-dark-muted font-mono">{totalLeads} Total</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-brand-emerald">HOT (80-100)</span>
                <span className="font-mono text-dark-bright">{hotLeads} ({totalLeads > 0 ? Math.round((hotLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${totalLeads > 0 ? (hotLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-brand-amber">WARM (60-79)</span>
                <span className="font-mono text-dark-bright">{warmLeads} ({totalLeads > 0 ? Math.round((warmLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-brand-amber rounded-full" style={{ width: `${totalLeads > 0 ? (warmLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-dark-muted">COLD (0-59)</span>
                <span className="font-mono text-dark-bright">{coldLeads} ({totalLeads > 0 ? Math.round((coldLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-dark-muted rounded-full" style={{ width: `${totalLeads > 0 ? (coldLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-brand-coral">REVIEW_REQUIRED</span>
                <span className="font-mono text-dark-bright">{reviewRequired} ({totalLeads > 0 ? Math.round((reviewRequired/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-brand-coral rounded-full" style={{ width: `${totalLeads > 0 ? (reviewRequired/totalLeads)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Leads by Source */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h2 className="text-xs font-bold text-dark-bright flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-brand-purple" /> Leads by Source
            </h2>
            <span className="text-[10px] text-dark-muted font-mono">{sourcesGroup.length} Channels</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {sourcesGroup.map((src) => (
              <div key={src.leadSource}>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-dark-bright">{src.leadSource}</span>
                  <span className="font-mono text-brand-purple font-bold">{src._count.id}</span>
                </div>
                <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                  <div className="h-full bg-brand-purple rounded-full" style={{ width: `${totalLeads > 0 ? (src._count.id/totalLeads)*100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Integration Outcomes & States */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h2 className="text-xs font-bold text-dark-bright flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-emerald" /> CRM Sync & Processing States
            </h2>
            <span className="text-[10px] text-dark-muted font-mono">Real-time</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1.5">
              <span className="font-semibold text-dark-bright block">CRM Integration Outcomes</span>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-brand-emerald font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Synced: {crmSynced}</span>
                <span className="text-brand-coral font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed: {crmFailed}</span>
                <span className="text-dark-muted font-bold">Pending: {crmPending}</span>
              </div>
            </div>

            <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1.5">
              <span className="font-semibold text-dark-bright block">Processing States</span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div>Approved: <span className="font-bold text-brand-emerald">{statusApproved}</span></div>
                <div>Scored: <span className="font-bold text-brand-cyan">{statusScored}</span></div>
                <div>In Review: <span className="font-bold text-brand-amber">{statusInReview}</span></div>
                <div>Rejected: <span className="font-bold text-brand-coral">{statusRejected}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <h2 className="text-base font-bold text-dark-bright">Recent Lead Activity</h2>
          <Link href="/dashboard/leads" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
            View All Directory <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Contact & Company</th>
                <th className="p-3">Category</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">CRM Sync</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3">
                    <div className="font-semibold text-dark-bright">{lead.fullName}</div>
                    <div className="text-[11px] text-dark-muted">{lead.companyName} &bull; {lead.workEmail}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        lead.category === 'HOT'
                          ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                          : lead.category === 'WARM'
                          ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                          : lead.category === 'COLD'
                          ? 'bg-dark-bg text-dark-muted border-dark-border'
                          : 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
                      }`}
                    >
                      {lead.category || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-dark-bright">
                    {lead.totalScore !== null ? `${lead.totalScore}/100` : '-'}
                  </td>
                  <td className="p-3">
                    <span className="text-dark-muted font-mono">{lead.status}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[11px] font-medium ${
                        lead.crmSyncStatus === 'SYNCED'
                          ? 'text-brand-emerald'
                          : lead.crmSyncStatus === 'FAILED'
                          ? 'text-brand-coral font-bold'
                          : 'text-dark-muted'
                      }`}
                    >
                      {lead.crmSyncStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="px-2.5 py-1 bg-dark-hover border border-dark-border hover:border-brand-cyan text-dark-bright text-[11px] rounded transition"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
