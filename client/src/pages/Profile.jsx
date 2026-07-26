import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  User,
  Mail,
  Phone,
  Bookmark,
  Coins,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Local Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [currency, setCurrency] = useState(user?.profile?.currency || 'INR');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.profile?.monthlyBudget || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Info banners
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setSuccess('');
    setError('');

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      name,
      email,
      profile: {
        bio,
        phone,
        currency,
        monthlyBudget: monthlyBudget === '' ? 0 : Number(monthlyBudget),
      },
    };

    if (password) {
      payload.password = password;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile(payload);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <User className="text-brand-500" />
          Account Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Adjust currency settings, budgets, credentials, and profile options.
        </p>
      </div>

      {/* Main Form content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Summary details */}
        <GlassCard className="p-6 h-fit space-y-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-850 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-bold text-brand-600 bg-brand-50 dark:text-brand-300 dark:bg-brand-900/40 rounded-full capitalize">
              {user?.role} Account
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 text-left space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold">BIO DESCRIPTION</p>
              <p className="text-sm text-slate-650 dark:text-slate-350 mt-1 italic">
                {user?.profile?.bio || '"No bio description configured."'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">PREFERENCED CURRENCY</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {user?.profile?.currency} ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'})
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Right Form panel */}
        <GlassCard className="p-6 lg:col-span-2 hover:translate-y-0" hover={false}>
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">Profile Preferences</h3>

          {/* Success Banner */}
          {success && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm border border-emerald-100 dark:border-emerald-950/30">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input text-sm pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input text-sm pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. +91 9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full glass-input text-sm pl-10"
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Primary Currency</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Coins size={16} />
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full glass-input text-sm pl-10"
                  >
                    <option value="INR">INR (₹) Rupees</option>
                    <option value="USD">USD ($) Dollars</option>
                    <option value="EUR">EUR (€) Euros</option>
                    <option value="GBP">GBP (£) Pounds</option>
                  </select>
                </div>
              </div>

              {/* Monthly Budget */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Monthly Budget Target</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Bookmark size={16} />
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 20000"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="w-full glass-input text-sm pl-10"
                    min="0"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Bio / Catchphrase</label>
                <input
                  type="text"
                  placeholder="e.g. Saving for a new laptop..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full glass-input text-sm"
                />
              </div>
            </div>

            {/* Password Credentials updates */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Security Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full glass-input text-sm pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full glass-input text-sm pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="btn-primary px-8 py-2.5 flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Settings'
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Profile;
