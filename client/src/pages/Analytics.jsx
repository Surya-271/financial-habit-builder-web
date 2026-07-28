import React, { useEffect, useState } from 'react';
import { wealthAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldCheck,
  Scale,
  LineChart as LineChartIcon,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';

// Import ChartJS components
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await wealthAPI.getDashboard();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
        {error || 'Error loading analytics dashboard.'}
      </div>
    );
  }

  const { summary, charts } = data;

  // Chart 1: Balance Sheet Ratio (Assets vs Liabilities)
  const assetRatioData = {
    labels: ['Cash/Assets', 'Liabilities (Debts)', 'Investments Value'],
    datasets: [
      {
        data: [summary.assets, summary.liabilities, summary.currentInvestmentValue],
        backgroundColor: ['#10b981', '#f43f5e', '#6366f1'],
        borderWidth: 1,
      },
    ],
  };

  const assetRatioOptions = {
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

  // Chart 2: Net Income Margin (Monthly growth bar chart)
  const months = Object.keys(charts.monthlyTrends);
  const netIncomeMargin = months.map(m => charts.monthlyTrends[m].income - charts.monthlyTrends[m].expense);

  const marginData = {
    labels: months,
    datasets: [
      {
        label: 'Net Savings Margin',
        data: netIncomeMargin,
        backgroundColor: netIncomeMargin.map(val => (val >= 0 ? 'rgba(16, 185, 129, 0.65)' : 'rgba(244, 63, 94, 0.65)')),
        borderColor: netIncomeMargin.map(val => (val >= 0 ? '#10b981' : '#f43f5e')),
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const marginOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(156, 163, 175, 0.8)' } },
      y: { grid: { color: 'rgba(156, 163, 175, 0.1)' }, ticks: { color: 'rgba(156, 163, 175, 0.8)' } },
    },
  };

  // Calculations
  const averageSavings = months.length > 0 
    ? Math.round(netIncomeMargin.reduce((acc, v) => acc + v, 0) / months.length) 
    : 0;

  const debtToAssetRatio = summary.assets > 0 
    ? Math.round((summary.liabilities / (summary.assets + summary.currentInvestmentValue)) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <LineChartIcon className="text-brand-500" />
          Wealth Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perform a deep analysis of your net worth, liabilities risk, and saving patterns.
        </p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 text-brand-500 dark:text-brand-400 rounded-xl">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Debt-to-Asset Ratio</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">
              {debtToAssetRatio}%
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Average Savings / Month</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">
              {currencySymbol}
              {averageSavings.toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Investments Return</p>
            <h3
              className={`text-lg font-bold mt-1 ${
                summary.investmentGrowth >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {summary.investmentGrowth >= 0 ? '+' : ''}
              {currencySymbol}
              {summary.investmentGrowth.toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Financial Health</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">
              {debtToAssetRatio < 30 ? 'Excellent' : debtToAssetRatio < 50 ? 'Moderate' : 'High Debt Warning'}
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-brand-500" />
            Asset & Liability Composition
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            {summary.assets > 0 || summary.liabilities > 0 || summary.currentInvestmentValue > 0 ? (
              <Doughnut data={assetRatioData} options={assetRatioOptions} />
            ) : (
              <p className="text-sm text-slate-400">No assets/debts entered yet.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-brand-500" />
            Monthly Savings Margins (Incomes - Expenses)
          </h3>
          <div className="flex-1 relative">
            <Bar data={marginData} options={marginOptions} />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Balance Sheet */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">System Balance Sheet Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          {/* Asset side */}
          <div className="space-y-4">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              Assets & Holdings
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cash, Properties & Items</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currencySymbol}
                {summary.assets.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Investment Portfolio Value</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currencySymbol}
                {summary.currentInvestmentValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 font-bold text-slate-850 dark:text-slate-100">
              <span>Total Capital Assets</span>
              <span>
                {currencySymbol}
                {(summary.assets + summary.currentInvestmentValue).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Liabilities side */}
          <div className="space-y-4">
            <h4 className="font-bold text-rose-600 dark:text-rose-455 border-b border-slate-100 dark:border-slate-800 pb-2">
              Liabilities & Debts
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Outstanding Debts / Loans</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currencySymbol}
                {summary.liabilities.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Other Liabilities</span>
              <span>{currencySymbol}0</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 font-bold text-slate-850 dark:text-slate-100">
              <span>Total Liabilities</span>
              <span>
                {currencySymbol}
                {summary.liabilities.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-semibold">
          <span className="text-slate-600 dark:text-slate-350">Overall Net Worth Valuation</span>
          <span className="text-xl font-black text-brand-600 dark:text-brand-300">
            {currencySymbol}
            {summary.netWorth.toLocaleString()}
          </span>
        </div>
      </GlassCard>
    </div>
  );
};

export default Analytics;
