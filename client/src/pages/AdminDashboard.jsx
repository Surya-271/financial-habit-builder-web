import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  MessageSquare,
  BarChart3,
  Loader2,
  TrendingUp,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve system stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-650 rounded-2xl text-center">
        {error || 'Error loading dashboard.'}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <ShieldCheck className="text-purple-600" />
          Admin System Panel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor platform metrics, user statuses, and user feedback logs.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-purple-500/10 text-purple-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registrations</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {stats.totalUsers}
            </h3>
          </div>
        </GlassCard>

        {/* Active Users */}
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Users</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {stats.activeUsers}
            </h3>
          </div>
        </GlassCard>

        {/* Suspended Users */}
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-rose-500/10 text-rose-600 rounded-2xl">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suspended Users</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {stats.suspendedUsers}
            </h3>
          </div>
        </GlassCard>

        {/* Unread feedback */}
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unread Feedback</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {stats.unreadFeedback}
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">System Cumulative Inflows</p>
            <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
              ₹{(stats.totalSystemIncome || 0).toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-pink-500/10 text-pink-600 rounded-2xl">
            <Coins size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">System Cumulative Investments</p>
            <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
              ₹{(stats.totalSystemInvestments || 0).toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-purple-500/10 text-purple-600 rounded-2xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total User Inquiries</p>
            <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
              {stats.totalFeedback || 0} submissions
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Savings Analytics Panel */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Savings Goals Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Goals</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalSavingsGoals || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Goals</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-1">{stats.activeSavingsGoals || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Completed Goals</p>
            <h4 className="text-xl font-bold text-indigo-600 mt-1">{stats.completedSavingsGoals || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Target Savings</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">₹{(stats.totalTargetAmount || 0).toLocaleString()}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Saved</p>
            <h4 className="text-xl font-bold text-purple-600 mt-1">₹{(stats.totalSavedAmount || 0).toLocaleString()}</h4>
          </GlassCard>
        </div>
      </div>

      {/* Habit Analytics Panel */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Habit Performance Telemetry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Habits Tracked</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalHabits || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Habit Check-ins Completed</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-1">{stats.completedHabits || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Pending Habit Entries</p>
            <h4 className="text-xl font-bold text-amber-500 mt-1">{stats.pendingHabits || 0}</h4>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase">Completion Rate</p>
            <h4 className="text-xl font-bold text-purple-600 mt-1">{stats.overallHabitCompletionPercentage || 0}%</h4>
          </GlassCard>
        </div>
      </div>

      {/* Navigation shortcuts panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <Link to="/admin/users">
          <GlassCard className="p-6 flex items-center justify-between border-l-4 border-l-purple-500">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white">User Accounts</h4>
              <p className="text-xs text-slate-450">Suspend, activate, or purge users.</p>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </GlassCard>
        </Link>

        {/* Reports */}
        <Link to="/admin/reports">
          <GlassCard className="p-6 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white">Platform Reports</h4>
              <p className="text-xs text-slate-450">Analyze system distributions and totals.</p>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </GlassCard>
        </Link>

        {/* Feedback */}
        <Link to="/admin/feedback">
          <GlassCard className="p-6 flex items-center justify-between border-l-4 border-l-blue-500">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white">User Feedback Logs</h4>
              <p className="text-xs text-slate-450">Resolve submitted complaints/suggestions.</p>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </GlassCard>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
