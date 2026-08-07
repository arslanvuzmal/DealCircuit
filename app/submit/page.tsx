import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Sparkles, LayoutDashboard, ArrowRight, Zap, Search, ShieldCheck as ShieldCheckIcon } from 'lucide-react';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
              LP
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">LeadPilot AI</h1>
              <p className="text-xs text-gray-500">AI Lead Operations & n8n Automation</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 transition font-medium"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin Console
          </Link>
        </div>

        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Lead Intelligence Lab
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            Turn Every Enquiry into Actionable Sales Intelligence
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            LeadPilot doesn&apos;t just score leads--it diagnoses business problems, extracts buying signals,
            identifies risks, and recommends the exact next sales action with full audit traceability.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/intelligence"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-lg text-base transition flex items-center justify-center gap-3 shadow-xl"
          >
            <Zap className="w-5 h-5" />
            <span>Enter Lead Intelligence Lab</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/submit?demo=true"
            className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Use Classic Lead Form</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">What Happens in the Lab?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            {[
              { icon: Zap, title: 'Validate & Normalize', desc: 'Email, phone, company cleanup' },
              { icon: ShieldCheckIcon, title: 'Duplicate Check', desc: 'Exact & fuzzy matching' },
              { icon: Zap, title: 'AI Qualification', desc: '5-criteria scoring + AI' },
              { icon: Search, title: 'Problem Diagnosis', desc: 'Root cause analysis' },
              { icon: Zap, title: 'Buying Signals', desc: 'Evidence-backed detection' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm mt-2">
            {[
              { icon: Zap, title: 'Risk Analysis', desc: 'Objections & mitigations' },
              { icon: Zap, title: 'Qualification Scorecard', desc: '5 dimensions + evidence' },
              { icon: Zap, title: 'Confidence Model', desc: 'Separate from score' },
              { icon: Zap, title: 'Deal Strategy', desc: 'Next actions + owner' },
              { icon: Zap, title: 'Human Review', desc: 'Override with audit trail' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm mt-2">
            {[
              { icon: Zap, title: 'CRM Preview', desc: 'HubSpot record preview' },
              { icon: Zap, title: 'Follow-up Draft', desc: 'Personalized + evidence' },
              { icon: Zap, title: 'Workflow Simulation', desc: 'Step-by-step trace' },
              { icon: Zap, title: 'Audit Timeline', desc: 'Immutable event log' },
              { icon: Zap, title: 'Business Impact', desc: 'Time saved estimates' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-200 pt-8">
          <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-green-600" /> AI-Assisted Qualification with Human Review</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-600" /> Secure Prompt Isolation Defense</span>
          <span>Mailpit & Demo CRM Enabled</span>
          <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded text-[10px] font-mono">
            Simulation Mode
          </span>
        </div>
      </div>
    </div>
  );
}