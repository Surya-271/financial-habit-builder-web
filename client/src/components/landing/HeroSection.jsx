import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Flame,
  Target,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -10, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  const floatAnimationReverse = shouldReduceMotion
    ? {}
    : {
        y: [0, 10, 0],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Gradient Vector Blobs */}
      <div className="gradient-blob w-[500px] h-[500px] bg-brand-500/20 top-[-100px] left-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />
      <div className="gradient-blob w-[400px] h-[400px] bg-indigo-500/15 top-[200px] left-[-100px] blur-[90px] pointer-events-none" />
      <div className="gradient-blob w-[450px] h-[450px] bg-purple-500/15 bottom-0 right-[-100px] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <Sparkles size={16} className="text-brand-500 animate-pulse" />
            <span>Smart Personal Finance & Wealth Habit Tracker</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-brand-500 text-white rounded-full">
              v1.0 Ready
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Build Better Financial Habits.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Grow Your Wealth.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto"
          >
            Track income, monitor expenses, build saving habits, manage investments, and achieve your financial goals through one intelligent financial dashboard.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto btn-primary py-3.5 px-8 text-base font-semibold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto btn-secondary py-3.5 px-8 text-base font-semibold border border-slate-200 dark:border-slate-800"
            >
              <span>Sign In to Dashboard</span>
            </Link>
          </motion.div>

          {/* Feature Highlights Pills */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>100% Free & Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              <span>Real-Time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-brand-500" />
              <span>Habit Streak Tracker</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Floating Widgets Banner */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Widget 1: Savings Goal */}
            <motion.div
              animate={floatAnimation}
              className="glass-card p-6 border-l-4 border-l-brand-500 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-500">
                  <Target size={20} />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                  84% Reached
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Emergency Fund Goal
              </p>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                ₹84,000 / ₹1,00,000
              </h4>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full w-[84%]" />
              </div>
            </motion.div>

            {/* Widget 2: Habit Streak */}
            <motion.div
              animate={floatAnimationReverse}
              className="glass-card p-6 border-l-4 border-l-amber-500 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                  <Flame size={20} className="fill-amber-500" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                  14 Day Streak 🔥
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                No Impulse Spend
              </p>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                Active Streak
              </h4>
              <p className="text-xs text-slate-400 mt-2">
                Consistently logged 14 check-ins without missing a day
              </p>
            </motion.div>

            {/* Widget 3: Asset Growth */}
            <motion.div
              animate={floatAnimation}
              className="glass-card p-6 border-l-4 border-l-emerald-500 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                  +18.4% YTD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Net Worth Accumulation
              </p>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                ₹3,45,200
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                ▲ Income outgrows expenses by 42%
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
