import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full text-center space-y-6 shadow-card">
        <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lead Inquiry Submitted!</h1>
          <p className="text-xs text-gray-500">
            Your project requirements have been ingested, normalized, and evaluated by DealCircuit.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-bold text-green-600">INGESTED & SCORED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Expected Response:</span>
            <span className="font-medium text-gray-900">Based on qualification category</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Mode:</span>
            <span className="font-mono text-blue-600">DEMO_MODE=true</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
          >
            Submit Another Lead <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 border border-gray-300"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Open Admin Console
          </Link>
        </div>
      </div>
    </div>
  );
}