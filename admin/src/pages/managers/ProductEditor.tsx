import React, { useMemo, useState } from 'react';
import { ExportProduct, InsightItem, ProductCertification, ProductSeo } from '../../types';
import { ImageUploadButton } from '../../components/ImageUploadButton';
import { slugify, SITE_URL, siteLink } from '../../utils';
import {
  Trash2,
  Plus,
  Sparkles,
  FileText,
  Image as ImageIcon,
  BadgeCheck,
  Newspaper,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Wand2,
} from 'lucide-react';

type Section = 'details' | 'media' | 'certifications' | 'insight' | 'seo';

const DEFAULT_SEO: ProductSeo = {
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  ogImage: '',
  noIndex: false,
};

const inputClass =
  'w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900';

const labelClass = 'block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5';

interface ProductEditorProps {
  product: ExportProduct;
  categories: string[];
  insights: InsightItem[];
  onChange: (product: ExportProduct) => void;
  onDelete: () => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({
  product,
  categories,
  insights,
  onChange,
  onDelete,
}) => {
  const [section, setSection] = useState<Section>('details');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  const set = <K extends keyof ExportProduct>(key: K, value: ExportProduct[K]) =>
    onChange({ ...product, [key]: value });

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const certifications = product.certifications || [];
  const seo = { ...DEFAULT_SEO, ...(product.seo || {}) };
  const setSeo = (patch: Partial<ProductSeo>) => set('seo', { ...seo, ...patch });

  const categoryOptions = useMemo(() => {
    const list = [...categories];
    if (product.category && !list.includes(product.category)) list.unshift(product.category);
    return list;
  }, [categories, product.category]);

  const sections: { id: Section; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'media', label: 'Media & Specs', icon: ImageIcon, badge: String(gallery.length) },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: BadgeCheck,
      badge: product.certificationsEnabled ? String(certifications.length) : 'Off',
    },
    { id: 'insight', label: 'Insight', icon: Newspaper, badge: product.insightUrl ? '1' : undefined },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6 pb-4">
        <div className="min-w-0">
          <span className="text-xs font-mono font-bold text-teal-600">/export/products/{product.slug}</span>
          <h2 className="text-lg font-bold text-slate-900 truncate">{product.name}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {SITE_URL && (
            <a
              href={siteLink(`/export/products/${product.slug}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4">
        {sections.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${
              section === id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {badge && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  section === id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {section === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => set('name', e.target.value)}
                className={`${inputClass} font-medium`}
              />
            </div>

            <div>
              <label className={labelClass}>URL Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  className={`${inputClass} font-mono`}
                />
                <button
                  type="button"
                  onClick={() => set('slug', slugify(product.name))}
                  title="Generate from product name"
                  className="shrink-0 rounded-lg border border-slate-200 px-2.5 text-slate-500 hover:bg-slate-50 hover:text-teal-600"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Lowercase words separated by hyphens. Changing it changes the page URL.
              </p>
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={product.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputClass}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                    {!categories.includes(c) ? ' (not in category list)' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400">
                Manage the list in the Product Categories tab. Buyers filter the catalog by this.
              </p>
            </div>

            <div>
              <label className={labelClass}>Origin Country</label>
              <input
                type="text"
                value={product.origin}
                onChange={(e) => set('origin', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Availability</label>
              <input
                type="text"
                value={product.availability}
                onChange={(e) => set('availability', e.target.value)}
                placeholder="e.g. Year-round, Seasonal"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Minimum Order Quantity (MOQ)</label>
              <input
                type="text"
                value={product.moq}
                onChange={(e) => set('moq', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Cover Image</label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={product.image}
                  onChange={(e) => set('image', e.target.value)}
                  className={`${inputClass} flex-1 min-w-[200px]`}
                />
                <ImageUploadButton onImageUploaded={(url) => set('image', url)} label="Upload Cover" />
              </div>
              {product.image && (
                <img
                  src={product.image}
                  alt=""
                  className="mt-2 h-20 w-32 rounded-lg border border-slate-200 object-cover bg-slate-100"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Summary</label>
              <textarea
                rows={3}
                value={product.summary}
                onChange={(e) => set('summary', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {section === 'media' && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Image Gallery ({gallery.length})</h3>
              </div>
              <p className="text-xs text-slate-500 -mt-2">
                Powers the thumbnail carousel and fullscreen lightbox on the product page.
              </p>

              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newGalleryUrl.trim()) {
                      e.preventDefault();
                      set('images', [...gallery, newGalleryUrl.trim()]);
                      setNewGalleryUrl('');
                    }
                  }}
                  placeholder="Photo path or URL..."
                  className={`${inputClass} flex-1 min-w-[200px]`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newGalleryUrl.trim()) return;
                    set('images', [...gallery, newGalleryUrl.trim()]);
                    setNewGalleryUrl('');
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add URL
                </button>
                <ImageUploadButton onImageUploaded={(url) => set('images', [...gallery, url])} label="Upload to Gallery" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((imgUrl, imgIdx) => (
                  <div
                    key={`${imgUrl}-${imgIdx}`}
                    className="group relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden aspect-video"
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                      <span className="text-[10px] text-white font-mono bg-black/50 px-1.5 py-0.5 rounded">
                        #{imgIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => set('images', gallery.filter((_, i) => i !== imgIdx))}
                        className="text-white hover:text-rose-400 p-1"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Technical Specifications</h3>
                <p className="text-xs text-slate-500">Rendered as a table on the product page.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSpecLabel}
                  onChange={(e) => setNewSpecLabel(e.target.value)}
                  placeholder="Label (e.g. Storage)"
                  className={`${inputClass} sm:w-1/3`}
                />
                <input
                  type="text"
                  value={newSpecVal}
                  onChange={(e) => setNewSpecVal(e.target.value)}
                  placeholder="Value (e.g. -18°C cold chain)"
                  className={`${inputClass} sm:flex-1`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSpecLabel.trim() || !newSpecVal.trim()) return;
                    set('specifications', [
                      ...(product.specifications || []),
                      { label: newSpecLabel.trim(), value: newSpecVal.trim() },
                    ]);
                    setNewSpecLabel('');
                    setNewSpecVal('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Spec
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Attribute</th>
                      <th className="px-4 py-2.5">Value</th>
                      <th className="px-4 py-2.5 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(product.specifications || []).map((spec, sIdx) => (
                      <tr key={`${spec.label}-${sIdx}`} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-medium text-slate-900">{spec.label}</td>
                        <td className="px-4 py-2 text-slate-600">{spec.value}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              set('specifications', product.specifications.filter((_, i) => i !== sIdx))
                            }
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(product.specifications || []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                          No specifications yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {section === 'certifications' && (
          <CertificationsSection
            enabled={!!product.certificationsEnabled}
            certifications={certifications}
            onToggle={(enabled) => set('certificationsEnabled', enabled)}
            onChange={(next) => set('certifications', next)}
          />
        )}

        {section === 'insight' && (
          <InsightSection product={product} insights={insights} onChange={(url) => set('insightUrl', url)} />
        )}

        {section === 'seo' && <SeoSection product={product} seo={seo} onChange={setSeo} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }> = ({
  checked,
  onChange,
  label,
  hint,
}) => (
  <label className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
    <span>
      <span className="block text-sm font-semibold text-slate-900">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-teal-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  </label>
);

const CertificationsSection: React.FC<{
  enabled: boolean;
  certifications: ProductCertification[];
  onToggle: (enabled: boolean) => void;
  onChange: (certs: ProductCertification[]) => void;
}> = ({ enabled, certifications, onToggle, onChange }) => {
  const update = (idx: number, patch: Partial<ProductCertification>) =>
    onChange(certifications.map((c, i) => (i === idx ? { ...c, ...patch } : c)));

  return (
    <div className="space-y-4">
      <Toggle
        checked={enabled}
        onChange={onToggle}
        label="Show certifications on the product page"
        hint={
          enabled
            ? 'Visible to buyers on the website.'
            : 'Hidden on the website. Your entries below are kept and reappear when you turn this on.'
        }
      />

      <div className={`space-y-3 transition-opacity ${enabled ? '' : 'opacity-50'}`}>
        {certifications.map((cert, idx) => (
          <div key={cert.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {cert.image ? (
                    <img src={cert.image} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <BadgeCheck className="h-7 w-7 text-slate-300" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => update(idx, { title: e.target.value })}
                    placeholder="Certification title (e.g. HACCP Certified)"
                    className={`${inputClass} font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => onChange(certifications.filter((_, i) => i !== idx))}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Remove certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={cert.description}
                  onChange={(e) => update(idx, { description: e.target.value })}
                  placeholder="What this certifies, issuing body, validity..."
                  className={inputClass}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={cert.image}
                    onChange={(e) => update(idx, { image: e.target.value })}
                    placeholder="Certificate or logo image URL"
                    className={`${inputClass} flex-1 min-w-[180px]`}
                  />
                  <ImageUploadButton
                    label="Upload Image"
                    currentUrl={cert.image}
                    onImageUploaded={(url) => update(idx, { image: url })}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
            No certifications added yet.
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            onChange([...certifications, { id: `cert-${Date.now()}`, title: '', description: '', image: '' }])
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>
    </div>
  );
};

const InsightSection: React.FC<{
  product: ExportProduct;
  insights: InsightItem[];
  onChange: (url: string) => void;
}> = ({ product, insights, onChange }) => {
  const url = product.insightUrl || '';
  const internalSlug = url.match(/\/insights\/([^/?#]+)/)?.[1];
  const linked = internalSlug ? insights.find((i) => i.slug === internalSlug) : undefined;
  const tagged = insights.filter((i) => i.relatedProductSlug === product.slug && i.slug !== internalSlug);

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Insight URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder="/insights/your-article  or  https://external-news-site.com/article"
          className={inputClass}
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Shown as a featured article on this product's page. Use one of your own insights or any external link.
        </p>
      </div>

      {insights.length > 0 && (
        <div>
          <label className={labelClass}>Or pick one of your insights</label>
          <select
            value={linked ? linked.slug : ''}
            onChange={(e) => onChange(e.target.value ? `/insights/${e.target.value}` : '')}
            className={inputClass}
          >
            <option value="">— None —</option>
            {insights.map((i) => (
              <option key={i.id} value={i.slug}>
                {i.title}
                {i.status === 'draft' ? ' (draft — not visible yet)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {url && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preview</span>
          {linked ? (
            <div className="mt-2 flex gap-3">
              {linked.coverImage && (
                <img src={linked.coverImage} alt="" className="h-16 w-24 rounded-lg object-cover bg-slate-200" />
              )}
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-teal-700">{linked.category}</span>
                <p className="text-sm font-semibold text-slate-900 truncate">{linked.title}</p>
                {linked.status === 'draft' && (
                  <p className="mt-1 text-[11px] font-semibold text-amber-600">
                    This insight is a draft — it won't show on the product page until published.
                  </p>
                )}
              </div>
            </div>
          ) : internalSlug ? (
            <p className="mt-2 text-xs font-medium text-rose-600">
              No insight found with slug "{internalSlug}". Check the URL.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-600 break-all">
              External link: <span className="font-medium text-slate-900">{url}</span>
            </p>
          )}
        </div>
      )}

      {tagged.length > 0 && (
        <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
          <p className="text-xs font-semibold text-teal-800">
            Also shown automatically — these insights are tagged with this product:
          </p>
          <ul className="mt-2 space-y-1">
            {tagged.map((i) => (
              <li key={i.id} className="text-xs text-teal-900">
                • {i.title}
                {i.status === 'draft' ? ' (draft)' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SeoSection: React.FC<{
  product: ExportProduct;
  seo: ProductSeo;
  onChange: (patch: Partial<ProductSeo>) => void;
}> = ({ product, seo, onChange }) => {
  const effectiveTitle = seo.metaTitle || `${product.name} | ANIKA TRADING & CO.`;
  const effectiveDescription = seo.metaDescription || product.summary;
  const keywords = seo.keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  const primary = keywords[0]?.toLowerCase();

  const checks = [
    { ok: seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60, label: 'Meta title is 30–60 characters' },
    {
      ok: seo.metaDescription.length >= 70 && seo.metaDescription.length <= 160,
      label: 'Meta description is 70–160 characters',
    },
    { ok: keywords.length > 0, label: 'At least one focus keyword' },
    {
      ok: !!primary && (effectiveTitle.toLowerCase().includes(primary) || effectiveDescription.toLowerCase().includes(primary)),
      label: 'Main keyword appears in title or description',
    },
    { ok: !!(seo.ogImage || product.image), label: 'Social share image set (falls back to cover image)' },
    { ok: !seo.noIndex, label: 'Search engines are allowed to index this page' },
  ];
  const score = checks.filter((c) => c.ok).length;

  const previewUrl = `${(SITE_URL || 'https://yourdomain.com').replace(/^https?:\/\//, '')} › export › products › ${product.slug}`;

  return (
    <div className="space-y-5">
      {/* Search preview */}
      <div className="rounded-xl border border-slate-200 p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google search preview</span>
        <div className="mt-2">
          <p className="text-xs text-slate-600 truncate">{previewUrl}</p>
          <p className="mt-0.5 text-lg leading-snug text-[#1a0dab] truncate">{effectiveTitle}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 line-clamp-2">{effectiveDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex items-baseline justify-between">
            <label className={labelClass}>Meta Title</label>
            <CharCount value={seo.metaTitle} max={60} />
          </div>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => onChange({ metaTitle: e.target.value })}
            placeholder={`${product.name} | ANIKA TRADING & CO.`}
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label className={labelClass}>Meta Description</label>
            <CharCount value={seo.metaDescription} max={160} />
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => onChange({ metaDescription: e.target.value })}
            placeholder={product.summary}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Focus Keywords</label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => onChange({ keywords: e.target.value })}
            placeholder="frozen shrimp supplier, bangladesh shrimp export, black tiger shrimp"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Comma-separated, most important first. Think about what an importer would type into Google.
          </p>
          {keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {keywords.map((k, i) => (
                <span
                  key={`${k}-${i}`}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                    i === 0 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Social Share Image</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={seo.ogImage}
              onChange={(e) => onChange({ ogImage: e.target.value })}
              placeholder="Defaults to the cover image"
              className={`${inputClass} flex-1 min-w-[200px]`}
            />
            <ImageUploadButton label="Upload" currentUrl={seo.ogImage} onImageUploaded={(url) => onChange({ ogImage: url })} />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Shown when the page is shared on WhatsApp, LinkedIn, Facebook, etc. Ideal size 1200×630.
          </p>
        </div>

        <Toggle
          checked={seo.noIndex}
          onChange={(v) => onChange({ noIndex: v })}
          label="Hide from search engines"
          hint="Turn on only for products you don't want appearing in Google results (e.g. discontinued lines)."
        />
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">SEO checklist</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              score >= 5 ? 'bg-emerald-50 text-emerald-700' : score >= 3 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {score}/{checks.length}
          </span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-xs">
              {c.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0 text-slate-300" />
              )}
              <span className={c.ok ? 'text-slate-700' : 'text-slate-500'}>{c.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          Every product page also publishes structured product data, a canonical URL, and is listed in the
          site's sitemap automatically.
        </p>
      </div>
    </div>
  );
};

const CharCount: React.FC<{ value: string; max: number }> = ({ value, max }) => (
  <span className={`text-[11px] font-medium ${value.length > max ? 'text-rose-600' : 'text-slate-400'}`}>
    {value.length}/{max}
  </span>
);
