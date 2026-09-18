import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Winter Arc — Become who you said you\'d become',
  description: '90 days. One promise. A different you. Track your Arc, build daily habits, and transform with AI coaching.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Winter Arc',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import ScreenNavigator from '@/components/layout/ScreenNavigator';

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
          <ScreenNavigator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
