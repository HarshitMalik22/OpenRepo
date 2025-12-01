'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import RepositoryImage from '@/components/repository-image';
import type { Repository } from '@/lib/types';

interface FloatingRepoGridProps {
    repos: Repository[];
}

export default function FloatingRepoGrid({ repos }: FloatingRepoGridProps) {
    const [mounted, setMounted] = useState(false);
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setColumns(3);
            } else if (window.innerWidth >= 768) {
                setColumns(2);
            } else {
                setColumns(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Use 9 repos for a clean 3x3 grid
    const displayRepos = repos.slice(0, 9);

    if (!mounted) {
        return (
            <div className="relative w-full h-[800px] bg-gradient-to-b from-background/50 via-background/80 to-background overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-wrap justify-center gap-4 pt-20">
                    {/* Static fallback for SSR/Loading */}
                    {displayRepos.map((repo) => (
                        <div key={repo.id} className="w-[300px] h-[180px] rounded-2xl border border-white/10 bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[800px] overflow-hidden bg-gradient-to-b from-background/50 via-background/80 to-background">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative w-full h-full max-w-7xl mx-auto p-4">
                {displayRepos.map((repo, index) => {
                    // Strict Grid Calculation based on responsive columns
                    const row = Math.floor(index / columns);
                    const col = index % columns;

                    // Position with percentage to be responsive
                    const colWidth = 100 / columns;
                    const rowHeight = 30; // approx 30% height per row

                    const top = `${(row * rowHeight) + 5}%`;
                    const left = `${(col * colWidth) + (colWidth / 2) - (columns === 1 ? 40 : 15)}%`; // Center align adjustment

                    return (
                        <FloatingCard
                            key={repo.id}
                            repo={repo}
                            index={index}
                            top={top}
                            left={left}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function FloatingCard({ repo, index, top, left }: { repo: Repository; index: number; top: string; left: string }) {
    const [config, setConfig] = useState({
        x: 0,
        y: 0,
        rotate: 0,
        duration: 10,
        delay: 0
    });

    useEffect(() => {
        // Constrained random movement to keep them roughly in their grid cells
        setConfig({
            x: Math.random() * 30 - 15, // +/- 15px horizontal sway
            y: Math.random() * 30 - 15, // +/- 15px vertical sway
            rotate: Math.random() * 4 - 2, // +/- 2deg tilt (subtle)
            duration: 5 + Math.random() * 5, // 5-10s duration
            delay: Math.random() * 2
        });
    }, []);

    const slug = repo.full_name.replace('/', '--');

    return (
        <motion.div
            className="absolute w-[280px] md:w-[350px] z-10"
            style={{ top, left }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, config.y, 0],
                x: [0, config.x, 0],
                rotate: [0, config.rotate, 0]
            }}
            transition={{
                opacity: { duration: 0.5, delay: index * 0.1 },
                scale: { duration: 0.5, delay: index * 0.1 },
                y: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: config.duration,
                    ease: "easeInOut",
                    delay: config.delay
                },
                x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: config.duration * 1.2,
                    ease: "easeInOut",
                    delay: config.delay
                },
                rotate: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: config.duration * 1.5,
                    ease: "easeInOut",
                    delay: config.delay
                }
            }}
            whileHover={{
                scale: 1.05,
                zIndex: 50,
                transition: { duration: 0.2 }
            }}
        >
            <Link href={`/repos/${slug}`} className="block group">
                <Card className="h-full bg-background/60 backdrop-blur-md border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden bg-white/10">
                                    <RepositoryImage repo={repo} />
                                </div>
                                <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                                    {repo.name}
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">
                            {repo.description || "No description available"}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-medium">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                            </div>
                            {repo.language && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-6 border-primary/20 text-primary/80">
                                    {repo.language}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
