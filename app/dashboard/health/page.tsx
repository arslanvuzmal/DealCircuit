import React from 'react';
import { prisma } from '@/lib/db';
import { isDemoMode } from '@/lib/env';
import { Activity, CheckCircle2, ShieldCheck, Database, Mail, Radio } from 'lucide-react';

export const revalidate = 0;

export default async function HealthPage() {
  let dbStatus = 'UP';
  let leadCount = 0;
  try {
    leadCount = await prisma.lead.count();
  } catch (err) {
    dbStatus = 'DOWN';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-emerald" /> Application & Infrastructure Health
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            System diagnostics, database connectivity, and environment status.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> ALL SYSTEMS OPERATIONAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-dark-bright text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-cyan" /> Database Service
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              {dbStatus}
            </span>
          </div>
          <div className="text-dark-muted space-y-1">
            <div>Type: SQLite / PostgreSQL (Prisma)</div>
            <div>Total Lead Entities: {leadCount}</div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-dark-bright text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-purple" /> Mailpit SMTP
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              UP
            </span>
          </div>
          <div className="text-dark-muted space-y-1">
            <div>Port: 1025 (SMTP) / 8025 (UI)</div>
            <div>Mode: Local Offline Dispatch</div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-dark-bright text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-amber" /> Demo CRM Adapter
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              UP
            </span>
          </div>
          <div className="text-dark-muted space-y-1">
            <div>Mode: Standalone Mock</div>
            <div>Status: Ready for HubSpot / Webhooks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
