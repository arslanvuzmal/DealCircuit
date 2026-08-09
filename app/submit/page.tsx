import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Sparkles, LayoutDashboard, ArrowRight, Zap, Search, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/Logo';

export default function SubmitPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 animate-fade-in" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="text-heading-lg text-text-primary tracking-tight">LeadPilot AI</h1>
              <p className="text-caption text-text-muted">Lead Intelligence & Revenue Operations</p>
            </div>
          </div>
          <Link href="/login" className="btn-ghost btn-sm">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> Admin Console
          </Link>
        </div>

        <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
          <Badge variant="info" size="sm" className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Lead Intelligence Lab
          </Badge>
          <h2 className="text-display text-text-primary tracking-tight leading-tight">
            Turn Every Enquiry into Actionable Sales Intelligence
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            LeadPilot doesn&apos;t just score leads—it diagnoses business problems, extracts buying signals,
            identifies risks, and recommends the exact next sales action with full audit traceability.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/intelligence">
            <Button size="lg" className="w-full gap-3" style={{ background: 'linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-purple))' }}>
              <Zap className="w-5 h-5" />
              <span>Enter Lead Intelligence Lab</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/submit?demo=true">
            <Button variant="secondary" size="lg" className="w-full gap-2">
              <Search className="w-5 h-5" />
              <span>Use Classic Lead Form</span>
            </Button>
          </Link>
        </div>

        <Card variant="padded" className="space-y-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" /> What Happens in the Lab?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Zap, title: 'Validate & Normalize', desc: 'Email, phone, company cleanup', color: 'cyan' },
                { icon: ShieldCheckIcon, title: 'Duplicate Check', desc: 'Exact & fuzzy matching', color: 'blue' },
                { icon: Zap, title: 'AI Qualification', desc: '5-criteria scoring + AI', color: 'amber' },
                { icon: Search, title: 'Problem Diagnosis', desc: 'Root cause analysis', color: 'emerald' },
                { icon: Zap, title: 'Buying Signals', desc: 'Evidence-backed detection', color: 'coral' },
              ].map((item, i) => (
                <Card key={i} variant="compact" className="p-4 space-y-2 text-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto`} style={{
                    backgroundColor: `var(--color-brand-${item.color}-dim)`,
                    color: `var(--color-brand-${item.color}-light)`
                  }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-text-primary">{item.title}</h4>
                  <p className="text-caption text-text-muted">{item.desc}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Zap, title: 'Risk Analysis', desc: 'Objections & mitigations', color: 'coral' },
                { icon: Zap, title: 'Qualification Scorecard', desc: '5 dimensions + evidence', color: 'amber' },
                { icon: Zap, title: 'Confidence Model', desc: 'Separate from score', color: 'emerald' },
                { icon: Zap, title: 'Deal Strategy', desc: 'Next actions + owner', color: 'blue' },
                { icon: Zap, title: 'Human Review', desc: 'Override with audit trail', color: 'cyan' },
              ].map((item, i) => (
                <Card key={i} variant="compact" className="p-4 space-y-2 text-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto`} style={{
                    backgroundColor: `var(--color-brand-${item.color}-dim)`,
                    color: `var(--color-brand-${item.color}-light)`
                  }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-text-primary">{item.title}</h4>
                  <p className="text-caption text-text-muted">{item.desc}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Zap, title: 'CRM Preview', desc: 'HubSpot record preview', color: 'blue' },
                { icon: Zap, title: 'Follow-up Draft', desc: 'Personalized + evidence', color: 'emerald' },
                { icon: Zap, title: 'Workflow Simulation', desc: 'Step-by-step trace', color: 'amber' },
                { icon: Zap, title: 'Audit Timeline', desc: 'Immutable event log', color: 'cyan' },
                { icon: Zap, title: 'Business Impact', desc: 'Time saved estimates', color: 'coral' },
              ].map((item, i) => (
                <Card key={i} variant="compact" className="p-4 space-y-2 text-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto`} style={{
                    backgroundColor: `var(--color-brand-${item.color}-dim)`,
                    color: `var(--color-brand-${item.color}-light)`
                  }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-text-primary">{item.title}</h4>
                  <p className="text-caption text-text-muted">{item.desc}</p>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-6 text-caption text-text-muted">
            <Badge variant="success" size="sm" className="gap-1.5"><ShieldCheckIcon className="w-3.5 h-3.5" /> AI-Assisted Qualification with Human Review</Badge>
            <Badge variant="info" size="sm" className="gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure Prompt Isolation Defense</Badge>
            <span>Mailpit & Demo CRM Enabled</span>
            <Badge variant="warning" size="sm" style={{ backgroundColor: 'var(--color-status-warning-bg)', color: 'var(--color-status-warning-text)', borderColor: 'var(--color-status-warning-border)' }}>Simulation Mode</Badge>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}