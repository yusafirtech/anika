import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@anikatrading.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, selectedRole);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const demoEmail = `${role}@anikatrading.com`;
    setEmail(demoEmail);
    const success = await login(demoEmail, role);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans text-slate-800">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 shadow-sm mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-teal-600">
            ANIKA TRADING &amp; CO.
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Management Console
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sign in to access corporate management and operations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700">Role Clearance Simulation</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            >
              <option value="admin">Administrator (Unrestricted Access)</option>
              <option value="manager">Operations Manager (Full Content/Leads, Read-only Users)</option>
              <option value="editor">Content Editor (Edit Products &amp; Hero, Restricted Settings)</option>
              <option value="viewer">Viewer (Read-only Compliance)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white shadow-sm shadow-teal-600/25 hover:bg-teal-500 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Console'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-8 border-t border-slate-100 pt-5">
          <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 text-center">
            Quick 1-Click Role Switcher for Testing
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="rounded-lg bg-rose-50 p-2 text-[11px] font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              ⚡ Login as Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('manager')}
              className="rounded-lg bg-amber-50 p-2 text-[11px] font-semibold text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              ⚡ Login as Manager
            </button>
            <button
              onClick={() => handleQuickDemoLogin('editor')}
              className="rounded-lg bg-teal-50 p-2 text-[11px] font-semibold text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              ⚡ Login as Editor
            </button>
            <button
              onClick={() => handleQuickDemoLogin('viewer')}
              className="rounded-lg bg-slate-100 p-2 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              ⚡ Login as Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
