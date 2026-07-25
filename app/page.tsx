import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Database, Workflow, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col justify-between p-6 sm:p-12">
      <div className="max-w-5xl mx-auto w-full space-y-16 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white text-lg shadow-lg">
              LP
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-bright tracking-tight">LeadPilot AI</h1>
              <p className="text-xs text-dark-muted">Intelligent Lead Qualification & CRM Orchestration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              className="text-xs font-medium text-dark-bright hover:text-brand-cyan transition px-3 py-2"
            >
              Public Lead Form
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-white bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 px-4 py-2 rounded-lg transition shadow"
            >
              Admin Dashboard
            </Link>
          </div>
        </header>

        {/* Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Autonomous Lead Qualification Engine (V1)
          </div>
          <h2 className="text-4xl font-extrabold text-dark-bright sm:text-5xl tracking-tight leading-tight">
            Qualify Leads Instantly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">AI Precision & Human Control</span>
          </h2>
          <p className="text-base text-dark-muted leading-relaxed">
            LeadPilot AI evaluates inbound leads across 5 editable criteria, prevents prompt injections, handles duplicate detection, drafts personalized follow-ups, and triggers n8n CRM synchronisation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold rounded-lg text-sm transition flex items-center gap-2 shadow-xl hover:opacity-90"
            >
              <Zap className="w-4 h-4" /> Try Public Lead Form <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-dark-card border border-dark-border hover:bg-dark-hover text-dark-bright font-medium rounded-lg text-sm transition flex items-center gap-2"
            >
              Open Admin Console
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-bright">5-Criteria AI Scoring</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              Budget, Service Fit, Urgency, Authority, and Info Quality scored out of 100 points with transparent explanations.
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-bright">AI Safety & Defense</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              Sanitizes lead text, defends against prompt injections, and automatically routes edge cases to human review.
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-bright">n8n Automation</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              4 production-grade n8n workflows for intake, daily digests, failed event retries, and review completion.
            </p>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full border-t border-dark-border pt-6 text-center text-xs text-dark-muted">
        LeadPilot AI V1 &bull; Enterprise Lead Qualification & Automation Platform &bull; Demo Mode Enabled
      </footer>
    </div>
  );
}
