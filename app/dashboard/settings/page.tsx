import React from 'react';
import { isDemoMode } from '@/lib/env';
import { Sliders, ShieldCheck, Lock, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-cyan" /> System Settings & Configuration
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Manage application parameters, security policies, and environment flags.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6 text-xs">
        <div className="space-y-4 border-b border-dark-border pb-6">
          <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-emerald" /> Operational Mode Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border space-y-1">
              <span className="text-dark-muted block">DEMO_MODE</span>
              <span className="font-mono text-brand-cyan font-bold text-sm">
                {isDemoMode ? 'true (Zero Paid API Required)' : 'false (Production Live)'}
              </span>
            </div>

            <div className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border space-y-1">
              <span className="text-dark-muted block">Session Auth Policy</span>
              <span className="font-mono text-dark-bright font-bold text-sm">
                JWT HTTP-Only Cookie (7 Days)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-purple" /> AI & Security Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border space-y-1">
              <span className="text-dark-muted block">Prompt Injection Defense</span>
              <span className="font-mono text-brand-emerald font-bold text-sm">
                ACTIVE (Automatic Review Routing)
              </span>
            </div>

            <div className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border space-y-1">
              <span className="text-dark-muted block">Duplicate Detection Engine</span>
              <span className="font-mono text-brand-emerald font-bold text-sm">
                ACTIVE (Multi-Factor Matching)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
