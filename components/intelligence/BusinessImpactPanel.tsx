'use client';

import React from 'react';
import { Zap, Clock, Users, TrendingUp, ShieldCheck } from 'lucide-react';

interface BusinessImpactPanelProps {
  data: {
    traditionalManualMinutes: number;
    leadPilotAutomatedSeconds: number;
    humanReviewMinutes: number;
    illustrativeStaffTimeSaved: string;
    disclaimer: string;
  };
}

export default function BusinessImpactPanel({ data }: BusinessImpactPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Illustrative Business Impact</h3>
          <p className="text-xs text-gray-500">Estimated operational efficiency gains</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-amber-700 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold text-amber-800">Important Disclaimer</span>
        </div>
        <p className="text-sm text-amber-800">{data.disclaimer}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-900">Traditional Process</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.traditionalManualMinutes}</div>
          <div className="text-xs text-gray-500">minutes per lead (manual triage)</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">LeadPilot Analysis</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{data.leadPilotAutomatedSeconds}</div>
          <div className="text-xs text-gray-500">seconds (automated qualification)</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Human Review</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{data.humanReviewMinutes}</div>
          <div className="text-xs text-gray-500">minutes (decision & approval)</div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-gray-900">Illustrative Staff Time Redirected</span>
        </div>
        <div className="text-2xl font-bold text-emerald-600">{data.illustrativeStaffTimeSaved}</div>
        <div className="text-xs text-gray-500 mt-1">per qualified enquiry</div>
      </div>
    </div>
  );
}