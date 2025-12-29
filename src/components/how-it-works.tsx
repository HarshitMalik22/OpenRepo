'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    GitBranch,
    Command,
    Terminal,
    Cpu,
    Share2,
    ArrowRight,
    Database,
    Globe,
    Layout,
    Server
} from 'lucide-react';

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-advance logic with a longer pause for the user to read/explore
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            id: 0,
            title: 'Ingest',
            description: 'Paste a repository URL. We initialize a secure, isolated sandbox instantly.',
        },
        {
            id: 1,
            title: 'Analyze',
            description: 'Our engine parses the AST, mapping every dependency and function call in the codebase.',
        },
        {
            id: 2,
            title: 'Visualize',
            description: 'Raw code is transformed into interactive architecture diagrams and flowcharts.',
        },
    ];

    return (
        <section className="container mx-auto py-8 relative z-20">
            {/* Header - Strictly Typography */}
            <div className="mb-24 px-4 md:px-0">
                <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-white tracking-tight">
                    From Code to <span className="text-white/50">Concept.</span>
                </h2>
                <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
                    A machine-precision pipeline that turns raw Git repositories into navigable mental maps.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-7xl mx-auto">
                {/* Left Side: The Pipeline (Steps) */}
                <div className="lg:col-span-4 space-y-0 relative pl-4">
                    {/* Continuous Line Track */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-[1px] bg-zinc-800" />

                    {steps.map((step, index) => {
                        const isActive = activeStep === index;
                        const isPast = activeStep > index;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "relative pl-12 py-6 cursor-pointer group transition-all duration-500",
                                    isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                                )}
                                onClick={() => setActiveStep(index)}
                            >
                                {/* Dot Indicator */}
                                <div className={cn(
                                    "absolute left-[21px] top-9 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10",
                                    isActive
                                        ? "bg-white border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        : isPast
                                            ? "bg-zinc-800 border-zinc-600"
                                            : "bg-black border-zinc-800"
                                )} />

                                {/* Step Content */}
                                <div>
                                    <h3 className={cn(
                                        "text-sm font-mono uppercase tracking-widest mb-2 transition-colors",
                                        isActive ? "text-indigo-400" : "text-zinc-500"
                                    )}>
                                        Step 0{index + 1}
                                    </h3>
                                    <h4 className={cn(
                                        "text-xl font-semibold mb-2 transition-colors tracking-tight",
                                        isActive ? "text-white" : "text-zinc-300"
                                    )}>
                                        {step.title}
                                    </h4>
                                    <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: The Glass Console */}
                <div className="lg:col-span-8">
                    <div className="relative aspect-video rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-sm shadow-2xl overflow-hidden group">

                        {/* Console Header */}
                        <div className="absolute top-0 left-0 w-full h-10 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-4 justify-between z-20">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                System Online
                            </div>
                        </div>

                        {/* Main Display Area */}
                        <div className="absolute inset-0 top-10 flex items-center justify-center p-8">
                            <AnimatePresence mode="wait">
                                {activeStep === 0 && <ConsoleIngest key="ingest" />}
                                {activeStep === 1 && <ConsoleAnalyze key="analyze" />}
                                {activeStep === 2 && <ConsoleVisualize key="visualize" />}
                            </AnimatePresence>
                        </div>

                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ------------------------------------------------------------------
// Sub-Components for Console Modes
// ------------------------------------------------------------------

function ConsoleIngest() {
    return (
        <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative">
                {/* Floating Input Bar */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-1.5 flex items-center gap-3 shadow-2xl ring-1 ring-white/5 mx-auto relative z-10 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                        <Command className="w-4 h-4 text-zinc-500" />
                    </div>

                    <div className="flex-1 font-mono text-sm text-zinc-500 flex items-center overflow-hidden">
                        <span className="text-zinc-600 mr-1">git clone</span>
                        <Typewriter text="github.com/torvalds/linux" />
                    </div>

                    <div className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wide rounded hover:bg-zinc-200 transition-colors">
                        Enter
                    </div>

                    {/* Progress Bar (Bottom) */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-indigo-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                {/* Status Logs underneath */}
                <div className="mt-8 space-y-2 font-mono text-xs text-zinc-500 max-w-sm mx-auto opacity-70">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-green-500">✔</span> Resolving deltas...
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.0 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-green-500">✔</span> Checking out files...
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.5 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-indigo-400">➜</span> Sandbox ready.
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

function Typewriter({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayed(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50); // Typing speed
        return () => clearInterval(timer);
    }, [text]);

    return (
        <span className="text-zinc-300">
            {displayed}
            <span className="animate-pulse bg-zinc-500 w-[1px] h-4 inline-block align-middle ml-[1px]" />
        </span>
    );
}

function ConsoleAnalyze() {
    return (
        <motion.div
            className="w-full h-full flex items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative w-64 h-80 perspective-1000">
                {/* The Stack */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 bg-[#111] border border-white/10 rounded-lg p-4 flex flex-col gap-2 shadow-2xl origin-bottom"
                        style={{
                            zIndex: 4 - i,
                            transform: `translateY(${i * -8}px) scale(${1 - i * 0.05})`,
                        }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {/* Mock Code Lines */}
                        <div className="w-1/3 h-2 bg-zinc-800 rounded-full" />
                        <div className="w-2/3 h-2 bg-zinc-800/50 rounded-full" />
                        <div className="w-full h-2 bg-zinc-900 rounded-full" />
                        <div className="w-1/2 h-2 bg-zinc-800/50 rounded-full" />

                        {/* Active File Highlights */}
                        {i === 0 && (
                            <motion.div
                                className="absolute inset-0 bg-indigo-500/5 z-10"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                ))}

                {/* The Scanner Beam */}
                <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-20"
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                />
            </div>

            <div className="absolute bottom-4 right-8 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                <Cpu className="w-3 h-3 text-indigo-400" />
                Parsing AST...
            </div>
        </motion.div>
    );
}

function ConsoleVisualize() {
    return (
        <motion.div
            className="w-full h-full p-8 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative w-full h-full max-w-sm flex items-center justify-center">
                {/* Central Node */}
                <motion.div
                    className="z-20 w-16 h-16 rounded-xl bg-zinc-900 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <Layout className="w-6 h-6 text-indigo-400" />
                </motion.div>

                {/* Connected Nodes */}
                {[
                    { x: -80, y: -60, icon: Globe, delay: 0.2, label: 'Client' },
                    { x: 80, y: -60, icon: Server, delay: 0.3, label: 'API' },
                    { x: 0, y: 80, icon: Database, delay: 0.4, label: 'DB' },
                ].map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute z-10 flex flex-col items-center gap-2"
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, x: node.x, y: node.y }}
                        transition={{ delay: node.delay, type: "spring", stiffness: 100 }}
                    >
                        <div className="w-10 h-10 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
                            <node.icon className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-black/50 text-zinc-500 font-mono border border-white/5">
                            {node.label}
                        </span>
                    </motion.div>
                ))}

                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible">
                    <motion.line
                        x1="50%" y1="50%" x2="calc(50% - 80px)" y2="calc(50% - 60px)"
                        stroke="#333" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                    />
                    <motion.line
                        x1="50%" y1="50%" x2="calc(50% + 80px)" y2="calc(50% - 60px)"
                        stroke="#333" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                    />
                    <motion.line
                        x1="50%" y1="50%" x2="50%" y2="calc(50% + 80px)"
                        stroke="#333" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                    />
                </svg>
            </div>
        </motion.div>
    );
}
