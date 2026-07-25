import React from 'react';
import PublicLeadForm from '@/components/PublicLeadForm';
import Link from 'next/link';
import { ShieldCheck, Lock, Sparkles, LayoutDashboard } from 'lucide-react';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white shadow-lg">
              LP
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-bright tracking-tight">LeadPilot AI</h1>
              <p className="text-xs text-dark-muted">Enterprise Lead Qualification & Automation</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-brand-cyan hover:text-white px-3 py-1.5 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 transition font-medium"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin Console
          </Link>
        </div>

        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen B2B Lead Intake
          </div>
          <h2 className="text-3xl font-extrabold text-dark-bright sm:text-4xl tracking-tight">
            Accelerate Lead Qualification with AI
          </h2>
          <p className="text-sm text-dark-muted">
            Instant 5-criteria qualification, prompt-injection defense, duplicate detection, and automated CRM synchronisation.
          </p>
        </div>

        <PublicLeadForm />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-dark-muted border-t border-dark-border pt-8">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-emerald" /> 100% Deterministic & AI Qualification</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-brand-cyan" /> Secure Prompt Isolation Defense</span>
          <span>Mailpit & Demo CRM Enabled</span>
        </div>
      </div>
    </div>
  );
}
