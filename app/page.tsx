import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Bot, Database, Workflow, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between p-6 sm:p-12">
      <div className="max-w-5xl mx-auto w-full space-y-16 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
              LP
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">LeadPilot AI</h1>
              <p className="text-xs text-gray-500">AI Lead Operations & n8n Automation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              className="text-xs font-medium text-gray-700 hover:text-blue-600 transition px-3 py-2"
            >
              Public Lead Form
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow"
            >
              Admin Dashboard
            </Link>
          </div>
        </header>

        {/* Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Zap className="w-4 h-4" /> AI-Assisted Lead Qualification
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight leading-tight">
            Turn Every Enquiry into a Clear Sales Action
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            LeadPilot captures incoming enquiries, validates and qualifies them, routes uncertain cases for human review,
            updates your CRM, prepares follow-ups and tracks workflow failures from one operations workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition flex items-center gap-2 shadow"
            >
              <Zap className="w-4 h-4" /> Try a Lead <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition flex items-center gap-2 border border-gray-300"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Problem Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">The Problem</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Capturing a lead is easy. Processing it is where teams lose time.</p>
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
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 card-hover">
                <div className="text-3xl">{item.icon}</div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section className="space-y-8 bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-2xl font-bold text-gray-900">The Solution</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">End-to-end lead operations with human control at every decision point.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-600">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">Capture</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">Validate</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">Deduplicate</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">Qualify</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded">Review</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded">CRM</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded">Follow-up</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded">Notify</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded">Audit</span>
          </div>
        </section>

        {/* Before/After */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">Before vs After</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Before LeadPilot
              </h4>
              <div className="space-y-2 text-sm text-gray-600 font-mono">
                <div>Lead Form → Inbox</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>Spreadsheet</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>Salesperson</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>CRM (manual)</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>Manual Email</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> After LeadPilot
              </h4>
              <div className="space-y-2 text-sm text-gray-600 font-mono">
                <div>Lead Source</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>LeadPilot AI</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>n8n Workflows</div>
                <ArrowRight className="mx-auto text-gray-300" />
                <div>CRM + Follow-up + Team</div>
              </div>
            </div>
          </div>
        </section>

        {/* n8n Section */}
        <section className="space-y-8 bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-2xl font-bold text-gray-900">What n8n Automates</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Four production workflows handle the operational heavy lifting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Lead Intake', desc: 'Webhook → Qualify → CRM → Log', icon: Workflow },
              { title: 'Daily Digest', desc: 'Cron → Rank → Summarize → Email', icon: Database },
              { title: 'Failed Event Retry', desc: 'Cron → Retry → Recover → Alert', icon: Zap },
              { title: 'Review Completion', desc: 'Webhook → CRM → Follow-up → Log', icon: ShieldCheck },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3 card-hover">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Human Control */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">Human Control</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">AI supports qualification. People remain in control of uncertain or sensitive actions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Review Queue', desc: 'Low confidence, duplicates, prompt injection attempts routed for human review' },
              { title: 'Edit & Approve', desc: 'Reviewers adjust scores, edit follow-ups, change categories before dispatch' },
              { title: 'Audit Trail', desc: 'Every decision logged with reviewer, timestamp, and reasoning' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 card-hover">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Failure Recovery */}
        <section className="space-y-8 bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Failure Recovery</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">A mature automation does not silently stop when an API fails.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-600">
            <span className="bg-red-50 text-red-700 px-3 py-1 rounded">Failure</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded">Retry</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">Recovery</span>
            <ArrowRight className="text-gray-300" />
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded">Audit</span>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">Exponential backoff, retryable vs permanent classification, bounded attempts, full audit trail</p>
        </section>

        {/* Final CTA */}
        <div className="text-center space-y-4 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Ready to automate your lead operations?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition flex items-center gap-2 shadow"
            >
              <Zap className="w-4 h-4" /> Try a Lead
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition flex items-center gap-2 border border-gray-300"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
        LeadPilot AI &bull; AI Lead Operations & n8n Automation &bull; Demo Mode Enabled
      </footer>
    </div>
  );
}