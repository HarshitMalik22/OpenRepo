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
  Globe,
  Activity,
  Command,
  GitPullRequest,
  GitMerge
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

        {/* Card 1: Smart Discovery (Span 2) - COMMAND CENTER UI */}
        <motion.div
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-[#0A0A0B] border border-white/5 p-8 group hover:border-blue-500/30 transition-all duration-500 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background Grid & Scanline */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Command className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Smart Discovery</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                INIT_SEARCH_PROTOCOL
              </div>
            </div>

            {/* Mock Command UI */}
            <div className="w-full max-w-2xl mx-auto space-y-4">
              {/* Search Box */}
              <div className="relative group/search">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl blur opacity-20 group-hover/search:opacity-40 transition duration-500" />
                <div className="relative flex items-center gap-3 w-full bg-[#111318]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                  <Search className="w-5 h-5 text-gray-500" />
                  <div className="h-5 w-[1px] bg-gray-700" />
                  <span className="text-gray-400 text-sm font-mono flex-1">Find repositories with...</span>
                  <div className="flex gap-2">
                    <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500 font-mono">⌘K</span>
                  </div>
                </div>
              </div>

              {/* Recent Queries / Suggestions Visual */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Machine Learning', 'Rust Networking', 'Next.js 14'].map((term, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group/item">
                    <Activity className="w-3.5 h-3.5 text-blue-500/50 group-hover/item:text-blue-400" />
                    <span className="text-xs text-gray-400 group-hover/item:text-gray-200">{term}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link href="/repos" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                Open Command Center <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Tech Universe (Span 1) - VISUAL PRESERVED */}
        <motion.div
          className="md:col-span-1 relative overflow-hidden rounded-3xl bg-[#0A0A0B] border border-white/5 p-6 group hover:border-cyan-500/30 transition-all duration-500 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Central Network Visualization */}
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            {/* Center Node */}
            <div className="relative z-20 w-12 h-12 bg-[#0A0A0B] rounded-xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Satellite Nodes */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 bg-[#111] rounded-lg border border-white/5 flex items-center justify-center z-10"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translate(60px) rotate(-${deg}deg)`
                }}
                animate={{
                  transform: [
                    `translate(-50%, -50%) rotate(${deg}deg) translate(60px) rotate(-${deg}deg)`,
                    `translate(-50%, -50%) rotate(${deg + 360}deg) translate(60px) rotate(-${deg + 360}deg)`
                  ]
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30" />
              </motion.div>
            ))}

            {/* Connecting Lines (svg) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 animate-[spin_60s_linear_infinite]">
              <circle cx="50%" cy="50%" r="60" stroke="rgba(6,182,212,0.1)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
              <path d="M80 80 L80 20" stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
              <path d="M80 80 L20 80" stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
              <path d="M80 80 L140 80" stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
              <path d="M80 80 L80 140" stroke="rgba(6,182,212,0.05)" strokeWidth="1" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            Tech Universe
          </h3>
          <p className="text-xs text-gray-500 max-w-[180px] font-light">
            Exploring the infinite possibilities of open source technology.
          </p>
        </motion.div>

        {/* Card 3: Trending Now (Span 1) - VISUAL PRESERVED */}
        <motion.div
          className="md:col-span-1 relative overflow-hidden rounded-3xl bg-[#0A0A0B] border border-white/5 p-6 group hover:border-orange-500/30 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-md font-bold text-white">Trending Now</h3>
            </div>
            <Link href="/repos" className="text-[10px] text-gray-500 hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topRepos.slice(0, 3).map((repo, i) => (
              <div key={repo.id} className="group/item relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity rounded-xl" />
                <div className="relative flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] group-hover/item:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/5">
                      {repo.owner?.avatar_url ? (
                        <img src={repo.owner.avatar_url} alt="" className="w-full h-full rounded-lg opacity-80" />
                      ) : (
                        <Code2 className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200 group-hover/item:text-white transition-colors">{repo.name}</div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <Star className="w-2.5 h-2.5 text-orange-500/70" />
                        {(repo.stargazers_count / 1000).toFixed(1)}k
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        {repo.language || 'Code'}
                      </div>
                    </div>
                  </div>

                  {/* Fake Sparkline */}
                  <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-30 group-hover/item:opacity-100 transition-opacity">
                    <path
                      d={`M0,${15 + Math.random() * 5} Q10,${Math.random() * 10} 20,${10 + Math.random() * 5} T40,${5 + Math.random() * 5}`}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Start Contributing (Span 2) - GIT PIPELINE UI */}
        <motion.div
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-[#0A0A0B] border border-white/5 p-8 group hover:border-green-500/30 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Subtle Git Graph Background */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
              <path d="M20 20 L20 150 C20 200 80 200 80 250" stroke="currentColor" fill="none" strokeWidth="4" className="text-green-500" />
              <circle cx="20" cy="20" r="4" fill="currentColor" className="text-green-500" />
              <circle cx="80" cy="250" r="4" fill="currentColor" className="text-blue-500" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
            <div className="max-w-[40%]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <GitFork className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Open Source</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed font-light">
                Contribute to projects that matter. Follow the pipeline from issue to merge.
              </p>

              <Link href="/contribute">
                <button className="px-5 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-white text-xs font-medium transition-colors flex items-center gap-2">
                  View First Issues <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            {/* Pipeline Visual */}
            <div className="flex-1 w-full pl-4 overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center justify-between relative min-w-[300px]">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 -z-10" />

                {/* Steps */}
                {[
                  { icon: Target, label: 'Issue', sub: '#128', color: 'text-green-400', bg: 'bg-green-500/10' },
                  { icon: Code2, label: 'Work', sub: 'feat/fix', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { icon: GitPullRequest, label: 'Review', sub: 'PR #42', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { icon: GitMerge, label: 'Merge', sub: 'main', color: 'text-gray-400', bg: 'bg-gray-800/10' }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 bg-[#0A0A0B] px-2 relative group/step">
                    <div className={`w-10 h-10 rounded-xl border border-white/10 ${s.bg} flex items-center justify-center relative z-10 transition-transform group-hover/step:scale-110 duration-300`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      {i < 3 && <div className="absolute -right-[50px] top-1/2 w-[30px] h-[1px] bg-gray-700 hidden md:block opacity-0" />}
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{s.label}</div>
                      <div className="text-[9px] font-mono text-gray-600 mt-0.5">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}