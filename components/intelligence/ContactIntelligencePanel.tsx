'use client';

import React from 'react';
import { User, Briefcase, TrendingUp, Target } from 'lucide-react';

interface ContactIntelligencePanelProps {
  data: {
    role: string;
    seniority: string;
    influenceLevel: string;
    department: string;
    decisionMakingCertainty: string;
    inferred?: string[];
  };
}

export default function ContactIntelligencePanel({ data }: ContactIntelligencePanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Contact Intelligence</h3>
          <p className="text-xs text-gray-500">Contact profiling and decision-making analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <User className="w-3.5 h-3.5" /> Role
            </div>
            <div className="font-medium text-gray-900">{data.role}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Target className="w-3.5 h-3.5" /> Seniority
            </div>
            <div className="font-medium text-gray-900">{data.seniority}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Influence Level
            </div>
            <div className="font-medium text-gray-900">{data.influenceLevel}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Department
            </div>
            <div className="font-medium text-gray-900">{data.department}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Decision Certainty
            </div>
            <div className="font-medium text-gray-900">{data.decisionMakingCertainty}</div>
          </div>
        </div>

        {data.inferred && data.inferred.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <span className="w-4 h-4" />
              <span className="font-medium">Inferred Fields</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              {data.inferred.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}