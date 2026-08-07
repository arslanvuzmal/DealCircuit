'use client';

import React from 'react';
import { Building2, User, Mail, Zap, Globe, Database, ShieldCheck, AlertTriangle, ArrowRight, Target, HelpCircle } from 'lucide-react';

interface CRMPreviewPanelProps {
  data: {
    company: string;
    contact: string;
    stage: string;
    priority: string;
    opportunityScore: number;
    confidence: number;
    primaryRequirement: string;
    primaryPain: string;
    currentSystems: string[];
    knownRisks: string[];
    missingQualification: string[];
    nextStep: string;
  };
}

export default function CRMPreviewPanel({ data }: CRMPreviewPanelProps) {
  const stageColors: Record<string, { bg: string; border: string; text: string }> = {
    'Sales Qualified': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'Marketing Qualified': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    'Review Required': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    'Disqualified': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

  const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
    High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  };

  const stageColor = stageColors[data.stage] || stageColors['Review Required'];
  const priorityColor = priorityColors[data.priority as keyof typeof priorityColors] || priorityColors.Medium;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">CRM Record Preview</h3>
          <p className="text-xs text-gray-500">HubSpot opportunity record that would be created</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${stageColors[data.stage].bg} border ${stageColors[data.stage].border} rounded-xl p-5`}>
          <div className="text-xs text-gray-500 mb-1">Stage</div>
          <div className={`font-bold ${stageColors[data.stage].text}`}>{data.stage}</div>
        </div>
        <div className={`${priorityColors[data.priority as keyof typeof priorityColors].bg} border ${priorityColors[data.priority as keyof typeof priorityColors].border} rounded-xl p-5`}>
          <div className="text-xs text-gray-500 mb-1">Priority</div>
          <div className={`font-bold ${priorityColors[data.priority as keyof typeof priorityColors].text}`}>{data.priority}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Opportunity Score</div>
          <div className="text-2xl font-bold text-gray-900">{data.opportunityScore}/100</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Confidence</div>
          <div className="text-2xl font-bold text-gray-900">{data.confidence}%</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Target className="w-4 h-4" />
            <h4 className="font-semibold text-gray-900">Primary Requirement</h4>
          </div>
          <p className="text-gray-600">{data.primaryRequirement}</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-semibold text-gray-900">Primary Pain Point</h4>
          </div>
          <p className="text-gray-600">{data.primaryPain}</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Zap className="w-4 h-4" />
          <h4 className="font-semibold text-gray-900">Current Systems</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.currentSystems.map((system, index) => (
            <span key={index} className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-700">
              {system}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <h4 className="font-semibold text-gray-900">Known Risks</h4>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {data.knownRisks.map((risk, index) => (
            <li key={index} className="text-gray-600">{risk}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <HelpCircle className="w-4 h-4" />
          <h4 className="font-semibold text-gray-900">Missing Qualification</h4>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {data.missingQualification.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <ArrowRight className="w-4 h-4" />
          <h4 className="font-semibold text-gray-900">Recommended Next Step</h4>
        </div>
        <p className="text-gray-700">{data.nextStep}</p>
      </div>
    </div>
  );
}