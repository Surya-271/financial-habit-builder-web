import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import WhyChooseSection from '../components/landing/WhyChooseSection';
import StatsSection from '../components/landing/StatsSection';
import TechStackSection from '../components/landing/TechStackSection';
import FaqSection from '../components/landing/FaqSection';
import CtaSection from '../components/landing/CtaSection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'FinanceHabit | Build Better Financial Habits & Grow Your Wealth';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100 selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Background Blur Spheres */}
      <div className="gradient-blob w-[600px] h-[600px] bg-brand-500/10 top-[-100px] right-[-100px] pointer-events-none" />
      <div className="gradient-blob w-[500px] h-[500px] bg-indigo-500/10 top-[1200px] left-[-200px] pointer-events-none" />

      {/* Sticky Responsive Header Navigation */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <StatsSection />
        <TechStackSection />
        <FaqSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
