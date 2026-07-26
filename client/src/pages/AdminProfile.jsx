import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { ShieldCheck, Mail, Calendar, KeyRound, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please complete all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await adminAPI.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Password changed successfully!');
        toast.success('Admin password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update password. Verify current password.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <ShieldCheck className="text-purple-600" />
          Admin Account & Security
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage system administrator account credentials and password security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admin Information Card */}
        <GlassCard className="p-6 md:col-span-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h3 className="font-bold text-slate-850 dark:text-white text-lg">
                  {admin?.name || 'Administrator'}
                </h3>
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-950/50 rounded-full mt-1">
                  {admin?.role ? admin.role.toUpperCase() : 'ADMIN'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={16} className="text-purple-500 shrink-0" />
                <span className="truncate">{admin?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Calendar size={16} className="text-purple-500 shrink-0" />
                <span>System Root Account</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Change Password Form Card */}
        <GlassCard className="p-6 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-6">
            <KeyRound size={20} className="text-purple-600" />
            Update Security Password
          </h3>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm border border-emerald-100 dark:border-emerald-950/30">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <KeyRound size={18} />
                </span>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <KeyRound size={18} />
                </span>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminProfile;
