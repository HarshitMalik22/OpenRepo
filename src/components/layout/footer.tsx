"use client";

export default function Footer() {
  return (
    <footer className="py-6 px-6 md:px-8 mt-12 border-t border-border/20 bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OpenSauce. All rights reserved.</p>
      </div>
    </footer>
  );
}
