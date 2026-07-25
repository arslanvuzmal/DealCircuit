'use client';

import React, { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';

export default function ScoringRulesEditor({ rules: initialRules }: { rules: any[] }) {
  const [rules, setRules] = useState(initialRules);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const handleSave = async (rule: any) => {
    setSavingKey(rule.criterionKey);
    setSuccessKey(null);
    try {
      const res = await fetch('/api/scoring-rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criterionKey: rule.criterionKey,
          maxScore: Number(rule.maxScore),
          weight: Number(rule.weight),
        }),
      });
      if (!res.ok) throw new Error('Failed to update rule');
      setSuccessKey(rule.criterionKey);
      setTimeout(() => setSuccessKey(null), 3000);
    } catch (err) {
      alert('Error updating rule. Admin role required.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleChange = (key: string, field: string, val: any) => {
    setRules((prev) =>
      prev.map((r) => (r.criterionKey === key ? { ...r, [field]: val } : r))
    );
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.criterionKey} className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-dark-bright text-sm">{rule.name}</h3>
            <span className="text-xs text-dark-muted font-mono">Key: {rule.criterionKey}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <label className="block text-dark-muted mb-1 font-medium">Max Points</label>
              <input
                type="number"
                min={1}
                max={50}
                value={rule.maxScore}
                onChange={(e) => handleChange(rule.criterionKey, 'maxScore', e.target.value)}
                className="w-24 bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-dark-muted mb-1 font-medium">Weight Multiplier</label>
              <input
                type="number"
                step="0.1"
                min={0.1}
                max={3.0}
                value={rule.weight}
                onChange={(e) => handleChange(rule.criterionKey, 'weight', e.target.value)}
                className="w-24 bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-dark-bright focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="pt-5">
              <button
                onClick={() => handleSave(rule)}
                disabled={savingKey === rule.criterionKey}
                className="px-3.5 py-1.5 bg-brand-cyan hover:opacity-90 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1 shadow disabled:opacity-50"
              >
                {savingKey === rule.criterionKey ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : successKey === rule.criterionKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-emerald" /> Saved
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
