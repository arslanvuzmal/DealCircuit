'use client';

import React from 'react';
import { Zap, Target, ShieldCheck, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

interface DealStrategyPanelProps {
  data: {
    action: string;
    priority: string;
    ownerType: string;
    objective: string[];
    avoidForNow: string[];
    reasoning: string;
  };
}

export default function DealStrategyPanel({ data }: DealStrategyPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Recommended Deal Strategy</h3>
          <p className="text-xs text-gray-500">AI-generated sales/revenue strategy based on evidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-purple-700 mb-3">
            <Zap className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">Recommended Action</h4>
          </div>
          <p className="font-semibold text-gray-900 text-lg">{data.action}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-blue-700 mb-3">
            <Clock className="w-5 h-5" />
            <h4 className="font-semibold text-gray-900">Priority & Timing</h4>
          </div>
          <p className="font-semibold text-gray-900">{data.priority}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Target className="w-4 h-4" />
            <h4 className="font-semibold text-gray-900">Discovery Objectives</h4>
          </div>
          <ul className="space-y-2">
            {data.objective.map((obj, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.avoidForNow.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="font-semibold text-gray-900">Do Not Do Yet</h4>
            </div>
            <ul className="space-y-1">
              {data.avoidForNow.map((avoid, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="font-semibold text-gray-900">Reasoning</h4>
          </div>
          <p className="text-sm text-gray-600">{data.reasoning}</p>
        </div>
      </div>
    </div>
  );
}