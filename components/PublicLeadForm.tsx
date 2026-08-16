'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function PublicLeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    companyName: '',
    companyWebsite: '',
    industry: 'Software / SaaS',
    companySize: '51-200',
    serviceRequired: 'Custom AI Lead Scoring & CRM Automation',
    budgetRange: '$25k-$50k',
    desiredTimeline: '1-3 Months',
    decisionAuthority: 'Final Decision Maker',
    projectDescription: '',
    leadSource: 'Website Form',
    consent: true,
    websiteHoneypot: '', // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit lead inquiry.');
      }

      setSubmittedResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 max-w-2xl mx-auto shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-brand-emerald/10 border border-brand-emerald/30 rounded-full flex items-center justify-center mx-auto text-brand-emerald">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-dark-bright">Inquiry Received & Processed!</h2>
        <p className="text-dark-muted max-w-lg mx-auto">
          Thank you, <span className="text-dark-bright font-semibold">{formData.fullName}</span>. Your submission has been securely ingested and evaluated by DealCircuit.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left bg-dark-bg/60 p-4 rounded-lg border border-dark-border text-sm">
          <div>
            <span className="text-xs text-dark-muted block">Reference ID</span>
            <span className="font-mono text-brand-cyan text-xs">{submittedResult.leadId}</span>
          </div>
          <div>
            <span className="text-xs text-dark-muted block">Qualification Score</span>
            <span className="font-bold text-brand-emerald">{submittedResult.score}/100</span>
          </div>
          <div>
            <span className="text-xs text-dark-muted block">Category</span>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              {submittedResult.category}
            </span>
          </div>
          <div>
            <span className="text-xs text-dark-muted block">Response Time</span>
            <span className="text-dark-bright font-medium">Based on qualification</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmittedResult(null);
            setFormData((prev) => ({ ...prev, projectDescription: '' }));
          }}
          className="px-6 py-2.5 bg-dark-hover hover:bg-dark-border text-dark-bright rounded-lg border border-dark-border text-sm font-medium transition"
        >
          Submit Another Lead Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-3xl mx-auto">
      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        name="websiteHoneypot"
        value={formData.websiteHoneypot}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden opacity-0 absolute -top-9999px -left-9999px pointer-events-none"
      />

      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-dark-bright flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-cyan" /> Submit Project Requirements
          </h2>
          <p className="text-xs text-dark-muted mt-1">Get an instant AI qualification assessment and tailored solution proposal.</p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-full flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Demo Mode Ready
        </span>
      </div>

      {error && (
        <div className="bg-brand-coral/10 border border-brand-coral/30 rounded-lg p-4 flex items-center gap-3 text-brand-coral text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            required
            placeholder="Jane Doe"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Work Email *</label>
          <input
            type="email"
            name="workEmail"
            required
            placeholder="jane@acmecorp.com"
            value={formData.workEmail}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Company Name *</label>
          <input
            type="text"
            name="companyName"
            required
            placeholder="Acme Technologies"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Company Website</label>
          <input
            type="text"
            name="companyWebsite"
            placeholder="acmecorp.com"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Industry *</label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option>Software / SaaS</option>
            <option>FinTech / Financial Services</option>
            <option>Healthcare / BioTech</option>
            <option>E-commerce / Retail</option>
            <option>Real Estate & PropTech</option>
            <option>Agency / Consulting</option>
            <option>Professional Services</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Company Size *</label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option>1-10 Employees</option>
            <option>11-50 Employees</option>
            <option>51-200 Employees</option>
            <option>201-500 Employees</option>
            <option>500+ Employees</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Budget Range *</label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option>$50k-$100k+ (Enterprise)</option>
            <option>$25k-$50k (Growth)</option>
            <option>$10k-$25k (Mid-market)</option>
            <option>Under $10k (Starter)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1">Desired Timeline *</label>
          <select
            name="desiredTimeline"
            value={formData.desiredTimeline}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
          >
            <option>&lt;1 Month (Immediate)</option>
            <option>1-3 Months</option>
            <option>3-6 Months</option>
            <option>Exploratory</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-dark-muted mb-1">Decision Authority *</label>
        <select
          name="decisionAuthority"
          value={formData.decisionAuthority}
          onChange={handleChange}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
        >
          <option>Final Decision Maker (C-Level / Founder / Owner)</option>
          <option>Evaluator & Recommender (VP / Director / Manager)</option>
          <option>Team Lead / Individual Contributor</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-dark-muted mb-1">Project Description & Goals *</label>
        <textarea
          name="projectDescription"
          rows={4}
          required
          placeholder="Describe your current lead volume, CRM stack, automation requirements, and specific business goals..."
          value={formData.projectDescription}
          onChange={handleChange}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-bright focus:outline-none focus:border-brand-cyan"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          className="w-4 h-4 accent-brand-cyan rounded bg-dark-bg border-dark-border"
        />
        <label htmlFor="consent" className="text-xs text-dark-muted">
          I consent to DealCircuit processing my project requirements and generating automated follow-up communications.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Lead Requirements...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Inquiry & Trigger DealCircuit
          </>
        )}
      </button>
    </form>
  );
}
