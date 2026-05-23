"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FAQ: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl px-4 py-24 mx-auto border-t border-zinc-200 dark:border-border-dark"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        <FAQItem
          question="How secure is the generated code?"
          answer="Security is baked in at the architectural level. All code follows OWASP security best practices, with built-in protection against XSS, CSRF, and SQL injection. We enforce strict type safety and automated dependency scanning."
        />
        <FAQItem
          question="Can I export the source code?"
          answer="Absolutely. You have 100% ownership of the code. You can export the full repository as a standard Next.js, React, or Node.js project at any time. There is no obfuscation and no platform lock-in."
        />
        <FAQItem
          question="Which frameworks are supported?"
          answer="We currently specialize in the modern React ecosystem, specifically Next.js (App Router), Tailwind CSS, and TypeScript. Backend support includes Node.js, PostgreSQL, and serverless edge functions."
        />
        <FAQItem
          question="How does pricing work for large teams?"
          answer="Our Enterprise tier offers custom seat-based pricing with volume discounts. It includes dedicated support, SLA guarantees, SSO integration, and private cloud deployment options."
        />
      </div>
    </motion.section>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <details className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent open:bg-zinc-50 dark:open:bg-zinc-900/30 transition-all duration-300">
      <summary className="flex items-center justify-between w-full p-6 text-left cursor-pointer select-none">
        <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{question}</span>
        <div className="flex items-center justify-center size-6 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          <span className="material-symbols-outlined block group-open:hidden text-[20px]">add</span>
          <span className="material-symbols-outlined hidden group-open:block text-[20px]">remove</span>
        </div>
      </summary>
      <div className="px-6 pb-6 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-transparent group-open:border-zinc-200 dark:group-open:border-zinc-800/50 pt-4">
        {answer}
      </div>
    </details>
  );
};

export default FAQ;