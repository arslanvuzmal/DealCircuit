'use client';

import React from 'react';
import { FileQuestion, HelpCircle, AlertCircle } from 'lucide-react';

interface MissingInformationPanelProps {
  data: Array<{
    field: string;
    reason: string;
    impact: string;
  }>;
}

export default function MissingInformationPanel({ data }: MissingInformationPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
          <FileQuestion className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Qualification Gaps</h3>
          <p className="text-xs text-gray-500">Missing information that affects qualification confidence</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((gap, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-gray-900">{gap.field}</h4>
                <p className="text-sm text-gray-600">{gap.reason}</p>
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-medium">Impact:</span> {gap.impact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}