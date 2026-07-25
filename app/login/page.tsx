'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@leadpilot.ai');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg">
            LP
          </div>
          <h1 className="text-2xl font-bold text-dark-bright tracking-tight">Admin Console Login</h1>
          <p className="text-xs text-dark-muted">Sign in to access LeadPilot AI administration and review queue</p>
        </div>

        {error && (
          <div className="bg-brand-coral/10 border border-brand-coral/30 rounded-lg p-3 flex items-center gap-2 text-brand-coral text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-dark-muted absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-dark-muted absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="bg-dark-bg/60 border border-dark-border rounded-lg p-3 text-xs space-y-1 text-dark-muted">
          <div className="font-semibold text-dark-bright flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" /> Seeded Demo Credentials:
          </div>
          <div>Admin: <code className="text-brand-cyan">admin@leadpilot.ai</code> / <code className="text-dark-bright">admin123</code></div>
          <div>Reviewer: <code className="text-brand-cyan">reviewer@leadpilot.ai</code> / <code className="text-dark-bright">admin123</code></div>
        </div>
      </div>
    </div>
  );
}
