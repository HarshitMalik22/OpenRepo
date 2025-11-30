"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import HeaderAuth from './header-auth';

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
                  alt="OpenRepo Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold font-headline text-foreground">OpenRepo</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-4 py-6">
            <Link href="/repos" className="text-lg text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              Repositories
            </Link>
            <Link href="/contact" className="text-lg text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </nav>
          <div className="mt-auto border-t pt-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Theme</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-start"
                    onClick={() => {
                      const { setTheme } = require('next-themes');
                      setTheme('light');
                    }}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-start"
                    onClick={() => {
                      const { setTheme } = require('next-themes');
                      setTheme('dark');
                    }}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const { setTheme } = require('next-themes');
                    setTheme('system');
                  }}
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  System Theme
                </Button>
              </div>
              <div className="border-t pt-4">
                <HeaderAuth />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
