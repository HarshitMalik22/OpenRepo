import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { techStacks } from '@/lib/mock-data';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import { getPopularRepos } from '@/lib/github';
import GithubRepoSearch from '@/components/github-repo-search';
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
          Discover and understand open-source projects with AI-powered explanations, interactive flowcharts, and curated learning paths.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <Button asChild size="lg" className="gap-2">
            <Link href="/onboarding">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
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
    </div>
  );
}
