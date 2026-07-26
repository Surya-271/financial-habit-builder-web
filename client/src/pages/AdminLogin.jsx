import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { ShieldCheck, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [valError, setValError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setValError('');

    if (!email || !password) {
      setValError('Please enter email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setValError(err.message || 'Administrative verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs */}
      <div className="gradient-blob w-[300px] h-[300px] bg-purple-500 top-[-50px] left-[-50px]" />
      <div className="gradient-blob w-[350px] h-[350px] bg-slate-500 bottom-[-50px] right-[-50px]" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-tr from-purple-650 from-purple-600 to-indigo-750 to-indigo-700 text-white p-3 rounded-2xl shadow-lg mb-3">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-1">
            Admin Console
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            System administration credentials required
          </p>
        </div>

        {/* Global Error Banner */}
        {valError && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="admin@tracker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 hover:text-purple-500 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-750 hover:from-purple-500 hover:to-indigo-650 text-white font-medium py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authorizing...
              </>
            ) : (
              'Authorize Console'
            )}
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-5">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-purple-500 transition"
          >
            Return to User Dashboard Portal
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminLogin;
