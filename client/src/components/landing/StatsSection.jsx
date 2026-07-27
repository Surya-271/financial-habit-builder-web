import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, Target, Flame, FileSpreadsheet } from 'lucide-react';
import GlassCard from '../GlassCard';

const statsData = [
  {
    icon: Users,
    label: 'Active Community Users',
    target: 100,
    suffix: '+',
    color: 'text-brand-500',
    description: 'Registered users actively tracking wealth',
  },
  {
    icon: FileSpreadsheet,
    label: 'Transactions Tracked',
    target: 5000,
    suffix: '+',
    color: 'text-emerald-500',
    description: 'Incomes & expenses logged seamlessly',
  },
  {
    icon: Target,
    label: 'Goal Completion Rate',
    target: 95,
    suffix: '%',
    color: 'text-indigo-500',
    description: 'Milestone savings target success rate',
  },
  {
    icon: Flame,
    label: 'Habits Tracked Daily',
    target: 50,
    suffix: '+',
    color: 'text-amber-500',
    description: 'Daily money check-ins & streaks',
  },
];

const StatCounter = ({ target, suffix, shouldReduceMotion }) => {
  const [count, setCount] = useState(shouldReduceMotion ? target : 0);
  const ref = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let observer;
    let animationFrame;

    const startCounting = () => {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic formula
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        setCount(Math.floor(easeProgress * target));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        } else {
          setCount(target);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [target, shouldReduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8 md:p-12 border-brand-500/20 bg-gradient-to-br from-brand-900/10 via-dark-900/80 to-indigo-900/10 relative overflow-hidden">
          <div className="gradient-blob w-[300px] h-[300px] bg-brand-500/20 top-[-50px] right-[-50px] blur-[80px]" />

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
              Platform Metrics
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Proven Impact Across Users
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Real application statistics demonstrating consistent financial growth.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {statsData.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-white/40 dark:bg-dark-950/40 border border-white/20 dark:border-slate-800/50"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-4">
                    <Icon size={24} className={stat.color} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">
                    <StatCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default StatsSection;
