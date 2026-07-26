import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { wealthAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Gem,
  Flame,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  FileText,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    if (code === 'GBP') return '£';
    return code || '₹';
  };

  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await wealthAPI.getDashboard();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-2xl text-center">
        {error || 'Error loading dashboard. Please try again.'}
      </div>
    );
  }

  const { summary, charts, recentActivities, habits, goals } = data;

  // Chart 1: Monthly Trends (Line Chart)
  const trendLabels = Object.keys(charts.monthlyTrends);
  const trendIncome = trendLabels.map((lbl) => charts.monthlyTrends[lbl].income);
  const trendExpense = trendLabels.map((lbl) => charts.monthlyTrends[lbl].expense);

  const lineData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Income',
        data: trendIncome,
        borderColor: '#10b981', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expense',
        data: trendExpense,
        borderColor: '#f43f5e', // Rose
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(156, 163, 175, 0.9)',
          font: { family: 'Outfit' },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(156, 163, 175, 0.8)' },
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.8)' },
      },
    },
  };

  // Chart 2: Expense Category Breakdown (Doughnut)
  const expenseCategories = Object.keys(charts.expenseBreakdown);
  const expenseValues = Object.values(charts.expenseBreakdown);

  const doughnutData = {
    labels: expenseCategories.length > 0 ? expenseCategories : ['No Expenses'],
    datasets: [
      {
        data: expenseValues.length > 0 ? expenseValues : [1],
        backgroundColor: [
          '#6366f1', // Indigo
          '#3b82f6', // Blue
          '#ec4899', // Pink
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#a855f7', // Purple
          '#f43f5e', // Rose
          '#64748b', // Slate
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(156, 163, 175, 0.9)',
          font: { family: 'Outfit', size: 12 },
        },
      },
    },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Hello, {user?.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here is a overview of your habits and wealth growth.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/income" className="btn-primary">
            <PlusCircle size={18} />
            Add Income
          </Link>
          <Link to="/expenses" className="btn-secondary">
            <PlusCircle size={18} />
            Log Expense
          </Link>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Net Worth */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Net Worth
              </p>
              <h3 className="text-2xl font-bold mt-2 text-slate-800 dark:text-white">
                {currencySymbol}
                {summary.netWorth.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-500 dark:text-brand-400 rounded-xl">
              <Gem size={20} />
            </div>
          </div>
        </GlassCard>

        {/* Total Income */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Income
              </p>
              <h3 className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                {currencySymbol}
                {summary.totalIncome.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
        </GlassCard>

        {/* Total Expenses */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Expenses
              </p>
              <h3 className="text-2xl font-bold mt-2 text-rose-600 dark:text-rose-400">
                {currencySymbol}
                {summary.totalExpense.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <TrendingDown size={20} />
            </div>
          </div>
        </GlassCard>

        {/* Investments */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Investments Value
              </p>
              <h3 className="text-2xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                {currencySymbol}
                {summary.currentInvestmentValue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Coins size={20} />
            </div>
          </div>
        </GlassCard>

        {/* Savings Rate */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Savings Rate
              </p>
              <h3 className="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">
                {summary.savingsRate}%
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Target size={20} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Income vs. Expenses Trend
          </h3>
          <div className="flex-1 relative">
            <Line data={lineData} options={lineOptions} />
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Expense Breakdown
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            {expenseCategories.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <p className="text-sm text-slate-400">No expense records logged yet.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act._id}
                  className="flex justify-between items-center p-3.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        act.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {act.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {act.title}
                      </p>
                      <p className="text-xs text-slate-400">{act.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        act.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {act.type === 'income' ? '+' : '-'}
                      {currencySymbol}
                      {act.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(act.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                No transactions recorded.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Goals & Habits Snapshot */}
        <div className="flex flex-col gap-6">
          {/* Habits Card */}
          <GlassCard className="p-6 flex-1">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
              Habits Streak
            </h3>
            <div className="flex items-center gap-4 p-4 bg-brand-500/10 text-brand-600 dark:text-brand-300 rounded-2xl">
              <Flame size={32} className="text-amber-500 fill-amber-500 animate-pulse-slow" />
              <div>
                <p className="text-sm font-semibold">Active Streak Count</p>
                <p className="text-2xl font-extrabold mt-0.5">{habits.avgStreak} Days</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Total Tracked</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{habits.totalHabits}</p>
              </div>
              <div className="bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Best Streak</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{habits.maxStreak} Days</p>
              </div>
            </div>
            <Link
              to="/habits"
              className="mt-4 w-full text-center text-xs font-semibold text-brand-500 hover:text-brand-400 block"
            >
              Configure Habits & Calendars
            </Link>
          </GlassCard>

          {/* Goals Card */}
          <GlassCard className="p-6 flex-1">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
              Savings Goal Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Average Progress</span>
                  <span className="text-brand-500 font-bold">{goals.avgProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${goals.avgProgress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center mt-2">
                <div className="bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-xl">
                  <p className="text-xs text-slate-400">Total Goals</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{goals.totalGoals}</p>
                </div>
                <div className="bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-xl">
                  <p className="text-xs text-slate-400">Completed</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {goals.completedGoals}
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/savings"
              className="mt-4 w-full text-center text-xs font-semibold text-brand-500 hover:text-brand-400 block"
            >
              Create New Savings Target
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
