'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import { Flame, Calendar, Zap, BarChart3, Bot, User, Sparkles } from 'lucide-react';
import { getUserProfile, calculateChallengeDay } from '@/lib/userProfile';

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export default function ResponsiveShell({ children }: ResponsiveShellProps) {
  const pathname = usePathname();
  const profile = getUserProfile();
  const dayInfo = calculateChallengeDay(profile.startDate, profile.duration);
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'A';

  const navLinks = [
    { label: 'Today', href: '/today', icon: Flame },
    { label: 'Arc Matrix', href: '/arc', icon: Calendar },
    { label: 'Lock In', href: '/lock-in', icon: Zap, isSpecial: true },
    { label: 'Progress & Analytics', href: '/progress', icon: BarChart3 },
    { label: 'AI Coach', href: '/coach', icon: Bot },
    { label: 'Weekly Review', href: '/review', icon: Sparkles },
    { label: 'Settings', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex">
      {/* ── DESKTOP SIDEBAR NAVIGATION (Visible on lg: and up) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-64 h-screen fixed left-0 top-0 bg-white border-r border-[#E8EEF5] p-5 z-40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-lg font-black text-[#0085FF]">
                ⚡
              </div>
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-[#0085FF] uppercase block leading-none">
                MAXXDADDY.AI
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold mt-1 block">
                Discipline & Performance
              </span>
            </div>
          </div>

          {/* User Quick Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 mt-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0085FF] flex items-center justify-center text-xs font-black shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0A192F] truncate">
                  {profile.name || 'Athlete'}
                </div>
                <div className="text-[10px] text-[#64748B]">Day {dayInfo.currentDay} / {profile.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-[#FF7A00] bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
              <Flame className="w-3 h-3 fill-[#FF7A00]" />
              <span>{dayInfo.currentDay}D</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/today' && pathname === '/');
              const Icon = link.icon;

              if (link.isSpecial) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-2xl btn-sunset my-3 shadow-md shadow-orange-500/20 active:scale-[0.98] transition-transform"
                  >
                    <Icon className="w-4 h-4 fill-white animate-bounce" />
                    <span className="text-xs font-extrabold tracking-wide text-white">
                      Lock In Session
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#0085FF] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0A192F] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0085FF]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Footer Quote */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/50 to-orange-50/50 border border-blue-100 text-center">
          <span className="font-handwriting text-base text-[#0085FF] block">
            Discipline Creates Freedom
          </span>
          <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider block mt-0.5">
            Winter Arc Protocol
          </span>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <div className="w-full flex-1">
          {children}
        </div>

        {/* Mobile bottom navigation (hidden on desktop) */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
