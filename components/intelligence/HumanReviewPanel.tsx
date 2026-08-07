'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Loader2, AlertCircle, Edit2 } from 'lucide-react';

interface HumanReviewPanelProps {
  leadId: string;
  aiStage: string;
  aiScore: number;
  onApprove: (updates: { stage: string; score: number; reason: string }) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onReprocess: () => Promise<void>;
}

export default function HumanReviewPanel({ leadId, aiStage, aiScore, onApprove, onReject, onReprocess }: HumanReviewPanelProps) {
  const [stage, setStage] = useState(aiStage);
  const [score, setScore] = useState(aiScore);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onApprove({ stage, score: Number(score), reason });
      setMessage('✅ Approved! Follow-up sent & CRM synced.');
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onReject(reason);
      setMessage('Lead rejected.');
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onReprocess();
      setMessage('Reprocessed! New qualification generated.');
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 card-hover">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Edit2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Human Review & Decision</h3>
          <p className="text-xs text-gray-500">Override or confirm AI recommendation</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.startsWith('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-bold text-gray-900 text-sm">AI Recommendation</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Stage</span>
            <span className="font-bold text-gray-900">{aiStage}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Score</span>
            <span className="font-bold text-gray-900">{aiScore}/100</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 mb-1 font-medium text-sm">Override Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full input"
          >
            <option value="Sales Qualified">Sales Qualified</option>
            <option value="Marketing Qualified">Marketing Qualified</option>
            <option value="Review Required">Review Required</option>
            <option value="Disqualified">Disqualified</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 mb-1 font-medium text-sm">Override Score (0-100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full input"
          />
        </div>

        <div>
          <label className="block text-gray-500 mb-1 font-medium text-sm">Reviewer Notes (Required for Override)</label>
          <textarea
            rows={3}
            placeholder="Reason for score/stage adjustment or approval decision..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full input min-h-[80px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="btn-success"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve & Dispatch
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="btn-danger"
          >
            <XCircle className="w-4 h-4" /> Reject Lead
          </button>

          <button
            onClick={handleReprocess}
            disabled={loading}
            className="btn-secondary"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" /> Re-qualify AI
          </button>
        </div>
      </div>
    </div>
  );
}