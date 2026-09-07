import React, { useState } from 'react';
import { AboutPageContent } from '../../types';
import { mockDb } from '../../api';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  X,
} from 'lucide-react';

export const AboutPageManager: React.FC = () => {
  const [content, setContent] = useState<AboutPageContent>(() => mockDb.getAboutPage());
  const [activeTab, setActiveTab] = useState<'intro' | 'timeline' | 'mission' | 'values' | 'philosophy'>('intro');
  const [toast, setToast] = useState(false);
  const [newPillar, setNewPillar] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveAboutPage(content);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Timeline handlers
  const handleTimelineChange = (index: number, field: string, val: string) => {
    const updated = [...content.timeline];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, timeline: updated });
  };

  const handleAddTimeline = () => {
    const newStage = {
      id: `stage-${Date.now()}`,
      label: 'NEW MILESTONE',
      title: 'Milestone Title',
      description: 'Describe this phase of corporate growth and expansion.',
      image: '/images/materials-detail.jpg',
    };
    setContent({ ...content, timeline: [...content.timeline, newStage] });
  };

  const handleDeleteTimeline = (index: number) => {
    setContent({ ...content, timeline: content.timeline.filter((_, i) => i !== index) });
  };

  // Values handlers
  const handleValueChange = (index: number, field: string, val: string) => {
    const updated = [...content.coreValues];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, coreValues: updated });
  };

  // Pillars handlers
  const handleAddPillar = () => {
    if (!newPillar.trim()) return;
    setContent({
      ...content,
      missionVision: {
        ...content.missionVision,
        pillars: [...content.missionVision.pillars, newPillar.trim()],
      },
    });
    setNewPillar('');
  };

  const handleRemovePillar = (index: number) => {
    setContent({
      ...content,
      missionVision: {
        ...content.missionVision,
        pillars: content.missionVision.pillars.filter((_, i) => i !== index),
      },
    });
  };

  // Stats handler
  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    const updated = [...content.intro.stats];
    updated[index] = { ...updated[index], [field]: val };
    setContent({
      ...content,
      intro: { ...content.intro, stats: updated },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            About Page Content Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control all corporate story narrative, mission &amp; vision, timeline milestones, core values, and executive philosophy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toast && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Saved About Content!
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" /> Save About Page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'intro', label: '1. Intro & Stats' },
          { id: 'timeline', label: '2. Company Timeline' },
          { id: 'mission', label: '3. Mission & Vision' },
          { id: 'values', label: '4. Core Values' },
          { id: 'philosophy', label: '5. Business Philosophy' },
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
            TAB 1: INTRO & STATS
            ========================================== */}
        {activeTab === 'intro' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Intro Section &amp; Metrics
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Eyebrow Label</label>
                <input
                  type="text"
                  value={content.intro.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, eyebrow: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Main Heading</label>
                <input
                  type="text"
                  value={content.intro.heading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, heading: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Lead Paragraph</label>
                <textarea
                  rows={2}
                  value={content.intro.leadText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, leadText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Body Narrative</label>
                <textarea
                  rows={3}
                  value={content.intro.bodyText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, bodyText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Intro Image</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={content.intro.image}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        intro: { ...content.intro, image: e.target.value },
                      })
                    }
                    className="flex-1 rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  {content.intro.image && (
                    <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                      <img src={content.intro.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Counters */}
              <div className="md:col-span-2 pt-3 border-t border-slate-100 space-y-3">
                <label className="text-xs font-semibold text-slate-700">Key Statistics Counters</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {content.intro.stats.map((stat, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        placeholder="e.g. 15+"
                        className="w-full rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-slate-900 border border-slate-200"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-full rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 border border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: COMPANY TIMELINE
            ========================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Company Growth Stages ({content.timeline.length})
              </h3>
              <button
                type="button"
                onClick={handleAddTimeline}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" /> Add Stage
              </button>
            </div>

            <div className="space-y-4">
              {content.timeline.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-teal-700">Stage #{idx + 1} &middot; {stage.label}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTimeline(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Stage Badge / Label</label>
                      <input
                        type="text"
                        value={stage.label}
                        onChange={(e) => handleTimelineChange(idx, 'label', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Stage Title</label>
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Description</label>
                      <textarea
                        rows={2}
                        value={stage.description}
                        onChange={(e) => handleTimelineChange(idx, 'description', e.target.value)}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Image URL</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={stage.image}
                          onChange={(e) => handleTimelineChange(idx, 'image', e.target.value)}
                          className="flex-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                        {stage.image && (
                          <div className="h-10 w-16 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                            <img src={stage.image} alt="Preview" className="h-full w-full object-cover" />
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
            TAB 3: MISSION & VISION
            ========================================== */}
        {activeTab === 'mission' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Mission, Vision &amp; Strategic Pillars
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mission Title</label>
                <input
                  type="text"
                  value={content.missionVision.missionTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: {
                        ...content.missionVision,
                        missionTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Vision Title</label>
                <input
                  type="text"
                  value={content.missionVision.visionTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: {
                        ...content.missionVision,
                        visionTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Mission Statement</label>
                <textarea
                  rows={3}
                  value={content.missionVision.missionText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: {
                        ...content.missionVision,
                        missionText: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Vision Statement</label>
                <textarea
                  rows={3}
                  value={content.missionVision.visionText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: {
                        ...content.missionVision,
                        visionText: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Pillars list */}
              <div className="space-y-2 md:col-span-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Operational Pillars</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational pillar..."
                    value={newPillar}
                    onChange={(e) => setNewPillar(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPillar();
                      }
                    }}
                    className="flex-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPillar}
                    className="rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200"
                  >
                    Add Pillar
                  </button>
                </div>
                <div className="space-y-1.5 pt-2">
                  {content.missionVision.pillars.map((pillar, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200"
                    >
                      <span>{pillar}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(i)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: CORE VALUES
            ========================================== */}
        {activeTab === 'values' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Company Core Values ({content.coreValues.length})
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {content.coreValues.map((val, idx) => (
                <div
                  key={val.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Value Name</label>
                    <input
                      type="text"
                      value={val.label}
                      onChange={(e) => handleValueChange(idx, 'label', e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Value Principle</label>
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => handleValueChange(idx, 'description', e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: PHILOSOPHY
            ========================================== */}
        {activeTab === 'philosophy' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Leadership Business Philosophy
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Featured Quote Headline</label>
                <textarea
                  rows={2}
                  value={content.philosophy.quote}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      philosophy: { ...content.philosophy, quote: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Supporting Narrative</label>
                <textarea
                  rows={3}
                  value={content.philosophy.narrative}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      philosophy: { ...content.philosophy, narrative: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Author Name</label>
                <input
                  type="text"
                  value={content.philosophy.authorName}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      philosophy: { ...content.philosophy, authorName: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Author Designation</label>
                <input
                  type="text"
                  value={content.philosophy.authorTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      philosophy: { ...content.philosophy, authorTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Background Visual Path</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={content.philosophy.image}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        philosophy: { ...content.philosophy, image: e.target.value },
                      })
                    }
                    className="flex-1 rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                  {content.philosophy.image && (
                    <div className="h-12 w-20 overflow-hidden rounded-lg border border-slate-200 shrink-0 bg-slate-100">
                      <img src={content.philosophy.image} alt="Preview" className="h-full w-full object-cover" />
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
            <Save className="h-4 w-4" /> Save About Page Content
          </button>
        </div>
      </form>
    </div>
  );
};
