"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CodePreview: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl px-4 py-20"
    >
      <div className="rounded-xl border border-zinc-200 dark:border-border-dark bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex flex-col lg:flex-row min-h-[600px] shadow-2xl">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-border-dark min-h-[300px] relative">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-border-dark">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-red-400"></div>
              <div className="size-3 rounded-full bg-amber-400"></div>
              <div className="size-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="text-xs text-zinc-400 font-mono">index.tsx</div>
            <div className="w-10"></div>
          </div>
          <div className="p-6 font-mono text-sm overflow-y-auto bg-white dark:bg-[#0c0c0e] text-zinc-800 dark:text-zinc-300 h-full scrollbar-hide">
            <CodeLine num={1} content={<>
              <span className="text-purple-600 dark:text-purple-400">import</span> {'{'} useState {'}'} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-green-600 dark:text-green-400">'react'</span>;
            </>} />
            <CodeLine num={2} content={<>
              <span className="text-purple-600 dark:text-purple-400">import</span> {'{'} Button {'}'} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-green-600 dark:text-green-400">'@levitate/ui'</span>;
            </>} />
            <CodeLine num={3} content={<>&nbsp;</>} />
            <CodeLine num={4} content={<>
              <span className="text-blue-600 dark:text-blue-400">export default function</span> <span className="text-yellow-600 dark:text-yellow-300">Dashboard</span>() {'{'}
            </>} />
            <CodeLine num={5} indent={1} content={<>
              <span className="text-purple-600 dark:text-purple-400">const</span> [data, setData] = <span className="text-blue-600 dark:text-blue-400">useState</span>(<span className="text-green-600 dark:text-green-400">null</span>);
            </>} />
            <CodeLine num={6} content={<>&nbsp;</>} />
            <CodeLine num={7} indent={1} content={<>
              <span className="text-purple-600 dark:text-purple-400">return</span> (
            </>} />
            <CodeLine num={8} indent={2} content={<>
              &lt;<span className="text-red-600 dark:text-red-400">div</span> <span className="text-sky-600 dark:text-sky-300">className</span>=<span className="text-green-600 dark:text-green-400">"p-8 bg-zinc-50 h-full"</span>&gt;
            </>} />
            <CodeLine num={9} indent={3} content={<>
              &lt;<span className="text-red-600 dark:text-red-400">h1</span> <span className="text-sky-600 dark:text-sky-300">className</span>=<span className="text-green-600 dark:text-green-400">"text-2xl font-bold"</span>&gt;Analytics&lt;/<span className="text-red-600 dark:text-red-400">h1</span>&gt;
            </>} />
            <CodeLine num={10} indent={3} content={<>
              &lt;<span className="text-red-600 dark:text-red-400">div</span> <span className="text-sky-600 dark:text-sky-300">className</span>=<span className="text-green-600 dark:text-green-400">"grid grid-cols-3 gap-4 mt-6"</span>&gt;
            </>} />
            <CodeLine num={11} indent={4} content={<>
              &lt;<span className="text-yellow-600 dark:text-yellow-300">StatCard</span> <span className="text-sky-600 dark:text-sky-300">title</span>=<span className="text-green-600 dark:text-green-400">"Users"</span> <span className="text-sky-600 dark:text-sky-300">value</span>=<span className="text-green-600 dark:text-green-400">"12.5k"</span> /&gt;
            </>} />
            <CodeLine num={12} indent={4} content={<>
              &lt;<span className="text-yellow-600 dark:text-yellow-300">StatCard</span> <span className="text-sky-600 dark:text-sky-300">title</span>=<span className="text-green-600 dark:text-green-400">"Revenue"</span> <span className="text-sky-600 dark:text-sky-300">value</span>=<span className="text-green-600 dark:text-green-400">"$42.8k"</span> /&gt;
            </>} />
            <CodeLine num={13} indent={4} content={<>
              &lt;<span className="text-yellow-600 dark:text-yellow-300">StatCard</span> <span className="text-sky-600 dark:text-sky-300">title</span>=<span className="text-green-600 dark:text-green-400">"Growth"</span> <span className="text-sky-600 dark:text-sky-300">value</span>=<span className="text-green-600 dark:text-green-400">"+18%"</span> /&gt;
            </>} />
            <CodeLine num={14} indent={3} content={<>
              &lt;/<span className="text-red-600 dark:text-red-400">div</span>&gt;
            </>} />
            <CodeLine num={15} indent={2} content={<>
              &lt;/<span className="text-red-600 dark:text-red-400">div</span>&gt;
            </>} />
            <CodeLine num={16} indent={1} content={<>);</>} />
            <CodeLine num={17} content={<>{'}'}</>} />

            <div className="w-2 h-4 bg-zinc-400 animate-pulse mt-1 ml-4 inline-block"></div>
          </div>

          {/* Arrow indicator */}
          <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full items-center justify-center shadow-lg text-zinc-400">
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </div>
        </div>

        {/* Preview Side */}
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900 min-h-[300px]">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-border-dark">
            <div className="flex gap-1 text-zinc-400">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              <span className="material-symbols-outlined text-sm">refresh</span>
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-500 text-center flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] mr-1">lock</span>
              localhost:3000
            </div>
          </div>

          <div className="p-8 flex-1 bg-white dark:bg-[#121214] relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics Dashboard</h2>
              <p className="text-zinc-400 text-sm mt-1">Real-time platform metrics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard label="Total Users" value="12,543" color="bg-blue-500" width="w-3/4" />
              <MetricCard label="Total Revenue" value="$42,890" color="bg-emerald-500" width="w-1/2" />
              <MetricCard label="Growth Rate" value="+18.2%" color="bg-purple-500" width="w-4/5" />
            </div>

            <div className="mt-6 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 h-32 flex items-end justify-between gap-2 px-6 pb-2">
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[40%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-t-sm h-[50%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[75%]"></div>
              <div className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-t-sm h-[85%]"></div>
              <div className="w-full bg-zinc-400 dark:bg-zinc-600 rounded-t-sm h-[65%]"></div>
              <div className="w-full bg-zinc-500 dark:bg-zinc-500 rounded-t-sm h-[90%]"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const CodeLine = ({ num, content, indent = 0 }: { num: number, content: React.ReactNode, indent?: number }) => (
  <div className="flex gap-4 hover:bg-zinc-100 dark:hover:bg-white/5">
    <div className="text-zinc-300 dark:text-zinc-700 select-none text-right w-6 flex-shrink-0">{num}</div>
    <div style={{ paddingLeft: `${indent * 1}rem` }} className="whitespace-nowrap font-medium">{content}</div>
  </div>
);

const MetricCard = ({ label, value, color, width }: { label: string, value: string, color: string, width: string }) => (
  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
    <p className="text-sm text-zinc-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{value}</p>
    <div className="mt-2 h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} ${width} rounded-full`}></div>
    </div>
  </div>
);

export default CodePreview;