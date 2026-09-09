import React, { useState } from 'react';
import { Save, CheckCircle2, Shield, Globe, Bell, KeyRound, AlertTriangle } from 'lucide-react';
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
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'ANIKA TRADING & CO.',
    tagline: 'Building. Supplying. Exporting. Connecting.',
    primaryEmail: 'info@anikatrading.com',
    supportPhone: '+880 1711 000000',
    headquarters: 'Dhaka & Chittagong, Bangladesh',
    notificationEmail: 'inquiries@anikatrading.com',
    notifyOnNewLead: true,
    maintenanceMode: false,
    defaultCurrency: 'USD ($)',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('anika_admin_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            System &amp; Platform Configuration
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure global corporate identifiers, inquiry notification webhooks, and operational flags.
          </p>
        </div>
        {saved && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Configuration Saved
          </div>
        )}
      </div>

      <AccountSettings />

      <form onSubmit={handleSave} className="space-y-6 text-xs max-w-4xl">
        {/* Section 1: Company Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Globe className="h-4 w-4 text-teal-600" /> General Company Identity
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Company Legal Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Corporate Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Public Inquiry Email</label>
              <input
                type="email"
                value={settings.primaryEmail}
                onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Office Phone / Hotline</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Bell className="h-4 w-4 text-indigo-600" /> Notifications &amp; Alerts
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Lead Alert Recipient Email</label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Currency Display</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="BDT (৳)">BDT (৳)</option>
                <option value="AED (AED)">AED (AED)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyOnNewLead}
                onChange={(e) => setSettings({ ...settings, notifyOnNewLead: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-slate-700">
                Dispatch instantaneous email notifications whenever a B2B export inquiry or quote is submitted.
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Operational Flags */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Shield className="h-4 w-4 text-amber-600" /> Operational Controls &amp; Security
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block text-sm">System Maintenance Mode</span>
              <span className="text-slate-500 text-xs mt-0.5 block">
                Temporarily pause public form submissions while undergoing catalog database updates.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
