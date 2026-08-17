'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Badge } from './ui/Badge';
import { Avatar } from './Avatar';
import { useSidebar } from '@/app/dashboard/client-layout';
import {
  LayoutDashboard,
  Users,
  Brain,
  ClipboardList,
  Database,
  GitBranch,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  disabled?: boolean;
}

const navigation: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
  { label: 'Intelligence Lab', href: '/dashboard/intelligence', icon: <Brain className="w-5 h-5" /> },
  { label: 'Review Queue', href: '/dashboard/review-queue', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'CRM', href: '/dashboard/crm', icon: <Database className="w-5 h-5" /> },
  { label: 'Workflows', href: '/dashboard/workflows', icon: <GitBranch className="w-5 h-5" /> },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Audit Trail', href: '/dashboard/audit', icon: <FileText className="w-5 h-5" /> },
  { label: 'Team', href: '/dashboard/team', icon: <Users className="w-5 h-5" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.disabled) return;
    if (mobileOpen) setMobileOpen(false);
  };

  if (mobileOpen) {
    return (
      <>
        <div
          className="fixed inset-0 z-[250] bg-overlay-modal animate-fade-in lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <aside className="fixed left-0 top-0 bottom-0 z-[300] w-sidebar-expanded bg-surface border-r border-border-subtle animate-slide-in-right lg:hidden" role="navigation" aria-label="Main navigation">
          <div className="flex flex-col h-full">
            {renderSidebarContent()}
          </div>
        </aside>
      </>
    );
  }

  function renderSidebarContent() {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    return (
      <>
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-border-subtle">
          <Logo variant="sidebar" size={collapsed ? 'sm' : 'md'} />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="btn-ghost p-1.5 rounded-md hover:bg-surface-interactive transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-text-muted" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
              onClick={handleItemClick}
              onMouseEnter={setHoveredItem}
              onMouseLeave={() => setHoveredItem(null)}
            />
          ))}
        </nav>

        {/* Bottom: Environment + User */}
        <div className="border-t border-border-subtle p-3 space-y-3">
          {/* Environment Badge */}
          <div className={cn('flex items-center gap-2 px-2 py-1.5', collapsed && 'justify-center')}>
            <Badge
              variant={isDemo ? 'info' : 'success'}
              size="xs"
              className={cn(collapsed && 'px-1.5')}
            >
              {isDemo ? 'DEMO' : 'PROD'}
            </Badge>
            {!collapsed && (
              <span className="text-caption text-text-muted truncate">
                {isDemo ? 'Demo Mode' : 'Production'}
              </span>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar name="Admin User" size="sm" status="online" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-text-primary truncate">Admin User</p>
                <p className="text-caption text-text-muted truncate">admin@leadpilot.ai</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-[200] bg-surface border-r border-border-subtle transition-all duration-200 ease-default flex flex-col',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar-expanded',
          'lg:block hidden'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {renderSidebarContent()}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="absolute -right-5 top-14 z-10 btn-ghost p-1.5 rounded-full shadow-floating hover:bg-surface-raised transition-all"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted" />
          </button>
        )}
      </aside>

      {/* Collapsed Sidebar Expand Button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-[4rem] top-14 z-10 lg:block hidden btn-ghost p-1.5 rounded-full shadow-floating hover:bg-surface-raised transition-all"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5 text-text-muted" />
        </button>
      )}

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed left-3 top-3 z-[350] btn-ghost p-2 rounded-md shadow-floating"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6 text-text-primary" />
      </button>
    </>
  );
}

/** Individual Nav Item with tooltip support when collapsed */
function NavItemComponent({
  item,
  isActive,
  collapsed,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: (item: NavItem) => void;
  onMouseEnter: (label: string) => void;
  onMouseLeave: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (collapsed) {
      tooltipTimeout.current = setTimeout(() => setShowTooltip(true), 300);
      onMouseEnter(item.label);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    setShowTooltip(false);
    onMouseLeave();
  };

  const handleClick = () => onClick(item);

  if (collapsed) {
    return (
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link
          href={item.href}
          onClick={(e) => { if (item.disabled) e.preventDefault(); else handleClick(); }}
          className={cn(
            'flex items-center justify-center h-10 px-3 rounded-lg transition-colors duration-120',
            isActive
              ? 'bg-surface-highlight text-brand-cyan border-l-2 border-brand-cyan'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-interactive',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={item.disabled}
          aria-label={item.label}
        >
          {item.icon}
          {item.badge && (
            <Badge variant={item.badgeVariant || 'neutral'} size="xs" className="ml-1">
              {item.badge}
            </Badge>
          )}
        </Link>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 surface-raised border border-border-subtle rounded-md px-2.5 py-1.5 text-body-sm text-text-secondary whitespace-nowrap shadow-floating animate-slide-up z-[600]">
            {item.label}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={(e) => { if (item.disabled) e.preventDefault(); else handleClick(); }}
      className={cn(
        'flex items-center gap-2.5 h-10 px-3 rounded-lg transition-colors duration-120',
        isActive
          ? 'bg-surface-highlight text-brand-cyan border-l-2 border-brand-cyan'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-interactive',
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={item.disabled}
    >
      {item.icon}
      <span className="truncate text-nav">{item.label}</span>
      {item.badge && (
        <Badge variant={item.badgeVariant || 'neutral'} size="xs" className="ml-auto">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}