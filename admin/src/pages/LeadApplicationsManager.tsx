import React, { useState, useMemo, useEffect } from 'react';
import { LeadApplication } from '../types';
import { backendApi } from '../api';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  Save,
  CheckCircle2,
  Loader2,
  Globe,
  Tag,
  FileText,
} from 'lucide-react';

const BangladeshiBuyerBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
    <span className="relative inline-block h-2.5 w-3.5 overflow-hidden rounded-[2px] bg-[#006a4e]" aria-hidden>
      <span className="absolute left-[30%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#f42a41]" />
    </span>
    Bangladeshi Buyer
  </span>
);

export const LeadApplicationsManager: React.FC = () => {
  const [leads, setLeads] = useState<LeadApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [buyerFilter, setBuyerFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<LeadApplication | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    let cancelled = false;
    backendApi.leads.getAll().then((data) => {
      if (!cancelled) {
        setLeads(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchSector = sectorFilter === 'All' || l.sector === sectorFilter;
      const matchBuyer = buyerFilter === 'All' || l.buyerType === buyerFilter;
      return matchSearch && matchStatus && matchSector && matchBuyer;
    });
  }, [leads, searchTerm, statusFilter, sectorFilter, buyerFilter]);

  const sectorOptions = useMemo(
    () => Array.from(new Set(leads.map((l) => l.sector).filter(Boolean))).sort(),
    [leads]
  );
  const bangladeshCount = leads.filter((l) => l.buyerType === 'bangladesh').length;

  const handleStatusChange = (id: string, newStatus: LeadApplication['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    backendApi.leads.update(id, { status: newStatus });
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    const updated = leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: internalNotes } : l));
    setLeads(updated);
    setSelectedLead({ ...selectedLead, notes: internalNotes });
    backendApi.leads.update(selectedLead.id, { notes: internalNotes }).then((ok) => {
      if (ok) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this lead record?')) return;
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    if (selectedLead?.id === id) setSelectedLead(null);
    backendApi.leads.delete(id);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Buyer Type,Company,Contact Name,Email,Phone,Country,Subject,Sector,Status,Budget,Date,Message'];
    const rows = filteredLeads.map((l) =>
      [
        l.id,
        l.buyerType === 'bangladesh' ? 'Bangladeshi Buyer' : 'International',
        `"${l.company.replace(/"/g, '""')}"`,
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        `"${l.phone}"`,
        `"${(l.country || '').replace(/"/g, '""')}"`,
        `"${(l.subject || '').replace(/"/g, '""')}"`,
        l.sector,
        l.status,
        `"${l.budget || ''}"`,
        l.createdAt,
        `"${l.message.replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anika_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Lead Inquiries &amp; Applications Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Triage, update status, maintain internal notes, and export B2B export and tender applications.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs transition-all"
        >
          <Download className="h-4 w-4 text-slate-500" /> Export CSV ({filteredLeads.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, contact name, email, keyword..."
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Inquiry Types</option>
            {sectorOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={buyerFilter}
            onChange={(e) => setBuyerFilter(e.target.value)}
            className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Buyers</option>
            <option value="bangladesh">Bangladeshi Buyers ({bangladeshCount})</option>
            <option value="international">International</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Company / Lead</th>
                <th className="px-5 py-3.5 font-semibold">Sector</th>
                <th className="px-5 py-3.5 font-semibold">Budget Range</th>
                <th className="px-5 py-3.5 font-semibold">Received</th>
                <th className="px-5 py-3.5 font-semibold">Status (Dropdown)</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching inquiries found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{lead.company || lead.name}</span>
                          {lead.buyerType === 'bangladesh' && <BangladeshiBuyerBadge />}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                          <span>{lead.name}</span> &middot;{' '}
                          <span className="text-slate-400">{lead.email}</span>
                        </div>
                        {lead.subject && <div className="mt-0.5 text-slate-600 truncate max-w-xs">{lead.subject}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
                        {lead.sector}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {lead.budget || 'Unspecified'}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value as LeadApplication['status'])
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border focus:outline-none ${
                          lead.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : lead.status === 'Reviewing'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : lead.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setInternalNotes(lead.notes || '');
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="View Inquiry Details & Notes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                  Lead ID #{selectedLead.id}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{selectedLead.company || selectedLead.name}</h3>
                  {selectedLead.buyerType === 'bangladesh' && <BangladeshiBuyerBadge />}
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200 text-slate-700">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span>Contact: <strong>{selectedLead.name}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Email: <a href={`mailto:${selectedLead.email}`} className="text-teal-600 underline font-semibold">{selectedLead.email}</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>Phone: <strong>{selectedLead.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Date: <strong>{new Date(selectedLead.createdAt).toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <span>Country: <strong>{selectedLead.country || '—'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-400" />
                  <span>Inquiry: <strong>{selectedLead.sector}</strong></span>
                </div>
                {selectedLead.subject && (
                  <div className="col-span-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Subject: <strong>{selectedLead.subject}</strong></span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Client Requirements &amp; Message:</label>
                <div className="rounded-xl bg-slate-50 p-4 text-slate-800 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Internal Notes Editor */}
              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Internal Collaboration Notes:</label>
                  {saveToast && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" /> Saved!
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record call logs, compliance notes, quote terms, or partner specs..."
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Drawer actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) =>
                      handleStatusChange(selectedLead.id, e.target.value as LeadApplication['status'])
                    }
                    className="rounded-lg bg-slate-50 px-3 py-1.5 text-slate-800 border border-slate-200 font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-500"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
