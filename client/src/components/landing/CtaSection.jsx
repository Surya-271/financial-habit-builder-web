import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';
import GlassCard from '../GlassCard';

const CtaSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-10 md:p-16 text-center border-brand-500/30 bg-gradient-to-br from-brand-900/40 via-dark-900/90 to-indigo-900/40 relative overflow-hidden shadow-2xl">
          {/* Gradient backdrop vector elements */}
          <div className="gradient-blob w-[400px] h-[400px] bg-brand-500/30 top-[-100px] left-1/2 -translate-x-1/2 blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs sm:text-sm font-semibold border border-brand-500/40"
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>Start Building Wealth Today</span>
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Take Control of Your Finances?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
              Join users building discipline, reaching milestone savings goals, and growing their net worth with FinanceHabit.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto btn-primary py-3.5 px-8 text-base font-semibold shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50"
              >
                <span>Create Free Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto btn-secondary py-3.5 px-8 text-base font-semibold border border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default CtaSection;
