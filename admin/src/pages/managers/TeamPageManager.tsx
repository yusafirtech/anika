import React, { useState } from 'react';
import { TeamPageContent } from '../../types';
import { mockDb } from '../../api';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Award,
} from 'lucide-react';

export const TeamPageManager: React.FC = () => {
  const [content, setContent] = useState<TeamPageContent>(() => mockDb.getTeamPage());
  const [activeTab, setActiveTab] = useState<'members' | 'intro' | 'departments'>('members');
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(0);
  const [newExpertiseTag, setNewExpertiseTag] = useState('');
  const [newDept, setNewDept] = useState('');
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.saveTeamPage(content);
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

  // Member CRUD
  const handleMemberChange = (index: number, field: string, val: any) => {
    const updated = [...content.members];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, members: updated });
  };

  const handleAddMember = () => {
    const newMemb = {
      id: `member-${Date.now()}`,
      name: 'New Team Member',
      title: 'Senior Officer',
      department: content.departments[1] || 'Operations',
      image: '/images/team-ceo.jpg',
      initials: 'TM',
      bio: 'Experienced professional bringing domain mastery and leadership to ANIKA TRADING & CO.',
      expertise: ['Operations Management', 'Cross-functional Coordination', 'Strategic Planning'],
    };
    const updated = [...content.members, newMemb];
    setContent({ ...content, members: updated });
    setSelectedMemberIdx(updated.length - 1);
  };

  const handleDeleteMember = (index: number) => {
    if (content.members.length <= 1) {
      alert('You must have at least one team member.');
      return;
    }
    const updated = content.members.filter((_, i) => i !== index);
    setContent({ ...content, members: updated });
    if (selectedMemberIdx >= updated.length) {
      setSelectedMemberIdx(Math.max(0, updated.length - 1));
    }
  };

  // Expertise tags
  const handleAddExpertise = (memberIndex: number) => {
    if (!newExpertiseTag.trim()) return;
    const current = content.members[memberIndex];
    const updated = [...content.members];
    updated[memberIndex] = {
      ...current,
      expertise: [...(current.expertise || []), newExpertiseTag.trim()],
    };
    setContent({ ...content, members: updated });
    setNewExpertiseTag('');
  };

  const handleRemoveExpertise = (memberIndex: number, tagIndex: number) => {
    const current = content.members[memberIndex];
    const updated = [...content.members];
    updated[memberIndex] = {
      ...current,
      expertise: current.expertise.filter((_, i) => i !== tagIndex),
    };
    setContent({ ...content, members: updated });
  };

  // Departments
  const handleAddDepartment = () => {
    if (!newDept.trim() || content.departments.includes(newDept.trim())) return;
    setContent({
      ...content,
      departments: [...content.departments, newDept.trim()],
    });
    setNewDept('');
  };

  const handleRemoveDepartment = (deptName: string) => {
    if (deptName === 'All') return;
    setContent({
      ...content,
      departments: content.departments.filter((d) => d !== deptName),
    });
  };

  const activeMember = content.members[selectedMemberIdx] || content.members[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          Leadership & Team content saved successfully!
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Page Editor
            </span>
            <span className="text-xs text-slate-400">/team</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Leadership & Team Page Content</h1>
          <p className="text-sm text-slate-500">
            Manage executive bios, leadership credentials, department taxonomies, and portrait photography.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/team"
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
          onClick={() => setActiveTab('members')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Team Roster ({content.members.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'departments'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Departments & Filters ({content.departments.length})
        </button>
        <button
          onClick={() => setActiveTab('intro')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 tracking-wide uppercase transition-colors flex items-center gap-2 ${
            activeTab === 'intro'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Intro Narrative
        </button>
      </div>

      {/* Tab: Members Roster */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Members Sidebar List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Personnel</h3>
                <p className="text-xs text-slate-500">{content.members.length} leaders & specialists</p>
              </div>
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Person
              </button>
            </div>

            <div className="space-y-2">
              {content.members.map((memb, idx) => (
                <div
                  key={memb.id || idx}
                  onClick={() => setSelectedMemberIdx(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedMemberIdx === idx
                      ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {memb.image ? (
                      <img
                        src={memb.image}
                        alt={memb.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {memb.initials || 'AR'}
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{memb.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{memb.title}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      selectedMemberIdx === idx ? 'text-teal-600' : 'text-slate-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Member Details Editor */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {activeMember ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      {activeMember.image ? (
                        <img
                          src={activeMember.image}
                          alt={activeMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-teal-700 bg-teal-50">
                          {activeMember.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{activeMember.name}</h2>
                      <p className="text-xs text-teal-600 font-medium">{activeMember.title}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(selectedMemberIdx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={activeMember.name}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Initials (Fallback Avatar)
                    </label>
                    <input
                      type="text"
                      value={activeMember.initials || ''}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'initials', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
                      placeholder="e.g. AR"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Position / Executive Title
                    </label>
                    <input
                      type="text"
                      value={activeMember.title}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <select
                      value={activeMember.department}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'department', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    >
                      {content.departments
                        .filter((d) => d !== 'All')
                        .map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Portrait Photography URL / Path
                    </label>
                    <input
                      type="text"
                      value={activeMember.image || ''}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'image', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="/images/team-ceo.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Executive Biography & Background
                    </label>
                    <textarea
                      rows={4}
                      value={activeMember.bio}
                      onChange={(e) => handleMemberChange(selectedMemberIdx, 'bio', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Expertise Badges */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Areas of Mastery & Core Competencies
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pills rendered under this team member's bio card.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExpertiseTag}
                      onChange={(e) => setNewExpertiseTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddExpertise(selectedMemberIdx);
                        }
                      }}
                      placeholder="Add competency (e.g. Cross-border Logistics)..."
                      className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddExpertise(selectedMemberIdx)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {activeMember.expertise?.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium"
                      >
                        <Award className="w-3 h-3 text-teal-600" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(selectedMemberIdx, tagIdx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a team member to edit</div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Department Taxonomies</h2>
            <p className="text-xs text-slate-500">
              Department categories used for filtering leadership and personnel across the website.
            </p>
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="New department name (e.g. Quality Assurance)..."
              className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddDepartment}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Department
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {content.departments.map((dept) => (
              <div
                key={dept}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
              >
                <span>{dept}</span>
                {dept !== 'All' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDepartment(dept)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Intro */}
      {activeTab === 'intro' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Team Page Narrative</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top banner content for the /team page.</p>
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
