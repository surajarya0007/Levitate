"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ComparisonTable: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl px-4 py-20 border-t border-zinc-200 dark:border-border-dark"
      id="solutions"
    >
      <h2 className="text-3xl font-bold text-center tracking-tight text-zinc-900 dark:text-white mb-12">Legacy vs. The Future</h2>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-border-dark">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-zinc-900/50">
              <th className="py-4 px-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100 w-1/3">Metric</th>
              <th className="py-4 px-6 text-sm font-semibold text-zinc-500 dark:text-zinc-500 w-1/3">Legacy Development</th>
              <th className="py-4 px-6 text-sm font-bold text-zinc-900 dark:text-white w-1/3 bg-zinc-100 dark:bg-zinc-800/50">Levitate</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <ComparisonRow metric="Time to Market" legacy="3-6 Months" levitate="< 2 Minutes" />
            <ComparisonRow metric="Infrastructure" legacy="Manual Provisioning" levitate="Serverless Auto-scale" />
            <ComparisonRow metric="Maintenance" legacy="High Overhead" levitate="Self-healing" />
            <ComparisonRow metric="Security" legacy="Patchwork Solutions" levitate="Enterprise Grade" last />
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

const ComparisonRow = ({ metric, legacy, levitate, last = false }: { metric: string, legacy: string, levitate: string, last?: boolean }) => (
  <tr className={`group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors ${!last ? 'border-b border-zinc-200 dark:border-border-dark' : ''}`}>
    <td className="py-4 px-6 font-medium text-zinc-700 dark:text-zinc-300">{metric}</td>
    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-500">{legacy}</td>
    <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50">{levitate}</td>
  </tr>
);

export default ComparisonTable;