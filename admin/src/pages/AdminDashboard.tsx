import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../api';
import {
  Briefcase,
  Package,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads] = useState(() => mockDb.getLeads());

  const pendingLeadsCount = leads.filter((l) => l.status === 'Pending').length;

  const kpis = [
    {
      title: 'Total Lead Inquiries',
      value: leads.length.toString(),
      trend: '+18.4% this month',
      isPositive: true,
      icon: FileText,
      accent: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      title: 'Pending B2B Reviews',
      value: pendingLeadsCount.toString(),
      trend: `${pendingLeadsCount} require triage`,
      isPositive: pendingLeadsCount === 0,
      icon: Clock,
      accent: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Active Export Products',
      value: '24',
      trend: '+3 new categories',
      isPositive: true,
      icon: Package,
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Active Tender Projects',
      value: '12',
      trend: '4 in execution',
      isPositive: true,
      icon: Briefcase,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-200 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>Authenticated Portal &middot; ANIKA TRADING &amp; CO.</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Monitor real-time international trade inquiries, supply chain operations, and manage corporate content across the ANIKA business ecosystem.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/leads"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-colors"
            >
              Review Pending Inquiries ({pendingLeadsCount})
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200/70 transition-colors"
            >
              View Live Website
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-teal-50/70 to-transparent" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${kpi.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-900">{kpi.value}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <TrendingUp className={`h-3.5 w-3.5 ${kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className={kpi.isPositive ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Shortcuts & Recent Inquiries Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Submissions Table (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Trade Inquiries &amp; Leads</h3>
              <p className="text-xs text-slate-500">Incoming B2B requirements and supply requests</p>
            </div>
            <Link
              to="/leads"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">{lead.company}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 border border-slate-200 font-medium">
                      {lead.sector}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{lead.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Contact: {lead.name} ({lead.email})
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      lead.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : lead.status === 'Reviewing'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts & Operational Status (1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Quick Shortcuts</h3>
            <p className="text-xs text-slate-500">Direct navigation to active managers</p>

            <div className="mt-4 space-y-2.5">
              <Link
                to="/products"
                className="group flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 hover:bg-slate-100 hover:border-teal-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-semibold text-slate-800">Manage Export Catalog</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/projects"
                className="group flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 hover:bg-slate-100 hover:border-teal-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">Update Project Portfolio</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/hero"
                className="group flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 hover:bg-slate-100 hover:border-teal-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-800">Hero Slide Banners</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/users"
                className="group flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 hover:bg-slate-100 hover:border-teal-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">RBAC User Management</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* System Health / Status */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-800">API Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Interceptors attached. Authentication token active. Mock storage persistence configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
