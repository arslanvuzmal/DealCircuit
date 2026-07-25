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
    <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border space-y-4 text-xs">
      <h3 className="font-bold text-dark-bright">Human Reviewer Action Panel</h3>

      {message && (
        <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-lg p-2.5 text-brand-cyan">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-dark-muted mb-1 font-medium">Adjust Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option value="HOT">HOT (Immediate Sales Call)</option>
            <option value="WARM">WARM (Nurture / Follow-up)</option>
            <option value="COLD">COLD (Disqualified)</option>
            <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
          </select>
        </div>

        <div>
          <label className="block text-dark-muted mb-1 font-medium">Adjust Score (0-100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      <div>
        <label className="block text-dark-muted mb-1 font-medium">Reviewer Internal Notes</label>
        <input
          type="text"
          placeholder="Reason for score adjustment or manual approval decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
        />
      </div>

      <div>
        <label className="block text-dark-muted mb-1 font-medium">Edit Follow-up Draft</label>
        <textarea
          rows={3}
          value={followUpBody}
          onChange={(e) => setFollowUpBody(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="px-4 py-2 bg-brand-emerald hover:opacity-90 text-white font-medium rounded-lg text-xs transition flex items-center gap-1.5 shadow"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve & Dispatch Sync
        </button>

        <button
          onClick={handleReject}
          disabled={loading}
          className="px-4 py-2 bg-brand-coral hover:opacity-90 text-white font-medium rounded-lg text-xs transition flex items-center gap-1.5 shadow"
        >
          <XCircle className="w-3.5 h-3.5" /> Reject Lead
        </button>

        <button
          onClick={handleReprocess}
          disabled={loading}
          className="px-4 py-2 bg-dark-hover border border-dark-border hover:border-brand-cyan text-dark-bright font-medium rounded-lg text-xs transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-cyan" /> Re-qualify AI Engine
        </button>
      </div>
    </div>
  );
}
