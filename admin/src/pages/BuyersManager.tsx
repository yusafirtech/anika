import React, { useState, useEffect, useMemo } from 'react';
import { BuyerAccount } from '../types';
import { backendApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Trash2, Loader2, Users, ShieldCheck, ShieldAlert } from 'lucide-react';

export const BuyersManager: React.FC = () => {
  const { hasPermission } = useAuth();
  const [buyers, setBuyers] = useState<BuyerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    backendApi.buyers.getAll().then((data) => {
      setBuyers(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return buyers;
    return buyers.filter(
      (b) =>
        b.email.toLowerCase().includes(term) ||
        b.name.toLowerCase().includes(term) ||
        (b.company || '').toLowerCase().includes(term)
    );
  }, [buyers, searchTerm]);

  const handleToggleVerified = async (buyer: BuyerAccount) => {
    const next = !buyer.emailVerified;
    setBuyers((prev) => prev.map((b) => (b.id === buyer.id ? { ...b, emailVerified: next } : b)));
    const ok = await backendApi.buyers.setVerified(buyer.id, next);
    if (!ok) {
      setActionError('Could not update verification status. Reloading current data.');
      setTimeout(() => setActionError(null), 3500);
      backendApi.buyers.getAll().then(setBuyers);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this buyer account permanently? Their past leads and quotations will remain but will no longer show in any dashboard.')) return;
    setBuyers((prev) => prev.filter((b) => b.id !== id));
    const ok = await backendApi.buyers.delete(id);
    if (!ok) {
      setActionError('Could not delete this buyer account. Reloading current data.');
      setTimeout(() => setActionError(null), 3500);
      backendApi.buyers.getAll().then(setBuyers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-rose-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          {actionError}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Buyer Accounts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Registered buyer-portal accounts and how many inquiries/quotations each has on file.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Buyer</th>
                <th className="px-5 py-3.5 font-semibold">Country</th>
                <th className="px-5 py-3.5 font-semibold">Inquiries</th>
                <th className="px-5 py-3.5 font-semibold">Quotations</th>
                <th className="px-5 py-3.5 font-semibold">Email Verified</th>
                <th className="px-5 py-3.5 font-semibold">Joined</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                    No buyer accounts yet.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{b.company || b.name}</div>
                      <div className="text-slate-500">{b.name} &middot; {b.email}</div>
                    </td>
                    <td className="px-5 py-4">{b.country || '—'}</td>
                    <td className="px-5 py-4 font-semibold">{b.leadCount}</td>
                    <td className="px-5 py-4 font-semibold">{b.quotationCount}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => hasPermission('buyers', 'edit') && handleToggleVerified(b)}
                        disabled={!hasPermission('buyers', 'edit')}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                          b.emailVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                        title={hasPermission('buyers', 'edit') ? 'Click to toggle' : undefined}
                      >
                        {b.emailVerified ? (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldAlert className="h-3.5 w-3.5" />
                        )}
                        {b.emailVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      {hasPermission('buyers', 'delete') && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
