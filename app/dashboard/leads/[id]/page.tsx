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
          className="text-xs text-dark-muted hover:text-dark-bright flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lead Directory
        </Link>
        <span className="font-mono text-xs text-dark-muted">Lead ID: {lead.id}</span>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-brand-cyan" /> {lead.fullName}
            </h1>
            <p className="text-xs text-dark-muted flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> {lead.companyName} &bull; {lead.workEmail}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                lead.category === 'HOT'
                  ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                  : lead.category === 'WARM'
                  ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                  : lead.category === 'COLD'
                  ? 'bg-dark-bg text-dark-muted border-dark-border'
                  : 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
              }`}
            >
              <Flame className="w-4 h-4" /> {lead.category || 'UNQUALIFIED'} ({lead.totalScore || 0}/100)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4 bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-bold text-dark-bright text-sm border-b border-dark-border pb-2">
              Requirements & Budget Details
            </h3>
            <div className="space-y-2 text-dark-text">
              <div><span className="text-dark-muted">Requested Service:</span> <span className="font-semibold">{lead.serviceRequired}</span></div>
              <div><span className="text-dark-muted">Budget Fit:</span> <span className="font-semibold text-brand-cyan">{lead.budgetRange}</span></div>
              <div><span className="text-dark-muted">Desired Timeline:</span> <span className="font-semibold">{lead.desiredTimeline}</span></div>
              <div><span className="text-dark-muted">Decision Authority:</span> <span className="font-semibold">{lead.decisionAuthority}</span></div>
              <div className="pt-2"><span className="text-dark-muted block mb-1">Project Description:</span>
                <p className="bg-dark-card p-3 rounded border border-dark-border text-dark-bright leading-relaxed">{lead.projectDescription}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-dark-bg/60 p-5 rounded-xl border border-dark-border">
            <h3 className="font-bold text-dark-bright text-sm border-b border-dark-border pb-2">
              AI Qualification Score Breakdown
            </h3>
            {latestScore ? (
              <div className="space-y-2 text-dark-text">
                <div className="flex justify-between"><span>Budget Fit (25%):</span><span className="font-mono font-bold">{latestScore.budgetFitScore}/25</span></div>
                <div className="flex justify-between"><span>Service Fit (25%):</span><span className="font-mono font-bold">{latestScore.serviceFitScore}/25</span></div>
                <div className="flex justify-between"><span>Urgency & Timeline (20%):</span><span className="font-mono font-bold">{latestScore.urgencyScore}/20</span></div>
                <div className="flex justify-between"><span>Decision Authority (15%):</span><span className="font-mono font-bold">{latestScore.authorityScore}/15</span></div>
                <div className="flex justify-between"><span>Info Completeness (15%):</span><span className="font-mono font-bold">{latestScore.infoQualityScore}/15</span></div>
                <div className="pt-2 border-t border-dark-border">
                  <span className="text-dark-muted block mb-1">AI Recommendation:</span>
                  <p className="font-semibold text-brand-purple">{latestScore.recommendedAction}</p>
                </div>
              </div>
            ) : (
              <div className="text-dark-muted italic">No score breakdown available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
