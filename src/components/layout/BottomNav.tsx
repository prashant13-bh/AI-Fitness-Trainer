'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Calendar, Zap, BarChart3, Bot } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Today', href: '/today', icon: Flame },
    { label: 'Arc', href: '/arc', icon: Calendar },
    { label: 'Lock In', href: '/lock-in', icon: Zap, isCenter: true },
    { label: 'Progress', href: '/progress', icon: BarChart3 },
    { label: 'Coach', href: '/coach', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8EEF5] px-4 py-2 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/today' && pathname === '/');
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative -top-5 flex flex-col items-center group"
                id="nav-lock-in"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-[2px] shadow-lg shadow-orange-500/25 transition-transform group-hover:scale-105 active:scale-95">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#FF7A00] mt-1 tracking-tight">
                  Lock In
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0085FF] font-bold'
                  : 'text-[#94A3B8] hover:text-[#475569] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#0085FF] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
