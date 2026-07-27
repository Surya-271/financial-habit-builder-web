import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Server, Database, Shield, Key, Palette, Cpu, BarChart2, Cloud } from 'lucide-react';
import GlassCard from '../GlassCard';

const techStack = [
  {
    name: 'React.js',
    category: 'Frontend Framework',
    icon: Code2,
    color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    description: 'Component-driven UI with Hooks, Context API, and React Router DOM v6.',
  },
  {
    name: 'Node.js',
    category: 'Backend Runtime',
    icon: Server,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    description: 'Asynchronous event-driven server runtime for ultra-fast REST APIs.',
  },
  {
    name: 'Express.js',
    category: 'API Framework',
    icon: Server,
    color: 'text-slate-300 bg-slate-300/10 border-slate-300/20',
    description: 'Robust routing, authentication middleware, and structured error handlers.',
  },
  {
    name: 'MongoDB Atlas',
    category: 'Cloud NoSQL Database',
    icon: Database,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    description: 'Document database schemas with Mongoose ODM hooks and aggregation pipelines.',
  },
  {
    name: 'Firebase Auth',
    category: 'Identity Provider',
    icon: Shield,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    description: 'Secure email verification workflows, password resets, and session management.',
  },
  {
    name: 'JWT Security',
    category: 'Token Authentication',
    icon: Key,
    color: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    description: 'Encrypted bearer tokens for stateful user authorization and admin roles.',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling & Design System',
    icon: Palette,
    color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    description: 'Utility-first styling with custom glassmorphism layers and dark/light themes.',
  },
  {
    name: 'Framer Motion',
    category: 'Animations Engine',
    icon: Cpu,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    description: 'Fluid scroll reveals, floating icon loops, and accessible motion controls.',
  },
  {
    name: 'Chart.js',
    category: 'Data Visualization',
    icon: BarChart2,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    description: 'Interactive financial trend lines, budget breakdown doughnuts, and graphs.',
  },
  {
    name: 'Vercel & Render',
    category: 'Cloud Infrastructure',
    icon: Cloud,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    description: 'CI/CD automated deployment pipelines for frontend static builds and API services.',
  },
];

const TechStackSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="tech-stack" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-500 dark:text-brand-400 mb-2">
            Modern Engineering Architecture
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built With Industry-Standard Tech
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Powered by a high-performance full-stack MERN architecture designed for scale, security, and developer ergonomics.
          </p>
        </div>

        {/* Tech Stack Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <GlassCard className="p-5 h-full flex flex-col justify-between hover:border-brand-500/40 group transition-all">
                  <div>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform ${tech.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {tech.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 mb-2 group-hover:text-brand-500 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tech.description}
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

export default TechStackSection;
