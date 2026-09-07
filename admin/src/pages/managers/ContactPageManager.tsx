import React, { useState } from 'react';
import { ContactPageContent } from '../../types';
import { mockDb } from '../../api';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const ContactPageManager: React.FC = () => {
  const [content, setContent] = useState<ContactPageContent>(() => mockDb.getContactPage());
  const [activeTab, setActiveTab] = useState<'coordinates' | 'form' | 'hero'>('coordinates');
  const [newSector, setNewSector] = useState('');
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveContactPage(content);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Hero handlers
  const handleHeroChange = (field: keyof typeof content.hero, val: string) => {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: val },
    });
  };

  // Coordinates handlers
  const handleCoordChange = (field: keyof typeof content.coordinates, val: string) => {
    setContent({
      ...content,
      coordinates: { ...content.coordinates, [field]: val },
    });
  };

  // Inquiry sectors handlers
  const handleAddSector = () => {
    if (!newSector.trim()) return;
    setContent({
      ...content,
      formSettings: {
        ...content.formSettings,
        inquirySectors: [...content.formSettings.inquirySectors, newSector.trim()],
      },
    });
    setNewSector('');
  };

  const handleRemoveSector = (index: number) => {
    setContent({
      ...content,
      formSettings: {
        ...content.formSettings,
        inquirySectors: content.formSettings.inquirySectors.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Contact page & channels saved successfully!
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Page Editor
            </span>
            <span className="text-xs text-slate-400">/contact</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Contact Page & Official Coordinates</h1>
          <p className="text-sm text-slate-500">
            Configure contact coordinates, inquiry sector options, response messaging and hero banner.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/contact"
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
          onClick={() => setActiveTab('coordinates')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'coordinates'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Phone className="w-4 h-4" />
          Official Coordinates & Channels
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'form'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Inquiry Form & Routing ({content.formSettings.inquirySectors.length} sectors)
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Hero Banner & Narrative
        </button>
      </div>

      {/* Tab: Coordinates */}
      {activeTab === 'coordinates' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Communication Channels & Office Location</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Public contact info displayed on the contact page, header badges and direct links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Physical Address
              </label>
              <input
                type="text"
                value={content.coordinates.address}
                onChange={(e) => handleCoordChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Operating Hours & Timezone
              </label>
              <input
                type="text"
                value={content.coordinates.hours || ''}
                onChange={(e) => handleCoordChange('hours', e.target.value)}
                placeholder="Sunday – Thursday: 9:00 AM – 6:00 PM (GMT+6)"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Official Phone Number
              </label>
              <input
                type="text"
                value={content.coordinates.phone}
                onChange={(e) => handleCoordChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Official Email Address
              </label>
              <input
                type="email"
                value={content.coordinates.email}
                onChange={(e) => handleCoordChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Direct WhatsApp Hotline (International Format)
              </label>
              <input
                type="text"
                value={content.coordinates.whatsapp}
                onChange={(e) => handleCoordChange('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Form Settings */}
      {activeTab === 'form' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Inquiry Routing & Sectors</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sector dropdown choices available to visitors submitting trade inquiries.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Success Confirmation Message
            </label>
            <textarea
              rows={3}
              value={content.formSettings.successMessage}
              onChange={(e) =>
                setContent({
                  ...content,
                  formSettings: { ...content.formSettings, successMessage: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Inquiry Sectors (Dropdown Options)
            </label>

            <div className="flex gap-2 max-w-lg">
              <input
                type="text"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSector();
                  }
                }}
                placeholder="Add inquiry sector (e.g. Bulk Commodity Procurement)..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSector}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Sector
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {content.formSettings.inquirySectors.map((sector, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                >
                  <span className="font-medium truncate">{sector}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSector(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Hero */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Hero Banner & Narrative</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top banner headline and background for the /contact page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Eyebrow Category
              </label>
              <input
                type="text"
                value={content.hero.eyebrow}
                onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Hero Heading
              </label>
              <input
                type="text"
                value={content.hero.heading}
                onChange={(e) => handleHeroChange('heading', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Background Image Path / URL
              </label>
              <input
                type="text"
                value={content.hero.bgImage}
                onChange={(e) => handleHeroChange('bgImage', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Introductory Text Narrative
              </label>
              <textarea
                rows={4}
                value={content.intro.text}
                onChange={(e) =>
                  setContent({
                    ...content,
                    intro: { ...content.intro, text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
