"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col h-full">
          <div className="border-b pb-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="relative w-8 h-8">
                <Image 
                  src="/logos/opensauce-logo.png" 
                  alt="OpenSauce Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold font-headline text-foreground">OpenSauce</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-4 py-6">
            <Link href="/repos" className="text-lg text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              Repositories
            </Link>
            <Link href="/profile" className="text-lg text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
            <Link href="/contact" className="text-lg text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </nav>
          <div className="mt-auto flex flex-col gap-4 border-t pt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Sign In</Button>
              </SignInButton>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
