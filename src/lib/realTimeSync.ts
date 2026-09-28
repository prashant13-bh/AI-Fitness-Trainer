/**
 * Real-Time Date & Clock Synchronization Engine
 * 
 * Provides timezone-safe local dates, live ticking second clock, 
 * schedule block tracking, and real calendar-day mapping for Bruce.
 */

'use client';

import { useState, useEffect } from 'react';

export interface RoutineSlotInfo {
  id: string;
  title: string;
  timeRange: string;
  category: 'BODY' | 'SKIN' | 'NUTRITION' | 'MIND' | 'SLEEP';
  target: string;
  emoji: string;
  isActiveNow: boolean;
}

export const MASTER_SCHEDULE_SLOTS = [
  { id: 'sleep', startHour: 21, startMin: 30, endHour: 5, endMin: 0, title: 'Deep Sleep & Muscle Growth', timeRange: '9:30 PM – 5:00 AM', category: 'SLEEP' as const, target: '8 Hours Non-Negotiable Rest', emoji: '🌙' },
  { id: 'wake', startHour: 5, startMin: 0, endHour: 5, endMin: 45, title: '5:30 AM Rise & 500ml Hydration', timeRange: '5:00 AM – 5:45 AM', category: 'BODY' as const, target: '500ml Water + Sunlight', emoji: '🌅' },
  { id: 'skin_am', startHour: 5, startMin: 45, endHour: 6, endMin: 30, title: 'AM Skin Barrier & SPF 50+', timeRange: '5:45 AM – 6:30 AM', category: 'SKIN' as const, target: 'Ceramides + Niacinamide + SPF', emoji: '✨' },
  { id: 'gym', startHour: 6, startMin: 30, endHour: 8, endMin: 0, title: 'PPL Hypertrophy Gym Session', timeRange: '6:30 AM – 8:00 AM', category: 'BODY' as const, target: 'Push / Pull / Legs Overload', emoji: '🏋️' },
  { id: 'breakfast', startHour: 8, startMin: 0, endHour: 10, endMin: 30, title: 'Meal 1: Jolada Rotti + Shenga Chutney', timeRange: '8:00 AM – 10:30 AM', category: 'NUTRITION' as const, target: '28g Pure Veg Protein', emoji: '🌾' },
  { id: 'mid_morning', startHour: 10, startMin: 30, endHour: 13, endMin: 0, title: 'Meal 2: Sprouted Moong Kosambari', timeRange: '10:30 AM – 1:00 PM', category: 'NUTRITION' as const, target: '12g Live Enzyme Protein', emoji: '🌱' },
  { id: 'lunch', startHour: 13, startMin: 0, endHour: 15, endMin: 0, title: 'Meal 3: Ennegayi, Jowar Roti & Taak', timeRange: '1:00 PM – 3:00 PM', category: 'NUTRITION' as const, target: '32g Protein + Probiotic Buttermilk', emoji: '🍆' },
  { id: 'spf_refresh', startHour: 15, startMin: 0, endHour: 16, endMin: 30, title: 'SPF 50+ Sunscreen Re-application', timeRange: '3:00 PM – 4:30 PM', category: 'SKIN' as const, target: 'Shield against UV rebound', emoji: '🧴' },
  { id: 'snack', startHour: 16, startMin: 30, endHour: 19, endMin: 30, title: 'Meal 4: Roasted Hurigadale / Shenga', timeRange: '4:30 PM – 7:30 PM', category: 'NUTRITION' as const, target: '18g Protein Fuel Crunch', emoji: '🥜' },
  { id: 'dinner', startHour: 19, startMin: 30, endHour: 21, endMin: 0, title: 'Meal 5: 200g Low-Fat Paneer & Mudde', timeRange: '7:30 PM – 9:00 PM', category: 'NUTRITION' as const, target: '36g Casein Muscle Repair', emoji: '🍲' },
  { id: 'skin_pm', startHour: 21, startMin: 0, endHour: 21, endMin: 30, title: 'PM Skin Healing: Azelaic 10% & Rosehip', timeRange: '9:00 PM – 9:30 PM', category: 'SKIN' as const, target: 'Ice + 10% Azelaic + Rosehip Lock', emoji: '🔬' },
];

