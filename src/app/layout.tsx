import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'MaxxDaddy.ai — LooksMaxx, BodyMaxx & Winter Arc Protocol',
  description: 'MaxxDaddy.ai: Real-time AI pose coaching, looksmax ratio scans, body transformation, and 90-day winter arc protocols.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MaxxDaddy.ai',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning className="bg-[#F8FAFC] text-[#0A192F]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
