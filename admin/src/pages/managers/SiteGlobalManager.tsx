import React, { useState } from 'react';
import { SiteGlobalContent } from '../../types';
import { mockDb } from '../../api';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Globe,
  Compass,
  LayoutGrid,
  ExternalLink,
  Building,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export const SiteGlobalManager: React.FC = () => {
  const [content, setContent] = useState<SiteGlobalContent>(() => mockDb.getSiteGlobal());
  const [activeTab, setActiveTab] = useState<'company' | 'navigation' | 'footer'>('company');
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavHref, setNewNavHref] = useState('');
  const [newColTitle, setNewColTitle] = useState('');
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveSiteGlobal(content);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Company info handlers
  const handleCompanyChange = (field: keyof typeof content.companyInfo, val: string) => {
    setContent({
      ...content,
      companyInfo: { ...content.companyInfo, [field]: val },
    });
  };

  // Nav links handlers
  const handleAddNavLink = () => {
    if (!newNavLabel.trim() || !newNavHref.trim()) return;
    setContent({
      ...content,
      navLinks: [
        ...content.navLinks,
        { label: newNavLabel.trim(), href: newNavHref.trim() },
      ],
    });
    setNewNavLabel('');
    setNewNavHref('');
  };

  const handleRemoveNavLink = (index: number) => {
    setContent({
      ...content,
      navLinks: content.navLinks.filter((_, i) => i !== index),
    });
  };

  const handleNavLinkChange = (index: number, field: 'label' | 'href', val: string) => {
    const updated = [...content.navLinks];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, navLinks: updated });
  };

  // Footer columns handlers
  const handleAddFooterCol = () => {
    if (!newColTitle.trim()) return;
    setContent({
      ...content,
      footerColumns: [
        ...content.footerColumns,
        { title: newColTitle.trim(), links: [] },
      ],
    });
    setNewColTitle('');
  };

  const handleRemoveFooterCol = (colIdx: number) => {
    setContent({
      ...content,
      footerColumns: content.footerColumns.filter((_, i) => i !== colIdx),
    });
  };

  const handleAddFooterLink = (colIdx: number, label: string, href: string) => {
    if (!label.trim() || !href.trim()) return;
    const col = content.footerColumns[colIdx];
    const updated = [...content.footerColumns];
    updated[colIdx] = {
      ...col,
      links: [...col.links, { label: label.trim(), href: href.trim() }],
    };
    setContent({ ...content, footerColumns: updated });
  };

  const handleRemoveFooterLink = (colIdx: number, linkIdx: number) => {
    const col = content.footerColumns[colIdx];
    const updated = [...content.footerColumns];
    updated[colIdx] = {
      ...col,
      links: col.links.filter((_, i) => i !== linkIdx),
    };
    setContent({ ...content, footerColumns: updated });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Global site branding & navigation saved successfully!
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Global Settings
            </span>
            <span className="text-xs text-slate-400">Header & Footer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Global Site & Navigation Settings</h1>
          <p className="text-sm text-slate-500">
            Control company branding, global header menu links, footer columns and footer link destinations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
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
          onClick={() => setActiveTab('company')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'company'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Brand Identity & Coordinates
        </button>
        <button
          onClick={() => setActiveTab('navigation')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'navigation'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          Main Navbar Menu ({content.navLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'footer'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Footer Columns & Links ({content.footerColumns.length})
        </button>
      </div>

      {/* Tab: Company Info */}
      {activeTab === 'company' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Brand Identity & Master Contact</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Global brand name, tagline and official contact channels used in header & footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Legal / Brand Name
              </label>
              <input
                type="text"
                value={content.companyInfo.name}
                onChange={(e) => handleCompanyChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Tagline / Motto
              </label>
              <input
                type="text"
                value={content.companyInfo.tagline}
                onChange={(e) => handleCompanyChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Headquarters Address
              </label>
              <input
                type="text"
                value={content.companyInfo.address}
                onChange={(e) => handleCompanyChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Corporate Phone
              </label>
              <input
                type="text"
                value={content.companyInfo.phone}
                onChange={(e) => handleCompanyChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Corporate Email
              </label>
              <input
                type="email"
                value={content.companyInfo.email}
                onChange={(e) => handleCompanyChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Direct Link
              </label>
              <input
                type="text"
                value={content.companyInfo.whatsapp}
                onChange={(e) => handleCompanyChange('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Main Navbar Menu */}
      {activeTab === 'navigation' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Main Navbar Links</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top-level navigation items rendered across the header.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={newNavLabel}
              onChange={(e) => setNewNavLabel(e.target.value)}
              placeholder="Link Label (e.g. Careers)"
              className="sm:w-1/2 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
            <input
              type="text"
              value={newNavHref}
              onChange={(e) => setNewNavHref(e.target.value)}
              placeholder="Destination URL (e.g. /careers)"
              className="sm:w-1/2 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={handleAddNavLink}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Menu Link
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-2.5 w-12 text-center">#</th>
                  <th className="px-4 py-2.5">Display Label</th>
                  <th className="px-4 py-2.5">Destination URL</th>
                  <th className="px-4 py-2.5 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {content.navLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-center font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleNavLinkChange(idx, 'label', e.target.value)}
                        className="w-full px-2.5 py-1 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 font-medium"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => handleNavLinkChange(idx, 'href', e.target.value)}
                        className="w-full px-2.5 py-1 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 font-mono"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveNavLink(idx)}
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
      )}

      {/* Tab: Footer Columns & Links */}
      {activeTab === 'footer' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Footer Columns & Link Collections</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured link columns presented at the bottom of every page.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                placeholder="Column Title (e.g. Legal)..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddFooterCol}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Column
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.footerColumns.map((col, colIdx) => (
              <div
                key={colIdx}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const updated = [...content.footerColumns];
                        updated[colIdx] = { ...updated[colIdx], title: e.target.value };
                        setContent({ ...content, footerColumns: updated });
                      }}
                      className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterCol(colIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete Column"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Links in this column */}
                  <div className="space-y-2 mb-4">
                    {col.links.map((link, linkIdx) => (
                      <div
                        key={linkIdx}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-slate-900">{link.label}</span>
                          <span className="text-slate-400 ml-1 font-mono text-[11px]">({link.href})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLink(colIdx, linkIdx)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inline Add Link to Column */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const labelInput = form.elements.namedItem('linkLabel') as HTMLInputElement;
                    const hrefInput = form.elements.namedItem('linkHref') as HTMLInputElement;
                    handleAddFooterLink(colIdx, labelInput.value, hrefInput.value);
                    labelInput.value = '';
                    hrefInput.value = '';
                  }}
                  className="pt-3 border-t border-slate-200 space-y-2"
                >
                  <input
                    name="linkLabel"
                    required
                    placeholder="New link text..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                  <div className="flex gap-2">
                    <input
                      name="linkHref"
                      required
                      placeholder="/route..."
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded transition-colors shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
