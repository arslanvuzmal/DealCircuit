'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface ObjectionsPanelProps {
  data: Array<{
    name: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Unknown';
    evidence: string;
    whyItMatters: string;
    recommendedNextStep: string;
  }>;
}

export default function ObjectionsPanel({ data }: ObjectionsPanelProps) {
  const severityConfig = {
    Critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', icon: AlertTriangle },
    High: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500', icon: AlertTriangle },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', icon: AlertCircle },
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500', icon: ShieldCheck },
    Unknown: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', dot: 'bg-gray-400', icon: AlertCircle },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Objections & Risk Analysis</h3>
          <p className="text-xs text-gray-500">Identified risks, objections, and recommended mitigations</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((risk, index) => {
          const config = severityConfig[risk.severity];
          const Icon = config.icon;
          return (
            <div key={index} className={`${config.bg} border ${config.border} rounded-lg p-4 space-y-3`}>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full ${config.dot} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{risk.name}</h4>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${config.bg} ${config.border} ${config.text}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Evidence:</span>
                      <p className="text-gray-600 mt-1">{risk.evidence}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Why It Matters:</span>
                      <p className="text-gray-600 mt-1">{risk.whyItMatters}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Recommended Next Step:</span>
                      <p className="text-gray-600 mt-1">{risk.recommendedNextStep}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}