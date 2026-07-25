import React from 'react';
import { prisma } from '@/lib/db';
import ReviewItemAction from '@/components/ReviewItemAction';
import { CheckSquare, AlertTriangle, ShieldAlert, Copy, Bot } from 'lucide-react';

export const revalidate = 0;

export default async function ReviewQueuePage() {
  const reviewLeads = await prisma.lead.findMany({
    where: {
      OR: [
        { category: 'REVIEW_REQUIRED' },
        { status: 'IN_REVIEW' },
        { isDuplicate: true },
      ],
    },
    include: {
      scores: { orderBy: { createdAt: 'desc' }, take: 1 },
      followUps: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-coral" /> Human-in-the-Loop Review Queue
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Audit edge cases, low-confidence scores, duplicate matches, and prompt injection attempts before CRM synchronisation.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-lg text-xs font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> {reviewLeads.length} Items Pending Review
        </div>
      </div>

      {reviewLeads.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center text-dark-muted space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-dark-bright">Review Queue is Clear!</h3>
          <p className="text-xs max-w-md mx-auto">
            All leads have been automatically qualified and dispatched, or manually reviewed by your team.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviewLeads.map((lead) => {
            const score = lead.scores[0];
            const risks: string[] = score?.risksJson ? JSON.parse(score.risksJson) : [];
            const missing: string[] = score?.missingInfoJson ? JSON.parse(score.missingInfoJson) : [];

            return (
              <div key={lead.id} className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-dark-bright">{lead.fullName}</span>
                      <span className="text-xs text-dark-muted">({lead.companyName})</span>
                      {lead.isDuplicate && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-amber/20 text-brand-amber border border-brand-amber/30 flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Duplicate Match
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-dark-muted">{lead.workEmail} &bull; {lead.industry} &bull; Submitted {new Date(lead.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-dark-muted block">PRELIMINARY SCORE</span>
                    <span className="text-xl font-bold text-brand-coral">{lead.totalScore ?? '-'}/100</span>
                  </div>
                </div>

                {/* Requirements & Scan Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
                    <span className="font-semibold text-dark-bright block">Project Description:</span>
                    <p className="text-dark-text leading-relaxed whitespace-pre-line">{lead.projectDescription}</p>
                  </div>

                  <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-2">
                    <span className="font-semibold text-dark-bright block flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-brand-amber" /> Flags & Risks
                    </span>
                    {risks.length > 0 && (
                      <ul className="list-disc list-inside text-brand-coral space-y-0.5">
                        {risks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                    {missing.length > 0 && (
                      <div className="text-dark-muted">
                        Missing Info: <span className="text-dark-bright font-medium">{missing.join(', ')}</span>
                      </div>
                    )}
                    {score && (
                      <div className="text-[11px] text-dark-muted border-t border-dark-border pt-1.5 mt-1">
                        AI Rationale: {score.summary}
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Action Form Component */}
                <ReviewItemAction lead={lead} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
