import React from 'react';
import DemoControlsPanel from '@/components/DemoControlsPanel';
import { SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function DemoControlsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-cyan" /> Demo Control Panel & Test Scenarios
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Trigger deterministic test scenarios, prompt injection defense checks, CRM failure simulations, and database resets.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan rounded-lg text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> DEMO_MODE = true
        </div>
      </div>

      <DemoControlsPanel />
    </div>
  );
}
