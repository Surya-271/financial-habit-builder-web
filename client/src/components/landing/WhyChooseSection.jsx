import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Zap, Smartphone, Sparkles } from 'lucide-react';
import GlassCard from '../GlassCard';

const whyUsItems = [
  {
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    title: 'Secure Authentication',
    description:
      'Bank-grade password hashing via Bcrypt, JSON Web Tokens (JWT), and Firebase Auth security wrappers.',
  },
  {
    icon: Zap,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    title: 'Real-Time Analytics',
    description:
      'Instant financial computations with live Chart.js visualizations and automated habit streak calculations.',
  },
  {
    icon: Smartphone,
    color: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
    title: 'Responsive Design',
    description:
      'Tailored for every device viewport. Seamless transition from desktop monitors to mobile phones.',
  },
  {
    icon: Sparkles,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    title: 'Simple & Modern Interface',
    description:
      'Sleek glassmorphism cards, dynamic backdrop vector lighting, and customizable dark/light theme modes.',
  },
];

const WhyChooseSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="why-us" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Why Choose FinanceHabit
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built for Modern Wealth Builders
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A production-ready stack engineered with performance, security, and exceptional user experience in mind.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {whyUsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 h-full flex items-start gap-5 hover:border-brand-500/40 group transition-all">
                  <div
                    className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${item.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
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

export default WhyChooseSection;
