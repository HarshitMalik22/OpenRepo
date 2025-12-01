import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { ReactQueryProvider } from '@/components/providers/react-query-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { Providers } from './providers'

export function generateViewport() {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "black" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  }
}

export const metadata: Metadata = {
  metadataBase: new URL('https://openrepo.xyz'),
  title: {
    default: "OpenRepo - AI-Powered Open Source Discovery",
    template: "%s | OpenRepo"
  },
  description: "Discover and analyze open-source projects with AI-powered recommendations, architecture visualization, and comprehensive insights.",
  keywords: [
    "open source",
    "github",
    "repository",
    "repositories",
    "repo",
    "open repo",
    "openrepo",
    "analysis",
    "visualization",
    "ai",
    "architecture",
    "code understanding",
    "git analysis",
    "codebase visualization"
  ],
  authors: [{ name: "Harshit Malik" }],
  creator: "Harshit Malik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://openrepo.xyz",
    title: "OpenRepo - AI-Powered Open Source Discovery",
    description: "Discover and analyze open-source projects with AI-powered recommendations, architecture visualization, and comprehensive insights.",
    siteName: "OpenRepo",
    images: [
      {
        url: "/logos/opensauce-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenRepo - AI-Powered Open Source Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRepo - AI-Powered Open Source Discovery",
    description: "Discover and analyze open-source projects with AI-powered recommendations, architecture visualization, and comprehensive insights.",
    images: ["/logos/opensauce-logo.png"],
    creator: "@HarshitMalik22",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logos/opensauce-logo.png',
    apple: '/logos/opensauce-logo.png',
  },
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
};

import { getGitHubRepoDetails } from '@/lib/github';

import { Analytics } from "@vercel/analytics/next"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let stars = 0;
  try {
    const repo = await getGitHubRepoDetails('HarshitMalik22/OpenRepo');
    stars = repo.stargazers_count;
  } catch (error) {
    console.error('Failed to fetch repo details:', error);
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logos/opensauce-logo.png" />
        <link rel="apple-touch-icon" href="/logos/opensauce-logo.png" />

      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <div id="root" suppressHydrationWarning>
          <Providers>
            <ReactQueryProvider>
              <SmoothScrollProvider>
                <div className="font-body antialiased min-h-screen flex flex-col">
                  <Header stars={stars} />
                  <main>
                    {children}
                    <Analytics />
                  </main>
                  <Footer />
                  <Toaster />
                </div>
              </SmoothScrollProvider>
            </ReactQueryProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
