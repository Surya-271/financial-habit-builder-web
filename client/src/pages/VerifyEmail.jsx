import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Mail, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkEmailVerification, resendVerificationEmail } = useAuth();

  const [email] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');

  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    setLoading(true);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        setError('Your email is not verified yet. Please click the link in your email and try again.');
        toast.error('Email not verified yet.');
      }
    } catch (err) {
      setError(err.message || 'Verification check failed. Please try again.');
      toast.error('Verification check failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setError('');
    setResending(true);
    try {
      const res = await resendVerificationEmail();
      if (res.success) {
        toast.success(res.message || 'A new verification link has been sent!');
        setTimer(60); // Reset countdown timer
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification link.');
      toast.error(err.message || 'Resend failed.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blurred spheres */}
      <div className="gradient-blob w-[300px] h-[300px] bg-brand-500 top-[-50px] left-[-50px]" />
      <div className="gradient-blob w-[350px] h-[350px] bg-indigo-500 bottom-[-50px] right-[-50px]" />

      <GlassCard className="w-full max-w-md p-8 relative z-10" hover={false}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            <span className="text-slate-900 dark:text-white font-extrabold">Finance</span>
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent font-black">Habit</span>
          </h1>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Verify Email
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Confirm your registration using the link sent to your email
          </p>
        </div>

        {/* Local Error Block */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-950/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="p-5 bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-center space-y-3">
            <Mail size={36} className="mx-auto text-brand-500 animate-pulse" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              We sent a verification email to:
            </p>
            <p className="text-sm font-bold text-brand-500 select-all">
              {email || 'your email'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Please click the link in that email to activate your account, then click the confirmation button below.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking status...
              </>
            ) : (
              'I have verified my email'
            )}
          </button>
        </form>

        {/* Spam/Junk Folder Info Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-100/30 dark:bg-slate-800/10 border border-slate-200/30 dark:border-slate-800/30 text-left text-xs text-slate-500 dark:text-slate-400 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
            <span>📧</span>
            <span>Can't find the verification email?</span>
          </div>
          <p className="leading-relaxed">
            Please check your Inbox, Spam/Junk, and Promotions folders. Email delivery may take a few minutes.
          </p>
          <p className="leading-relaxed">
            If you still don't receive it, you can resend the verification email once the countdown finishes.
          </p>
        </div>

        {/* Resend actions & Timer */}
        <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800 text-center">
          {timer > 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resend verification link in <span className="font-semibold text-brand-500">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-400 transition disabled:opacity-50"
            >
              {resending ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Resend Verification Email
                </>
              )}
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default VerifyEmail;

