import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Winter Arch — AI Fitness Trainer",
  description: "Your personal AI-powered fitness companion. Habit tracking, AI workout planning, live pose training, and seasonal challenges to transform your body.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Winter Arch",
  },
};

export const viewport: Viewport = {
  themeColor: "#060A14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="app-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
