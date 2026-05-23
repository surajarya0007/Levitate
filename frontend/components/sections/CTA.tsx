"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CTA: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 py-24 bg-zinc-50 dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-border-dark flex flex-col items-center text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">Ready to ship?</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-lg">Join forward-thinking engineering teams building the next generation of web applications.</p>
      <Link href="/signup" className="h-12 px-8 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-base font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center">
        Start Building for Free
      </Link>
    </motion.section>
  );
};

export default CTA;
