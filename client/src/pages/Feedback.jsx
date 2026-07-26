import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Feedback = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setSuccess('');
    setError('');

    if (!subject || !message) {
      setError('Please fill in both the subject and message.');
      return;
    }

    try {
      setLoading(true);
      const res = await adminAPI.submitFeedback({ subject, message });
      if (res.data.success) {
        setSuccess('Thank you! Your feedback has been sent directly to the administrators.');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      {/* Header section */}
      <div className="text-center">
        <div className="inline-flex p-3 bg-brand-500/10 text-brand-600 dark:text-brand-300 rounded-2xl mb-3">
          <MessageSquare size={24} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
          Platform Feedback
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Have ideas, bug reports, or feature recommendations? Send a message directly to our admin team.
        </p>
      </div>

      {/* Form Card */}
      <GlassCard className="p-6 relative z-10" hover={false}>
        {/* Success Banner */}
        {success && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm border border-emerald-100 dark:border-emerald-950/30 animate-fade-in">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Feedback Subject *</label>
            <input
              type="text"
              placeholder="e.g. Splicing issue in Habit graph, request for USD support"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="glass-input text-sm"
              required
            />
          </div>

          {/* Message field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Detailed Message *</label>
            <textarea
              placeholder="Tell us what you think or describe the issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input text-sm h-40 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Feedback
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Feedback;
