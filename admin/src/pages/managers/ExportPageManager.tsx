import React, { useState, useEffect } from 'react';
import { ExportPageContent, ExportProduct, InsightItem } from '../../types';
import { mockDb, backendApi } from '../../api';
import { ImageUploadButton } from '../../components/ImageUploadButton';
import { ProductEditor } from './ProductEditor';
import { SITE_URL, siteLink, slugify } from '../../utils';
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Globe2,
  Package,
  Layers,
  ExternalLink,
  ListOrdered,
  BadgeCheck,
} from 'lucide-react';

export const ExportPageManager: React.FC = () => {
  const [content, setContent] = useState<ExportPageContent>(() => mockDb.getExportPage());
  const [activeTab, setActiveTab] = useState<'intro' | 'categories' | 'process' | 'products'>('products');
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    backendApi.pages.get<ExportPageContent>('export', content).then((data) => {
      if (data) setContent(data);
    });
    backendApi.insights
      .getAll()
      .then(setInsights)
      .catch(() => setInsights([]));
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const slugs = content.products.map((p) => p.slug.trim());
    if (slugs.some((s) => !s)) {
      showToast('error', 'Every product needs a URL slug.');
      return;
    }
    const duplicate = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (duplicate) {
      showToast('error', `Two products share the slug "${duplicate}". Slugs must be unique.`);
      return;
    }

    setIsSaving(true);
    const ok = await backendApi.pages.save('export', content);
    setIsSaving(false);
    showToast(
      ok ? 'success' : 'error',
      ok ? 'Export page and products saved.' : 'Could not save to the server. Check your connection or sign in again.'
    );
  };

  // Intro handlers
  const handleIntroChange = (field: keyof typeof content.intro, val: string) => {
    setContent({ ...content, intro: { ...content.intro, [field]: val } });
  };

  // Category handlers
  const handleCategoryChange = (index: number, field: string, val: string) => {
    const updated = [...content.categories];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, categories: updated });
  };

  const handleAddCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      label: 'New Export Category',
      image: '/images/story-agriculture-origin.jpg',
    };
    setContent({ ...content, categories: [...content.categories, newCat] });
  };

  const handleDeleteCategory = (index: number) => {
    setContent({ ...content, categories: content.categories.filter((_, i) => i !== index) });
  };

  // Process step handlers
  const handleProcessChange = (index: number, field: string, val: string) => {
    const updated = [...content.process];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, process: updated });
  };

  const handleAddProcess = () => {
    const newStepNum = (content.process.length + 1).toString().padStart(2, '0');
    setContent({
      ...content,
      process: [
        ...content.process,
        { step: `Step ${newStepNum} — New Phase`, description: 'Standard operational protocol and inspection step.' },
      ],
    });
  };

  const handleDeleteProcess = (index: number) => {
    setContent({ ...content, process: content.process.filter((_, i) => i !== index) });
  };

  // Product handlers
  const handleProductReplace = (index: number, product: ExportProduct) => {
    const updated = [...content.products];
    updated[index] = product;
    setContent({ ...content, products: updated });
  };

  const handleAddProduct = () => {
    const name = 'New Export Commodity';
    const newProd: ExportProduct = {
      slug: `${slugify(name)}-${Date.now().toString().slice(-5)}`,
      name,
      category: content.categories[0]?.label || 'General Export',
      origin: 'Bangladesh',
      availability: 'Year-round',
      moq: '1 x 20ft FCL',
      summary: 'Export-grade standard specifications with phytosanitary and cold-chain compliance.',
      image: '/images/story-seafood.jpg',
      images: ['/images/story-seafood.jpg'],
      specifications: [
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Packaging', value: 'Master Export Carton' },
      ],
      certificationsEnabled: false,
      certifications: [],
      insightUrl: '',
      seo: { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', noIndex: false },
    };
    setContent({ ...content, products: [newProd, ...content.products] });
    setSelectedProductIdx(0);
  };

  const handleDeleteProduct = (index: number) => {
    if (content.products.length <= 1) {
      alert('You must have at least one product.');
      return;
    }
    if (!confirm(`Delete "${content.products[index].name}"? This takes effect when you save.`)) return;
    const updated = content.products.filter((_, i) => i !== index);
    setContent({ ...content, products: updated });
    if (selectedProductIdx >= updated.length) {
      setSelectedProductIdx(Math.max(0, updated.length - 1));
    }
  };

  const activeProduct = content.products[selectedProductIdx] || content.products[0];
  const categoryLabels = content.categories.map((c) => c.label);

  const tabClass = (tab: typeof activeTab) =>
    `py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
      activeTab === tab ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
    }`;

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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Page Editor
            </span>
            <span className="text-xs text-slate-400">/export & /export/products/*</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Export Division & Products Manager</h1>
          <p className="text-sm text-slate-500">
            Products, certifications, linked insights, SEO, categories, and the export process.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {SITE_URL && (
            <a
              href={siteLink('/export')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Preview
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow hover:shadow-teal-600/20 active:scale-[0.98] disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('products')} className={tabClass('products')}>
          <Package className="w-4 h-4" />
          Products ({content.products.length})
        </button>
        <button onClick={() => setActiveTab('categories')} className={tabClass('categories')}>
          <Layers className="w-4 h-4" />
          Product Categories ({content.categories.length})
        </button>
        <button onClick={() => setActiveTab('process')} className={tabClass('process')}>
          <ListOrdered className="w-4 h-4" />
          Export Process ({content.process.length})
        </button>
        <button onClick={() => setActiveTab('intro')} className={tabClass('intro')}>
          <Globe2 className="w-4 h-4" />
          Page Intro
        </button>
      </div>

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Products Catalog</h3>
                <p className="text-xs text-slate-500">{content.products.length} export lines</p>
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            </div>

            <div className="space-y-2">
              {content.products.map((prod, idx) => (
                <div
                  key={`${prod.slug}-${idx}`}
                  onClick={() => setSelectedProductIdx(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedProductIdx === idx
                      ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.visibility = 'hidden';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{prod.name}</h4>
                      <p className="text-xs text-teal-600 font-medium truncate">{prod.category}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{prod.images?.length || 1} photos</span>
                        {prod.certificationsEnabled && (prod.certifications?.length || 0) > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600">
                            <BadgeCheck className="w-3 h-3" />
                            {prod.certifications!.length}
                          </span>
                        )}
                        {prod.seo?.noIndex && <span className="text-amber-600">noindex</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            {activeProduct ? (
              <ProductEditor
                key={selectedProductIdx}
                product={activeProduct}
                categories={categoryLabels}
                insights={insights}
                onChange={(p) => handleProductReplace(selectedProductIdx, p)}
                onDelete={() => handleDeleteProduct(selectedProductIdx)}
              />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-400">
                Select a product to edit
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Categories */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Export Product Categories</h2>
              <p className="text-xs text-slate-500">
                Shown as the category rail and filters on the export catalog. Assign products to these in each product's
                Details tab.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.categories.map((cat, idx) => {
              const productCount = content.products.filter((p) => p.category === cat.label).length;
              return (
                <div
                  key={cat.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{idx + 1} · {productCount} product{productCount === 1 ? '' : 's'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category Label</label>
                      <input
                        type="text"
                        value={cat.label}
                        onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      />
                      {productCount > 0 && (
                        <p className="mt-1 text-[11px] text-amber-600">
                          Renaming this won't update the {productCount} product{productCount === 1 ? '' : 's'} using it
                          — reassign them in each product's Details tab.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Card Image</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <ImageUploadButton
                          label="Upload from Device"
                          currentUrl={cat.image}
                          onImageUploaded={(url) => handleCategoryChange(idx, 'image', url)}
                        />
                      </div>
                      <input
                        type="text"
                        value={cat.image}
                        onChange={(e) => handleCategoryChange(idx, 'image', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      />
                      {cat.image && (
                        <div className="h-16 w-24 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100 mt-2">
                          <img src={cat.image} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Process Steps */}
      {activeTab === 'process' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Export Fulfillment Process</h2>
              <p className="text-xs text-slate-500">The step-by-step process shown on the export page.</p>
            </div>
            <button
              type="button"
              onClick={handleAddProcess}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Process Step
            </button>
          </div>

          <div className="space-y-3">
            {content.process.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4">
                <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Step Title</label>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleProcessChange(idx, 'step', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Description</label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleProcessChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProcess(idx)}
                  className="text-slate-400 hover:text-rose-600 p-2 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Intro */}
      {activeTab === 'intro' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Export Page Header</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top banner content for /export, above the product search.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Eyebrow</label>
              <input
                type="text"
                value={content.intro.eyebrow}
                onChange={(e) => handleIntroChange('eyebrow', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Heading
              </label>
              <input
                type="text"
                value={content.intro.heading}
                onChange={(e) => handleIntroChange('heading', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={content.intro.description}
                onChange={(e) => handleIntroChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
