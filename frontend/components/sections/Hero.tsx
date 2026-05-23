"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createJob } from '../../utils/api';
import StatusView from '../StatusView';
import { supabase } from '../../utils/supabase';

const Hero: React.FC = () => {
  const [placeholder, setPlaceholder] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prompts = [
    "Create a real estate portal...",
    "Build an e-commerce dashboard...",
    "Launch a SaaS landing page...",
    "Design a portfolio site..."
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let loopNum = 0;
    let isDeleting = false;
    let text = '';

    // Only animate placeholder if we are NOT in job mode
    if (jobId) return;

    const tick = () => {
      const i = loopNum % prompts.length;
      const fullText = prompts[i];

      if (isDeleting) {
        text = fullText.substring(0, text.length - 1);
      } else {
        text = fullText.substring(0, text.length + 1);
      }

      setPlaceholder(text);

      let delta = 100 - Math.random() * 50;

      if (isDeleting) { delta /= 2; }

      if (!isDeleting && text === fullText) {
        delta = 2000;
        isDeleting = true;
      } else if (isDeleting && text === '') {
        isDeleting = false;
        loopNum++;
        delta = 500;
      }

      timeout = setTimeout(tick, delta);
    };

    tick();
    return () => clearTimeout(timeout);
  }, [jobId]);

  const handleGenerate = async () => {
    setError(null);

    if (!prompt.trim()) {
      setError("Please enter a prompt to generate your website.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError("Please sign in to generate and save projects.");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await createJob(prompt);
      console.log("Job ID:", data.job_id);
      setJobId(data.job_id);
    } catch (error) {
      console.error("Error generating code:", error);
      const message = error instanceof Error ? error.message : "Failed to start job";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="w-full max-w-7xl px-4 py-24 md:py-32 flex flex-col items-center text-center min-h-screen">

      {/* Header / Title */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1 mb-6 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">v2.0 System Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl leading-[1.1]">
          {jobId ? "Building your application" : "The engine for autonomous web development"}
        </h1>

        {!jobId && (
          <p className="mt-6 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
            Deploy production-ready full-stack applications in seconds. Built for scale, designed for reliability.
          </p>
        )}
      </motion.div>

      {/* Conditional Content: Input OR Status */}
      <AnimatePresence mode="wait">
        {jobId ? (
          <motion.div
            key="status-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <StatusView jobId={jobId} onReset={() => setJobId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="input-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-300 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-border-dark p-2 pl-4 shadow-lg">
              <span className="material-symbols-outlined text-zinc-400 mr-3 select-none">terminal</span>
              <input
                className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 text-base md:text-lg font-mono h-12"
                placeholder={placeholder}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate();
                  }
                }}
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="hidden sm:flex h-10 px-5 items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap ml-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Initializing..." : "Generate Code"}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="sm:hidden flex size-10 items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isGenerating ? "hourglass_empty" : "arrow_forward"}
                </span>
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-left">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!jobId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
            <span>No vendor lock-in</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
            <span>Full source code ownership</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
            <span>Deploy anywhere</span>
          </div>
        </motion.div>
      )}

    </section>
  );
};

export default Hero;
