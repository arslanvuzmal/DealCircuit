import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Bot, Database, Workflow, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 animate-fade-in" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      <div className="max-w-5xl mx-auto w-full space-y-16 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-heading-lg text-text-primary tracking-tight">LeadPilot AI</h1>
              <p className="text-caption text-text-muted">AI Lead Operations & n8n Automation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/submit" className="btn-ghost btn-sm text-text-secondary hover:text-text-primary">
              Public Lead Form
            </Link>
            <Link href="/login" className="btn-primary btn-sm">
              Admin Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <Badge variant="info" size="sm" className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI-Assisted Lead Qualification
          </Badge>
          <h2 className="text-display text-text-primary tracking-tighter leading-tight">
            Turn Every Enquiry into a Clear Sales Action
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            LeadPilot captures incoming enquiries, validates and qualifies them, routes uncertain cases for human review,
            updates your CRM, prepares follow-ups and tracks workflow failures from one operations workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/intelligence">
              <Button size="lg" className="gap-2">
                <Zap className="w-4 h-4" /> Try Lead Intelligence <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="secondary" size="lg">
                Use Classic Lead Form
              </Button>
            </Link>
          </div>
        </div>

        {/* Problem Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-section-title text-text-primary">The Problem</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">Capturing a lead is easy. Processing it is where teams lose time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📋', title: 'Manual Review', desc: 'Every lead read by hand' },
              { icon: '🔍', title: 'Duplicate Checking', desc: 'Same lead enters twice' },
              { icon: '📊', title: 'Inconsistent Scoring', desc: 'No standard criteria' },
              { icon: '⏱️', title: 'Delayed Response', desc: 'Hours before follow-up' },
              { icon: '🔗', title: 'Manual CRM Entry', desc: 'Copy-paste errors' },
              { icon: '🤝', title: 'Forgotten Handoffs', desc: 'Sales never notified' },
              { icon: '🔧', title: 'Failed Automations', desc: 'Silent workflow stops' },
              { icon: '📝', title: 'No Audit Trail', desc: 'What happened when?' },
            ].map((item, i) => (
              <Card key={i} variant="hover" className="p-6 space-y-3 text-center">
                <div className="text-3xl mx-auto">{item.icon}</div>
                <h4 className="font-semibold text-text-primary">{item.title}</h4>
                <p className="text-body-sm text-text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-section-title text-text-primary">The Solution</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">End-to-end lead operations with human control at every decision point.</p>
          </div>
          <Card variant="padded" className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-body-sm font-medium">
              <Badge variant="info" className="gap-1.5">Capture <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="info" className="gap-1.5">Validate <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="info" className="gap-1.5">Deduplicate <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="info" className="gap-1.5">Qualify <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="warning" className="gap-1.5">Review <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="success" className="gap-1.5">CRM <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="success" className="gap-1.5">Follow-up <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="success" className="gap-1.5">Notify <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="neutral" className="gap-1.5" style={{ backgroundColor: 'var(--color-brand-cyan-dim)', color: 'var(--color-brand-cyan-light)' }}>Audit</Badge>
            </div>
          </Card>
        </section>

        {/* Before/After */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-section-title text-text-primary">Before vs After</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="padded" className="space-y-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-status-error">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-status-error)' }} />
                  Before LeadPilot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-body-sm font-mono text-text-secondary">
                <div>Lead Form → Inbox</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>Spreadsheet</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>Salesperson</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>CRM (manual)</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>Manual Email</div>
              </CardContent>
            </Card>
            <Card variant="padded" className="space-y-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-status-success">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-status-success)' }} />
                  After LeadPilot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-body-sm font-mono text-text-secondary">
                <div>Lead Source</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>LeadPilot AI</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>n8n Workflows</div>
                <ArrowRight className="mx-auto text-text-muted" />
                <div>CRM + Follow-up + Team</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* n8n Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-section-title text-text-primary">What n8n Automates</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">Four production workflows handle the operational heavy lifting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Lead Intake', desc: 'Webhook → Qualify → CRM → Log', icon: Workflow, color: 'cyan' },
              { title: 'Daily Digest', desc: 'Cron → Rank → Summarize → Email', icon: Database, color: 'blue' },
              { title: 'Failed Event Retry', desc: 'Cron → Retry → Recover → Alert', icon: Zap, color: 'amber' },
              { title: 'Review Completion', desc: 'Webhook → CRM → Follow-up → Log', icon: ShieldCheck, color: 'emerald' },
            ].map((item, i) => (
              <Card key={i} variant="hover" className="p-6 space-y-3 text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto`} style={{
                  backgroundColor: `var(--color-brand-${item.color}-dim)`,
                  color: `var(--color-brand-${item.color}-light)`
                }}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-text-primary">{item.title}</h4>
                <p className="text-body-sm text-text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Human Control */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-section-title text-text-primary">Human Control</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">AI supports qualification. People remain in control of uncertain or sensitive actions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Review Queue', desc: 'Low confidence, duplicates, prompt injection attempts routed for human review' },
              { title: 'Edit & Approve', desc: 'Reviewers adjust scores, edit follow-ups, change categories before dispatch' },
              { title: 'Audit Trail', desc: 'Every decision logged with reviewer, timestamp, and reasoning' },
            ].map((item, i) => (
              <Card key={i} variant="hover" className="p-6 space-y-3">
                <h4 className="font-semibold text-text-primary">{item.title}</h4>
                <p className="text-body-sm text-text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Failure Recovery */}
        <section className="space-y-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-section-title text-text-primary">Failure Recovery</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">A mature automation does not silently stop when an API fails.</p>
          </div>
          <Card variant="padded" className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-body-sm font-medium">
              <Badge variant="error" className="gap-1.5">Failure <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="warning" className="gap-1.5">Retry <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="info" className="gap-1.5">Recovery <ArrowRight className="w-3 h-3" /></Badge>
              <Badge variant="neutral" className="gap-1.5" style={{ backgroundColor: 'var(--color-brand-cyan-dim)', color: 'var(--color-brand-cyan-light)' }}>Audit</Badge>
            </div>
            <p className="text-body-sm text-text-muted text-center">Exponential backoff, retryable vs permanent classification, bounded attempts, full audit trail</p>
          </Card>
        </section>

        {/* Final CTA */}
        <div className="text-center space-y-4 pt-8 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h3 className="text-heading-lg text-text-primary">Ready to automate your lead operations?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/intelligence">
              <Button size="lg" className="gap-2">
                <Zap className="w-4 h-4" /> Try Lead Intelligence
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="secondary" size="lg">
                Use Classic Lead Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full pt-6 text-center text-caption" style={{ borderTopColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)' }}>
        LeadPilot AI · AI Lead Operations & n8n Automation · Demo Mode Enabled
      </footer>
    </div>
  );
}