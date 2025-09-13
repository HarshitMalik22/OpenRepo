export default function Footer() {
  return (
    <footer className="py-6 px-6 md:px-8 mt-12 border-t border-border/40">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OpenSource Sage. All rights reserved.</p>
      </div>
    </footer>
  );
}