/**
 * Returns date as YYYY-MM-DD in the USER's real local timezone (safe from UTC midnight rollbacks).
 */
export function getLocalISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats live 12-hour clock (e.g. "01:14:05 AM")
 */
export function formatLiveTime(d: Date = new Date(), withSeconds: boolean = true): string {
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true,
  });
}

/**
 * Formats real calendar date (e.g. "Tuesday, 29 Sep 2026")
 */
export function formatLiveDate(d: Date = new Date()): string {
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Real-time greeting based on hour of day
 */
export function getLiveGreeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h >= 5 && h < 12) return 'Good Morning, Bruce';
  if (h >= 12 && h < 17) return 'Good Afternoon, Bruce';
  if (h >= 17 && h < 21) return 'Good Evening, Bruce';
  return 'Night Rest, Bruce';
}

/**
 * Determine which routine block is running right now in real time.
 */
export function getCurrentActiveSlot(d: Date = new Date()): RoutineSlotInfo {
  const hour = d.getHours();
  const min = d.getMinutes();
  const currentTotalMins = hour * 60 + min;

  for (const slot of MASTER_SCHEDULE_SLOTS) {
    const startMins = slot.startHour * 60 + slot.startMin;
    const endMins = slot.endHour * 60 + slot.endMin;

    if (slot.id === 'sleep') {
      // Overnight (21:30 -> 05:00)
      if (currentTotalMins >= startMins || currentTotalMins < endMins) {
        return {
          id: slot.id,
          title: slot.title,
          timeRange: slot.timeRange,
          category: slot.category,
          target: slot.target,
          emoji: slot.emoji,
          isActiveNow: true,
        };
      }
    } else {
      if (currentTotalMins >= startMins && currentTotalMins < endMins) {
        return {
          id: slot.id,
          title: slot.title,
          timeRange: slot.timeRange,
          category: slot.category,
          target: slot.target,
          emoji: slot.emoji,
          isActiveNow: true,
        };
      }
    }
  }

  // Fallback to first
  const fallback = MASTER_SCHEDULE_SLOTS[0];
  return {
    id: fallback.id,
    title: fallback.title,
    timeRange: fallback.timeRange,
    category: fallback.category,
    target: fallback.target,
    emoji: fallback.emoji,
    isActiveNow: true,
  };
}

/**
 * Calculates current real Arc Day given a start date string (or today).
 */
export function getRealArcDayInfo(startDateStr?: string) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let startMidnight = todayMidnight;
  if (startDateStr) {
    const parts = startDateStr.split('-');
    if (parts.length === 3) {
      const p = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(p.getTime())) {
        startMidnight = p;
      }
    }
  }

  const diffTime = todayMidnight.getTime() - startMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentArcDay = Math.max(1, diffDays + 1);

  // Goal: Dec 31, 2027
  const targetEnd = new Date(2027, 11, 31);
  const remainingTime = targetEnd.getTime() - todayMidnight.getTime();
  const daysUntil2027 = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  return {
    currentArcDay,
    currentDay: currentArcDay,
    totalArcDays: 457,
    daysUntil2027,
    weekdayIndex: today.getDay(), // 0=Sun, 1=Mon, ..., 6=Sat
  };
}

/**
 * React Hook for Real-Time Ticking Clock (updates every 1000ms).
 */
export function useRealTimeClock() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Sync initial state on mount
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = formatLiveTime(now, true);
  const dateString = formatLiveDate(now);
  const isoDate = getLocalISODate(now);
  const greeting = getLiveGreeting(now);
  const activeSlot = getCurrentActiveSlot(now);
  const weekdayName = now.toLocaleDateString('en-IN', { weekday: 'long' });
  const weekdayIndex = now.getDay(); // 0=Sun, 1=Mon...

  return {
    now,
    timeString,
    dateString,
    isoDate,
    greeting,
    activeSlot,
    weekdayName,
    weekdayIndex,
  };
}
