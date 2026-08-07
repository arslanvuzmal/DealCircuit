'use client';

import React from 'react';
import { Zap, Target, TrendingUp, ShieldCheck } from 'lucide-react';

interface BuyingSignalsPanelProps {
  data: Array<{
    signal: string;
    strength: 'Strong' | 'Medium' | 'Weak';
    evidence: string;
    interpretation: string;
  }>;
}

export default function BuyingSignalsPanel({ data }: BuyingSignalsPanelProps) {
  const strengthConfig = {
    Strong: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: Zap, color: 'text-green-600' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Target, color: 'text-amber-600' },
    Weak: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: TrendingUp, color: 'text-gray-600' },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Buying Signals</h3>
          <p className="text-xs text-gray-500">Evidence-based detection of commercial intent</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((signal, index) => {
          const config = strengthConfig[signal.strength];
          const Icon = config.icon;
          return (
            <div key={index} className={`${signal.strength === 'Strong' ? 'bg-green-50' : signal.strength === 'Medium' ? 'bg-amber-50' : 'bg-gray-50'} border ${signal.strength === 'Strong' ? 'border-green-200' : signal.strength === 'Medium' ? 'border-amber-200' : 'border-gray-200'} rounded-lg p-4 space-y-3`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${signal.strength === 'Strong' ? 'bg-green-100' : signal.strength === 'Medium' ? 'bg-amber-100' : 'bg-gray-100'} flex items-center justify-center`}>
                  <config.icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{signal.signal}</h4>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${signal.strength === 'Strong' ? 'bg-green-100 border-green-200 text-green-700' : signal.strength === 'Medium' ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                      {signal.strength}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Evidence:</span> {signal.evidence}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Interpretation:</span> {signal.interpretation}
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