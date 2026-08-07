'use client';

import React from 'react';
import { HelpCircle, ArrowRight, Target } from 'lucide-react';

interface NextBestQuestionsPanelProps {
  data: Array<{
    question: string;
    reason: string;
    priority: 'Critical' | 'High' | 'Medium';
  }>;
}

export default function NextBestQuestionsPanel({ data }: NextBestQuestionsPanelProps) {
  const priorityConfig = {
    Critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '🔴' },
    High: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '🟠' },
    Medium: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '🔵' },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Next-Best Discovery Questions</h3>
          <p className="text-xs text-gray-500">AI-generated questions to close qualification gaps</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const config = priorityConfig[item.priority];
          return (
            <div key={index} className={`${config.bg} border ${config.border} rounded-xl p-5 space-y-3`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{item.question}</h4>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${config.bg} ${config.border} ${config.text}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Why:</span> {item.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}