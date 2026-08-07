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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Lead Directory & Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete database directory of ingested, qualified, and synchronized leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-600" /> {leads.length} Records
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-900 table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Contact Details</th>
                <th className="table-cell">Company & Industry</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Score</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">CRM Sync</th>
                <th className="table-cell text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="table-row-hover">
                  <td className="table-cell">
                    <div className="font-semibold text-gray-900">{lead.fullName}</div>
                    <div className="text-[11px] text-gray-500">{lead.workEmail}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-semibold text-gray-900">{lead.companyName}</div>
                    <div className="text-[11px] text-gray-500">{lead.industry}</div>
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