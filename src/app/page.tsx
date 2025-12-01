import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


import { getCommunityStats } from '@/lib/github';
import {
  ArrowRight,
  Star,
  Sparkles,
  Trophy,
  Users,
  Target,
  BookOpen,
  Zap,
  CheckCircle,
  Filter,
  Brain
} from 'lucide-react';
import BentoGrid from '@/components/bento-grid';
import { Badge } from '@/components/ui/badge';
import { getPopularRepos } from '@/lib/github';
import GithubRepoSearch from '@/components/github-repo-search';
import RepositoryImage from '@/components/repository-image';
import GitHubStatusIndicator from '@/components/github-status-indicator';
import type { Repository, CommunityStats } from '@/lib/types';
import { FALLBACK_REPOS } from '@/lib/mock-data';

// --- IMPORT THE NEW COMPONENT HERE ---
import WarpBackground from '@/components/ui/warp-background';
import SpotlightCard from '@/components/ui/spotlight-card';
import FloatingRepoGrid from '@/components/ui/floating-repo-grid';
import BlurFade from '@/components/ui/blur-fade';
import BlurFadeText from '@/components/ui/blur-fade-text';

export default async function Home() {
  // Skip database calls during build time to avoid connection errors
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_BUILD === 'true';

  let repos: Repository[] = [];
  let communityStats: CommunityStats = {
    totalQueries: 0,
    totalUsers: 0,
    activeRepositories: 0,
    successfulContributions: 0,
    averageSatisfaction: 0,
    lastUpdated: new Date().toISOString()
  };

  if (!isBuildTime) {
    // TEMPORARY: Use static data to avoid hitting GitHub API rate limits
    // const { repositories: reposData } = await getPopularRepos();
    // const stats = await getCommunityStats();

    // Ensure repos is always an array
    repos = FALLBACK_REPOS;

    // Ensure communityStats has all required fields
    communityStats = {
      totalQueries: 12500,
      totalUsers: 850,
      activeRepositories: 120,
      successfulContributions: 450,
      averageSatisfaction: 4.8,
      lastUpdated: new Date().toISOString()
    };
  }

  return (
    <div className="mb-32 min-h-screen">
      {/* --- MODIFIED HERO SECTION --- */}
      {/* We ensure min-h-[600px] or similar so the starfield has room to show */}
      {/* Added extra top padding to account for fixed header */}
      <section className="relative w-full overflow-hidden pt-20 pb-20 md:pt-24 md:pb-32">

        {/* 1. The Warp Background */}
        <WarpBackground />

        {/* 2. A gradient overlay to fade the bottom of the stars into the rest of the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-0 pointer-events-none" />

        {/* GitHub Status Indicator - Moved inside hero for immersive effect */}
        <div className="container mx-auto relative z-10 mb-8">
          <GitHubStatusIndicator />
        </div>

        {/* 3. The Content (Z-Index 10 ensures it sits ON TOP of the canvas) */}
        <div className="container mx-auto text-center relative z-10">
          <div className="flex flex-col items-center justify-center pb-6 drop-shadow-2xl">
            <BlurFadeText
              delay={0.25}
              className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white"
              text="Learn Open Source."
            />
            <BlurFadeText
              delay={0.5}
              className="text-5xl md:text-7xl font-bold font-headline tracking-tighter pb-1"
              textClassName="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
              text="Smarter. Faster."
            />
          </div>

          <BlurFade delay={0.5}>
            {/* Adjusted text color to be lighter/white for better contrast on dark background */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed drop-shadow-md">
              Discover and analyze open-source projects with AI-powered recommendations,
              advanced filtering, and comprehensive insights. Your journey to exploring open source starts here.
            </p>
          </BlurFade>

          <BlurFade delay={0.75}>
            <div className="mt-10 flex flex-col items-center gap-8">
              <div className="w-full max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white border border-white/20 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
                    <Link href="/repos">
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Added margin top to separate search from button */}
                  <div className="mt-0 w-full">
                    <GithubRepoSearch />
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Feature Highlights - Bento Grid */}
      <section className="pt-0 pb-16 md:pt-0 md:pb-24 bg-gradient-to-b from-background to-muted/20 w-full relative z-10">
        <div className="w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why Developers Love OpenRepo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Powerful features that make understanding open source code a breeze</p>
          </div>
          <BentoGrid stats={communityStats} topRepos={repos} key="bento-grid-v2" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto animate-fade-in py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">How OpenRepo Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Start contributing to open source in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />

          {/* Step 1 */}
          <Card className="relative z-10 bg-background/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100/80 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-inner">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <CardTitle className="text-center">Input Repository</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Paste any public GitHub repository URL. No complex setup or configuration required.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative z-10 bg-background/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100/80 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-inner">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <CardTitle className="text-center">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Our advanced AI agents read the codebase, understanding architecture, logic, and dependencies.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative z-10 bg-background/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100/80 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-inner">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <CardTitle className="text-center">Interactive Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Get a visual flowchart and deep explanations to understand the code and start contributing faster.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trending Projects Carousel */}
      <section className="container mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Trending Repos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover the most popular open source projects right now</p>
        </div>
        <FloatingRepoGrid repos={repos} />
      </section>

      {/* Features Section */}
      <section className="container mx-auto animate-fade-in pb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Everything You Need to Succeed in Open Source</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">Powerful features designed to accelerate your open source journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SpotlightCard className="group h-full border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500" spotlightColor="rgba(59, 130, 246, 0.15)">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-blue-500/10 group-hover:border-blue-500/20">
                <Brain className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Get AI-powered repository recommendations based on your tech stack, experience level, and goals.
                Find projects that match your skills perfectly.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Tech stack matching</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-75">Experience level alignment</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-100">Goal-oriented suggestions</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300" asChild>
                <Link href="/repos">
                  Explore Recommendations
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </SpotlightCard>

          <SpotlightCard className="group h-full border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500" spotlightColor="rgba(34, 197, 94, 0.15)">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-green-500/10 group-hover:border-green-500/20">
                <BookOpen className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:text-green-500 transition-colors" />
              </div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-green-500 animate-pulse" />
                Guided Contribution Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                New to open source? Explore our comprehensive analysis tools that help you understand
                project structure, code quality, and contribution opportunities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Step-by-step guidance</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-75">Beginner-friendly projects</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-100">Progress tracking</span>
                </div>
              </div>
            </CardContent>
          </SpotlightCard>

          <SpotlightCard className="group h-full border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500" spotlightColor="rgba(168, 85, 247, 0.15)">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-purple-500/10 group-hover:border-purple-500/20">
                <Filter className="w-7 h-7 text-purple-600 dark:text-purple-400 group-hover:text-purple-500 transition-colors" />
              </div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-5 h-5 text-purple-500 animate-pulse" />
                Advanced Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find the perfect project with advanced filtering by competition level, activity level,
                AI domain, programming language, and more.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Competition level filters</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-75">Activity level insights</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300 delay-100">AI domain classification</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300" asChild>
                <Link href="/repos">
                  Browse Projects
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </SpotlightCard>
        </div>
      </section>

    </div>
  );
}