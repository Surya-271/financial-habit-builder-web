import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Wallet,
  TrendingDown,
  Target,
  Flame,
  Sparkles,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import GlassCard from '../GlassCard';

const features = [
  {
    icon: Wallet,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    title: 'Income Tracking',
    description:
      'Effortlessly record salary, freelance, investments, and passive earnings with recurring inflow categorization.',
  },
  {
    icon: TrendingDown,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    title: 'Expense Management',
    description:
      'Categorize spending, receive budget alert notifications, and prevent cash leakages across daily expense streams.',
  },
  {
    icon: Target,
    color: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
    title: 'Savings Goals',
    description:
      'Set target dates, allocate milestone deposits, and watch progress bars automatically update as goals complete.',
  },
  {
    icon: Flame,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    title: 'Financial Habit Tracker',
    description:
      'Build long-term discipline through interactive streak calendars, daily check-ins, and habit consistency scoring.',
  },
  {
    icon: Sparkles,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    title: 'Investment Tracking',
    description:
      'Monitor stock portfolios, mutual funds, crypto, and fixed deposits while calculating asset-to-liability ratios.',
  },
  {
    icon: PieChart,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    title: 'Analytics Dashboard',
    description:
      'Visualize financial health with interactive Chart.js line graphs, doughnut breakdowns, and net worth reports.',
  },
];

const FeaturesSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Powerful Features
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need to Master Your Money
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Engineered with modern tools to simplify daily budgeting, build lifelong wealth discipline, and give you complete financial clarity.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between group hover:border-brand-500/40 transition-all duration-300">
                  <div>
                    {/* Icon Container */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}
                    >
                      <Icon size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-xs font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
                    <span>Explore in Dashboard</span>
                    <ArrowRight size={14} />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
