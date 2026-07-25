import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Search, Filter, ArrowUpRight, Users } from 'lucide-react';

export const revalidate = 0;

export default async function LeadsDirectoryPage({
  searchParams,
}: {
  searchParams?: { category?: string; status?: string; search?: string };
}) {
  const categoryFilter = searchParams?.category || 'ALL';
  const statusFilter = searchParams?.status || 'ALL';
  const searchQuery = searchParams?.search || '';

  const where: any = {};
  if (categoryFilter !== 'ALL') where.category = categoryFilter;
  if (statusFilter !== 'ALL') where.status = statusFilter;
  if (searchQuery) {
    where.OR = [
      { fullName: { contains: searchQuery } },
      { workEmail: { contains: searchQuery } },
      { companyName: { contains: searchQuery } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-cyan" /> Lead Directory
          </h1>
          <p className="text-xs text-dark-muted mt-1">Browse, filter, and inspect all captured and qualified leads.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <form method="GET" className="bg-dark-card border border-dark-border p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-dark-muted absolute left-3 top-2.5" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search by name, email, or company..."
            className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-dark-muted" />
          <select
            name="category"
            defaultValue={categoryFilter}
            className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-xs text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option value="ALL">All Categories</option>
            <option value="HOT">HOT</option>
            <option value="WARM">WARM</option>
            <option value="COLD">COLD</option>
            <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
          </select>

          <select
            name="status"
            defaultValue={statusFilter}
            className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-xs text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="SCORED">SCORED</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 bg-dark-hover hover:bg-dark-border border border-dark-border text-dark-bright text-xs font-medium rounded-lg transition"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Directory Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Contact Name</th>
                <th className="p-3">Company & Industry</th>
                <th className="p-3">Category</th>
                <th className="p-3">Score</th>
                <th className="p-3">Budget</th>
                <th className="p-3">CRM Sync</th>
                <th className="p-3">Submitted</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-dark-muted">
                    No leads found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-dark-hover/50 transition">
                    <td className="p-3">
                      <div className="font-semibold text-dark-bright">{lead.fullName}</div>
                      <div className="text-[11px] text-dark-muted">{lead.workEmail}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-dark-bright">{lead.companyName}</div>
                      <div className="text-[11px] text-dark-muted">{lead.industry}</div>
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
                    <td className="p-3 text-dark-muted">{lead.budgetRange}</td>
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
                    <td className="p-3 text-dark-muted text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="px-2.5 py-1 bg-dark-hover border border-dark-border hover:border-brand-cyan text-dark-bright text-[11px] rounded transition flex items-center gap-1 inline-flex"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
