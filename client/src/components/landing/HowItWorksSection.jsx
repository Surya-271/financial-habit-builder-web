import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { UserPlus, Wallet, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import GlassCard from '../GlassCard';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Free Account',
    description:
      'Sign up in less than a minute. Secure your profile with Firebase and JWT authentication.',
    badge: 'Step 1',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Track Income & Expenses',
    description:
      'Log your daily earnings and spending. Categorize cash flows to identify savings potential.',
    badge: 'Step 2',
  },
  {
    step: '03',
    icon: Flame,
    title: 'Build Financial Habits',
    description:
      'Set daily check-ins and streaks. Eliminate impulse buys and build lifelong money discipline.',
    badge: 'Step 3',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Grow Your Wealth',
    description:
      'Monitor savings goals, track investment portfolios, and watch your net worth surge month over month.',
    badge: 'Step 4',
  },
];

const HowItWorksSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Simple Four-Step Workflow
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How FinanceHabit Works
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A proven path from basic expense tracking to systematic wealth creation.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative flex flex-col h-full"
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between hover:border-brand-500/40 group transition-all duration-300">
                  <div>
                    {/* Top Step Number Badge & Icon */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-brand-500 transition-colors">
                        {item.step}
                      </span>
                      <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl border border-brand-500/20 group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                    </div>

                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md mb-3">
                      {item.badge}
                    </span>

                    {/* Step Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
                      {item.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex items-center gap-1 text-slate-300 dark:text-slate-700 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-xs font-semibold">Next Phase</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
