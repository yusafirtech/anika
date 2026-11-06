import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Quotation, QuotationLineItem, QuotationStatus } from '../types';
import { backendApi } from '../api';
import {
  Search,
  Plus,
  Trash2,
  X,
  Eye,
  Download,
  Pencil,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const STATUS_OPTIONS: QuotationStatus[] = ['draft', 'sent', 'accepted', 'expired'];

const STATUS_STYLES: Record<QuotationStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  sent: 'bg-sky-50 text-sky-700 border-sky-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-rose-50 text-rose-700 border-rose-200',
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'BDT', 'AED'];
const UNITS = ['KG', 'MT', 'Carton', '20ft Container', '40ft Container', 'Piece'];

const inputClass =
  'w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900';
const labelClass = 'block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5';

type DraftQuotation = {
  leadId?: string;
  status: QuotationStatus;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerCountry: string;
  lineItems: QuotationLineItem[];
  currency: string;
  incoterm: string;
  destinationPort: string;
  paymentTerms: string;
  validUntil: string;
  notes: string;
};

const emptyLineItem = (): QuotationLineItem => ({ description: '', hsCode: '', quantity: '', unit: 'KG', unitPrice: 0 });

const emptyDraft = (): DraftQuotation => ({
  leadId: undefined,
  status: 'draft',
  buyerName: '',
  buyerCompany: '',
  buyerEmail: '',
  buyerCountry: '',
  lineItems: [emptyLineItem()],
  currency: 'USD',
  incoterm: '',
  destinationPort: '',
  paymentTerms: '',
  validUntil: '',
  notes: '',
});

function lineTotal(item: QuotationLineItem): number {
  return (parseFloat(item.quantity) || 0) * (Number(item.unitPrice) || 0);
}

function quotationTotal(items: QuotationLineItem[]): number {
  return items.reduce((sum, i) => sum + lineTotal(i), 0);
}

