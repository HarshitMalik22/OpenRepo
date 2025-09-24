import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import MobileNav from './mobile-nav';
import ClerkComponentsWrapper from '@/components/clerk-components';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-border/20 bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image 
              src="/logos/opensauce-logo.png" 
              alt="OpenSauce Logo" 
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">OpenSauce</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/repos" className="text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <ClerkComponentsWrapper>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </ClerkComponentsWrapper>
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
