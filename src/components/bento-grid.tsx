"use client";

import {
  Search,
  BarChart3,
  BookOpen,
  Zap,
  Code2,
  GitFork,
  Star,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Target,
  FileCode,
  Database,
  Cpu,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityStats, Repository } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface BentoGridProps {
  stats?: CommunityStats;
  topRepos?: Repository[];
}

export default function BentoGrid({ stats, topRepos = [] }: BentoGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default stats if not provided
  const displayStats = {
    activeRepositories: stats?.activeRepositories || 0,
    totalUsers: stats?.totalUsers || 0,
    totalQueries: stats?.totalQueries || 0,
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">

        {/* Card 1: Smart Discovery (Span 2) */}
        <motion.div
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 group hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Radar Scan Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
            <motion.div
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.1)_60deg,transparent_60deg)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
          </div>

          <div className="relative z-20 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Smart Discovery</h3>
                </div>
                <p className="text-gray-400 text-lg max-w-md">
                  Stop searching blindly. Find repositories that match your exact tech stack.
                </p>
              </div>

              {/* Animated Pulse Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs text-blue-400 font-medium">System Active</span>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {/* Floating Tags Container */}
              <div className="flex flex-wrap gap-3 relative">
                {['React', 'TypeScript', 'Python', 'Rust', 'Go', 'Next.js', 'Tailwind'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-gray-300 backdrop-blur-sm cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-300 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      opacity: { delay: i * 0.1 },
                      y: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <Link href="/repos" className="inline-flex group/btn">
                <motion.button
                  className="px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Start Exploring</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Holographic Tech Core (Span 1) */}
        <motion.div
          className="md:col-span-1 relative overflow-hidden rounded-3xl bg-black p-8 text-white group hover:shadow-2xl transition-all duration-500 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)' }} />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            {/* 3D Holographic Core */}
            <div className="relative w-32 h-32 mb-6 perspective-1000">
              <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: 360, rotateX: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {/* Core Glow */}
                <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl animate-pulse" />

                {/* Orbiting Icons */}
                {[Code2, Database, Cpu, Globe, Zap, Sparkles].map((Icon, i) => {
                  const angle = (i / 6) * Math.PI * 2;
                  const x = Math.cos(angle) * 40;
                  const z = Math.sin(angle) * 40;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 flex items-center justify-center bg-black/50 backdrop-blur-md border border-cyan-500/50 rounded-lg"
                      style={{
                        transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}rad)`,
                      }}
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
              Tech Universe
            </h3>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Exploring the infinite possibilities of open source technology.
            </p>
          </div>

          {/* Background Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

          {/* Moving Beam */}
          <motion.div
            className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        </motion.div>

        {/* Card 3: Trending Repos (Span 1) */}
        <motion.div
          className="md:col-span-1 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-6 group hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Meteor Shower Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: '-20%',
                }}
                animate={{
                  x: ['0%', '200%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Trending Now</h3>
              </div>
              <Link href="/repos" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 group/link">
                View All <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {topRepos.slice(0, 3).map((repo, i) => (
                <Link key={repo.id} href={`/repos/${repo.full_name.replace('/', '--')}`} className="block">
                  <motion.div
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-orange-500/30 transition-all group/item cursor-pointer relative overflow-hidden"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center shrink-0 border border-white/10 group-hover/item:border-orange-500/50 transition-colors">
                      {repo.owner?.avatar_url ? (
                        <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <Code2 className="w-5 h-5 text-gray-400 group-hover/item:text-orange-500 transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate text-gray-200 group-hover/item:text-white transition-colors">{repo.name}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1 text-yellow-500/80">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          {(repo.stargazers_count / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                          {repo.language || 'Code'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover/item:text-orange-500 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                  </motion.div>
                </Link>
              ))}

              {topRepos.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No trending repos available right now.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Card 4: Contribution Guide (Span 2) */}
        <motion.div
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 group hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Animated Circuit Board Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <motion.path
                  d="M10 10h80v80h-80z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-500"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M20 20h60v60h-60z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-500"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                />
                <circle cx="10" cy="10" r="2" className="fill-gray-500" />
                <circle cx="90" cy="90" r="2" className="fill-gray-500" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse" />
                  <div className="relative p-2.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <Target className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Start Contributing</h3>
              </div>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                New to open source? We've curated thousands of <span className="text-green-400 font-medium">"Good First Issues"</span> to help you make your first PR.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/repos?goodFirstIssues=true">
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all cursor-pointer flex items-center gap-2 group/badge">
                    <Sparkles className="w-3.5 h-3.5 group-hover/badge:rotate-12 transition-transform" />
                    Good First Issues
                  </Badge>
                </Link>
                <Link href="/repos?sort=help-wanted">
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer flex items-center gap-2 group/badge">
                    <Users className="w-3.5 h-3.5 group-hover/badge:scale-110 transition-transform" />
                    Help Wanted
                  </Badge>
                </Link>
                <Link href="/repos?sort=documentation">
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2 group/badge">
                    <BookOpen className="w-3.5 h-3.5 group-hover/badge:translate-x-0.5 transition-transform" />
                    Documentation
                  </Badge>
                </Link>
              </div>
            </motion.div>

            <div className="relative h-full min-h-[160px] bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-center backdrop-blur-sm overflow-hidden">
              {/* Animated Connection Line */}
              <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-white/10">
                <motion.div
                  className="w-full bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {/* Pulse Beam */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
                  animate={{ top: ["-20%", "120%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </div>

              {[
                { step: 1, text: "Find an issue", color: "bg-green-500", shadow: "shadow-green-500/50", icon: Search },
                { step: 2, text: "Fork & Clone", color: "bg-blue-500", shadow: "shadow-blue-500/50", icon: GitFork },
                { step: 3, text: "Submit PR", color: "bg-purple-500", shadow: "shadow-purple-500/50", icon: GitFork }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 mb-4 last:mb-0 relative z-10 group/step cursor-default"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.2) }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-sm shadow-lg ${item.shadow} group-hover/step:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <div className="text-sm font-medium text-gray-200 group-hover/step:text-white transition-colors">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}