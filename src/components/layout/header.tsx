'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import MobileNav from './mobile-nav';
import HeaderAuth from './header-auth';
import { Icons } from '@/components/icons';



import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Header({ stars = 0 }: { stars?: number }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full border-[0.5px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ${isHome
        ? 'bg-white/10 backdrop-blur-3xl backdrop-saturate-200 border-white/20 supports-[backdrop-filter]:bg-white/10'
        : 'bg-white/10 backdrop-blur-3xl backdrop-saturate-200 border-white/20 supports-[backdrop-filter]:bg-white/10 shadow-2xl'
        } w-[90%] md:w-auto mx-auto`}
      suppressHydrationWarning
    >
      <div className="px-6 h-14 flex items-center justify-between gap-4 md:gap-12" suppressHydrationWarning>
        {/* Left: Logo */}
        <div className="flex items-center gap-2 z-20" suppressHydrationWarning>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110" suppressHydrationWarning>
              <Image
                src="/logos/opensauce-logo.png"
                alt="OpenRepo Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground tracking-tight hidden sm:block">OpenRepo</h1>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1 z-10">
          <Link
            href="/repos"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${pathname === '/repos'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
          >
            Discover
          </Link>
          {/* Contact link removed */}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3 z-20" suppressHydrationWarning>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/HarshitMalik22/OpenRepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-all duration-200 border border-border/50 hover:border-border text-xs font-medium group"
                >
                  <Icons.github className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-background/50 text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {stars}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <HeaderAuth />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden z-20" suppressHydrationWarning>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
