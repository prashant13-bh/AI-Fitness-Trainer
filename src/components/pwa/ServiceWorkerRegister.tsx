'use client';

import React, { useEffect, useState } from 'react';
import { Download, WifiOff, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function ServiceWorkerRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.debug('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. Listen for BeforeInstallPromptEvent
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed before
      const dismissed = localStorage.getItem('bruce_pwa_prompt_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Online/Offline Network Status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('bruce_pwa_prompt_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Indicator Banner */}
      {isOffline && (
        <div className="fixed top-2 inset-x-4 max-w-md mx-auto z-[999] bg-[#0A192F] text-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-[11px]">Offline Mode · Gym routines & logging active</span>
          </div>
          <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">100% Ready</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-[990] bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-slide-up">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7A00] to-[#0085FF] flex items-center justify-center text-white font-black text-sm shadow-sm">
                ⚡
              </div>
              <div>
                <p className="text-xs font-black text-white">Install Bruce Arc App</p>
                <p className="text-[10px] text-white/70">Add to Home Screen for 1-tap gym access</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="text-white/50 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#0085FF] to-[#7B61FF] text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Home Screen</span>
            </button>
            <button
              onClick={handleDismiss}
              className="py-2 px-3 rounded-xl bg-white/10 text-white/80 text-[11px] font-bold hover:bg-white/20 transition"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
