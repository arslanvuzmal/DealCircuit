'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Zap, Database, Mail, User, Loader2 } from 'lucide-react';

interface WorkflowSimulationPanelProps {
  isRunning: boolean;
  onRun: () => Promise<void>;
  simulationMode: boolean;
}

export default function WorkflowSimulationPanel({ isRunning, onRun, simulationMode }: WorkflowSimulationPanelProps) {
  const [steps, setSteps] = useState<Array<{ label: string; status: 'pending' | 'running' | 'completed' | 'failed' }>>([
    { label: 'Lead normalized', status: 'pending' },
    { label: 'Duplicate lookup completed', status: 'pending' },
    { label: 'Qualification executed', status: 'pending' },
    { label: 'Human decision recorded', status: 'pending' },
    { label: 'Company match prepared', status: 'pending' },
    { label: 'Contact record prepared', status: 'pending' },
    { label: 'Opportunity record prepared', status: 'pending' },
    { label: 'Discovery task created', status: 'pending' },
    { label: 'Follow-up drafted', status: 'pending' },
    { label: 'Sales owner notification prepared', status: 'pending' },
    { label: 'Audit events recorded', status: 'pending' },
  ]);

  const runSimulation = async () => {
    setSteps(steps.map(s => ({ ...s, status: 'pending' })));
    await onRun();
    
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Workflow Execution Simulation</h3>
            <p className="text-xs text-gray-500">Step-by-step automation trace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {simulationMode && (
            <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Simulation Mode
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.status === 'completed' ? 'bg-green-100 text-green-600' :
              step.status === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' :
              step.status === 'failed' ? 'bg-red-100 text-red-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              {step.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              {step.status === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
              {step.status === 'failed' && <XCircle className="w-4 h-4" />}
              {step.status === 'pending' && <span className="text-[10px]">{index + 1}</span>}
            </div>
            <span className={`text-gray-700 ${step.status === 'running' ? 'font-medium' : ''}`}>
              {step.label}
            </span>
            {step.status === 'completed' && <span className="text-xs text-green-600 ml-auto">✓ Done</span>}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="w-full btn-primary"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Running Workflow...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" /> Execute Workflow
            </>
          )}
        </button>

        {simulationMode && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Simulation Mode — no external HubSpot, Gmail, Calendar or other system was modified.
          </p>
        )}
      </div>
    </div>
  );
}