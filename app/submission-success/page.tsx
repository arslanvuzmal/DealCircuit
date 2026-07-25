import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-brand-emerald/10 border border-brand-emerald/30 rounded-full flex items-center justify-center mx-auto text-brand-emerald">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-dark-bright tracking-tight">Lead Inquiry Submitted!</h1>
          <p className="text-xs text-dark-muted">
            Your project requirements have been ingested, normalized, and evaluated by LeadPilot AI.
          </p>
        </div>

        <div className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-dark-muted">Status:</span>
            <span className="font-bold text-brand-emerald">INGESTED & SCORED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-muted">Expected Response:</span>
            <span className="font-medium text-dark-bright">Within 2 Hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-muted">Mode:</span>
            <span className="font-mono text-brand-cyan">DEMO_MODE=true</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/submit"
            className="w-full py-2.5 bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 text-white font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
          >
            Submit Another Lead <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-2 bg-dark-hover border border-dark-border hover:border-brand-cyan text-dark-bright font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Open Admin Console
          </Link>
        </div>
      </div>
    </div>
  );
}
