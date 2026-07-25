import React from 'react';
import { prisma } from '@/lib/db';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import ReviewItemAction from '@/components/ReviewItemAction';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReviewQueuePage() {
  const leadsInReview = await prisma.lead.findMany({
    where: {
      OR: [
        { category: 'REVIEW_REQUIRED' },
        { status: 'IN_REVIEW' },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: { scores: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-coral" /> Human Review Queue
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Evaluate flagged leads, prompt injection attempts, and edge-case lead qualifications.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        {leadsInReview.length === 0 ? (
          <div className="text-center p-8 space-y-3">
            <div className="w-12 h-12 bg-brand-emerald/10 border border-brand-emerald/30 rounded-full flex items-center justify-center mx-auto text-brand-emerald">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-dark-bright font-bold text-sm">Review Queue Empty</div>
            <p className="text-xs text-dark-muted">All incoming leads have been automatically scored and assigned.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leadsInReview.map((lead) => {
              const score = lead.scores[0];
              return (
                <div
                  key={lead.id}
                  className="bg-dark-bg/60 border border-dark-border rounded-xl p-5 space-y-4 text-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-dark-border pb-3">
                    <div>
                      <div className="font-bold text-dark-bright text-sm flex items-center gap-2">
                        {lead.fullName} <span className="text-dark-muted text-xs">&bull; {lead.companyName}</span>
                      </div>
                      <div className="text-[11px] text-dark-muted">{lead.workEmail}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-brand-coral/10 text-brand-coral border border-brand-coral/30 rounded text-[11px] font-bold">
                        REVIEW_REQUIRED
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-dark-muted block">Project Description / Input:</span>
                      <p className="bg-dark-card p-3 rounded border border-dark-border text-dark-bright font-mono text-[11px]">
                        {lead.projectDescription}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-dark-muted block">AI Flag Details & Score:</span>
                      <div className="bg-dark-card p-3 rounded border border-dark-border text-dark-text space-y-1">
                        <div>Score: <span className="font-bold text-dark-bright">{lead.totalScore || 0}/100</span></div>
                        <div>Reason: <span className="text-brand-coral font-medium">{score?.summary || 'Edge case flagged for human verification'}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dark-border">
                    <ReviewItemAction lead={lead} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
