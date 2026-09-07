import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionResource, PermissionAction } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PermissionGuardProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  children,
}) => {
  const { hasPermission, role } = useAuth();
  const navigate = useNavigate();

  if (!hasPermission(resource, action)) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-sm mb-6">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 border border-slate-200 mb-3">
          Role Restricted: {role?.toUpperCase() || 'UNKNOWN'}
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Access Restricted
        </h2>
        <p className="mt-3 max-w-md text-sm text-slate-600 leading-relaxed">
          Your current account does not have sufficient clearance to <span className="text-amber-700 font-semibold">{action}</span> the <span className="text-slate-900 font-semibold">{resource}</span> module.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
