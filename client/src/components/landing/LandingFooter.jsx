import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, ArrowUp, Heart, ShieldCheck } from 'lucide-react';

const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white/40 dark:bg-dark-950/80 border-t border-slate-200/50 dark:border-slate-800/60 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/50 dark:border-slate-800/60">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 shrink-0">
                <img src="/logo.png" alt="FinanceHabit Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-sans font-extrabold tracking-tight">
                <span className="text-slate-900 dark:text-white">Finance</span>
                <span className="text-brand-500">Habit</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              An intelligent, full-stack personal finance and wealth habit builder designed for long-term financial discipline.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-brand-500 transition">
                  Key Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="hover:text-brand-500 transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#dashboard-preview" onClick={(e) => handleNavClick(e, '#dashboard-preview')} className="hover:text-brand-500 transition">
                  Dashboard Preview
                </a>
              </li>
              <li>
                <a href="#tech-stack" onClick={(e) => handleNavClick(e, '#tech-stack')} className="hover:text-brand-500 transition">
                  Built With
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-brand-500 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Auth */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              Access Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <Link to="/login" className="hover:text-brand-500 transition">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-500 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-500 transition">
                  Wealth Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-500 transition flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-500" />
                  <span>Admin Moderation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              Project Information
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              FinanceHabit is built with Node.js, Express, MongoDB Atlas, React, and Firebase Auth.
            </p>
            <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20 text-xs text-brand-600 dark:text-brand-300 font-medium">
              Open Source Portfolio Project
            </div>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} FinanceHabit. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Crafted with <Heart size={13} className="text-rose-500 fill-rose-500 inline" /> for portfolio showcase
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition flex items-center gap-1 font-semibold"
              aria-label="Back to top of page"
            >
              <ArrowUp size={14} />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
