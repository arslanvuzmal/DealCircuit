import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Building2, Flame, Zap, ShieldCheck, Mail, Radio, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      scores: true,
      followUps: true,
      approvals: { include: { user: true } },
      integrationEvents: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const latestScore = lead.scores[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/leads"
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lead Directory
        </Link>
        <span className="font-mono text-xs text-gray-500">Lead ID: {lead.id}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> {lead.fullName}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> {lead.companyName} &bull; {lead.workEmail}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                lead.category === 'HOT'
                  ? 'badge-hot'
                  : lead.category === 'WARM'
                  ? 'badge-warm'
                  : lead.category === 'COLD'
                  ? 'badge-cold'
                  : 'badge-review'
              }`}
            >
              <Flame className="w-4 h-4" /> {lead.category || 'UNQUALIFIED'} ({lead.totalScore || 0}/100)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2">
              Requirements & Budget Details
            </h3>
            <div className="space-y-2 text-gray-900">
              <div><span className="text-gray-500">Requested Service:</span> <span className="font-semibold">{lead.serviceRequired}</span></div>
              <div><span className="text-gray-500">Budget Fit:</span> <span className="font-semibold text-blue-600">{lead.budgetRange}</span></div>
              <div><span className="text-gray-500">Desired Timeline:</span> <span className="font-semibold">{lead.desiredTimeline}</span></div>
              <div><span className="text-gray-500">Decision Authority:</span> <span className="font-semibold">{lead.decisionAuthority}</span></div>
              <div className="pt-2"><span className="text-gray-500 block mb-1">Project Description:</span>
                <p className="bg-white p-3 rounded border border-gray-200 text-gray-900 leading-relaxed">{lead.projectDescription}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2">
              AI Qualification Score Breakdown
            </h3>
            {latestScore ? (
              <div className="space-y-2 text-gray-900">
                <div className="flex justify-between"><span>Budget Fit (25%):</span><span className="font-mono font-bold">{latestScore.budgetFitScore}/25</span></div>
                <div className="flex justify-between"><span>Service Fit (25%):</span><span className="font-mono font-bold">{latestScore.serviceFitScore}/25</span></div>
                <div className="flex justify-between"><span>Urgency & Timeline (20%):</span><span className="font-mono font-bold">{latestScore.urgencyScore}/20</span></div>
                <div className="flex justify-between"><span>Decision Authority (15%):</span><span className="font-mono font-bold">{latestScore.authorityScore}/15</span></div>
                <div className="flex justify-between"><span>Info Completeness (15%):</span><span className="font-mono font-bold">{latestScore.infoQualityScore}/15</span></div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">AI Recommendation:</span>
                  <p className="font-semibold text-purple-600">{latestScore.recommendedAction}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">No score breakdown available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}