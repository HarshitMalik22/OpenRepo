import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import MobileNav from './mobile-nav';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-border/40">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">OpenSource Sage</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/repos" className="text-muted-foreground hover:text-foreground transition-colors">
            Repositories
          </Link>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Log In</Button>
          <Button asChild>
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
