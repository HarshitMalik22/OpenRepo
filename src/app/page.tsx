import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


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
import FloatingRepoGrid from '@/components/ui/floating-repo-grid';
import BlurFade from '@/components/ui/blur-fade';
import BlurFadeText from '@/components/ui/blur-fade-text';
import VideoDemo from '@/components/video-demo';
import HowItWorks from '@/components/how-it-works';

export default async function Home() {
  // Skip database calls during build time to avoid connection errors
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_BUILD === 'true';

  // TEMPORARY: Use static data to avoid hitting GitHub API rate limits
  // const { repositories: reposData } = await getPopularRepos();
  // const stats = await getCommunityStats();

  // Ensure repos is always an array
  let repos: Repository[] = FALLBACK_REPOS;

  // Ensure communityStats has all required fields
  let communityStats: CommunityStats = {
    totalQueries: 12500,
    totalUsers: 850,
    activeRepositories: 120,
    successfulContributions: 450,
    averageSatisfaction: 4.8,
    lastUpdated: new Date().toISOString()
  };

  return (
    <div className="mb-32 min-h-screen">
      {/* --- MODIFIED HERO SECTION --- */}
      {/* We ensure min-h-[600px] or similar so the starfield has room to show */}
      {/* Added extra top padding to account for fixed header */}
      <section className="relative w-full overflow-hidden pt-20 pb-10 md:pt-24 md:pb-16">

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
              className="text-4xl md:text-7xl font-bold font-headline tracking-tighter text-white"
              text="Learn Open Source."
            />
            <BlurFadeText
              delay={0.5}
              className="text-4xl md:text-7xl font-bold font-headline tracking-tighter pb-1"
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

      {/* Video Demo Section */}
      <VideoDemo />



      {/* Feature Highlights - Bento Grid */}
      <section className="pt-0 pb-16 md:pt-0 md:pb-24 bg-gradient-to-b from-background to-muted/20 w-full relative z-10">
        <div className="w-full px-4">
          <div className="text-center mb-5">
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-blue-500 to-green-500">
              Open Source Intelligence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real-time insights and trending repositories at your fingertips.
            </p>
          </div>
          <BentoGrid stats={communityStats} topRepos={repos} key="bento-grid-v2" />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />



      {/* Trending Projects Carousel */}
      <section className="container mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Trending Repos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover the most popular open source projects right now</p>
        </div>
        <FloatingRepoGrid repos={repos} />
      </section>



    </div>
  );
}