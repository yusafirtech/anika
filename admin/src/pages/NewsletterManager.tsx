import React, { useState, useEffect, useMemo } from 'react';
import { NewsletterSubscriber } from '../types';
import { backendApi } from '../api';
import { Search, Download, Trash2, Loader2, Mail } from 'lucide-react';

export const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    backendApi.newsletter.getAll().then((data) => {
      setSubscribers(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter(
      (s) => s.email.toLowerCase().includes(term) || (s.name || '').toLowerCase().includes(term)
    );
  }, [subscribers, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    await backendApi.newsletter.delete(id);
  };

  const handleExportCSV = () => {
    const headers = ['Email,Name,Source,Status,Subscribed'];
    const rows = filtered.map((s) =>
      [s.email, `"${(s.name || '').replace(/"/g, '""')}"`, s.source || '', s.status, s.subscribedAt].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `anika_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Buyers and partners who opted in for market updates and export news.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs transition-all"
        >
          <Download className="h-4 w-4 text-slate-500" /> Export CSV ({filtered.length})
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email or name..."
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Source</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Subscribed</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Mail className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{s.email}</td>
                    <td className="px-5 py-4">{s.name || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
                        {s.source || 'website'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                          s.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
