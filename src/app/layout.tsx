import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/motion/LenisProvider';
import { ArchitecturalGrid } from '@/components/layout/ArchitecturalGrid';
import { BackgroundAtmosphere } from '@/components/motion/BackgroundAtmosphere';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AutomotiveTelemetryHUD } from '@/components/ui/AutomotiveTelemetryHUD';
import { AITerminal } from '@/components/ui/AITerminal';
import { siteConfig } from '@/data/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: `${siteConfig.tagline} Student at ${siteConfig.education.institution}, ${siteConfig.education.location}.`,
  authors: [{ name: siteConfig.name }],
  keywords: [
    'Nikhil Sai Reddy',
    'AI/ML Developer',
    'Frontend Developer',
    'Machine Learning',
    'Artificial Intelligence',
    'Next.js',
    'React',
    'TypeScript',
    'Vizag',
    'Nxt Wave',
  ],
  openGraph: {
    title: `${siteConfig.name} — Computing the Future`,
    description: siteConfig.tagline,
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.tagline,
    creator: '@_nikhilsai08_',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#070707',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        {/* Structured Data: JSON-LD Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.name,
              jobTitle: siteConfig.role,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Visakhapatnam',
                addressCountry: 'IN',
              },
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: siteConfig.education.institution,
              },
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'Deep Learning',
                'Next.js',
                'TypeScript',
                'Web Audio API',
                'Creative Computing',
              ],
              sameAs: [
                'https://github.com/nikhilsaireddyi',
                'http://www.linkedin.com/in/nikhil-sai-reddy-induri-0ab948432',
                'https://www.instagram.com/_nikhilsai08_',
              ],
            }),
          }}
        />
        {/* Instant Theme Pre-Hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-cyber-theme') || localStorage.getItem('nikhil_theme_preference') || 'lime';
                  document.documentElement.setAttribute('data-theme', saved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans bg-[#070707] text-[#F2F0EA] relative antialiased">
        <LenisProvider>
          {/* Visual Canvas & Structural Grid Background Layers */}
          <BackgroundAtmosphere />
          <ArchitecturalGrid />
          <GrainOverlay />
          <CustomCursor />

          {/* Persistent Navigation */}
          <Navigation />

          {/* Main Content Sections */}
          <div className="relative z-10">{children}</div>

          {/* Closing Scene & Telemetry */}
          <Footer />
          <AutomotiveTelemetryHUD />
          <AITerminal />
        </LenisProvider>
      </body>
    </html>
  );
}
