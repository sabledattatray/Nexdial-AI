import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexdial.vercel.app"),
  title: "NexDial AI — Enterprise Call Center Platform",
  description: "AI-powered enterprise call center dialer with predictive dialing, omnichannel communication, and real-time analytics.",
  keywords: ["call center", "AI dialer", "predictive dialer", "contact center", "CRM"],
  authors: [{ name: "NexDial AI" }],
  openGraph: {
    title: "NexDial AI — Enterprise Dialer Platform",
    description: "AI-powered enterprise call center dialer platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
