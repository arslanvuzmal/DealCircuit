'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { Button } from './ui/Button';
import { Badge, type BadgeProps } from './ui/Badge';
import { Input } from './ui/Input';
import {
  Search,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  Command,
  HelpCircle,
  Shield,
  AlertTriangle,
  XCircle,
  Info,
  Users,
  Brain,
  ClipboardList,
  Database,
  GitBranch,
  BarChart3,
  FileText,
} from 'lucide-react';

export function TopBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Keyboard shortcut: ⌘K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Demo mode indicator
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <header className="topbar fixed left-0 right-0 top-0 z-[100] bg-surface/95 backdrop-blur-sm border-b border-border-subtle">
      <div className="flex items-center h-topbar-height px-4 sm:px-6 lg:px-8">
        {/* Mobile sidebar trigger */}
        <button
          className="lg:hidden btn-ghost p-2 mr-3"
          onClick={() => document.dispatchEvent(new CustomEvent('sidebar:toggle'))}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo (only on mobile or collapsed sidebar) */}
        <Logo variant="sidebar" size="md" className="lg:hidden" onClick={() => window.location.href = '/dashboard'} />

        {/* Search / Command Palette */}
        <div className="relative flex-1 max-w-xl mx-4 lg:mx-8">
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'btn-ghost w-full justify-start px-3 py-2',
              'bg-surface-interactive border border-border-subtle',
              'hover:border-border-focus hover:bg-surface-highlight',
              'transition-all duration-120',
              'text-text-muted',
              searchOpen && 'border-brand-cyan bg-surface-highlight'
            )}
            aria-label="Search leads, companies, workflows... (⌘K)"
            aria-expanded={searchOpen}
          >
            <Search className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate text-body-sm">Search leads, companies, workflows…</span>
            <kbd className="ml-auto px-1.5 py-0.5 text-[0.625rem] font-mono text-text-muted bg-surface rounded border border-border-subtle">
              ⌘K
            </kbd>
          </button>

          {/* Command Palette Modal */}
          {searchOpen && (
            <CommandPalette
              onClose={() => setSearchOpen(false)}
              initialQuery={searchQuery}
              onQueryChange={setSearchQuery}
              ref={searchRef}
            />
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 lg:gap-2 ml-auto">
          {/* Environment Badge */}
          {isDemo && (
            <Badge variant="info" size="xs" className="hidden sm:inline-flex mr-2 px-2 py-1">
              DEMO
            </Badge>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-lg"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="btn-ghost p-2 rounded-lg relative"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-status-error rounded-full" aria-hidden="true" />
            </button>

            {notificationsOpen && (
              <NotificationDropdown onClose={() => setNotificationsOpen(false)} />
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-interactive transition-colors"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <Avatar name="Admin User" size="sm" status="online" />
              <span className="hidden md:block text-body-sm font-medium text-text-primary">Admin User</span>
              <ChevronDown className="w-4 h-4 text-text-muted hidden md:block" />
            </button>

            {userMenuOpen && (
              <UserDropdown onClose={() => setUserMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/** Command Palette - Global Search */
function CommandPalette({
  onClose,
  initialQuery,
  onQueryChange,
  ref,
}: {
  onClose: () => void;
  initialQuery: string;
  onQueryChange: (q: string) => void;
  ref: React.RefObject<HTMLInputElement>;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const results = getSearchResults(query);

  useEffect(() => {
    setQuery(initialQuery);
    onQueryChange(initialQuery);
  }, [initialQuery, onQueryChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].onSelect();
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[500] animate-fade-in" onClick={onClose}>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl animate-slide-down">
        <div className="surface-raised border border-border-subtle rounded-xl shadow-floating overflow-hidden">
          <div className="p-4 border-b border-border-subtle">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={ref}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); onQueryChange(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-3 bg-surface border border-border rounded-lg text-text-primary text-body focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30"
                placeholder="Search leads, companies, workflows…"
                autoFocus
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[0.625rem] font-mono text-text-muted bg-surface rounded border border-border-subtle">
                ⎋ Close
              </kbd>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-body-sm">No results found</p>
                <p className="text-caption">Try a different search term</p>
              </div>
            ) : (
              <ul role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                  <li
                    key={result.id}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={result.onSelect}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                      index === selectedIndex
                        ? 'bg-surface-highlight text-text-primary'
                        : 'hover:bg-surface-interactive text-text-secondary'
                    )}
                  >
                    <result.icon className={cn('w-5 h-5 flex-shrink-0', index === selectedIndex ? 'text-brand-cyan' : 'text-text-muted')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium truncate">{result.title}</p>
                      <p className="text-caption text-text-muted truncate">{result.description}</p>
                    </div>
                    {result.badge && (
                      <Badge variant={(result.badgeVariant as BadgeProps['variant']) || 'neutral'} size="xs">
                        {result.badge}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-border-subtle text-right">
            <span className="text-caption text-text-muted">
              <kbd className="px-1.5 py-0.5 text-[0.625rem] font-mono bg-surface rounded border border-border-subtle">⌘K</kbd> to open
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function getSearchResults(query: string) {
  const allResults = [
    { id: 'leads', title: 'Leads', description: 'Browse and manage all leads', icon: Users, href: '/dashboard/leads', badge: '12 new', badgeVariant: 'info' },
    { id: 'intelligence', title: 'Intelligence Lab', description: 'Analyze leads with AI', icon: Brain, href: '/dashboard/intelligence' },
    { id: 'review', title: 'Review Queue', description: 'Leads requiring human review', icon: ClipboardList, href: '/dashboard/review-queue', badge: '3 pending', badgeVariant: 'warning' },
    { id: 'crm', title: 'CRM Integration', description: 'Manage CRM connections', icon: Database, href: '/dashboard/crm' },
    { id: 'workflows', title: 'Workflows', description: 'Monitor n8n workflow runs', icon: GitBranch, href: '/dashboard/workflows' },
    { id: 'analytics', title: 'Analytics', description: 'View operational metrics', icon: BarChart3, href: '/dashboard/analytics' },
    { id: 'audit', title: 'Audit Trail', description: 'View execution history', icon: FileText, href: '/dashboard/audit' },
    { id: 'settings', title: 'Settings', description: 'Configure workspace', icon: Settings, href: '/dashboard/settings' },
  ];

  if (!query.trim()) return allResults.slice(0, 6).map(r => ({
      ...r,
      onSelect: () => window.location.href = r.href,
    }));

  const q = query.toLowerCase();
  return allResults
    .filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    .map(r => ({
      ...r,
      onSelect: () => window.location.href = r.href,
      badgeVariant: r.badgeVariant,
    }));
}

/** Notification Dropdown */
function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const notifications = [
    { id: 1, title: 'CRM sync completed', description: 'HubSpot sync finished successfully', time: '2 min ago', type: 'success' },
    { id: 2, title: 'Review required', description: 'Lead L-2024-045 needs approval', time: '15 min ago', type: 'warning' },
    { id: 3, title: 'Workflow retry', description: 'Failed event recovered on attempt #2', time: '1 hour ago', type: 'info' },
    { id: 4, title: 'Duplicate detected', description: 'Lead L-2024-038 merged with existing', time: '3 hours ago', type: 'info' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[450]" onClick={onClose}>
      <div className="absolute right-4 top-20 w-80 animate-slide-down">
        <div className="surface-raised border border-border-subtle rounded-xl shadow-floating overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h3 className="text-card-title text-text-primary">Notifications</h3>
            <button onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={onClose}
                className="w-full p-4 hover:bg-surface-interactive transition-colors text-left border-b border-border-subtle last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    n.type === 'success' && 'bg-status-success-bg text-status-success',
                    n.type === 'warning' && 'bg-status-warning-bg text-status-warning',
                    n.type === 'error' && 'bg-status-error-bg text-status-error',
                    n.type === 'info' && 'bg-status-info-bg text-status-info'
                  )}>
                    {n.type === 'success' && <Shield className="w-4 h-4" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {n.type === 'error' && <XCircle className="w-4 h-4" />}
                    {n.type === 'info' && <Info className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-text-primary">{n.title}</p>
                    <p className="text-caption text-text-muted truncate">{n.description}</p>
                    <p className="text-mono-sm text-text-muted mt-1">{n.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border-subtle">
            <button onClick={onClose} className="btn-ghost w-full text-sm">View all notifications</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** User Dropdown Menu */
function UserDropdown({ onClose }: { onClose: () => void }) {
  const menuItems = [
    { label: 'Profile', icon: User, href: '/dashboard/profile' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { label: 'Help & Docs', icon: HelpCircle, href: '/docs', external: true },
    { type: 'divider' as const },
    { label: 'Sign out', icon: LogOut, action: () => { /* handle sign out */ }, variant: 'danger' as const },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[450]" onClick={onClose}>
      <div className="absolute right-4 top-20 w-56 animate-slide-down">
        <div className="surface-raised border border-border-subtle rounded-xl shadow-floating overflow-hidden py-1">
          {menuItems.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={`divider-${index}`} className="h-px bg-border-subtle mx-2 my-1" />;
            }
            return (
              <button
                key={item.label}
                onClick={() => { if (item.action) item.action(); else if (item.href) window.location.href = item.href; onClose(); }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-body-sm transition-colors',
                  item.variant === 'danger' ? 'text-status-error hover:bg-status-error/10' : 'text-text-secondary hover:bg-surface-interactive hover:text-text-primary'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}