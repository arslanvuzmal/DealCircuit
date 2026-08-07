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

  const avgScore = scoreAggregate._avg.totalScore ? Math.round(scoreAggregate._avg.totalScore) : 0;
  const qualifiedCount = hotLeads + warmLeads;
  const qualificationRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">System Performance & Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time metrics calculated from database entities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/demo-controls"
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 hover:border-blue-600 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Demo Control Panel
          </Link>
          <Link
            href="/dashboard/review"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow hover:opacity-90 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Review Queue ({reviewRequired})
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Ingested Leads</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{totalLeads}</div>
          <div className="text-[11px] text-gray-500">Across all channels & webhooks</div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Hot Qualified Leads</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-green-600">{hotLeads}</div>
          <div className="text-[11px] text-gray-500">Score 80-100 &bull; Auto-contacted</div>
        </div>

        {/* Qualification Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Qualification Rate</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{qualificationRate}%</div>
          <div className="text-[11px] text-gray-500">{qualifiedCount} qualified of {totalLeads} total</div>
        </div>

        {/* Average Score */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Average Qualification</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{avgScore} <span className="text-xs font-normal text-gray-500">/100</span></div>
          <div className="text-[11px] text-gray-500">5-Criteria aggregate score</div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Leads by Category */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 card-hover">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" /> Leads by Category
            </h2>
            <span className="text-[10px] text-gray-500 font-mono">{totalLeads} Total</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-green-600">HOT (80-100)</span>
                <span className="font-mono text-gray-900">{hotLeads} ({totalLeads > 0 ? Math.round((hotLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-green-600 rounded-full" style={{ width: `${totalLeads > 0 ? (hotLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-amber-600">WARM (60-79)</span>
                <span className="font-mono text-gray-900">{warmLeads} ({totalLeads > 0 ? Math.round((warmLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: `${totalLeads > 0 ? (warmLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-500">COLD (0-59)</span>
                <span className="font-mono text-gray-900">{coldLeads} ({totalLeads > 0 ? Math.round((coldLeads/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-gray-400 rounded-full" style={{ width: `${totalLeads > 0 ? (coldLeads/totalLeads)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-red-600">REVIEW_REQUIRED</span>
                <span className="font-mono text-gray-900">{reviewRequired} ({totalLeads > 0 ? Math.round((reviewRequired/totalLeads)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${totalLeads > 0 ? (reviewRequired/totalLeads)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Leads by Source */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 card-hover">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-600" /> Leads by Source
            </h2>
            <span className="text-[10px] text-gray-500 font-mono">{sourcesGroup.length} Channels</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {sourcesGroup.map((src) => (
              <div key={src.leadSource}>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-gray-900">{src.leadSource}</span>
                  <span className="font-mono text-purple-600 font-bold">{src._count.id}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${totalLeads > 0 ? (src._count.id/totalLeads)*100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Integration Outcomes & States */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 card-hover">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-green-600" /> CRM Sync & Processing States
            </h2>
            <span className="text-[10px] text-gray-500 font-mono">Real-time</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
              <span className="font-semibold text-gray-900 block">CRM Integration Outcomes</span>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Synced: {crmSynced}</span>
                <span className="text-red-600 font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed: {crmFailed}</span>
                <span className="text-gray-500 font-bold">Pending: {crmPending}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
              <span className="font-semibold text-gray-900 block">Processing States</span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div>Approved: <span className="font-bold text-green-600">{statusApproved}</span></div>
                <div>Scored: <span className="font-bold text-blue-600">{statusScored}</span></div>
                <div>In Review: <span className="font-bold text-amber-600">{statusInReview}</span></div>
                <div>Rejected: <span className="font-bold text-red-600">{statusRejected}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-base font-bold text-gray-900">Recent Lead Activity</h2>
          <Link href="/dashboard/leads" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            View All Directory <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-900 table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Contact & Company</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Score</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">CRM Sync</th>
                <th className="table-cell text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="table-row-hover">
                  <td className="table-cell">
                    <div className="font-semibold text-gray-900">{lead.fullName}</div>
                    <div className="text-[11px] text-gray-500">{lead.companyName} &bull; {lead.workEmail}</div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        lead.category === 'HOT'
                          ? 'badge-hot'
                          : lead.category === 'WARM'
                          ? 'badge-warm'
                          : lead.category === 'COLD'
                          ? 'badge-cold'
                          : 'badge-review'
                      }`}
                    >
                      {lead.category || 'PENDING'}
                    </span>
                  </td>
                  <td className="table-cell font-mono font-bold text-gray-900">
                    {lead.totalScore !== null ? `${lead.totalScore}/100` : '-'}
                  </td>
                  <td className="table-cell">
                    <span className="text-gray-500 font-mono">{lead.status}</span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`text-[11px] font-medium ${
                        lead.crmSyncStatus === 'SYNCED'
                          ? 'text-green-600'
                          : lead.crmSyncStatus === 'FAILED'
                          ? 'text-red-600 font-bold'
                          : lead.crmSyncStatus === 'FAILED_PERMANENT'
                          ? 'text-red-600 font-bold'
                          : 'text-gray-500'
                      }`}
                    >
                      {lead.crmSyncStatus}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-blue-600 text-gray-700 text-[11px] rounded transition"
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