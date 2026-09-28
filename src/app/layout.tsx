import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Bruce Glow-Up 2027 — Winter Arc & Transformation Protocol',
  description: "Bruce's 2027 Transformation Protocol: 167cm, 70kg to 63kg Greek God cut, North Karnataka vegetarian nutrition, and Betnovate-N skin healing.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bruce Arc 2027',
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
