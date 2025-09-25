import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ClerkProviderWrapper from '@/components/clerk-provider';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';

export const metadata: Metadata = {
  title: 'OpenSauce',
  description: 'Learn Open Source. Smarter. Faster.',
  icons: {
    icon: '/logos/opensauce-logo.png',
    apple: '/logos/opensauce-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
          <link rel="icon" href="/logos/opensauce-logo.png" />
          <link rel="apple-touch-icon" href="/logos/opensauce-logo.png" />
        </head>
        <body suppressHydrationWarning={true}>
          <ReactQueryProvider>
            <div className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
              <Header />
              <main>
                {children}
              </main>
              <Footer />
              <Toaster />
            </div>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
