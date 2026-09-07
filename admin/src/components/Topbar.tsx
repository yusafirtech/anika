import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface TopbarProps {
  onOpenMobile: () => void;
  collapsed: boolean;
}

const BREADCRUMB_MAP: Record<string, { group: string; title: string }> = {
  '/': { group: 'Overview', title: 'Operational Dashboard' },
  '/products': { group: 'Content Management', title: 'Export & Trade Products' },
  '/projects': { group: 'Content Management', title: 'Construction & Engineering Projects' },
  '/hero': { group: 'Content Management', title: 'Homepage Hero Slides' },
  '/team': { group: 'Content Management', title: 'Corporate Leadership & Team' },
  '/partners': { group: 'Content Management', title: 'Global Partners' },
  '/leads': { group: 'Operations', title: 'B2B Trade Inquiries & Leads' },
  '/users': { group: 'System & Security', title: 'Access Control & User Provisioning (RBAC)' },
  '/settings': { group: 'System & Security', title: 'Platform Settings' },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile, collapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  const current = BREADCRUMB_MAP[location.pathname] || {
    group: 'Admin Console',
    title: 'Workspace Management',
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-xl shadow-xs transition-all duration-300 ${
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{current.group}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-bold text-slate-800 truncate">{current.title}</span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, role indicator */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200/70 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3 w-3 text-slate-500" />
        </a>

        <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-1.5 text-xs border border-slate-200">
          <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
            {user?.role} Access
          </span>
        </div>

        <div className="relative">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
