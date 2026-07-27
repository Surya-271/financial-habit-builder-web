import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import GlassCard from '../GlassCard';

const faqs = [
  {
    question: 'How secure is my financial data on FinanceHabit?',
    answer:
      'Your security is paramount. Passwords are protected using Bcrypt hashing, sessions use encrypted JWT bearer tokens, and authentication workflows integrate with Firebase Auth. We never request or store bank credentials or account numbers.',
  },
  {
    question: 'Can I track investment portfolios alongside daily expenses?',
    answer:
      'Yes! FinanceHabit includes dedicated holding modules where you can log stocks, mutual funds, crypto, real estate, and fixed deposits while monitoring total asset growth against liabilities.',
  },
  {
    question: 'Can I set up multiple savings goals simultaneously?',
    answer:
      'Absolutely. You can create unlimited savings goals with custom target amounts, milestone dates, and visual progress tracking. Allocated funds automatically update completion percentages.',
  },
  {
    question: 'Is FinanceHabit fully mobile-friendly?',
    answer:
      'Yes, the platform is engineered with responsive glassmorphism layouts and touch-friendly controls. It delivers a fluid experience across desktop displays, tablets, and mobile smartphones.',
  },
  {
    question: 'Is FinanceHabit free to use?',
    answer:
      'Yes, FinanceHabit is 100% free and open-source. All core features including income logging, habit streaks, savings milestones, analytics, and admin moderation are fully accessible.',
  },
];

const FaqItem = ({ faq, isOpen, toggleOpen, index, shouldReduceMotion }) => {
  const contentId = `faq-content-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-b border-slate-200/50 dark:border-slate-800/60 last:border-none">
      <button
        id={buttonId}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full py-5 px-2 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg hover:text-brand-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
      >
        <span>{faq.question}</span>
        <div
          className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-brand-500 bg-brand-500/10' : ''
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 px-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-500 mb-4">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Got Questions?
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about FinanceHabit features and security.
          </p>
        </div>

        {/* FAQ Glass Card Accordion Container */}
        <GlassCard className="p-6 md:p-8">
          {faqs.map((faq, idx) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === idx}
              toggleOpen={() => toggleIndex(idx)}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </GlassCard>
      </div>
    </section>
  );
};

export default FaqSection;
