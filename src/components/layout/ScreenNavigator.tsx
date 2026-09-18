'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ScreenNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const screens = [
    { name: '1. Welcome & Onboarding (All 13 screens)', href: '/onboarding', category: 'Onboarding' },
    { name: '14. Today Dashboard & Protocol', href: '/today', category: 'Core Loop' },
    { name: '15-16. Lock In Focus & Active Timer', href: '/lock-in', category: 'Core Loop' },
    { name: '17. Full Progress & Analytics', href: '/progress', category: 'Analytics' },
    { name: '18. Arc 90-Day Calendar & Matrix', href: '/arc', category: 'Arc' },
    { name: '19. Arc Contract & Sealed Card', href: '/arc?tab=contract', category: 'Arc' },
    { name: '20. Weekly Review', href: '/review', category: 'Review' },
    { name: '21. AI Coach Chat & Insights', href: '/coach', category: 'AI Coach' },
    { name: '22-23. Profile & Notification Settings', href: '/profile', category: 'Settings' },
  ];

  return (
    <div className="fixed top-3 right-3 z-50 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur border border-[#E8EEF5] text-xs font-bold text-[#0A192F] shadow-md hover:bg-slate-50 transition-all"
        title="Screen Navigator"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
        <span>Screens ({screens.length})</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E8EEF5] shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#0A192F] uppercase tracking-wider">
              Winter Arc Screens
            </span>
            <span className="text-[10px] text-[#0085FF] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              Live Preview
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto py-1 text-xs space-y-1">
            {screens.map((s) => {
              const active = pathname === s.href.split('?')[0];
              return (
                <Link
                  key={s.name}
                  href={s.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                    active
                      ? 'bg-blue-50 text-[#0085FF] font-bold'
                      : 'text-[#475569] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  {active && <span className="text-xs">●</span>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
