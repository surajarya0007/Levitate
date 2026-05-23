"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full border-t border-zinc-200 dark:border-border-dark bg-white dark:bg-background-dark py-12 px-4 md:px-10 lg:px-40"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/Levitate.png" alt="Levitate Logo" width={24} height={24} className="w-6 h-6 rounded" />
            <span className="text-base font-bold text-zinc-900 dark:text-white">Levitate</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-4">
            The enterprise standard for AI-driven web development. Automate the boring stuff, focus on the product.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="Twitter">
              <span className="material-symbols-outlined text-[20px]">send</span>
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="GitHub">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </a>
          </div>
        </div>

        <FooterColumn title="Product" links={["Features", "Enterprise", "Security", "Changelog"]} />
        <FooterColumn title="Company" links={["About", "Careers", "Blog", "Contact"]} />
        <FooterColumn title="Legal" links={["Terms", "Privacy", "Cookies"]} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 dark:border-border-dark">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">© 2024 Levitate Inc. All rights reserved.</p>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">All systems operational</span>
        </div>
      </div>
    </motion.footer>
  );
};

const FooterColumn = ({ title, links }: { title: string, links: string[] }) => (
  <div className="flex flex-col gap-3">
    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h4>
    {links.map((link, i) => (
      <a key={i} href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">{link}</a>
    ))}
  </div>
);

export default Footer;