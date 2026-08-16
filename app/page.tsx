import React, { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Zap, ShieldCheck, GitBranch, RefreshCw, Brain, Database, Search, CheckCircle2, AlertTriangle, XCircle, Clock, Edit2, Eye, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/Logo';

const DecisionPipeline = dynamic(() => import('@/components/landing/DecisionPipeline').then(mod => mod.DecisionPipeline), { ssr: false, loading: () => <div className="text-center text-text-muted py-8">Loading pipeline...</div> });
const PipelineStepCard = dynamic(() => import('@/components/landing/PipelineStepCard').then(mod => mod.PipelineStepCard), { ssr: false });
const HumanControlPreview = dynamic(() => import('@/components/landing/HumanControlPreview').then(mod => mod.HumanControlPreview), { ssr: false });
const FailureRecoveryTrace = dynamic(() => import('@/components/landing/FailureRecoveryTrace').then(mod => mod.FailureRecoveryTrace), { ssr: false });
const DemoBoundariesTable = dynamic(() => import('@/components/landing/DemoBoundariesTable').then(mod => mod.DemoBoundariesTable), { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      <header className="topbar fixed left-0 right-0 top-0 z-[100] bg-surface-default/95 backdrop-blur-sm border-b border-border-subtle">
        <div className="flex items-center h-topbar-height px-4 sm:px-6 lg:px-8 max-w-[72rem] mx-auto">
          <Logo size="md" className="mr-8" />
          <nav className="flex-1 flex items-center justify-end gap-6">
            <Link href="/intelligence" className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">Intelligence Lab</Link>
            <Link href="/submit" className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">Public Form</Link>
            <span className="hidden sm:inline-flex">
              <Badge variant="info" size="xs">DEMO</Badge>
            </span>
            <Link href="/login">
              <Button size="sm" className="gap-1.5">Admin Dashboard <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-topbar-height">
        <section className="relative max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-cyan-dim rounded-full blur-[12rem] opacity-30" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-blue/10 rounded-full blur-[10rem] opacity-20" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-8 text-center lg:text-left">
              <Badge variant="info" size="sm" className="inline-flex items-center gap-2 mx-auto lg:mx-0">
                <Zap className="w-3.5 h-3.5" />
                <span>AI-Assisted Lead Qualification</span>
              </Badge>

              <h1 className="text-display text-text-primary tracking-tighter leading-tight max-w-xl mx-auto lg:mx-0">
                Turn Every Enquiry into a Clear Sales Action
              </h1>

              <p className="text-body-lg text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
                DealCircuit captures incoming enquiries, validates and qualifies them, routes uncertain cases for human review,
                updates your CRM, prepares follow-ups and tracks workflow failures from one operations workspace.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start pt-4">
                <Link href="/intelligence">
                  <Button size="lg" className="gap-2">
                    <Zap className="w-4 h-4" />
                    Try Lead Intelligence
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button variant="secondary" size="lg">
                    Use Classic Lead Form
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start pt-8 border-t border-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <div className="flex items-center gap-2 text-body-sm text-text-muted">
                  <ShieldCheck className="w-4 h-4 text-status-success" />
                  <span>Human-in-the-loop</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-muted">
                  <GitBranch className="w-4 h-4 text-status-info" />
                  <span>Full audit trail</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-muted">
                  <RefreshCw className="w-4 h-4 text-status-warning" />
                  <span>Auto-recovery</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Suspense fallback={<div className="text-center text-text-muted py-8">Loading pipeline...</div>}>
                <DecisionPipeline />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-y border-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="text-center space-y-4 mb-12">
            <Badge variant="neutral" size="sm" className="inline-flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </Badge>
            <h2 className="text-section-title text-text-primary">Decision Pipeline</h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Every lead flows through a deterministic pipeline. AI assists. People decide.
            </p>
          </div>

          <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-5 gap-4"><div className="p-4 border border-border-subtle rounded-lg animate-pulse" /><div className="p-4 border border-border-subtle rounded-lg animate-pulse" /><div className="p-4 border border-border-subtle rounded-lg animate-pulse" /><div className="p-4 border border-border-subtle rounded-lg animate-pulse" /><div className="p-4 border border-border-subtle rounded-lg animate-pulse" /></div>}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <PipelineStepCard step={1} label="Capture" icon={<Database className="w-5 h-5" />} desc="Web form, webhook, or API ingest" color="brand-blue" detail="Validates schema, sanitizes input, generates idempotency key" />
              <PipelineStepCard step={2} label="Deduplicate" icon={<Search className="w-5 h-5" />} desc="Fuzzy match on email, domain, company" color="brand-cyan" detail="Confidence score. Auto-merge or route to review queue" />
              <PipelineStepCard step={3} label="Qualify" icon={<Brain className="w-5 h-5" />} desc="AI scoring + scenario evaluation" color="brand-cyan" detail="Industry, size, complexity, systems, budget signals" />
              <PipelineStepCard step={4} label="Route" icon={<GitBranch className="w-5 h-5" />} desc="Auto-approve or human review" color="amber" detail="Low confidence to Review Queue. High confidence to CRM" />
              <PipelineStepCard step={5} label="Execute" icon={<CheckCircle2 className="w-5 h-5" />} desc="CRM write, follow-up, notify, log" color="emerald" detail="Idempotent writes. Retry on failure. Full audit entry" isLast />
            </div>
          </Suspense>
        </section>


        <Suspense fallback={<section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-secondary/50" style={{ backgroundColor: 'var(--color-background-secondary)' }}><div className="grid lg:grid-cols-2 gap-6"><div className="p-6 border border-border-subtle rounded-lg animate-pulse" /><div className="p-6 border border-border-subtle rounded-lg animate-pulse" /></div></section>}>
          <HumanControlPreview />
        </Suspense>

        <Suspense fallback={<section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"><div className="p-6 border border-border-subtle rounded-lg animate-pulse" /></section>}>
          <FailureRecoveryTrace />
        </Suspense>

        <Suspense fallback={<section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-secondary/50" style={{ backgroundColor: 'var(--color-background-secondary)' }}><div className="p-6 border border-border-subtle rounded-lg animate-pulse" /></section>}>
          <DemoBoundariesTable />
        </Suspense>

        <section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-section-title text-text-primary">Ready to automate your lead operations?</h2>
            <p className="text-body-lg text-text-secondary">
              Try the Intelligence Lab with your own data, or deploy DealCircuit in your infrastructure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/intelligence">
                <Button size="lg" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Try Lead Intelligence
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="secondary" size="lg">
                  Use Classic Lead Form
                </Button>
              </Link>
              <a href="https://github.com/arslanvuzmal/lead-pilot-ai" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg gap-2">
                <ExternalLink className="w-4 h-4" />
                View Source on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 text-center text-caption text-text-muted">
          DealCircuit \u00b7 Lead Intelligence & Revenue Operations
          <span className="mx-2">\u00b7</span> <Badge variant="info" size="xs">Demo Mode Enabled</Badge>
        </div>
      </footer>
    </div>
  );
}