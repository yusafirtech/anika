import React, { useState } from 'react';
import { HeroSlide } from '../types';
import { mockDb } from '../api';
import {
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  X,
} from 'lucide-react';

export const HeroSectionManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => mockDb.getHero());
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    let updated: HeroSlide[];
    if (slides.some((s) => s.id === editingSlide.id)) {
      updated = slides.map((s) => (s.id === editingSlide.id ? editingSlide : s));
    } else {
      updated = [...slides, { ...editingSlide, id: `hero-${Date.now()}` }];
    }
    setSlides(updated);
    mockDb.saveHero(updated);
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  const handleDelete = (id: string) => {
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    mockDb.saveHero(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSlides(updated);
    mockDb.saveHero(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // re-assign orders
    const reordered = newSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(reordered);
    mockDb.saveHero(reordered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Homepage Hero Slides Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control the high-impact hero presentation, titles, background visuals, and CTA buttons on the live homepage.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSlide({
              id: '',
              title: '',
              subtitle: '',
              badgeText: '',
              bgImage: '/images/hero-port-supply-route.jpg',
              ctaText: 'START A CONVERSATION',
              ctaLink: '/contact',
              active: true,
              order: slides.length + 1,
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>

      {/* Slide Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`group relative overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
              slide.active ? 'border-slate-200 hover:border-slate-300 hover:shadow-sm' : 'border-slate-200/50 opacity-60'
            }`}
          >
            {/* Visual Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  Slide 0{slide.order}
                </span>
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border backdrop-blur-md transition-colors ${
                    slide.active
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700'
                  }`}
                >
                  {slide.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="rounded-lg bg-slate-900/80 p-1.5 text-slate-300 hover:text-white disabled:opacity-30 border border-slate-700/60"
                  title="Move Up"
                >
                  <MoveUp className="h-3 w-3" />
                </button>
                <button
                  disabled={index === slides.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="rounded-lg bg-slate-900/80 p-1.5 text-slate-300 hover:text-white disabled:opacity-30 border border-slate-700/60"
                  title="Move Down"
                >
                  <MoveDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Slide details */}
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 block mb-1">
                {slide.badgeText || 'ANIKA TRADING & CO.'}
              </span>
              <h3 className="font-bold text-base text-slate-900 line-clamp-1">{slide.title}</h3>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">{slide.subtitle}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  CTA: <strong className="text-teal-600">{slide.ctaText}</strong> &rarr; {slide.ctaLink}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingSlide(slide);
                      setIsModalOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600"
                    title="Edit Slide"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete Slide"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Slide Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Main Headline Title</label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Building. Supplying. Exporting. Connecting."
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subtitle Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="Short introductory description"
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Badge / Eyebrow Text</label>
                  <input
                    type="text"
                    value={editingSlide.badgeText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                    placeholder="e.g. International B2B Supply"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Background Image Path</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.bgImage}
                    onChange={(e) => setEditingSlide({ ...editingSlide, bgImage: e.target.value })}
                    placeholder="/images/..."
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    placeholder="e.g. START A CONVERSATION"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">CTA Target Link</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaLink}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                    placeholder="e.g. /contact"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={editingSlide.active}
                  onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="active-toggle" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Activate this slide immediately on homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
