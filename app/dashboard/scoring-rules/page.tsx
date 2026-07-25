import React from 'react';
import { prisma } from '@/lib/db';
import ScoringRulesEditor from '@/components/ScoringRulesEditor';
import { Sliders, ShieldCheck } from 'lucide-react';

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
            <Sliders className="w-5 h-5 text-brand-cyan" /> Scoring Rules & Criteria Thresholds
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Configure individual criterion weights, point maximums, and category threshold rules stored in the database.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan rounded-lg text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Total Points Scale: 100
        </div>
      </div>

      <ScoringRulesEditor rules={rules} />
    </div>
  );
}
