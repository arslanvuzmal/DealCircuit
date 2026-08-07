'use client';

import React from 'react';
import { Building2, Users, Globe, Zap, Server, ShieldCheck } from 'lucide-react';

interface CompanyIntelligencePanelProps {
  data: {
    industry: string;
    companySize: string;
    locations?: number;
    operationalComplexity: string;
    existingSystems: string[];
    leadSource: string;
    enriched: boolean;
  };
}

export default function CompanyIntelligencePanel({ data }: CompanyIntelligencePanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Company Intelligence</h3>
          <p className="text-xs text-gray-500">Automated company profiling and enrichment</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Building2 className="w-3.5 h-3.5" /> Industry
            </div>
            <div className="font-medium text-gray-900">{data.industry}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Users className="w-3.5 h-3.5" /> Company Size
            </div>
            <div className="font-medium text-gray-900">{data.companySize}</div>
          </div>

          {data.locations && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Globe className="w-3.5 h-3.5" /> Locations
              </div>
              <div className="font-medium text-gray-900">{data.locations} locations</div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Zap className="w-3.5 h-3.5" /> Operational Complexity
            </div>
            <div className="font-medium text-gray-900">{data.operationalComplexity}</div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
            <Server className="w-3.5 h-3.5" /> Existing Systems
          </div>
          <div className="flex flex-wrap gap-2">
            {data.existingSystems.map((system, index) => (
              <span key={index} className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-700">
                {system}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Lead Source
          </div>
          <div className="font-medium text-gray-900">{data.leadSource}</div>
          {data.enriched && (
            <span className="text-xs text-blue-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Enriched with external data
            </span>
          )}
        </div>
      </div>
    </div>
  );
}