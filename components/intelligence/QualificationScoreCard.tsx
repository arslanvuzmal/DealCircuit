'use client';

import React from 'react';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

interface QualificationScoreCardProps {
  data: {
    overallScore: number;
    stage: 'Sales Qualified' | 'Marketing Qualified' | 'Review Required' | 'Disqualified';
    priority: 'High' | 'Medium' | 'Low';
    dimensions: Array<{
      name: string;
      score: number;
      maxScore: number;
      evidence: string[];
      missing?: string[];
    }>;
  };
}

export default function QualificationScoreCard({ data }: QualificationScoreCardProps) {
  const stageColors = {
    'Sales Qualified': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'Marketing Qualified': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    'Review Required': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    'Disqualified': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

  const priorityColors = {
    High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  };

  const stageColor = stageColors[data.stage];
  const priorityColor = priorityColors[data.priority];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Qualification Scorecard</h3>
          <p className="text-xs text-gray-500">Multi-dimensional scoring with evidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${stageColors[data.stage].bg} border ${stageColors[data.stage].border} rounded-xl p-5 text-center`}>
          <div className="text-3xl font-bold text-gray-900">{data.overallScore}</div>
          <div className="text-xs text-gray-500">Overall Score / 100</div>
        </div>
        <div className={`${stageColor.bg} border ${stageColor.border} rounded-xl p-5 text-center`}>
          <div className="text-lg font-bold {stageColor.text}">{data.stage}</div>
          <div className="text-xs text-gray-500 mt-1">Qualification Stage</div>
        </div>
        <div className={`${priorityColor.bg} border ${priorityColor.border} rounded-xl p-5 text-center`}>
          <div className="text-lg font-bold {priorityColor.text}">{data.priority}</div>
          <div className="text-xs text-gray-500 mt-1">Priority</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Dimension Breakdown</h4>
        <div className="space-y-3">
          {data.dimensions.map((dim, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">{dim.name}</h5>
                <span className="font-bold text-gray-900 text-lg">{dim.score}/{dim.maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><span className="font-medium">Evidence:</span></p>
                <ul className="list-disc list-inside text-gray-600">
                  {dim.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                </ul>
                {dim.missing && dim.missing.length > 0 && (
                  <p className="text-amber-600 mt-1"><span className="font-medium">Missing:</span> {dim.missing.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}