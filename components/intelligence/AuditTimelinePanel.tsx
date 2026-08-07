'use client';

import React from 'react';
import { History, Clock, CheckCircle2, XCircle, Zap, AlertTriangle, Loader2 } from 'lucide-react';

interface AuditTimelinePanelProps {
  data: Array<{
    timestamp: string;
    event: string;
    status: 'pending' | 'completed' | 'failed';
    traceId?: string;
    actionId?: string;
    executionType?: string;
    retryCount?: number;
  }>;
}

export default function AuditTimelinePanel({ data }: AuditTimelinePanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Automation Trace / Audit Log</h3>
          <p className="text-xs text-gray-500">Immutable record of all processing steps</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((event, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold
              {event.status === 'completed' ? 'bg-green-500' :
              event.status === 'failed' ? 'bg-red-500' :
              event.status === 'pending' ? 'bg-blue-500' : 'bg-gray-400'
            }">
              {event.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              {event.status === 'failed' && <XCircle className="w-4 h-4" />}
              {event.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{event.event}</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded
                  ${event.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                  event.status === 'failed' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-blue-50 border-blue-200 text-blue-700'}`}
                >
                  {event.status}
                </span>
                {event.retryCount && event.retryCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-50 border-amber-200 text-amber-700">
                    Retry #{event.retryCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{event.timestamp}</div>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                {event.traceId && <span className="font-mono">Trace: {event.traceId.slice(0, 8)}...</span>}
                {event.actionId && <span className="font-mono">Action: {event.actionId.slice(0, 8)}...</span>}
                {event.executionType && <span>Type: {event.executionType}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}