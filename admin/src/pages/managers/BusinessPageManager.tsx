import React, { useState } from 'react';
import { BusinessPageContent } from '../../types';
import { mockDb } from '../../api';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Briefcase,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const BusinessPageManager: React.FC = () => {
  const [content, setContent] = useState<BusinessPageContent>(() => mockDb.getBusinessPage());
  const [activeTab, setActiveTab] = useState<'intro' | 'verticals' | 'preview'>('intro');
  const [selectedVerticalIdx, setSelectedVerticalIdx] = useState<number>(0);
  const [newCapability, setNewCapability] = useState('');
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveBusinessPage(content);
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

  // Vertical handlers
  const handleVerticalChange = (index: number, field: string, val: any) => {
    const updated = [...content.verticals];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, verticals: updated });
  };

  const handleAddVertical = () => {
    const newIdxNum = (content.verticals.length + 1).toString().padStart(2, '0');
    const newVert = {
      id: `vertical-${Date.now()}`,
      index: newIdxNum,
      title: 'New Business Vertical',
      eyebrow: 'Specialized Capability',
      description: 'Comprehensive business services and execution capabilities.',
      capabilities: ['Contract Execution', 'Supply Chain Management', 'Technical Compliance'],
      cta: 'EXPLORE CAPABILITIES',
      image: '/images/story-business-network.jpg',
      layout: 'side' as const,
    };
    const updated = [...content.verticals, newVert];
    setContent({ ...content, verticals: updated });
    setSelectedVerticalIdx(updated.length - 1);
  };

  const handleDeleteVertical = (index: number) => {
    if (content.verticals.length <= 1) {
      alert('You must have at least one business vertical.');
      return;
    }
    const updated = content.verticals.filter((_, i) => i !== index);
    setContent({ ...content, verticals: updated });
    if (selectedVerticalIdx >= updated.length) {
      setSelectedVerticalIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleAddCapability = (verticalIndex: number) => {
    if (!newCapability.trim()) return;
    const current = content.verticals[verticalIndex];
    const updated = [...content.verticals];
    updated[verticalIndex] = {
      ...current,
      capabilities: [...current.capabilities, newCapability.trim()],
    };
    setContent({ ...content, verticals: updated });
    setNewCapability('');
  };

  const handleRemoveCapability = (verticalIndex: number, capIndex: number) => {
    const current = content.verticals[verticalIndex];
    const updated = [...content.verticals];
    updated[verticalIndex] = {
      ...current,
      capabilities: current.capabilities.filter((_, i) => i !== capIndex),
    };
    setContent({ ...content, verticals: updated });
  };

  const activeVertical = content.verticals[selectedVerticalIdx] || content.verticals[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Business page content saved successfully!
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Page Editor
            </span>
            <span className="text-xs text-slate-400">/business</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Business Page Content</h1>
          <p className="text-sm text-slate-500">
            Control page introduction, business verticals, capabilities list, imagery and layouts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/business"
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
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl">
        <button
          onClick={() => setActiveTab('intro')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'intro'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Page Intro & Header
        </button>
        <button
          onClick={() => setActiveTab('verticals')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'verticals'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Business Verticals ({content.verticals.length})
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Verticals Overview & Preview
        </button>
      </div>

      {/* Tab: Intro */}
      {activeTab === 'intro' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Header & Intro Narrative</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The primary banner narrative that introduces the company's business sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={content.intro.eyebrow}
                onChange={(e) => handleIntroChange('eyebrow', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                placeholder="e.g. Core Operations"
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
                placeholder="e.g. Connected Capabilities Across Sectors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Page Introduction Description
              </label>
              <textarea
                rows={4}
                value={content.intro.description}
                onChange={(e) => handleIntroChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                placeholder="Comprehensive narrative describing ANIKA's business model..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Verticals */}
      {activeTab === 'verticals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Vertical Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Verticals List</h3>
                <p className="text-xs text-slate-500">{content.verticals.length} operational lines</p>
              </div>
              <button
                type="button"
                onClick={handleAddVertical}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Vertical
              </button>
            </div>

            <div className="space-y-2">
              {content.verticals.map((vert, idx) => (
                <div
                  key={vert.id || idx}
                  onClick={() => setSelectedVerticalIdx(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedVerticalIdx === idx
                      ? 'bg-teal-50/70 border-teal-500 shadow-sm ring-1 ring-teal-500'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-700">
                      {vert.index || idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{vert.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{vert.eyebrow}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {vert.capabilities?.length || 0} caps
                    </span>
                    <ChevronRight className={`w-4 h-4 ${selectedVerticalIdx === idx ? 'text-teal-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Details Editor */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {activeVertical ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 uppercase">
                      Vertical #{activeVertical.index}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{activeVertical.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteVertical(selectedVerticalIdx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Vertical
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Index (2-digit)
                    </label>
                    <input
                      type="text"
                      value={activeVertical.index}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'index', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
                      placeholder="01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Eyebrow Category
                    </label>
                    <input
                      type="text"
                      value={activeVertical.eyebrow}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'eyebrow', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Execution Capability"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={activeVertical.title}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                      placeholder="Construction & Infrastructure Projects"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={activeVertical.description}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Detailed operational capability overview..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={activeVertical.image}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'image', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="/images/story-construction-site.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Layout Style
                    </label>
                    <select
                      value={activeVertical.layout || 'side'}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'layout', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    >
                      <option value="side">Side by Side (Left Image)</option>
                      <option value="reverse">Reverse Side (Right Image)</option>
                      <option value="banner">Full Banner Card</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Call-to-Action (CTA Button Text)
                    </label>
                    <input
                      type="text"
                      value={activeVertical.cta}
                      onChange={(e) => handleVerticalChange(selectedVerticalIdx, 'cta', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="DISCUSS A PROJECT"
                    />
                  </div>
                </div>

                {/* Capabilities Sub-list */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Specific Capabilities & Offerings
                      </h3>
                      <p className="text-xs text-slate-400">
                        Bullet points displayed on this vertical's card or details sheet.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCapability(selectedVerticalIdx);
                        }
                      }}
                      placeholder="Add capability (e.g. Civil engineering execution)..."
                      className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCapability(selectedVerticalIdx)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    {activeVertical.capabilities?.map((cap, capIdx) => (
                      <div
                        key={capIdx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          {cap}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCapability(selectedVerticalIdx, capIdx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove capability"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a vertical to edit details</div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Preview */}
      {activeTab === 'preview' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">All Business Verticals Visual Grid</h2>
            <p className="text-xs text-slate-500">Live preview of how the business cards will render.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.verticals.map((vert, idx) => (
              <div
                key={vert.id || idx}
                className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-slate-50/50 flex flex-col"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={vert.image}
                    alt={vert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
                    {vert.index}
                  </div>
                  <div className="absolute top-3 right-3 bg-teal-600 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">
                    {vert.layout || 'side'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">
                      {vert.eyebrow}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{vert.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {vert.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {vert.capabilities?.slice(0, 3).map((cap, i) => (
                        <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-teal-500" />
                          <span className="truncate">{cap}</span>
                        </div>
                      ))}
                      {(vert.capabilities?.length || 0) > 3 && (
                        <span className="text-[11px] text-teal-600 font-medium">
                          +{(vert.capabilities?.length || 0) - 3} more capabilities
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-700">{vert.cta || 'EXPLORE'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVerticalIdx(idx);
                        setActiveTab('verticals');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Edit →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
