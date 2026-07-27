import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Gem,
  TrendingUp,
  TrendingDown,
  Coins,
  Target,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../GlassCard';

const DashboardPreviewSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section id="dashboard-preview" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Live Product Showcase
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need in One Dashboard
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            No messy spreadsheets or fragmented apps. FinanceHabit consolidates your entire wealth ecosystem into a sleek, real-time command center.
          </p>
        </div>

        {/* Browser Frame Mockup */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-900/90 shadow-2xl overflow-hidden max-w-6xl mx-auto backdrop-blur-2xl"
        >
          {/* Mac-Style Window Header */}
          <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-4 bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-1.5 flex items-center gap-2 text-xs text-slate-400 font-mono text-center justify-center">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="truncate">https://financehabit.app/dashboard</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Live Preview</span>
            </div>
          </div>

          {/* Interactive Preview Tabs Header */}
          <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between overflow-x-auto gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'overview'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Wealth Overview
              </button>
              <button
                onClick={() => setActiveTab('habits')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'habits'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Habits & Savings
              </button>
            </div>
            <div className="text-xs text-slate-500 font-medium hidden md:block">
              Exact UI matching FinanceHabit Client Production Build
            </div>
          </div>

          {/* Inner Replica of Actual Dashboard UI */}
          <div className="p-6 md:p-8 bg-slate-950/90 text-slate-100 min-h-[480px]">
            {activeTab === 'overview' ? (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Net Worth */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Net Worth
                      </p>
                      <h3 className="text-xl font-bold mt-1 text-white">₹4,28,500</h3>
                    </div>
                    <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl">
                      <Gem size={18} />
                    </div>
                  </div>

                  {/* Income */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Total Income
                      </p>
                      <h3 className="text-xl font-bold mt-1 text-emerald-400">₹1,25,000</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <TrendingUp size={18} />
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Total Expenses
                      </p>
                      <h3 className="text-xl font-bold mt-1 text-rose-400">₹42,300</h3>
                    </div>
                    <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
                      <TrendingDown size={18} />
                    </div>
                  </div>

                  {/* Investments */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Investments
                      </p>
                      <h3 className="text-xl font-bold mt-1 text-indigo-400">₹2,80,000</h3>
                    </div>
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                      <Coins size={18} />
                    </div>
                  </div>

                  {/* Savings Rate */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Savings Rate
                      </p>
                      <h3 className="text-xl font-bold mt-1 text-amber-400">66.16%</h3>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Target size={18} />
                    </div>
                  </div>
                </div>

                {/* Middle Charts & Transactions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Trends Graphic Representation */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 lg:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-white">Income vs. Expense Trends</h4>
                      <span className="text-xs text-emerald-400 font-semibold">+66% Net Surplus</span>
                    </div>
                    <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 border-b border-slate-800">
                      {[
                        { month: 'Jan', inc: 80, exp: 40 },
                        { month: 'Feb', inc: 95, exp: 45 },
                        { month: 'Mar', inc: 110, exp: 38 },
                        { month: 'Apr', inc: 105, exp: 50 },
                        { month: 'May', inc: 120, exp: 42 },
                        { month: 'Jun', inc: 125, exp: 42.3 },
                      ].map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <div className="w-full flex items-end justify-center gap-1.5 h-full">
                            <div
                              className="w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all"
                              style={{ height: `${item.inc}%` }}
                            />
                            <div
                              className="w-3.5 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm transition-all"
                              style={{ height: `${item.exp}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-center items-center gap-6 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Monthly Income Inflow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Monthly Expense Outflow</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions List */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-white mb-4">Recent Inflows & Logs</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <ArrowUpRight size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">Software Retainer</p>
                            <p className="text-[10px] text-slate-400">Income • Client Inflow</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-emerald-400">+₹85,000</p>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg">
                            <ArrowDownRight size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">Cloud Hosting Services</p>
                            <p className="text-[10px] text-slate-400">Expense • Technology</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-rose-400">-₹4,200</p>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Coins size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">Nifty Index SIP</p>
                            <p className="text-[10px] text-slate-400">Investment • Mutual Fund</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-indigo-400">₹15,000</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-[11px] text-brand-400 font-semibold">
                        Real-time synchronization active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {/* Habits Card */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-white">Active Habit Streaks</h4>
                    <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Flame size={20} className="fill-amber-400" />
                    </span>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-300 font-medium">Top Performing Habit</p>
                      <p className="text-lg font-extrabold text-white mt-0.5">Track Daily Purchases</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-amber-400">24 Days</p>
                      <p className="text-[10px] text-amber-300">Streak Active</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Read 15 mins financial news', 'No unplanned coffee spend', 'Log weekly portfolio SIP'].map(
                      (h) => (
                        <div key={h} className="flex items-center justify-between p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                          <span className="text-slate-300 font-medium">{h}</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 size={14} /> Done Today
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Savings Goals Card */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-white">Savings Milestones</h4>
                    <span className="p-2 bg-brand-500/10 text-brand-400 rounded-xl">
                      <Target size={20} />
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Emergency Reserve Fund</span>
                        <span className="text-brand-400 font-bold">₹1,50,000 / ₹2,00,000 (75%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full w-[75%] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Annual Tech Upgrade</span>
                        <span className="text-emerald-400 font-bold">₹80,000 / ₹80,000 (100%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Travel & Vacation Pot</span>
                        <span className="text-amber-400 font-bold">₹35,000 / ₹60,000 (58%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[58%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
