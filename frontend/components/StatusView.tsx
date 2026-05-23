"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getJobStatus } from '../utils/api';
import { motion } from 'framer-motion';

interface StatusViewProps {
    jobId: string;
    onReset: () => void;
}

interface JobStatus {
    status: string;
    message?: string;
    logs?: string;
    deploy_url?: string;
}

const STEPS = [
    { id: "CREATED", label: "Queued" },
    { id: "PLANNING", label: "Planning" },
    { id: "GENERATING", label: "Coding" },
    { id: "BUILDING", label: "Building" },
    { id: "DEPLOYING", label: "Deploying" },
    { id: "DONE", label: "Live" }
];

const PHASE_MESSAGES: Record<string, string[]> = {
    CREATED: [
        "$ Initializing job...",
        "$ Queued for processing...",
    ],
    PLANNING: [
        "$ Analyzing your prompt...",
        "$ Identifying site structure and features...",
        "$ Creating site architecture...",
        "$ Defining pages, themes, and components...",
        "$ Generating site plan...",
    ],
    GENERATING: [
        "$ Site plan ready. Starting code generation...",
        "$ Writing React/TypeScript components...",
        "$ Applying Tailwind CSS styles...",
        "$ Building page layouts...",
        "$ Generating responsive UI...",
        "$ Writing app/page.tsx...",
    ],
    BUILDING: [
        "$ Code generation complete. Starting build...",
        "$ Running npm install...",
        "$ Installing dependencies...",
        "$ Running next build...",
        "$ Compiling TypeScript...",
        "$ Type-checking components...",
        "$ Optimizing production bundle...",
    ],
    DEPLOYING: [
        "$ Build successful. Starting deployment...",
        "$ Uploading to Vercel...",
        "$ Provisioning edge network...",
        "$ Configuring CDN...",
        "$ Finalizing deployment...",
    ],
};

export default function StatusView({ jobId, onReset }: StatusViewProps) {
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [phaseLogs, setPhaseLogs] = useState<string[]>([]);
    const [phaseLogIndex, setPhaseLogIndex] = useState(0);
    const [lastPhase, setLastPhase] = useState<string>("");
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Polling Effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchStatus = async () => {
            try {
                const data = await getJobStatus(jobId);
                setStatus(data);

                if (data.status === "DONE" || data.status === "FAILED") {
                    clearInterval(intervalId);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        };

        fetchStatus();
        intervalId = setInterval(fetchStatus, 3000);

        return () => clearInterval(intervalId);
    }, [jobId]);

    // Phase-based log simulation
    useEffect(() => {
        const currentPhase = status?.status;
        if (!currentPhase || currentPhase === "DONE" || currentPhase === "FAILED") return;

        // When phase changes, add all messages from the previous phase and start new phase
        if (currentPhase !== lastPhase) {
            if (lastPhase && PHASE_MESSAGES[lastPhase]) {
                // Ensure all previous phase messages are shown
                setPhaseLogs(prev => {
                    const prevMessages = PHASE_MESSAGES[lastPhase] || [];
                    const missing = prevMessages.filter(m => !prev.includes(m));
                    return [...prev, ...missing];
                });
            }
            setLastPhase(currentPhase);
            setPhaseLogIndex(0);
        }
    }, [status?.status, lastPhase]);

    // Drip-feed messages for the current phase
    useEffect(() => {
        const currentPhase = status?.status;
        if (!currentPhase || currentPhase === "DONE" || currentPhase === "FAILED") return;

        const messages = PHASE_MESSAGES[currentPhase];
        if (!messages || phaseLogIndex >= messages.length) return;

        const timer = setTimeout(() => {
            setPhaseLogs(prev => {
                const msg = messages[phaseLogIndex];
                if (prev.includes(msg)) return prev;
                return [...prev, msg];
            });
            setPhaseLogIndex(prev => prev + 1);
        }, phaseLogIndex === 0 ? 500 : 3000 + Math.random() * 2000);

        return () => clearTimeout(timer);
    }, [status?.status, phaseLogIndex]);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [phaseLogs, status]);

    const currentStepIndex = STEPS.findIndex(s => s.id === status?.status) ?? 0;

    // Build the display log: phase logs first, then real logs on completion
    const displayLog = (() => {
        if (status?.status === "DONE" || status?.status === "FAILED") {
            const realLogs = status?.logs || status?.message || "";
            return [...phaseLogs, "", "---  Build Output  ---", "", realLogs].join("\n");
        }
        // Show intermediate logs from backend if available, otherwise phase logs
        if (status?.logs) {
            return [...phaseLogs, "", status.logs].join("\n");
        }
        return phaseLogs.join("\n");
    })();

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">

            {/* Progress Stepper */}
            <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -z-0"></div>

                    {STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-300
                    ${isCompleted ? 'bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white' : 'bg-zinc-100 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600'}
                    ${isCurrent ? 'scale-125 ring-4 ring-zinc-100 dark:ring-zinc-800' : ''}
                 `}></div>
                                <span className={`text-xs font-medium uppercase tracking-wider ${isCompleted ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">

                {/* Live Logs Console */}
                <div className="bg-[#0c0c0e] rounded-xl border border-zinc-800 p-4 font-mono text-xs md:text-sm text-zinc-400 overflow-hidden flex flex-col shadow-inner">
                    <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        <span className="ml-auto text-zinc-600">build.log</span>
                    </div>
                    <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide min-h-[300px]">
                        {displayLog ? (
                            <pre className="whitespace-pre-wrap text-emerald-500/90 font-light">
                                {displayLog}
                            </pre>
                        ) : (
                            <div className="text-zinc-600 italic">Waiting for logs...</div>
                        )}
                    </div>
                </div>

                {/* Result / Preview Card */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                        {status?.status === 'DONE' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative z-10"
                            >
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Deployed Successfully!</h2>
                                <a href={status.deploy_url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 break-all underline decoration-emerald-500/30 underline-offset-4 cursor-pointer">
                                    {status.deploy_url}
                                </a>

                                <div className="mt-8">
                                    <a
                                        href={status.deploy_url}
                                        target="_blank"
                                        className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm inline-flex items-center gap-2 cursor-pointer"
                                    >
                                        Open Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                    <button
                                        onClick={onReset}
                                        className="ml-4 px-6 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium cursor-pointer"
                                    >
                                        Create Another
                                    </button>
                                </div>
                            </motion.div>
                        ) : status?.status === 'FAILED' ? (
                            <div className="text-red-500">
                                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                                <h3 className="text-lg font-bold">Build Failed</h3>
                                <button onClick={onReset} className="mt-4 text-sm underline cursor-pointer">Try Again</button>
                            </div>
                        ) : (
                            <div className="text-zinc-400 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                <p className="animate-pulse">
                                    {status?.status === 'PLANNING' && 'Planning your website...'}
                                    {status?.status === 'GENERATING' && 'Generating components...'}
                                    {status?.status === 'BUILDING' && 'Compiling your project...'}
                                    {status?.status === 'DEPLOYING' && 'Deploying to the cloud...'}
                                    {(!status?.status || status?.status === 'CREATED') && 'Initializing...'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
