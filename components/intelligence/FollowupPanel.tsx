'use client';

import React from 'react';
import { Mail, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

interface FollowupPanelProps {
  data: {
    subject: string;
    body: string;
    personalizationEvidence: string[];
  };
  onCopy?: () => void;
}

export default function FollowupPanel({ data, onCopy }: FollowupPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Personalized Follow-up Draft</h3>
            <p className="text-xs text-gray-500">AI-generated, evidence-grounded outreach</p>
          </div>
        </div>
        <button
          onClick={onCopy}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="block text-xs text-gray-500 mb-1 font-medium">Subject</label>
          <p className="font-semibold text-gray-900">{data.subject}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-xs text-gray-500 mb-1 font-medium">Message</label>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">{data.body}</pre>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="font-semibold text-gray-900">Personalization Evidence</h4>
          </div>
          <ul className="space-y-1 text-sm text-green-800">
            {data.personalizationEvidence.map((evidence, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{evidence}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}