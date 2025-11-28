import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { techStacks } from '@/lib/mock-data';
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

// --- IMPORT THE NEW COMPONENT HERE ---
import WarpBackground from '@/components/ui/warp-background';

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
    try {
      const { repositories: reposData } = await getPopularRepos();
      const stats = await getCommunityStats();

      // Ensure repos is always an array
      repos = Array.isArray(reposData) ? reposData : [];

      // Ensure communityStats has all required fields
      communityStats = {
        totalQueries: stats?.totalQueries ?? 0,
        totalUsers: stats?.totalUsers ?? 0,
        activeRepositories: stats?.activeRepositories ?? 0,
        successfulContributions: stats?.successfulContributions ?? 0,
        averageSatisfaction: stats?.averageSatisfaction ?? 0,
        lastUpdated: stats?.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch data during page load:', error);
      // Use empty data as fallback
      repos = [];
    }
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
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white pb-6 drop-shadow-2xl">
            Learn Open Source.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Smarter. Faster.
            </span>
          </h1>

          {/* Adjusted text color to be lighter/white for better contrast on dark background */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed drop-shadow-md">
            Discover and analyze open-source projects with AI-powered recommendations,
            advanced filtering, and comprehensive insights. Your journey to exploring open source starts here.
          </p>

          <div className="mt-10 flex flex-col items-center gap-8 animate-slide-up">
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
        </div>
      </section>

      {/* Feature Highlights - Bento Grid */}
      <section className="pt-0 pb-16 md:pt-0 md:pb-24 bg-gradient-to-b from-background to-muted/20 w-full relative z-10">
        <div className="w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why Developers Love OpenSauce</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Powerful features that make understanding open source code a breeze</p>
          </div>
          <BentoGrid stats={communityStats} topRepos={repos} key="bento-grid-v2" />
        </div>
      </section>

      {/* Popular Tech Stacks */}
      <section className="container mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Explore Popular Tech Stacks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover projects built with your favorite technologies</p>
        </div>
        <div className="relative">
          {/* Elegant background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl opacity-30" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
            {techStacks.map((tech, index) => (
              <Link
                href="/repos"
                key={tech.id}
                passHref
                className="group relative"
              >
                {/* Floating card effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2" />

                {/* Main content */}
                <div className="relative flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300 group-hover:scale-110">
                  {/* Logo with sophisticated glow effect */}
                  <div className="relative">
                    {/* Glow ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />

                    {/* Logo container with glass effect */}
                    <div className="relative w-16 h-16 bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-white/30">
                      {tech.logo ? (
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <Image
                            src={tech.logo}
                            alt={`${tech.name} logo`}
                            width={40}
                            height={40}
                            className="w-8 h-8 object-contain filter drop-shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                          />
                          {/* Subtle shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/40 to-primary/60 rounded-xl" />
                      )}
                    </div>
                  </div>

                  {/* Tech name with elegant typography */}
                  <div className="text-center">
                    <span className="text-lg font-semibold font-headline tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {tech.name}
                    </span>
                    <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-purple-500 mx-auto mt-2 transition-all duration-300 group-hover:w-8" />
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-500/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Projects Carousel */}
      <section className="container mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Trending Repos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover the most popular open source projects right now</p>
        </div>
        <Carousel opts={{ loop: true }} className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {repos.slice(0, 10).map((repo, index) => {
              const slug = repo.full_name.replace('/', '--');
              return (
                <CarouselItem key={repo.full_name} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Link href={`/repos/${slug}`} className="block">
                      <Card className="h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg cursor-pointer">
                        <CardHeader>
                          <RepositoryImage repo={repo} />
                          <CardTitle className="pt-4 font-headline">{repo.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                          <p className="text-muted-foreground text-sm flex-grow">{repo.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
                            </div>
                            <Badge variant="secondary">{repo.language}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="container mx-auto animate-fade-in pb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-headline mb-4">Everything You Need to Succeed in Open Source</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">Powerful features designed to accelerate your open source journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get AI-powered repository recommendations based on your tech stack, experience level, and goals.
                Find projects that match your skills perfectly.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tech stack matching</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Experience level alignment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Goal-oriented suggestions</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/repos">
                  Explore Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200/80 transition-colors">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Guided Contribution Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                New to open source? Explore our comprehensive analysis tools that help you understand
                project structure, code quality, and contribution opportunities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Step-by-step guidance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Beginner-friendly projects</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Progress tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group h-full hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200/80 transition-colors">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Advanced Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Find the perfect project with advanced filtering by competition level, activity level,
                AI domain, programming language, and more.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Competition level filters</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Activity level insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI domain classification</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/repos">
                  Browse Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}