'use client';

import React from 'react';
import { AlertTriangle, Zap, AlertCircle, ArrowRight } from 'lucide-react';

interface BusinessProblemPanelProps {
  data: {
    primaryProblem: {
      name: string;
      severity: 'Critical' | 'High' | 'Medium' | 'Low';
      evidence: string[];
      consequence: string;
    };
    secondaryProblems: Array<{
      name: string;
      severity: 'Critical' | 'High' | 'Medium' | 'Low';
      evidence: string[];
      consequence: string;
    }>;
    rootCauseSummary: string;
    workflow: string[];
    operationalConsequences: string[];
  };
}

export default function BusinessProblemPanel({ data }: BusinessProblemPanelProps) {
  const severityColors = {
    Critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
    High: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
  };

  const primary = data.primaryProblem;
  const primaryColors = severityColors[primary.severity];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Business Problem Diagnosis</h3>
          <p className="text-xs text-gray-500">AI-identified operational problems and root causes</p>
        </div>
      </div>

      <div className={`${primaryColors.bg} border ${primaryColors.border} rounded-lg p-4 space-y-3`}>
        <div className="flex items-start gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${primaryColors.dot} mt-1.5 flex-shrink-0`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-gray-900">{data.primaryProblem.name}</h4>
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${primaryColors.bg} ${primaryColors.border} ${primaryColors.text}`}>
                {data.primaryProblem.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600">{data.primaryProblem.consequence}</p>
            <div className="mt-2">
              <span className="font-medium text-gray-700 text-xs">Evidence:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                {data.primaryProblem.evidence.map((evidence, index) => (
                  <li key={index} className="text-sm text-gray-600">{evidence}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {data.secondaryProblems.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">Secondary Problems</h4>
          <div className="space-y-3">
            {data.secondaryProblems.map((problem, index) => {
              const colors = severityColors[problem.severity];
              return (
                <div key={index} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <h5 className="font-medium text-gray-900">{problem.name}</h5>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${colors.bg} ${colors.border} ${colors.text}`}>
                      {problem.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{problem.consequence}</p>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-1 space-y-0.5">
                    {problem.evidence.map((evidence, i) => (
                      <li key={i} className="text-gray-600">{evidence}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <h4 className="font-bold text-gray-900 text-sm">Root Cause Analysis</h4>
        <p className="text-sm text-gray-600">{data.rootCauseSummary}</p>
        
        <div className="pt-2 border-t border-gray-200">
          <h5 className="font-medium text-gray-700 text-xs mb-2">Operational Workflow</h5>
          <div className="flex flex-col gap-1">
            {data.workflow.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  {index + 1}
                </span>
                <span>{step}</span>
                {index < data.workflow.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <h5 className="font-medium text-gray-700 text-xs mb-2">Operational Consequences</h5>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
            {data.operationalConsequences.map((consequence, index) => (
              <li key={index} className="text-gray-600">{consequence}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}