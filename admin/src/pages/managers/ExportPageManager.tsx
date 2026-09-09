import React, { useState, useEffect } from 'react';
import { ExportPageContent } from '../../types';
import { mockDb, backendApi } from '../../api';
import { ImageUploadButton } from '../../components/ImageUploadButton';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Globe2,
  Package,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  Sparkles,
} from 'lucide-react';

export const ExportPageManager: React.FC = () => {
  const [content, setContent] = useState<ExportPageContent>(() => mockDb.getExportPage());
  const [activeTab, setActiveTab] = useState<'intro' | 'categories' | 'process' | 'products'>('products');
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [toast, setToast] = useState(false);

  // Fetch latest content from MySQL on mount
  useEffect(() => {
    backendApi.pages.get<ExportPageContent>('export', content).then((data) => {
      if (data) setContent(data);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveExportPage(content);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Intro handlers
  const handleIntroChange = (field: keyof typeof content.intro, val: string) => {
    setContent({
      ...content,
      intro: { ...content.intro, [field]: val },
    });
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
    setContent({
      ...content,
      categories: content.categories.filter((_, i) => i !== index),
    });
  };

  // Process steps handlers
  const handleProcessChange = (index: number, field: string, val: string) => {
    const updated = [...content.process];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, process: updated });
  };

  const handleAddProcess = () => {
    const newStepNum = (content.process.length + 1).toString().padStart(2, '0');
    const newStep = {
      step: `Step ${newStepNum} — New Phase`,
      description: 'Standard operational protocol and inspection step.',
    };
    setContent({ ...content, process: [...content.process, newStep] });
  };

  const handleDeleteProcess = (index: number) => {
    setContent({
      ...content,
      process: content.process.filter((_, i) => i !== index),
    });
  };

  // Product CRUD
  const handleProductChange = (index: number, field: string, val: any) => {
    const updated = [...content.products];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, products: updated });
  };

  const handleAddProduct = () => {
    const newProd = {
      slug: `product-${Date.now()}`,
      name: 'New Export Commodity',
      category: content.categories[0]?.label || 'General Export',
      origin: 'Bangladesh',
      availability: 'Year-round',
      moq: '1 x 20ft FCL',
      summary: 'Export-grade standard specifications with phytosanitary and cold-chain compliance.',
      image: '/images/story-seafood.jpg',
      images: [
        '/images/story-seafood.jpg',
        '/images/story-seafood-closeup.jpg',
        '/images/trade-detail.jpg',
      ],
      specifications: [
        { label: 'Origin', value: 'Bangladesh' },
        { label: 'Packaging', value: 'Master Export Carton' },
      ],
    };
    const updated = [newProd, ...content.products];
    setContent({ ...content, products: updated });
    setSelectedProductIdx(0);
  };

  const handleDeleteProduct = (index: number) => {
    if (content.products.length <= 1) {
      alert('You must have at least one product.');
      return;
    }
    const updated = content.products.filter((_, i) => i !== index);
    setContent({ ...content, products: updated });
    if (selectedProductIdx >= updated.length) {
      setSelectedProductIdx(Math.max(0, updated.length - 1));
    }
  };

  // Multi-Image Gallery Handlers
  const handleAddGalleryImage = (productIndex: number) => {
    if (!newGalleryUrl.trim()) return;
    const current = content.products[productIndex];
    const existing = current.images || [current.image];
    const updated = [...content.products];
    updated[productIndex] = {
      ...current,
      images: [...existing, newGalleryUrl.trim()],
    };
    setContent({ ...content, products: updated });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (productIndex: number, imgIndex: number) => {
    const current = content.products[productIndex];
    const existing = current.images || [current.image];
    const updated = [...content.products];
    updated[productIndex] = {
      ...current,
      images: existing.filter((_, i) => i !== imgIndex),
    };
    setContent({ ...content, products: updated });
  };

  // Specifications handlers
  const handleAddSpec = (productIndex: number) => {
    if (!newSpecLabel.trim() || !newSpecVal.trim()) return;
    const current = content.products[productIndex];
    const updated = [...content.products];
    updated[productIndex] = {
      ...current,
      specifications: [
        ...(current.specifications || []),
        { label: newSpecLabel.trim(), value: newSpecVal.trim() },
      ],
    };
    setContent({ ...content, products: updated });
    setNewSpecLabel('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (productIndex: number, specIndex: number) => {
    const current = content.products[productIndex];
    const updated = [...content.products];
    updated[productIndex] = {
      ...current,
      specifications: current.specifications.filter((_, i) => i !== specIndex),
    };
    setContent({ ...content, products: updated });
  };

  const activeProduct = content.products[selectedProductIdx] || content.products[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Export page and products saved successfully!
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
            Control export narratives, multi-image product galleries, categories, and 6-step export process.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/export"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview
          </a>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow hover:shadow-teal-600/20 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Export Products & Multi-Image Gallery ({content.products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Product Categories ({content.categories.length})
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'process'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          Export Logistics Process ({content.process.length})
        </button>
        <button
          onClick={() => setActiveTab('intro')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'intro'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          Page Intro Narrative
        </button>
      </div>

      {/* Tab: Products with Multi-Image Gallery */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Products Sidebar List */}
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
                  key={prod.slug}
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
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{prod.name}</h4>
                      <p className="text-xs text-teal-600 font-medium">{prod.category}</p>
                      <span className="text-[11px] text-slate-400">
                        {prod.images?.length || 1} gallery photos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details & Gallery Editor */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {activeProduct ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 uppercase">
                      /{activeProduct.slug}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{activeProduct.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(selectedProductIdx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Product
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={activeProduct.name}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={activeProduct.slug}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'slug', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={activeProduct.category}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'category', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Origin Country
                    </label>
                    <input
                      type="text"
                      value={activeProduct.origin}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'origin', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={activeProduct.availability}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'availability', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Minimum Order Quantity (MOQ)
                    </label>
                    <input
                      type="text"
                      value={activeProduct.moq}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'moq', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Cover Image Path / URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeProduct.image}
                        onChange={(e) => handleProductChange(selectedProductIdx, 'image', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      />
                      <ImageUploadButton
                        onImageUploaded={(url) => handleProductChange(selectedProductIdx, 'image', url)}
                        label="Upload Cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Product Summary Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={activeProduct.summary}
                      onChange={(e) => handleProductChange(selectedProductIdx, 'summary', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* MULTI-IMAGE GALLERY MANAGER */}
                <div className="border-t border-slate-200 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <h3 className="text-sm font-bold text-slate-900">
                          Product Images Gallery ({activeProduct.images?.length || 0})
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        These images power the interactive thumbnail carousel and fullscreen lightbox on the product details page.
                      </p>
                    </div>
                  </div>

                  {/* Add Image Input */}
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryImage(selectedProductIdx);
                        }
                      }}
                      placeholder="Enter photo path or URL (e.g. /images/story-seafood-closeup.jpg)..."
                      className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddGalleryImage(selectedProductIdx)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add URL
                    </button>
                    <ImageUploadButton
                      onImageUploaded={(url) => {
                        const current = activeProduct;
                        const existing = current.images || [current.image];
                        const updated = [...content.products];
                        updated[selectedProductIdx] = {
                          ...current,
                          images: [...existing, url],
                        };
                        setContent({ ...content, products: updated });
                      }}
                      label="Upload to Gallery"
                    />
                  </div>

                  {/* Gallery Visual Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {(activeProduct.images || [activeProduct.image]).map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="group relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden aspect-video"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery item ${imgIdx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                          <span className="text-[10px] text-white font-mono bg-black/50 px-1.5 py-0.5 rounded">
                            #{imgIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(selectedProductIdx, imgIdx)}
                            className="text-white hover:text-rose-400 p-1 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SPECIFICATIONS TABLE MANAGER */}
                <div className="border-t border-slate-200 pt-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Technical Specifications</h3>
                    <p className="text-xs text-slate-500">
                      Standardized parameter table rendered on the export product details sheet.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newSpecLabel}
                      onChange={(e) => setNewSpecLabel(e.target.value)}
                      placeholder="Spec label (e.g. Storage)"
                      className="sm:w-1/3 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <input
                      type="text"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      placeholder="Spec value (e.g. -18°C continuous cold chain)"
                      className="sm:flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSpec(selectedProductIdx)}
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
                          <th className="px-4 py-2.5">Attribute / Parameter</th>
                          <th className="px-4 py-2.5">Specification Value</th>
                          <th className="px-4 py-2.5 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProduct.specifications?.map((spec, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-medium text-slate-900">{spec.label}</td>
                            <td className="px-4 py-2 text-slate-600">{spec.value}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpec(selectedProductIdx, sIdx)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a product to edit</div>
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
              <p className="text-xs text-slate-500">Categories displayed in cards on the export overview page.</p>
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
            {content.categories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Card Image
                    </label>
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
            ))}
          </div>
        </div>
      )}

      {/* Tab: Process Steps */}
      {activeTab === 'process' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">6-Step Export Fulfillment Process</h2>
              <p className="text-xs text-slate-500">
                The sequential supply and cold-chain compliance process rendered on the Export page.
              </p>
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
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4"
              >
                <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleProcessChange(idx, 'step', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Description Narrative
                    </label>
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
            <h2 className="text-base font-semibold text-slate-900">Export Page Header Narrative</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top banner content for /export.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Eyebrow Category
              </label>
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
                Introductory Description
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
