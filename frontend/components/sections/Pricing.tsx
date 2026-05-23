"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(1); // Default to center

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="w-full max-w-6xl px-4 py-24 mx-auto border-t border-zinc-200 dark:border-border-dark" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Transparent Pricing</h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">Start building for free, scale as you grow. No hidden fees or long-term contracts.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        onMouseLeave={() => setFocusedIndex(1)}
      >
        <PricingCard
          title="Starter"
          description="Perfect for experimenting and personal projects."
          price="$0"
          buttonText="Get Started"
          features={["1 Active Project", "Community Support", "Basic Components"]}
          index={0}
          focused={focusedIndex === 0}
          setFocused={setFocusedIndex}
        />

        <PricingCard
          title="Pro"
          description="For professional developers shipping production apps."
          price="$29"
          buttonText="Start Free Trial"
          features={["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domains"]}
          index={1}
          focused={focusedIndex === 1}
          setFocused={setFocusedIndex}
          popular // Keep popular badge logic separate or just visual
        />

        <PricingCard
          title="Enterprise"
          description="Custom security, compliance, and support."
          price="Custom"
          buttonText="Contact Sales"
          features={["Dedicated Support Manager", "SLA Guarantees", "SSO & Audit Logs", "On-premise Deployment"]}
          index={2}
          focused={focusedIndex === 2}
          setFocused={setFocusedIndex}
        />
      </motion.div>
    </section>
  );
};

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  buttonText: string;
  features: string[];
  popular?: boolean;
  index: number;
  focused: boolean;
  setFocused: (index: number) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, description, price, buttonText, features, popular, index, focused, setFocused }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={item}
      className={`relative flex flex-col p-6 rounded-xl border transition-all duration-300 h-full cursor-default ${focused
          ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-xl z-10 scale-105'
          : 'border-zinc-200 dark:border-border-dark bg-white dark:bg-zinc-900/20 opacity-80 scale-100 hover:opacity-100'
        }`}
      onMouseEnter={() => setFocused(index)}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-zinc-700 dark:border-transparent shadow-sm">
          Most Popular
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6 h-10">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold text-zinc-900 dark:text-white">{price}</span>
        {price !== "Custom" && <span className="text-zinc-500 dark:text-zinc-400">/mo</span>}
      </div>

      <button className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors mb-8 ${focused ? 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90' : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
        {buttonText}
      </button>

      <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-zinc-900 dark:text-white">check</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Pricing;