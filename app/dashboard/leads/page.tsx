import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Users, Filter, Search, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadsDirectoryPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-cyan" /> Lead Directory & Management
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Complete database directory of ingested, qualified, and synchronized leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-xs font-mono text-dark-bright flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-brand-purple" /> {leads.length} Records
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Contact Details</th>
                <th className="p-3">Company & Industry</th>
                <th className="p-3">Category</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">CRM Sync</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3">
                    <div className="font-semibold text-dark-bright">{lead.fullName}</div>
                    <div className="text-[11px] text-dark-muted">{lead.workEmail}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-dark-bright">{lead.companyName}</div>
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
