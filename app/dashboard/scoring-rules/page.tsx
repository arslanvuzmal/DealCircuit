import React from 'react';
import { prisma } from '@/lib/db';
import { Sliders, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ScoringRulesPage() {
  const rules = await prisma.scoringRule.findMany({
    orderBy: { criterionKey: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-amber" /> Lead Scoring Configuration Rules
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Active 5-criteria qualification weights, max score caps, and tier thresholds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <span className="font-bold text-dark-bright text-sm">{rule.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                Max {rule.maxScore} pts ({rule.weight * 100}%)
              </span>
            </div>

            <div className="space-y-1 text-dark-muted">
              <div>Criterion Key: <span className="font-mono text-dark-bright">{rule.criterionKey}</span></div>
              <div>Updated By: <span className="text-dark-bright">{rule.updatedBy}</span></div>
            </div>

            <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border text-[11px] font-mono text-dark-text overflow-x-auto">
              <pre>{JSON.stringify(JSON.parse(rule.configJson), null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
