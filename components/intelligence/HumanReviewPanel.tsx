'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Loader2, AlertCircle, Edit2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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

  const handleApprove = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onApprove({ stage, score: Number(score), reason });
      setMessage('Recommendation approved. CRM update, follow-up prepared in Simulation Mode. No external systems modified.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onReject(reason);
      setMessage('Lead rejected. No external actions taken in Simulation Mode.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await onReprocess();
      setMessage('Reprocessed. New qualification generated in Simulation Mode.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="padded" className="space-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-cyan-dim rounded-lg flex items-center justify-center text-brand-cyan">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-body-sm">Human Review & Decision</h3>
            <p className="text-caption text-text-muted">Override or confirm AI recommendation</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && (
          <div className={`p-3 rounded-lg ${message.startsWith('Recommendation') || message.startsWith('Reprocessed') ? 'bg-status-success-bg border border-status-success-border text-status-success-text' : message.startsWith('Lead rejected') ? 'bg-status-warning-bg border border-status-warning-border text-status-warning-text' : 'bg-status-error-bg border border-status-error-border text-status-error-text'}`}>
            {message}
          </div>
        )}

        <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4 space-y-4">
          <h4 className="font-bold text-text-primary text-body-sm">AI Recommendation</h4>
          <div className="grid grid-cols-2 gap-4 text-body-sm">
            <div>
              <span className="text-text-muted block">Stage</span>
              <span className="font-bold text-text-primary">{aiStage}</span>
            </div>
            <div>
              <span className="text-text-muted block">Score</span>
              <span className="font-bold text-text-primary">{aiScore}/100</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-caption text-text-muted mb-1 font-medium">Override Stage</label>
            <Select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              options={[
                { value: 'Sales Qualified', label: 'Sales Qualified' },
                { value: 'Marketing Qualified', label: 'Marketing Qualified' },
                { value: 'Review Required', label: 'Review Required' },
                { value: 'Disqualified', label: 'Disqualified' },
              ]}
            />
          </div>

          <div>
            <label className="block text-caption text-text-muted mb-1 font-medium">Override Score (0-100)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-caption text-text-muted mb-1 font-medium">Reviewer Notes (Required for Override)</label>
            <textarea
              rows={3}
              placeholder="Reason for score/stage adjustment or approval decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full input min-h-[80px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <Button variant="success" onClick={handleApprove} disabled={loading} loading={loading} className="gap-2">
              {loading ? <span className="animate-spin">⏳</span> : <CheckCircle2 className="w-4 h-4" />} Approve
            </Button>

            <Button variant="danger" onClick={handleReject} disabled={loading} loading={loading} className="gap-2">
              <XCircle className="w-4 h-4" /> Reject
            </Button>

            <Button variant="secondary" onClick={handleReprocess} disabled={loading} loading={loading} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Re-qualify
            </Button>
          </div>
        </div>

        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <Badge variant="info" size="sm" className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Simulation Mode - no external CRM or email actions will be performed
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}