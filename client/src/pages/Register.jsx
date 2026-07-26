import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [valError, setValError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setValError('');

    // Frontend validations
    if (!name || !email || !password || !confirmPassword) {
      setValError('Please enter all required fields.');
      return;
    }

    if (password.length < 6) {
      setValError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/verify-email', { state: { email } });
      }
    } catch (err) {
      setValError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blurred spheres */}
      <div className="gradient-blob w-[300px] h-[300px] bg-brand-500 top-[-50px] left-[-50px]" />
      <div className="gradient-blob w-[350px] h-[350px] bg-indigo-500 bottom-[-50px] right-[-50px]" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            <span className="text-slate-900 dark:text-white font-extrabold">Finance</span>
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent font-black">Habit</span>
          </h1>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start building positive financial habits today
          </p>
        </div>

        {/* Global Error Banner */}
        {valError && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

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
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
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

          {/* Confirm Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-500 hover:text-brand-400 font-semibold transition"
          >
            Sign In
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