export const QuotationsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | QuotationStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftQuotation>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Quotation | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const load = () => {
    setIsLoading(true);
    backendApi.quotations.getAll().then((data) => {
      setQuotations(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  // Deep-link from the Leads manager: /quotations?fromLead=<id> pre-fills the
  // editor with the buyer + RFQ details already captured on that lead.
  useEffect(() => {
    const fromLead = searchParams.get('fromLead');
    if (!fromLead) return;

    backendApi.leads.getAll().then((leads) => {
      const lead = leads.find((l) => l.id === fromLead);
      if (lead) {
        setDraft({
          ...emptyDraft(),
          leadId: lead.id,
          buyerName: lead.name,
          buyerCompany: lead.company || '',
          buyerEmail: lead.email,
          buyerCountry: lead.country || '',
          incoterm: lead.incoterm || '',
          destinationPort: lead.destinationPort || '',
          paymentTerms: lead.paymentTerms || '',
          lineItems: [
            {
              description: lead.subject || `Export goods — ${lead.sector || 'General'}`,
              hsCode: '',
              quantity: lead.quantity || '',
              unit: lead.quantityUnit || 'KG',
              unitPrice: 0,
            },
          ],
        });
        setEditingId(null);
        setEditorOpen(true);
      }
      const next = new URLSearchParams(searchParams);
      next.delete('fromLead');
      setSearchParams(next, { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('fromLead')]);

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        q.quoteNumber.toLowerCase().includes(term) ||
        q.buyerName.toLowerCase().includes(term) ||
        (q.buyerCompany || '').toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }, [quotations, statusFilter, searchTerm]);

  const openCreate = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (q: Quotation) => {
    setDraft({
      leadId: q.leadId,
      status: q.status,
      buyerName: q.buyerName,
      buyerCompany: q.buyerCompany || '',
      buyerEmail: q.buyerEmail,
      buyerCountry: q.buyerCountry || '',
      lineItems: q.lineItems.length > 0 ? q.lineItems : [emptyLineItem()],
      currency: q.currency,
      incoterm: q.incoterm || '',
      destinationPort: q.destinationPort || '',
      paymentTerms: q.paymentTerms || '',
      validUntil: q.validUntil ? q.validUntil.slice(0, 10) : '',
      notes: q.notes || '',
    });
    setEditingId(q.id);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
  };

  const updateLineItem = (idx: number, patch: Partial<QuotationLineItem>) => {
    setDraft((d) => ({
      ...d,
      lineItems: d.lineItems.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));
  };

  const addLineItem = () => setDraft((d) => ({ ...d, lineItems: [...d.lineItems, emptyLineItem()] }));
  const removeLineItem = (idx: number) =>
    setDraft((d) => ({ ...d, lineItems: d.lineItems.length > 1 ? d.lineItems.filter((_, i) => i !== idx) : d.lineItems }));

  const handleSave = async () => {
    if (!draft.buyerName.trim() || !draft.buyerEmail.trim()) {
      alert('Buyer name and email are required.');
      return;
    }
    const validLineItems = draft.lineItems.filter((i) => i.description.trim());
    if (validLineItems.length === 0) {
      alert('At least one line item with a description is required.');
      return;
    }

    setSaving(true);
    const payload = { ...draft, lineItems: validLineItems };
    const result = editingId
      ? await backendApi.quotations.update(editingId, payload)
      : await backendApi.quotations.create(payload);
    setSaving(false);

    if (result) {
      load();
      closeEditor();
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } else {
      alert('Failed to save quotation. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, status: QuotationStatus) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    await backendApi.quotations.update(id, { status });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quotation permanently?')) return;
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    if (viewing?.id === id) setViewing(null);
    await backendApi.quotations.delete(id);
  };

  const handleDownload = async (q: Quotation) => {
    setDownloadingId(q.id);
    await backendApi.quotations.downloadPdf(q.id, q.quoteNumber);
    setDownloadingId(null);
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
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Quotation saved successfully!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Quotations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Build formal commercial quotes with line-item pricing and generate branded PDFs.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> New Quotation
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quote #, buyer, company..."
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | QuotationStatus)}
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:outline-none focus:border-teal-500"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Quote #</th>
                <th className="px-5 py-3.5 font-semibold">Buyer</th>
                <th className="px-5 py-3.5 font-semibold">Total</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Created</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-slate-900">{q.quoteNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{q.buyerCompany || q.buyerName}</div>
                      <div className="text-slate-500">{q.buyerName} &middot; {q.buyerEmail}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {q.currency} {quotationTotal(q.lineItems).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value as QuotationStatus)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border focus:outline-none ${STATUS_STYLES[q.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewing(q)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(q)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(q)}
                          disabled={downloadingId === q.id}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingId === q.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
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

      {/* View Drawer */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                  {viewing.quoteNumber}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{viewing.buyerCompany || viewing.buyerName}</h3>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200 text-slate-700">
                <div>Buyer: <strong>{viewing.buyerName}</strong></div>
                <div>Email: <strong>{viewing.buyerEmail}</strong></div>
                <div>Country: <strong>{viewing.buyerCountry || '—'}</strong></div>
                <div>Incoterm: <strong>{viewing.incoterm || '—'}</strong></div>
                <div>Destination: <strong>{viewing.destinationPort || '—'}</strong></div>
                <div>Payment Terms: <strong>{viewing.paymentTerms || '—'}</strong></div>
                <div>Valid Until: <strong>{viewing.validUntil ? new Date(viewing.validUntil).toLocaleDateString() : '—'}</strong></div>
                <div>Status: <strong className="capitalize">{viewing.status}</strong></div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                    <tr>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Unit Price</th>
                      <th className="px-3 py-2">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewing.lineItems.map((item, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{item.description}</td>
                        <td className="px-3 py-2">{item.quantity} {item.unit}</td>
                        <td className="px-3 py-2">{viewing.currency} {Number(item.unitPrice).toFixed(2)}</td>
                        <td className="px-3 py-2 font-semibold">{viewing.currency} {lineTotal(item).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end bg-slate-50 px-3 py-2.5 font-bold text-slate-900 border-t border-slate-200">
                  Total: {viewing.currency} {quotationTotal(viewing.lineItems).toFixed(2)}
                </div>
              </div>

              {viewing.notes && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 whitespace-pre-wrap text-slate-700">
                  {viewing.notes}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleDownload(viewing)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-500"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Quotation' : 'New Quotation'}
                </h3>
              </div>
              <button
                onClick={closeEditor}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Buyer info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Buyer Name</label>
                  <input
                    type="text"
                    value={draft.buyerName}
                    onChange={(e) => setDraft({ ...draft, buyerName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    value={draft.buyerCompany}
                    onChange={(e) => setDraft({ ...draft, buyerCompany: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={draft.buyerEmail}
                    onChange={(e) => setDraft({ ...draft, buyerEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={draft.buyerCountry}
                    onChange={(e) => setDraft({ ...draft, buyerCountry: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Line Items</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={draft.currency}
                      onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                      <tr>
                        <th className="px-3 py-2 w-2/5">Description</th>
                        <th className="px-3 py-2">HS Code</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Unit</th>
                        <th className="px-3 py-2">Unit Price</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2 w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {draft.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateLineItem(idx, { description: e.target.value })}
                              placeholder="e.g. Frozen Black Tiger Shrimp, Grade A"
                              className={inputClass}
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={item.hsCode || ''}
                              onChange={(e) => updateLineItem(idx, { hsCode: e.target.value })}
                              className={`${inputClass} font-mono`}
                            />
                          </td>
                          <td className="p-1.5 w-20">
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(idx, { quantity: e.target.value })}
                              className={inputClass}
                            />
                          </td>
                          <td className="p-1.5 w-28">
                            <select
                              value={item.unit}
                              onChange={(e) => updateLineItem(idx, { unit: e.target.value })}
                              className={inputClass}
                            >
                              {UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-1.5 w-28">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                              className={inputClass}
                            />
                          </td>
                          <td className="p-1.5 w-24 text-right font-semibold text-slate-800 whitespace-nowrap">
                            {draft.currency} {lineTotal(item).toFixed(2)}
                          </td>
                          <td className="p-1.5 text-center">
                            <button
                              onClick={() => removeLineItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5 border-t border-slate-200">
                    <button
                      onClick={addLineItem}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Line Item
                    </button>
                    <span className="font-bold text-slate-900">
                      Total: {draft.currency} {quotationTotal(draft.lineItems).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Incoterm</label>
                  <input
                    type="text"
                    value={draft.incoterm}
                    onChange={(e) => setDraft({ ...draft, incoterm: e.target.value })}
                    placeholder="e.g. FOB Chittagong Port"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Destination Port</label>
                  <input
                    type="text"
                    value={draft.destinationPort}
                    onChange={(e) => setDraft({ ...draft, destinationPort: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Payment Terms</label>
                  <input
                    type="text"
                    value={draft.paymentTerms}
                    onChange={(e) => setDraft({ ...draft, paymentTerms: e.target.value })}
                    placeholder="e.g. LC (Letter of Credit)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Valid Until</label>
                  <input
                    type="date"
                    value={draft.validUntil}
                    onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Notes / Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700">Status:</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as QuotationStatus })}
                    className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 font-semibold"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeEditor}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {editingId ? 'Save Changes' : 'Create Quotation'}
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
