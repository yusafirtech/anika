import React, { useState, useEffect } from 'react';
import { HomePageContent } from '../../types';
import { mockDb, backendApi } from '../../api';
import { ImageUploadButton } from '../../components/ImageUploadButton';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  X,
} from 'lucide-react';

export const HomePageManager: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>(() => mockDb.getHomePage());
  const [activeTab, setActiveTab] = useState<'hero' | 'sectors' | 'business' | 'why' | 'cta'>('hero');
  const [toast, setToast] = useState(false);

  // Fetch latest content from MySQL on mount
  useEffect(() => {
    backendApi.pages.get<HomePageContent>('home', content).then((data) => {
      if (data) setContent(data);
    });
  }, []);

  // Draft keyword input for hero
  const [newKeyword, setNewKeyword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveHomePage(content);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Keyword handlers
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        keywords: [...content.hero.keywords, newKeyword.trim().toUpperCase()],
      },
    });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    setContent({
      ...content,
      hero: {
        ...content.hero,
        keywords: content.hero.keywords.filter((_, i) => i !== index),
      },
    });
  };

  // Sector stories handlers
  const handleSectorChange = (index: number, field: string, val: string) => {
    const updated = [...content.sectorStories];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, sectorStories: updated });
  };

  const handleAddSector = () => {
    const newSector = {
      id: `sector-${Date.now()}`,
      eyebrow: `0${content.sectorStories.length + 1} / NEW SECTOR`,
      title: 'New Sector Title',
      description: 'Describe this sector capability and market value proposition.',
      image: '/images/story-international-trade.jpg',
    };
    setContent({
      ...content,
      sectorStories: [...content.sectorStories, newSector],
    });
  };

  const handleDeleteSector = (index: number) => {
    setContent({
      ...content,
      sectorStories: content.sectorStories.filter((_, i) => i !== index),
    });
  };

  // Business showcase handlers
  const handleBusinessChange = (index: number, field: string, val: any) => {
    const updated = [...content.businessShowcase];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, businessShowcase: updated });
  };

  // Why reasons handlers
  const handleWhyChange = (index: number, field: string, val: string) => {
    const updated = [...content.whyReasons];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, whyReasons: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Homepage Content Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control all text, titles, subtitles, background images, and CTAs across the entire homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toast && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Saved to Homepage!
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" /> Save Homepage Content
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'hero', label: '1. Hero Section' },
          { id: 'sectors', label: '2. Sector Stories Carousel' },
          { id: 'business', label: '3. Business Ecosystem Swiper' },
          { id: 'why', label: '4. Why ANIKA Reasons' },
          { id: 'cta', label: '5. Bottom CTA Banner' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ==========================================
            TAB 1: HERO SECTION
            ========================================== */}
        {activeTab === 'hero' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Hero Section Parameters
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Top Eyebrow Text</label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, eyebrow: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Headline 4-Word Cycle (comma-separated)
                </label>
                <input
                  type="text"
                  value={content.hero.headlineWords.join(', ')}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        headlineWords: e.target.value.split(',').map((w) => w.trim()),
                      },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Hero Subtitle Narrative</label>
                <textarea
                  rows={2}
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Background Image Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={content.hero.bgImage}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, bgImage: e.target.value },
                      })
                    }
                    className="flex-1 rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  <ImageUploadButton
                    onImageUploaded={(url) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, bgImage: url },
                      })
                    }
                  />
                </div>
                {content.hero.bgImage && (
                  <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-slate-200 mt-2 bg-slate-100">
                    <img src={content.hero.bgImage} alt="Hero Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={content.hero.ctaText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, ctaText: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">CTA Target Link</label>
                  <input
                    type="text"
                    value={content.hero.ctaLink}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, ctaLink: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Floating Sector Keywords */}
              <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Floating Sector Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    className="max-w-xs rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200"
                  >
                    Add Keyword
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {content.hero.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-700"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(i)}
                        className="text-teal-500 hover:text-teal-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: SECTOR STORIES
            ========================================== */}
        {activeTab === 'sectors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Sector Stories Slides ({content.sectorStories.length})
              </h3>
              <button
                type="button"
                onClick={handleAddSector}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" /> Add Story Slide
              </button>
            </div>

            <div className="space-y-4">
              {content.sectorStories.map((story, idx) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-xs text-teal-700">Slide {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSector(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Eyebrow / Category</label>
                      <input
                        type="text"
                        value={story.eyebrow}
                        onChange={(e) => handleSectorChange(idx, 'eyebrow', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Slide Title</label>
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => handleSectorChange(idx, 'title', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Story Narrative Description</label>
                      <textarea
                        rows={2}
                        value={story.description}
                        onChange={(e) => handleSectorChange(idx, 'description', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Image</label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <ImageUploadButton
                          label="Upload from Device"
                          currentUrl={story.image}
                          onImageUploaded={(url) => handleSectorChange(idx, 'image', url)}
                        />
                        <input
                          type="text"
                          value={story.image}
                          onChange={(e) => handleSectorChange(idx, 'image', e.target.value)}
                          className="flex-1 min-w-[160px] rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                        {story.image && (
                          <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                            <img src={story.image} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: BUSINESS SHOWCASE
            ========================================== */}
        {activeTab === 'business' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Connected Business Showcase Items ({content.businessShowcase.length})
            </h3>

            <div className="space-y-4">
              {content.businessShowcase.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-teal-700">
                      Business #{item.index} &middot; {item.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Index Tag</label>
                      <input
                        type="text"
                        value={item.index}
                        onChange={(e) => handleBusinessChange(idx, 'index', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Business Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleBusinessChange(idx, 'title', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Overview Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleBusinessChange(idx, 'description', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Bullet Points (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={item.points.join(', ')}
                        onChange={(e) =>
                          handleBusinessChange(
                            idx,
                            'points',
                            e.target.value.split(',').map((p) => p.trim())
                          )
                        }
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">CTA Label</label>
                      <input
                        type="text"
                        value={item.cta}
                        onChange={(e) => handleBusinessChange(idx, 'cta', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">CTA Link Target</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => handleBusinessChange(idx, 'href', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Image</label>
                      <div className="flex flex-wrap gap-3 items-center">
                        <ImageUploadButton
                          label="Upload from Device"
                          currentUrl={item.image}
                          onImageUploaded={(url) => handleBusinessChange(idx, 'image', url)}
                        />
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleBusinessChange(idx, 'image', e.target.value)}
                          className="flex-1 min-w-[160px] rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                        {item.image && (
                          <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                            <img src={item.image} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: WHY ANIKA
            ========================================== */}
        {activeTab === 'why' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Why ANIKA Reasons ({content.whyReasons.length})
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {content.whyReasons.map((reason, idx) => (
                <div
                  key={reason.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <span className="font-bold text-xs text-teal-700">Reason #{reason.index}</span>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Reason Title</label>
                    <input
                      type="text"
                      value={reason.title}
                      onChange={(e) => handleWhyChange(idx, 'title', e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={reason.description}
                      onChange={(e) => handleWhyChange(idx, 'description', e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Background Visual</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      <ImageUploadButton
                        label="Upload from Device"
                        currentUrl={reason.image}
                        onImageUploaded={(url) => handleWhyChange(idx, 'image', url)}
                      />
                      <input
                        type="text"
                        value={reason.image}
                        onChange={(e) => handleWhyChange(idx, 'image', e.target.value)}
                        className="flex-1 min-w-[160px] rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                      {reason.image && (
                        <div className="h-10 w-14 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                          <img src={reason.image} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: BOTTOM CTA
            ========================================== */}
        {activeTab === 'cta' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Homepage Bottom CTA Banner
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Eyebrow Badge</label>
                <input
                  type="text"
                  value={content.cta.eyebrow}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, eyebrow: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Main Heading</label>
                <input
                  type="text"
                  value={content.cta.heading}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, heading: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Description Text</label>
                <textarea
                  rows={2}
                  value={content.cta.description}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, description: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Primary Button Label</label>
                <input
                  type="text"
                  value={content.cta.primaryCtaText}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, primaryCtaText: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Primary Button Link</label>
                <input
                  type="text"
                  value={content.cta.primaryCtaLink}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, primaryCtaLink: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Secondary Button Label</label>
                <input
                  type="text"
                  value={content.cta.secondaryCtaText}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, secondaryCtaText: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Secondary Button Link</label>
                <input
                  type="text"
                  value={content.cta.secondaryCtaLink}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...content.cta, secondaryCtaLink: e.target.value } })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Background Image</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={content.cta.bgImage}
                    onChange={(e) =>
                      setContent({ ...content, cta: { ...content.cta, bgImage: e.target.value } })
                    }
                    className="flex-1 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  <ImageUploadButton
                    onImageUploaded={(url) =>
                      setContent({ ...content, cta: { ...content.cta, bgImage: url } })
                    }
                  />
                  {content.cta.bgImage && (
                    <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                      <img src={content.cta.bgImage} alt="CTA Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" /> Save Homepage Content
          </button>
        </div>
      </form>
    </div>
  );
};
