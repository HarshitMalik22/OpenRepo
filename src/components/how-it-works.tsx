'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, GitBranch, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 2000); // Change step every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            id: 1,
            title: 'Input Repository',
            description: 'Paste any public GitHub repository URL. No complex setup required.',
            icon: GitBranch,
        },
        {
            id: 2,
            title: 'AI Analysis',
            description: 'Our advanced AI agents read the codebase, understanding architecture and logic.',
            icon: Brain,
        },
        {
            id: 3,
            title: 'Interactive Insights',
            description: 'Get a visual flowchart and deep explanations to start contributing faster.',
            icon: Sparkles,
        },
    ];

    return (
        <section className="container mx-auto py-24 relative z-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6 text-white">
                    How OpenRepo Works
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Start contributing to open source in three simple steps
                </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Background Track */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0 rounded-full" />

                {/* Dynamic Realistic Beam */}
                <div className="hidden md:block absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 w-full pointer-events-none">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${(Math.min(activeStep, 2) / 2) * 100}%`
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Glowing Head / Particle */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/30 rounded-full blur-md" />
                    </motion.div>
                </div>

                {steps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isCompleted = activeStep > index;

                    return (
                        <div key={step.id} className="relative z-10 group">
                            <motion.div
                                className={cn(
                                    "h-full p-8 rounded-2xl border transition-all duration-500 bg-black/50 backdrop-blur-sm relative overflow-hidden",
                                    isActive ? "border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]" :
                                        isCompleted ? "border-green-500/30" : "border-white/10"
                                )}
                                animate={{
                                    y: isActive ? -10 : 0,
                                    scale: isActive ? 1.02 : 1
                                }}
                            >
                                {/* Active Gradient Background */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 z-0" />
                                )}

                                {/* Step Number Badge */}
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto transition-all duration-500 border-2 relative z-10",
                                    isActive ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
                                        isCompleted ? "bg-green-500/20 border-green-500 text-green-400" :
                                            "bg-white/5 border-white/10 text-muted-foreground"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : isActive ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        step.id
                                    )}
                                </div>

                                <h3 className={cn(
                                    "text-xl font-bold mb-4 text-center transition-colors duration-300 relative z-10",
                                    isActive || isCompleted ? "text-white" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </h3>

                                <p className="text-muted-foreground text-center leading-relaxed relative z-10">
                                    {step.description}
                                </p>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
