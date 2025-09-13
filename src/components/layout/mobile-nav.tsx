"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BrainCircuit } from 'lucide-react';

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
              <BrainCircuit className="w-8 h-8 text-primary" />
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
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Log In</Button>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
