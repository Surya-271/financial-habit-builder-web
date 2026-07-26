import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [valError, setValError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setValError('');

    // Frontend validations
    if (!email || !password) {
      setValError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      if (err.message === 'Please verify your email first.') {
        navigate('/verify-email', { state: { email } });
      } else {
        setValError(err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blurred spheres */}
      <div className="gradient-blob w-[300px] h-[300px] bg-brand-500 top-[-50px] right-[-50px]" />
      <div className="gradient-blob w-[350px] h-[350px] bg-indigo-500 bottom-[-50px] left-[-50px]" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            <span className="text-slate-900 dark:text-white font-extrabold">Finance</span>
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent font-black">Habit</span>
          </h1>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure login to your personal Wealth Dashboard
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
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-500 hover:text-brand-400 transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-500 dark:text-slate-500 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Redirect options */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-brand-500 hover:text-brand-400 font-semibold transition"
            >
              Sign Up Free
            </Link>
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-slate-400 hover:text-brand-500 transition"
            >
              Admin Dashboard Login
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
