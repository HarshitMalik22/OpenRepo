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
      className={`py-4 px-6 md:px-8 z-50 transition-all duration-300 ${isHome
        ? 'fixed top-0 w-full bg-background/10 backdrop-blur-md border-b border-white/10'
        : 'sticky top-0 border-b border-border/20 bg-background/80 backdrop-blur-sm shadow-sm'
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/logos/opensauce-logo.png"
              alt="OpenRepo Logo"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">OpenRepo</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/repos" className="text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="https://github.com/HarshitMalik22/OpenRepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] transition-colors border border-[#30363d] text-sm font-medium group"
          >
            <Icons.star className="w-4 h-4 text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors" />
            <span>Star</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#30363d] text-xs text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors border border-[#30363d]">
              {stars}
            </span>
          </Link>

          <HeaderAuth />
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
