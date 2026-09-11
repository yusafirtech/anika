import React, { useEffect, useMemo, useState } from 'react';
import { ExportPageContent, InsightItem, INSIGHT_CATEGORIES } from '../types';
import { backendApi, mockDb } from '../api';
import { useAuth } from '../context/AuthContext';
import { ImageUploadButton } from '../components/ImageUploadButton';
import { slugify, SITE_URL, siteLink } from '../utils';
import {
  Plus,
  Search,
  Star,
  Trash2,
  Save,
  Loader2,
  Wand2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Newspaper,
} from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900';
const labelClass = 'block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5';

const emptyInsight = (): InsightItem => ({
  id: '',
  slug: '',
  title: '',
  category: INSIGHT_CATEGORIES[0],
  excerpt: '',
  content: '',
  coverImage: '',
  relatedProductSlug: '',
  author: '',
  status: 'draft',
  featured: false,
  publishedAt: null,
  metaTitle: '',
  metaDescription: '',
  keywords: '',
});

// MySQL "YYYY-MM-DD HH:MM:SS" <-> <input type="datetime-local"> "YYYY-MM-DDTHH:MM"
const toInputDatetime = (value: string | null) => (value ? value.replace(' ', 'T').slice(0, 16) : '');

const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const d = new Date(value.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const InsightsManager: React.FC = () => {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('insights', 'create');
  const canEdit = hasPermission('insights', 'edit');
  const canDelete = hasPermission('insights', 'delete');

  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [products, setProducts] = useState<ExportPageContent['products']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState<InsightItem | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      backendApi.insights.getAll(),
      backendApi.pages.get<ExportPageContent>('export', mockDb.getExportPage()),
    ])
      .then(([insightRows, exportPage]) => {
        if (cancelled) return;
        setInsights(insightRows);
        setProducts(exportPage.products || []);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load insights from the server.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(
    () =>
      insights.filter((i) => {
        const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
        const q = search.toLowerCase();
        const matchesSearch = !q || i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      }),
    [insights, search, statusFilter]
  );

  const openNew = () => {
    setDraft(emptyInsight());
    setSlugTouched(false);
  };

  const openExisting = (insight: InsightItem) => {
    setDraft({ ...insight });
    setSlugTouched(true);
  };

  const patch = (changes: Partial<InsightItem>) => {
    if (!draft) return;
    const next = { ...draft, ...changes };
    if (changes.title !== undefined && !slugTouched) next.slug = slugify(changes.title);
    setDraft(next);
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      showToast('error', 'Give the insight a title first.');
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<InsightItem> = {
        ...draft,
        slug: draft.slug || slugify(draft.title),
        publishedAt: draft.publishedAt || null,
      };
      if (draft.id) {
        const { insight } = await backendApi.insights.update(draft.id, payload);
        setInsights(insights.map((i) => (i.id === insight.id ? insight : i)));
        setDraft(insight);
      } else {
        const { insight } = await backendApi.insights.create(payload);
        setInsights([insight, ...insights]);
        setDraft(insight);
      }
      setSlugTouched(true);
      showToast('success', draft.status === 'published' ? 'Insight saved and published.' : 'Draft saved.');
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Could not save the insight.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft?.id) {
      setDraft(null);
      return;
    }
    if (!confirm(`Delete "${draft.title}" permanently?`)) return;
    try {
      await backendApi.insights.delete(draft.id);
      setInsights(insights.filter((i) => i.id !== draft.id));
      setDraft(null);
      showToast('success', 'Insight deleted.');
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Could not delete the insight.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const editable = draft ? (draft.id ? canEdit : canCreate) : false;
  const effectiveTitle = draft ? draft.metaTitle || `${draft.title || 'Untitled'} | ANIKA TRADING & CO.` : '';
  const effectiveDescription = draft ? draft.metaDescription || draft.excerpt : '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-white rounded-lg shadow-xl text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights & News</h1>
          <p className="text-sm text-slate-500">
            Industry news, product updates, and company announcements shown on the homepage and /insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {SITE_URL && (
            <a
              href={siteLink('/insights')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Preview
            </a>
          )}
          {canCreate && (
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Insight
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4" />
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search insights..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'published', 'draft'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold capitalize ${
                    statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => openExisting(i)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  draft?.id === i.id
                    ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex gap-3">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    {i.coverImage && <img src={i.coverImage} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          i.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {i.status}
                      </span>
                      {i.featured && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                      <span className="truncate text-[11px] text-slate-400">{formatDate(i.publishedAt)}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2">{i.title}</p>
                    <p className="text-[11px] font-medium text-teal-600">{i.category}</p>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
                No insights match.
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-8">
          {!draft ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center">
              <Newspaper className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Select an insight to edit</p>
              <p className="mt-1 text-xs text-slate-500">or create a new one to publish on the website.</p>
            </div>
          ) : (
            <fieldset disabled={!editable} className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                <div className="min-w-0">
                  <span className="text-xs font-mono font-bold text-teal-600">/insights/{draft.slug || '…'}</span>
                  <h2 className="text-lg font-bold text-slate-900 truncate">{draft.title || 'New insight'}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {draft.id && draft.status === 'published' && SITE_URL && (
                    <a
                      href={siteLink(`/insights/${draft.slug}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </a>
                  )}
                  {(draft.id ? canDelete : true) && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {draft.id ? 'Delete' : 'Discard'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Publishing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <label className={labelClass}>Status</label>
                    <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                      {(['draft', 'published'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => patch({ status: s })}
                          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold capitalize ${
                            draft.status === s
                              ? s === 'published'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-500 text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Publish Date</label>
                    <input
                      type="datetime-local"
                      value={toInputDatetime(draft.publishedAt)}
                      onChange={(e) => patch({ publishedAt: e.target.value || null })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Featured</label>
                    <button
                      type="button"
                      onClick={() => patch({ featured: !draft.featured })}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                        draft.featured
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${draft.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      {draft.featured ? 'Featured on homepage' : 'Not featured'}
                    </button>
                  </div>
                  <p className="sm:col-span-3 text-[11px] text-slate-500">
                    Drafts are never visible on the website. A future publish date keeps a published insight hidden
                    until that time.
                  </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => patch({ title: e.target.value })}
                      placeholder="e.g. Bangladesh shrimp exports rise ahead of peak season"
                      className={`${inputClass} font-medium`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>URL Slug</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draft.slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          patch({ slug: slugify(e.target.value) });
                        }}
                        className={`${inputClass} font-mono`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSlugTouched(true);
                          patch({ slug: slugify(draft.title) });
                        }}
                        title="Generate from title"
                        className="shrink-0 rounded-lg border border-slate-200 px-2.5 text-slate-500 hover:text-teal-600"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      value={draft.category}
                      onChange={(e) => patch({ category: e.target.value })}
                      className={inputClass}
                    >
                      {INSIGHT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Author</label>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(e) => patch({ author: e.target.value })}
                      placeholder="e.g. ANIKA Export Desk"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Related Product</label>
                    <select
                      value={draft.relatedProductSlug}
                      onChange={(e) => patch({ relatedProductSlug: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">— Not about a specific product —</option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Product news is also shown on that product's page.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Cover Image</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={draft.coverImage}
                        onChange={(e) => patch({ coverImage: e.target.value })}
                        className={`${inputClass} flex-1 min-w-[200px]`}
                      />
                      <ImageUploadButton
                        label="Upload Cover"
                        currentUrl={draft.coverImage}
                        onImageUploaded={(url) => patch({ coverImage: url })}
                      />
                    </div>
                    {draft.coverImage && (
                      <img
                        src={draft.coverImage}
                        alt=""
                        className="mt-2 h-28 w-48 rounded-lg border border-slate-200 object-cover bg-slate-100"
                      />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-baseline justify-between">
                      <label className={labelClass}>Excerpt</label>
                      <span className="text-[11px] text-slate-400">{draft.excerpt.length}/220</span>
                    </div>
                    <textarea
                      rows={2}
                      value={draft.excerpt}
                      onChange={(e) => patch({ excerpt: e.target.value })}
                      placeholder="One or two sentences shown on cards and in search results."
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Article Content</label>
                    <textarea
                      rows={14}
                      value={draft.content}
                      onChange={(e) => patch({ content: e.target.value })}
                      placeholder={'Write the article here.\n\n## A subheading\n\nA paragraph of text.\n\n- A bullet point\n- Another bullet point'}
                      className={`${inputClass} font-mono text-[13px] leading-relaxed`}
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Leave a blank line between paragraphs. Start a line with <code className="font-mono">## </code> for
                      a subheading or <code className="font-mono">- </code> for a bullet point.
                    </p>
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4 border-t border-slate-200 pt-5">
                  <h3 className="text-sm font-bold text-slate-900">SEO</h3>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Google search preview
                    </span>
                    <p className="mt-2 text-xs text-slate-600 truncate">
                      {(SITE_URL || 'https://yourdomain.com').replace(/^https?:\/\//, '')} › insights ›{' '}
                      {draft.slug || '…'}
                    </p>
                    <p className="mt-0.5 text-lg leading-snug text-[#1a0dab] truncate">{effectiveTitle}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 line-clamp-2">
                      {effectiveDescription || 'Add an excerpt or meta description.'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between">
                      <label className={labelClass}>Meta Title</label>
                      <span className={`text-[11px] ${draft.metaTitle.length > 60 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {draft.metaTitle.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={draft.metaTitle}
                      onChange={(e) => patch({ metaTitle: e.target.value })}
                      placeholder="Defaults to the title"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between">
                      <label className={labelClass}>Meta Description</label>
                      <span
                        className={`text-[11px] ${draft.metaDescription.length > 160 ? 'text-rose-600' : 'text-slate-400'}`}
                      >
                        {draft.metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={draft.metaDescription}
                      onChange={(e) => patch({ metaDescription: e.target.value })}
                      placeholder="Defaults to the excerpt"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Focus Keywords</label>
                    <input
                      type="text"
                      value={draft.keywords}
                      onChange={(e) => patch({ keywords: e.target.value })}
                      placeholder="comma, separated, keywords"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          )}
        </div>
      </div>
    </div>
  );
};
