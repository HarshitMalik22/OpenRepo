'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import MobileNav from './mobile-nav';
import HeaderAuth from './header-auth';
import { Icons } from '@/components/icons';



import { usePathname } from 'next/navigation';

export default function Header({ stars = 0 }: { stars?: number }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome
          ? 'bg-background/5 backdrop-blur-md border-b border-white/5'
          : 'bg-background/60 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60'
        }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 z-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logos/opensauce-logo.png"
                alt="OpenRepo Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground tracking-tight">OpenRepo</h1>
          </Link>
        </div>

        {/* Center: Navigation - Absolutely positioned to ensure true centering */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Link
            href="/repos"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === '/repos'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            Discover
          </Link>
          <Link
            href="/contact"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === '/contact'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3 z-20">
          <Link
            href="https://github.com/HarshitMalik22/OpenRepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-all duration-200 border border-border/50 hover:border-border text-sm font-medium group"
          >
            <Icons.star className="w-4 h-4 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
            <span>Star</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-background/50 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {stars}
            </span>
          </Link>

          <HeaderAuth />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden z-20">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
