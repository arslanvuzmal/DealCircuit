'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, Zap, Filter, Search } from 'lucide-react';

interface ValidationPanelProps {
  data: {
    email: string;
    company: string;
    duplicateCheck: string;
    requiredFields: string;
    missing?: string;
  };
  isLoading?: boolean;
}

export default function ValidationPanel({ data, isLoading }: ValidationPanelProps) {
  const checks = [
    { label: 'Email', value: data.email, icon: data.email === 'Valid' ? CheckCircle2 : AlertCircle, color: data.email === 'Valid' ? 'text-green-600' : 'text-red-600', bgColor: data.email === 'Valid' ? 'bg-green-50' : 'bg-red-50', borderColor: data.email === 'Valid' ? 'border-green-200' : 'border-red-200' },
    { label: 'Company', value: data.company, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { label: 'Duplicate Check', value: data.duplicateCheck, icon: data.duplicateCheck === 'No exact duplicate' ? CheckCircle2 : AlertCircle, color: data.duplicateCheck === 'No exact duplicate' ? 'text-green-600' : 'text-red-600', bgColor: data.duplicateCheck === 'No exact duplicate' ? 'bg-green-50' : 'bg-red-50', borderColor: data.duplicateCheck === 'No exact duplicate' ? 'border-green-200' : 'border-red-200' },
    { label: 'Required Contact Fields', value: data.requiredFields, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Validation & Normalization</h3>
          <p className="text-xs text-gray-500">Input sanitization, format validation, and duplicate detection</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((check, index) => (
              <div key={index} className={`${check.bgColor} border ${check.borderColor} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <check.icon className={`w-4 h-4 ${check.color}`} />
                  <span className="font-medium text-gray-700">{check.label}</span>
                </div>
                <div className="font-mono text-sm text-gray-900">{check.value}</div>
              </div>
            ))}
          </div>

          {data.missing && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Missing Information</span>
              </div>
              <p className="text-sm text-amber-800">{data.missing}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}