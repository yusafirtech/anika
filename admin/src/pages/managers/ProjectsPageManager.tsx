import React, { useState, useEffect } from 'react';
import { ProjectsPageContent } from '../../types';
import { mockDb, backendApi } from '../../api';
import { ImageUploadButton } from '../../components/ImageUploadButton';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ProjectsPageManager: React.FC = () => {
  const [content, setContent] = useState<ProjectsPageContent>(() => mockDb.getProjectsPage());
  const [activeTab, setActiveTab] = useState<'intro' | 'projects' | 'preview'>('projects');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [newScopeItem, setNewScopeItem] = useState('');
  const [toast, setToast] = useState(false);

  // Fetch latest content from MySQL on mount
  useEffect(() => {
    backendApi.pages.get<ProjectsPageContent>('projects', content).then((data) => {
      if (data) setContent(data);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveProjectsPage(content);
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

  // Project handlers
  const handleProjectChange = (index: number, field: string, val: any) => {
    const updated = [...content.projects];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, projects: updated });
  };

  const handleAddProject = () => {
    const newProj = {
      slug: `project-${Date.now()}`,
      name: 'New Project Engagement',
      category: 'Infrastructure' as const,
      location: 'Dhaka, Bangladesh',
      year: new Date().getFullYear().toString(),
      status: 'In Execution',
      summary: 'Comprehensive execution overview of this major contractual undertaking.',
      overview: 'Full project background including engineering specifications, regulatory compliances, and site coordination.',
      scope: [
        'Material sourcing & testing',
        'On-site structural delivery',
        'Quality assurance inspection',
      ],
      execution: 'Structured multi-stage mobilization with dedicated logistics and quality monitoring teams.',
      image: '/images/story-construction-site.jpg',
    };
    const updated = [newProj, ...content.projects];
    setContent({ ...content, projects: updated });
    setSelectedIdx(0);
    setActiveTab('projects');
  };

  const handleDeleteProject = (index: number) => {
    if (content.projects.length <= 1) {
      alert('You must have at least one project.');
      return;
    }
    const updated = content.projects.filter((_, i) => i !== index);
    setContent({ ...content, projects: updated });
    if (selectedIdx >= updated.length) {
      setSelectedIdx(Math.max(0, updated.length - 1));
    }
  };

  // Scope handlers
  const handleAddScope = (projectIndex: number) => {
    if (!newScopeItem.trim()) return;
    const current = content.projects[projectIndex];
    const updated = [...content.projects];
    updated[projectIndex] = {
      ...current,
      scope: [...current.scope, newScopeItem.trim()],
    };
    setContent({ ...content, projects: updated });
    setNewScopeItem('');
  };

  const handleRemoveScope = (projectIndex: number, scopeIndex: number) => {
    const current = content.projects[projectIndex];
    const updated = [...content.projects];
    updated[projectIndex] = {
      ...current,
      scope: current.scope.filter((_, i) => i !== scopeIndex),
    };
    setContent({ ...content, projects: updated });
  };

  const filteredProjects = categoryFilter === 'All'
    ? content.projects
    : content.projects.filter((p) => p.category === categoryFilter);

  const activeProject = content.projects[selectedIdx] || content.projects[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Projects page content saved successfully!
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Page Editor
            </span>
            <span className="text-xs text-slate-400">/projects</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Projects Page Content</h1>
          <p className="text-sm text-slate-500">
            Control page intro narrative and manage the complete project portfolio, scopes and images.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/projects"
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
          onClick={() => setActiveTab('projects')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Projects Portfolio ({content.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('intro')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'intro'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Page Intro Narrative
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Portfolio Gallery Cards
        </button>
      </div>

      {/* Tab: Intro */}
      {activeTab === 'intro' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Projects Header Narrative</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The hero and intro text at the top of the /projects route.
            </p>
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
                placeholder="Track Record & Engagements"
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
                placeholder="Delivering Across Critical Sectors"
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
                placeholder="Describe ANIKA's track record, technical standards and project delivery rigor..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Projects Editor */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Projects Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Projects ({content.projects.length})</h3>
                <p className="text-xs text-slate-500">Select to inspect or edit</p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Project
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['All', 'Construction', 'Supply', 'Infrastructure', 'Engineering'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredProjects.map((proj) => {
                const realIdx = content.projects.findIndex((p) => p.slug === proj.slug);
                return (
                  <div
                    key={proj.slug}
                    onClick={() => setSelectedIdx(realIdx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedIdx === realIdx
                        ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{proj.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 font-medium">
                        {proj.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-medium text-[11px]">
                        {proj.category}
                      </span>
                      <span className="truncate">{proj.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Details Form */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {activeProject ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 uppercase">
                      Slug: {activeProject.slug}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{activeProject.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(selectedIdx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={activeProject.name}
                      onChange={(e) => handleProjectChange(selectedIdx, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Unique URL Slug
                    </label>
                    <input
                      type="text"
                      value={activeProject.slug}
                      onChange={(e) => handleProjectChange(selectedIdx, 'slug', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Sector / Category
                    </label>
                    <select
                      value={activeProject.category}
                      onChange={(e) => handleProjectChange(selectedIdx, 'category', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    >
                      <option value="Construction">Construction</option>
                      <option value="Supply">Supply</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Project Status
                    </label>
                    <input
                      type="text"
                      value={activeProject.status}
                      onChange={(e) => handleProjectChange(selectedIdx, 'status', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Completed / In Execution"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={activeProject.location}
                      onChange={(e) => handleProjectChange(selectedIdx, 'location', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      value={activeProject.year}
                      onChange={(e) => handleProjectChange(selectedIdx, 'year', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Image Path / URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeProject.image}
                        onChange={(e) => handleProjectChange(selectedIdx, 'image', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      />
                      <ImageUploadButton
                        onImageUploaded={(url) => handleProjectChange(selectedIdx, 'image', url)}
                        label="Upload Image"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Short Summary (Card Preview)
                    </label>
                    <textarea
                      rows={2}
                      value={activeProject.summary}
                      onChange={(e) => handleProjectChange(selectedIdx, 'summary', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Project Overview
                    </label>
                    <textarea
                      rows={3}
                      value={activeProject.overview}
                      onChange={(e) => handleProjectChange(selectedIdx, 'overview', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Execution & Mobilization Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={activeProject.execution}
                      onChange={(e) => handleProjectChange(selectedIdx, 'execution', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Scope of Work */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Scope of Work & Deliverables
                    </h3>
                    <p className="text-xs text-slate-400">
                      Deliverables and contractual items covered in this engagement.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newScopeItem}
                      onChange={(e) => setNewScopeItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddScope(selectedIdx);
                        }
                      }}
                      placeholder="Add scope item (e.g. Geotechnical soil stabilization)..."
                      className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddScope(selectedIdx)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Scope
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    {activeProject.scope?.map((sc, scIdx) => (
                      <div
                        key={scIdx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          {sc}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveScope(selectedIdx, scIdx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a project to view and edit details</div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Preview */}
      {activeTab === 'preview' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Project Portfolio Cards</h2>
            <p className="text-xs text-slate-500">Live preview of all projects formatted for the public site.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.projects.map((proj, idx) => (
              <div
                key={proj.slug}
                className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono font-medium">
                      {proj.year}
                    </div>
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase">
                      {proj.status}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-teal-700">{proj.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {proj.location}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">{proj.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">{proj.summary}</p>

                    <div className="space-y-1">
                      {proj.scope?.slice(0, 2).map((sc, i) => (
                        <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
                          <span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                          <span className="truncate">{sc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 truncate max-w-[150px]">
                    /{proj.slug}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIdx(idx);
                      setActiveTab('projects');
                    }}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Edit Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
