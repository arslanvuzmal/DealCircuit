import React from 'react';
import { isDemoMode } from '@/lib/env';
import { Sliders, ShieldCheck, Lock, Bell } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" /> System Settings & Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage application parameters, security policies, and environment flags.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 text-xs card-hover">
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" /> Operational Mode Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
              <span className="text-gray-500 block">DEMO_MODE</span>
              <span className="font-mono text-blue-600 font-bold text-sm">
                {isDemoMode ? 'true (Zero Paid API Required)' : 'false (Production Live)'}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
              <span className="text-gray-500 block">Session Auth Policy</span>
              <span className="font-mono text-gray-900 font-bold text-sm">
                JWT HTTP-Only Cookie (7 Days)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" /> AI & Security Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
              <span className="text-gray-500 block">Prompt Injection Defense</span>
              <span className="font-mono text-green-600 font-bold text-sm">
                ACTIVE (Automatic Review Routing)
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
              <span className="text-gray-500 block">Duplicate Detection Engine</span>
              <span className="font-mono text-green-600 font-bold text-sm">
                ACTIVE (Multi-Factor Matching)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}