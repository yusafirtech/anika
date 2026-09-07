import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { mockDb } from '../api';
import {
  Shield,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  X,
  Lock,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => mockDb.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    let updated: User[];
    if (users.some((u) => u.id === editingUser.id)) {
      updated = users.map((u) => (u.id === editingUser.id ? editingUser : u));
    } else {
      updated = [
        ...users,
        {
          ...editingUser,
          id: `usr-${Date.now()}`,
          lastActive: 'Never',
        },
      ];
    }
    setUsers(updated);
    mockDb.saveUsers(updated);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id
        ? { ...u, status: u.status === 'active' ? ('inactive' as const) : ('active' as const) }
        : u
    );
    setUsers(updated);
    mockDb.saveUsers(updated);
  };

  const handleDelete = (id: string) => {
    if (users.length <= 1) {
      alert('Cannot delete the last remaining administrative account.');
      return;
    }
    if (!confirm('Are you sure you want to revoke this user account?')) return;
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    mockDb.saveUsers(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Access Control &amp; User Accounts (RBAC)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Provision staff profiles, assign access roles (Admin, Manager, Editor, Viewer), and manage security permissions.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser({
              id: '',
              name: '',
              email: '',
              role: 'editor',
              department: 'Operations',
              status: 'active',
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all"
        >
          <UserPlus className="h-4 w-4" /> Provision New User
        </button>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold mb-1">
            <span>ADMINISTRATOR</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Full unconditional CRUD clearance across all modules and user provisioning.</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold mb-1">
            <span>MANAGER</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Full operations on inquiries, products, projects, and hero. Read-only on users.</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-teal-600 font-bold mb-1">
            <span>EDITOR</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Create &amp; edit content items (products, projects, media). Restricted settings.</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1">
            <span>VIEWER</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Read-only auditor access. Cannot create, edit, or delete any company records.</p>
        </div>
      </div>

      {/* Users List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Assigned Role</th>
                <th className="px-5 py-3.5 font-semibold">Account Status</th>
                <th className="px-5 py-3.5 font-semibold">Last Active</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-teal-700 text-xs">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                        ) : (
                          u.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{u.name}</span>
                        <span className="text-slate-500 text-xs">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{u.department || 'General'}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : u.role === 'manager'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : u.role === 'editor'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Lock className="h-2.5 w-2.5" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-all ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {u.status === 'active' ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{u.lastActive || 'Recently'}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition-colors"
                        title="Edit User & Role"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Revoke User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser.id ? 'Edit Staff Profile' : 'Provision Staff Account'}
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
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="e.g. Tariq Anwar"
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="user@anikatrading.com"
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Role Clearance</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                    }
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="admin">Admin (Full)</option>
                    <option value="manager">Manager (Ops)</option>
                    <option value="editor">Editor (Content)</option>
                    <option value="viewer">Viewer (Read-only)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={editingUser.department || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    placeholder="e.g. Export Logistics"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  value={editingUser.avatar || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="user-status"
                  checked={editingUser.status === 'active'}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.checked ? 'active' : 'inactive',
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="user-status" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Account is Active and allowed to authenticate
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
