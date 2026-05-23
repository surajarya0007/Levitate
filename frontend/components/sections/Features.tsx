"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full max-w-6xl px-4 py-20 border-t border-zinc-200 dark:border-border-dark" id="product">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Engineered for Scale</h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">Radical simplicity meets enterprise reliability. We've stripped away the complexity to leave you with pure performance.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <FeatureCard
          icon="architecture"
          title="Architecture-first approach"
          description="Define blueprints that scale with your team structure. Modular components ensure long-term maintainability."
        />
        <FeatureCard
          icon="rocket_launch"
          title="Edge-ready deployment"
          description="Push logic closer to users with global edge functions. Minimize latency with distributed data centers."
        />
        <FeatureCard
          icon="all_inclusive"
          title="Automated CI/CD"
          description="Integrated pipelines that test and deploy autonomously. Catch regressions before they reach production."
        />
      </motion.div>
    </section>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item} className="group p-6 rounded-xl border border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors">
      <div className="size-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-900 dark:text-white group-hover:scale-110 transition-transform duration-300 shadow-sm">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default Features;