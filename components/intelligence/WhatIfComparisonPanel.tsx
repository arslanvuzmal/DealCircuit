'use client';

import React from 'react';
import { ArrowRight, Zap, CheckCircle2, XCircle, Clock, Users, Server } from 'lucide-react';

interface WhatIfComparisonPanelProps {
  traditionalSteps: string[];
  leadPilotSteps: string[];
}

export default function WhatIfComparisonPanel({ traditionalSteps, leadPilotSteps }: WhatIfComparisonPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">What If LeadPilot Didn&apos;t Exist?</h3>
          <p className="text-xs text-gray-500">Traditional manual process vs. LeadPilot automation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-700 mb-3">
            <XCircle className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">Traditional Manual Process</h4>
          </div>
          <div className="space-y-2">
            {traditionalSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-700 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">LeadPilot Automated Process</h4>
          </div>
          <div className="space-y-2">
            {leadPilotSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Key Differences</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Time to Qualify</div>
            <div className="text-red-600 font-medium">~12 min (manual)</div>
            <div className="text-green-600 font-medium">~8 sec (automated)</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Human Review Time</div>
            <div className="text-red-600 font-medium">~12 min (read + research)</div>
            <div className="text-green-600 font-medium">~45 sec (review AI output)</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Duplicate Risk</div>
            <div className="text-red-600 font-medium">High (no idempotency)</div>
            <div className="text-green-600 font-medium">Zero (built-in)</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Failure Recovery</div>
            <div className="text-red-600 font-medium">Manual intervention</div>
            <div className="text-green-600 font-medium">Auto-retry + audit</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Audit Trail</div>
            <div className="text-red-600 font-medium">None / scattered</div>
            <div className="text-green-600 font-medium">Full immutable log</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-700 mb-1">Personalization</div>
            <div className="text-red-600 font-medium">Generic template</div>
            <div className="text-green-600 font-medium">Evidence-grounded</div>
          </div>
        </div>
      </div>
    </div>
  );
}