import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexdial.vercel.app"),
  title: "NexDial AI — Enterprise Call Center & AI Dialer Platform",
  description: "Scale outbound campaigns with predictive pacing algorithms, real-time AI sentiment analysis, and ultra-low latency WebRTC telephony integrations.",
  keywords: [
    "AI call center",
    "predictive dialer",
    "enterprise auto dialer",
    "sales automation platform",
    "WebRTC telephony",
    "SIP trunking integration",
    "AI voice copilot",
    "real-time sentiment analysis",
    "outbound call pacing",
    "omnichannel CRM dialer",
    "Asterisk PBX dialer",
    "call barging software",
    "TCPA compliant dialer",
    "NexDial AI",
    "Datta Sable portfolio"
  ],
  authors: [{ name: "Datta Sable", url: "https://dattasable.com" }],
  openGraph: {
    title: "NexDial AI — Enterprise Call Center & AI Dialer Platform",
    description: "Scale outbound campaigns with predictive pacing algorithms, real-time AI sentiment analysis, and ultra-low latency WebRTC telephony integrations.",
    url: "https://nexdial.vercel.app",
    siteName: "NexDial AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexDial AI — Enterprise Call Center & AI Dialer Platform",
    description: "Scale outbound campaigns with predictive pacing algorithms, real-time AI sentiment analysis, and ultra-low latency WebRTC telephony integrations.",
    creator: "@DattaSable",
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
  alternates: {
    canonical: "https://nexdial.vercel.app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NexDial AI",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://nexdial.vercel.app",
  "description": "Enterprise AI call center platform featuring predictive dialing algorithms, live agent whisper coaching, omnichannel CRM, and sub-400ms AI voice sentiment scoring.",
  "author": {
    "@type": "Person",
    "name": "Datta Sable",
    "url": "https://dattasable.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "category": "Freemium"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
