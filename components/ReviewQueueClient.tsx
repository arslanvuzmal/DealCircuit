'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle, Loader2, Search, Filter, ChevronDown, MoreHorizontal, Edit3, X, CheckCircle2 as CheckCircle2Icon, XCircle as XCircleIcon, Zap, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/Avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/DropdownMenu';

const CATEGORIES = ['HOT', 'WARM', 'COLD', 'REVIEW_REQUIRED'];
const categoryLabels: Record<string, string> = { HOT: 'HOT', WARM: 'WARM', COLD: 'COLD', REVIEW_REQUIRED: 'REVIEW REQUIRED' };
const categoryVariants: Record<string, 'success' | 'warning' | 'neutral' | 'error' | 'info'> = { HOT: 'success', WARM: 'warning', COLD: 'neutral', REVIEW_REQUIRED: 'error' };

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <Badge variant="info" size="sm">PENDING</Badge>;
  return <Badge variant={categoryVariants[category] || 'neutral'} size="sm">{categoryLabels[category] || category}</Badge>;
}

function ReviewActions({ lead, onRefresh }: { lead: any; onRefresh: () => void }) {
  const [category, setCategory] = useState(lead.category || 'WARM');
  const [score, setScore] = useState(lead.totalScore || 70);
  const [notes, setNotes] = useState('');
  const [followUpBody, setFollowUpBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

      const handleApprove = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newCategory: category, newScore: Number(score), notes, followUpBody }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Approval failed');
      setMessage('Recommendation approved. CRM update, follow-up prepared in Simulation Mode. No external systems modified.'); onRefresh();
    } catch (err: any) { setMessage(`Error: ${err.message}`); } finally { setLoading(false); }
  };  const handleReject = async () => {
    setLoading(true); setMessage(null);
    try { const res = await fetch(`/api/leads/${lead.id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Rejection failed'); setMessage('Lead rejected. No external actions taken in Simulation Mode.'); onRefresh(); } catch (err: any) { setMessage(`Error: ${err.message}`); } finally { setLoading(false); }
  };
  const handleReprocess = async () => {
    setLoading(true); setMessage(null);
    try { const res = await fetch(`/api/leads/${lead.id}/reprocess`, { method: 'POST' }); const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Reprocess failed'); setMessage(`Reprocessed! Category: ${data.category}, Score: ${data.score}`); onRefresh(); } catch (err: any) { setMessage(`❌ Error: ${err.message}`); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="block text-caption text-text-muted mb-1 font-medium">Adjust Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full input input-sm"><option value="HOT">HOT (Immediate Sales Call)</option><option value="WARM">WARM (Nurture / Follow-up)</option><option value="COLD">COLD (Disqualified)</option><option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option></select></div>
        <div><label className="block text-caption text-text-muted mb-1 font-medium">Adjust Score (0-100)</label><input type="number" min={0} max={100} value={score} onChange={e => setScore(Number(e.target.value))} className="w-full input input-sm" /></div>
      </div>
      <div className="space-y-2"><label className="block text-caption text-text-muted font-medium">Reviewer Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full input input-sm" placeholder="Enter review rationale..." /></div>
      <div className="space-y-2"><label className="block text-caption text-text-muted font-medium">Follow-up Draft</label><textarea value={followUpBody} onChange={e => setFollowUpBody(e.target.value)} rows={3} className="w-full input input-sm" placeholder="Customize follow-up email..." /></div>
      {message && <div className={`p-3 rounded-lg text-sm ${message.startsWith('✅') ? 'bg-status-success-bg text-status-success border border-status-success-border' : 'bg-status-error-bg text-status-error border border-status-error-border'}`}>{message}</div>}
      <div className="flex items-center gap-2 pt-2 border-t border-border-subtle"><Button variant="success" onClick={handleApprove} disabled={loading} loading={loading}><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</Button><Button variant="danger" onClick={handleReject} disabled={loading} loading={loading}><XCircle className="w-4 h-4 mr-2" /> Reject</Button><Button variant="secondary" onClick={handleReprocess} disabled={loading} loading={loading}><Zap className="w-4 h-4 mr-2" /> Re-process</Button></div>
    </div>
  );
}

interface ReviewQueueClientProps { leads: any[]; }

export default function ReviewQueueClient({ leads }: ReviewQueueClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLeads = leads.filter(lead => { if (searchQuery && !lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.workEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false; if (categoryFilter && lead.category !== categoryFilter) return false; return true; }).sort((a, b) => { const aVal = a[sortBy]; const bVal = b[sortBy]; if (sortOrder === 'asc') return aVal > bVal ? 1 : -1; return aVal < bVal ? 1 : -1; });

  const handleRefresh = () => { console.log('Refresh triggered'); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-page-title text-text-primary flex items-center gap-2"><AlertTriangleIcon className="w-6 h-6 text-status-warning" /> Review Queue</h1><p className="text-body-sm text-text-muted mt-1">Leads requiring human review — low confidence, duplicates, security flags, or missing info</p></div>
        <Badge variant="warning" size="sm" className="flex items-center gap-1.5">{leads.length} Pending</Badge>
      </div>
      <Card variant="compact" className="space-y-4"><CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" /><Input placeholder="Search name, company, email…" className="pl-10" size="sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
          <Select placeholder="All Categories" options={[{ value: '', label: 'All Categories' }, { value: 'HOT', label: 'HOT' }, { value: 'WARM', label: 'WARM' }, { value: 'COLD', label: 'COLD' }, { value: 'REVIEW_REQUIRED', label: 'REVIEW REQUIRED' }]} size="sm" className="w-40" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} />
          <Select placeholder="Sort By" options={[{ value: 'createdAt', label: 'Date' }, { value: 'totalScore', label: 'Score' }, { value: 'fullName', label: 'Name' }]} size="sm" className="w-36" value={sortBy} onChange={e => setSortBy(e.target.value)} />
          <Select placeholder="Order" options={[{ value: 'desc', label: 'Descending' }, { value: 'asc', label: 'Ascending' }]} size="sm" className="w-36" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} />
        </div></CardContent></Card>
      <Card variant="padded" className="space-y-4"><CardContent className="p-0">
        {filteredLeads.length === 0 ? (<div className="p-12 text-center"><AlertTriangleIcon className="w-12 h-12 text-text-muted mx-auto mb-4" /><p className="text-body text-text-secondary">No leads require review at this time.</p></div>) : (<Table><TableHeader><TableRow><TableHeadCell className="w-64">Contact</TableHeadCell><TableHeadCell className="w-56">Company</TableHeadCell><TableHeadCell className="w-28 text-center">Category</TableHeadCell><TableHeadCell className="w-28 text-center">Score</TableHeadCell><TableHeadCell className="w-28 text-center">Confidence</TableHeadCell><TableHeadCell className="w-28 text-center">Why Review?</TableHeadCell><TableHeadCell className="w-36 text-right">Updated</TableHeadCell><TableHeadCell className="w-12 text-right">Actions</TableHeadCell></TableRow></TableHeader><TableBody>{filteredLeads.map((lead) => (<TableRow key={lead.id}><TableCell className="table-cell-primary"><div className="flex items-center gap-3"><Avatar name={lead.fullName} size="sm" /><div className="min-w-0"><div className="font-medium text-text-primary truncate">{lead.fullName}</div><div className="text-mono-sm text-text-muted truncate">{lead.workEmail}</div></div></div></TableCell><TableCell><div className="min-w-0"><div className="font-medium text-text-primary truncate">{lead.companyName}</div><div className="text-caption text-text-muted truncate">{lead.industry}</div></div></TableCell><TableCell className="text-center"><Badge variant={lead.category === 'HOT' ? 'success' : lead.category === 'WARM' ? 'warning' : lead.category === 'COLD' ? 'neutral' : 'error'} size="sm">{lead.category}</Badge></TableCell><TableCell className="text-center font-mono font-bold text-text-primary">{lead.totalScore !== null ? `${lead.totalScore}/100` : '—'}</TableCell><TableCell className="text-center"><Badge variant="neutral" size="sm">—</Badge></TableCell><TableCell className="text-center text-caption text-text-muted">{lead.isDuplicate ? 'Duplicate' : lead.category === 'REVIEW_REQUIRED' ? 'Low confidence / Security' : 'Missing info'}</TableCell><TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(lead.createdAt)}</TableCell><TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z" /></svg></Button><ReviewActions lead={lead} onRefresh={() => {}} /></div></TableCell></TableRow>))}</TableBody></Table>)}</CardContent><CardFooter className="flex items-center justify-between"><span className="text-caption text-text-muted">Showing {filteredLeads.length} of {leads.length} leads</span><div className="flex items-center gap-2"><Button variant="ghost" size="sm" disabled>Previous</Button><Button variant="ghost" size="sm" disabled>Next</Button></div></CardFooter></Card>
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (<Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="info" size="sm">DEMO MODE</Badge><span className="text-body-sm text-text-secondary">Data is simulated. <Link href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</Link></span></div></div></Card>)}
    </div>
  );
}