import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
  Mail,
} from 'lucide-react';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unread', 'read'
  const [resolvingId, setResolvingId] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getFeedback();
      if (res.data.success) {
        setFeedbacks(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleResolveFeedback = async (id) => {
    if (resolvingId) return;
    setResolvingId(id);
    try {
      const res = await adminAPI.resolveFeedback(id);
      if (res.data.success) {
        setFeedbacks(
          feedbacks.map((f) => (f._id === id ? { ...f, status: 'read' } : f))
        );
      }
    } catch (err) {
      alert('Failed to mark feedback as resolved.');
    } finally {
      setResolvingId(null);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filterStatus === 'unread') return f.status === 'unread';
    if (filterStatus === 'read') return f.status === 'read';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <MessageSquare className="text-purple-600" />
            User Feedback Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review and resolve complaints, questions, or general reviews from the platform users.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/30">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'unread'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'read'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Feedback Feed */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-purple-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center">{error}</div>
      ) : filteredFeedbacks.length > 0 ? (
        <div className="space-y-6">
          {filteredFeedbacks.map((fb) => (
            <GlassCard
              key={fb._id}
              className={`p-6 border-l-4 ${
                fb.status === 'unread' ? 'border-l-purple-500 bg-purple-500/[0.02]' : 'border-l-slate-300 dark:border-l-slate-700'
              }`}
              hover={false}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-850 dark:text-white">
                      {fb.subject}
                    </h3>
                    {fb.status === 'unread' && (
                      <span className="px-2 py-0.5 text-[9px] font-bold text-purple-650 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/40 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={12} />
                    <span>
                      {fb.user?.name || 'Deleted User'} ({fb.user?.email || 'N/A'})
                    </span>
                    <span>•</span>
                    <span>{new Date(fb.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {fb.status === 'unread' && (
                  <button
                    onClick={() => handleResolveFeedback(fb._id)}
                    disabled={resolvingId !== null}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 bg-emerald-500/10 px-3.5 py-2 rounded-xl transition shrink-0 disabled:opacity-50"
                    title="Mark Feedback as Read"
                  >
                    {resolvingId === fb._id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Marking...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        Mark Read
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Message body */}
              <div className="mt-4 p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/25 rounded-2xl text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
                {fb.message}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 dark:bg-dark-900/40 rounded-2xl text-slate-400">
          No feedback logged. Clear inbox!
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
