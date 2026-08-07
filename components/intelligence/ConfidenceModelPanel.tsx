'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ConfidenceModelProps {
  data: {
    score: number;
    supportingFactors: string[];
    uncertaintyFactors: string[];
  };
}

export default function ConfidenceModelPanel({ data }: ConfidenceModelProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'High' };
    if (score >= 60) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Medium' };
    if (score >= 40) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Medium' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Low' };
  };

  const confidence = getConfidenceColor(data.score);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Confidence Model</h3>
          <p className="text-xs text-gray-500">Separate confidence assessment from opportunity score</p>
        </div>
      </div>

      <div className={`${confidence.bg} border ${confidence.border} rounded-xl p-6 text-center`}>
        <div className="text-4xl font-bold {confidence.text}">{data.score}%</div>
        <div className="text-sm font-medium {confidence.text} mt-1">{confidence.label} Confidence</div>
        <div className="text-xs text-gray-500 mt-2">Separate from opportunity score</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-700 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">Supporting Factors</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {data.supportingFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-700 mb-3">
            <AlertCircle className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">Uncertainty Factors</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {data.uncertaintyFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}