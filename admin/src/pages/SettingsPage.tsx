import React, { useState } from 'react';
import { CheckCircle2, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { backendApi } from '../api';
import { ImageUploadButton } from '../components/ImageUploadButton';

const AccountSettings: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword && !currentPassword) {
      setError('Enter your current password to set a new one.');
      return;
    }

    setIsSaving(true);
    try {
      const { user: updatedUser } = await backendApi.users.updateSelf({
        name,
        username,
        avatar,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      updateCurrentUser(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to update your account.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 text-xs max-w-4xl">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
        <KeyRound className="h-4 w-4 text-teal-600" /> My Account &amp; Password
      </div>
      <p className="text-slate-500">
        Signed in as <span className="font-semibold text-slate-700">@{user.username}</span> ({user.role}).
        Update your own sign-in username and password here.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Avatar</label>
          <div className="flex flex-wrap items-center gap-2">
            <ImageUploadButton label="Upload from Device" currentUrl={avatar} onImageUploaded={setAvatar} />
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="flex-1 min-w-[160px] rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to change password"
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {success && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Account updated
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Account Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your own sign-in details. Company identity, contact details, and navigation are managed in{' '}
          <span className="font-semibold text-slate-700">Site Settings</span>.
        </p>
      </div>

      <AccountSettings />
    </div>
  );
};
