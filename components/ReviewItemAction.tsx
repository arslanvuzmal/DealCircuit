'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewItemAction({ lead }: { lead: any }) {
  const router = useRouter();
  const [category, setCategory] = useState(lead.category || 'WARM');
  const [score, setScore] = useState(lead.totalScore || 70);
  const [notes, setNotes] = useState('');
  const [followUpBody, setFollowUpBody] = useState(lead.followUps[0]?.body || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCategory: category, newScore: Number(score), notes, followUpBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      setMessage('✅ Approved! Follow-up sent via Mailpit & CRM synced.');
      router.refresh();
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
      const res = await fetch(`/api/leads/${lead.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');
      setMessage('Lead rejected.');
      router.refresh();
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
      const res = await fetch(`/api/leads/${lead.id}/reprocess`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reprocess failed');
      setMessage(`Reprocessed! Category: ${data.category}, Score: ${data.score}`);
      router.refresh();
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 text-xs">
      <h3 className="font-bold text-gray-900">Human Reviewer Action Panel</h3>

      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-blue-600">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-500 mb-1 font-medium">Adjust Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full input"
          >
            <option value="HOT">HOT (Immediate Sales Call)</option>
            <option value="WARM">WARM (Nurture / Follow-up)</option>
            <option value="COLD">COLD (Disqualified)</option>
            <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 mb-1 font-medium">Adjust Score (0-100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full input"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-500 mb-1 font-medium">Reviewer Internal Notes</label>
        <input
          type="text"
          placeholder="Reason for score adjustment or manual approval decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full input"
        />
      </div>

      <div>
        <label className="block text-gray-500 mb-1 font-medium">Edit Follow-up Draft</label>
        <textarea
          rows={3}
          value={followUpBody}
          onChange={(e) => setFollowUpBody(e.target.value)}
          className="w-full input min-h-[80px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="btn btn-success"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve & Dispatch Sync
        </button>

        <button
          onClick={handleReject}
          disabled={loading}
          className="btn btn-danger"
        >
          <XCircle className="w-3.5 h-3.5" /> Reject Lead
        </button>

        <button
          onClick={handleReprocess}
          disabled={loading}
          className="btn btn-secondary"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Re-qualify AI Engine
        </button>
      </div>
    </div>
  );
}