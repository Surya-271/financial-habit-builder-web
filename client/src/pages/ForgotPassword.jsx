import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Mail, KeyRound, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success(res.message || 'Password reset link sent to your email.');
        // Redirect to Login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
      toast.error(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blurred spheres */}
      <div className="gradient-blob w-[300px] h-[300px] bg-brand-500 top-[-50px] right-[-50px]" />
      <div className="gradient-blob w-[350px] h-[350px] bg-indigo-500 bottom-[-50px] left-[-50px]" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            <span className="text-slate-900 dark:text-white font-extrabold">Finance</span>
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent font-black">Habit</span>
          </h1>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Local Error Block */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
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
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-550 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;
