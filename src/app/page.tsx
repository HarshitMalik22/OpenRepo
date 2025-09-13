import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { techStacks } from '@/lib/mock-data';
import { communityStats } from '@/lib/mock-data';
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
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import { getPopularRepos } from '@/lib/github';
import GithubRepoSearch from '@/components/github-repo-search';
import EnhancedRepoCard from '@/components/enhanced-repo-card';
import type { Repository } from '@/lib/types';

export default async function Home() {
  const trendingImages = placeholderImages.placeholderImages.filter(p => p.id.startsWith('trending-carousel'));
  const repos: Repository[] = await getPopularRepos();

  return (
    <div className="space-y-24 mb-24">
      {/* Hero Section */}
      <section className="container mx-auto text-center py-20 md:py-32">
        <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-4">
          Learn Open Source.
          <br />
          Smarter. Faster.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          Discover, analyze, and contribute to open-source projects with AI-powered recommendations, 
          guided workflows, and advanced filtering. Your journey to becoming an open source contributor starts here.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/contribute">
                Start Contributing
                <BookOpen className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <GithubRepoSearch />
        </div>
      </section>

      {/* Popular Tech Stacks */}
      <section className="container mx-auto">
        <h2 className="text-3xl font-bold font-headline text-center mb-12">Explore Popular Tech Stacks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {techStacks.map((tech) => (
            <Link href="/repos" key={tech.id} passHref>
              <Card className="group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                  <tech.icon className="w-10 h-10 text-primary" />
                  <span className="text-lg font-semibold font-headline">{tech.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Trending Projects Carousel */}
      <section className="container mx-auto">
        <h2 className="text-3xl font-bold font-headline text-center mb-12">Trending Projects</h2>
        <Carousel opts={{ loop: true }} className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {repos.slice(0, 10).map((repo, index) => {
              const slug = repo.full_name.replace('/', '--');
              return (
                <CarouselItem key={repo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Link href={`/repos/${slug}`} className="block">
                      <Card className="h-full flex flex-col hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <Image
                            src={trendingImages[index % trendingImages.length]?.imageUrl || ''}
                            alt={repo.name}
                            width={500}
                            height={300}
                            className="rounded-lg object-cover aspect-[5/3]"
                            data-ai-hint={trendingImages[index % trendingImages.length]?.imageHint || 'code project'}
                          />
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
      <section className="container mx-auto">
        <h2 className="text-3xl font-bold font-headline text-center mb-12">Everything You Need to Succeed in Open Source</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
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

          <Card className="group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Guided Contribution Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Never contributed before? Follow our step-by-step guide that walks you through 
                the entire contribution process, from finding issues to submitting pull requests.
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
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/contribute">
                  Start Contributing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
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

      {/* Community Impact */}
      <section className="container mx-auto">
        <h2 className="text-3xl font-bold font-headline text-center mb-12">Join Our Growing Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <div className="text-3xl font-bold mb-2">{communityStats.successfulContributions.toLocaleString()}+</div>
              <div className="text-muted-foreground">Contributions Made</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <div className="text-3xl font-bold mb-2">{communityStats.totalUsers.toLocaleString()}+</div>
              <div className="text-muted-foreground">Active Contributors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <div className="text-3xl font-bold mb-2">{communityStats.activeRepositories.toLocaleString()}+</div>
              <div className="text-muted-foreground">Projects Available</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">⭐ {communityStats.averageSatisfaction}</div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Ready to Make Your Mark?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of developers who have successfully contributed to open source projects 
                through OpenSauce. Whether you're a beginner or an experienced developer, we have 
                the perfect project waiting for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/onboarding">
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contribute">
                    Browse Projects
                    <Target className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
