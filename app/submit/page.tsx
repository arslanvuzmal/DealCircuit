import React from 'react';
import PublicLeadForm from '@/components/PublicLeadForm';
import Link from 'next/link';
import { ShieldCheck, Lock, Sparkles, LayoutDashboard } from 'lucide-react';

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
            <Sparkles className="w-3.5 h-3.5" /> B2B Lead Intake
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            Accelerate Lead Qualification with AI
          </h2>
          <p className="text-sm text-gray-600">
            Instant 5-criteria qualification, prompt-injection defense, duplicate detection, and automated CRM synchronisation.
          </p>
        </div>

        <PublicLeadForm />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-200 pt-8">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-600" /> AI-Assisted Qualification with Human Review</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-600" /> Secure Prompt Isolation Defense</span>
          <span>Mailpit & Demo CRM Enabled</span>
        </div>
      </div>
    </div>
  );
}