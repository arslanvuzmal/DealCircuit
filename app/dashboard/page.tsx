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
} from 'lucide-react';

export const revalidate = 0;

export default async function OverviewDashboard() {
  const totalLeads = await prisma.lead.count();
  const hotLeads = await prisma.lead.count({ where: { category: 'HOT' } });
  const warmLeads = await prisma.lead.count({ where: { category: 'WARM' } });
  const coldLeads = await prisma.lead.count({ where: { category: 'COLD' } });
  const reviewRequired = await prisma.lead.count({ where: { category: 'REVIEW_REQUIRED' } });
  const crmSynced = await prisma.lead.count({ where: { crmSyncStatus: 'SYNCED' } });
  const crmFailed = await prisma.lead.count({ where: { crmSyncStatus: 'FAILED' } });

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

      {/* Secondary Status Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-dark-muted">Warm Leads</div>
            <div className="text-lg font-bold text-brand-amber">{warmLeads}</div>
          </div>
          <Zap className="w-5 h-5 text-brand-amber/60" />
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-dark-muted">Cold Leads</div>
            <div className="text-lg font-bold text-dark-muted">{coldLeads}</div>
          </div>
          <Snowflake className="w-5 h-5 text-dark-muted/60" />
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-dark-muted">Review Required</div>
            <div className="text-lg font-bold text-brand-coral">{reviewRequired}</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-brand-coral/60" />
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-dark-muted">CRM Sync State</div>
            <div className="text-xs font-semibold text-dark-bright flex items-center gap-1.5 mt-0.5">
              <span className="text-brand-emerald font-bold">{crmSynced} Synced</span>
              {crmFailed > 0 && <span className="text-brand-coral font-bold">&bull; {crmFailed} Failed</span>}
            </div>
          </div>
          {crmFailed > 0 ? (
            <XCircle className="w-5 h-5 text-brand-coral" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
          )}
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
