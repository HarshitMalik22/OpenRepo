import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ContentSpacer from '@/components/layout/content-spacer'
import { ReactQueryProvider } from '@/components/providers/react-query-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { PostHogProvider } from '@/components/providers/posthog-provider'
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
    "open repository",
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
        url: "/og-homepage.png",
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
    images: ["/og-homepage.png"],
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico', // Fallback to ICO since PNG is too large
  },
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
};



import { Analytics } from "@vercel/analytics/next"

import { Suspense } from 'react';
import HeaderWithStars from '@/components/layout/header-with-stars';
import OpenSourceLaunchModal from '@/components/open-source-launch-modal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <PostHogProvider>
          <div id="root" suppressHydrationWarning>
            <Providers>
              <ReactQueryProvider>
                <SmoothScrollProvider>
                  <div className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
                    {/* Wrap Header in Suspense to prevent blocking the initial render */}
                    <Suspense fallback={<Header />}>
                      <HeaderWithStars />
                    </Suspense>
                    <OpenSourceLaunchModal />
                    <ContentSpacer />
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
        </PostHogProvider>
      </body>
    </html >
  );
}
