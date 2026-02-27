'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Sparkles, ShieldCheck, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'openrepo-open-source-launch-dismissed-v1';

export default function OpenSourceLaunchModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewportTop, setViewportTop] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceOpen = params.get('open_source') === '1';
    const currentPath = pathname ?? '';
    const shouldShowOnRoute = currentPath === '/' || currentPath.startsWith('/repos');

    if (!shouldShowOnRoute && !forceOpen) {
      return;
    }

    const isDismissed = window.localStorage.getItem(STORAGE_KEY) === 'true';

    if (isDismissed && !forceOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    setViewportTop(window.scrollY + window.innerHeight / 2);

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="absolute inset-x-0 z-[120]"
      style={{ top: window.scrollY, height: window.innerHeight }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Open source announcement"
        className="absolute left-1/2 z-[121] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/90 p-6 text-slate-100 shadow-[0_25px_80px_-20px_rgba(6,182,212,0.45)] backdrop-blur-2xl sm:p-8"
        style={{ top: viewportTop }}
      >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.24)_0%,_rgba(15,23,42,0)_58%)]" />
          <div className="pointer-events-none absolute -left-24 bottom-8 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-cyan-300/60 bg-white/10 p-3 shadow-[0_0_40px_rgba(14,165,233,0.35)]">
              <Image
                src="/logos/opensauce-logo.png"
                alt="OpenRepo logo"
                fill
                sizes="96px"
                className="object-contain p-1"
                priority
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                OpenRepo is now
                <span className="ml-2 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Open Source
                </span>
              </h2>
              <p className="mx-auto max-w-md text-base text-slate-300">
                Explore the code, shape the roadmap, and build the future of AI-native open source discovery.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4 text-left">
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>Contribute features and influence product direction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>Get full access to architecture, APIs, and implementation details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>Join a growing builder community around OpenRepo.</span>
                </li>
              </ul>
            </div>

            <div className="w-full">
              <Button asChild size="lg" className="h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500">
                <Link
                  href="https://github.com/HarshitMalik22/OpenRepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Star Now on GitHub ⭐
                </Link>
              </Button>
            </div>
          </div>
      </div>
    </div>,
    document.body
  );
}
