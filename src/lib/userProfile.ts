import { getLocalISODate } from './realTimeSync';

export interface ChallengeProfile {
  name: string;
  email: string;
  identity: string;
  duration: number; // 30, 60, 90
  startDate: string;
  focusAreas: string[];
  habits: {
    id: string;
    title: string;
    category: string;
    target: string;
  }[];
  morningAlarm: string;
  eveningReview: string;
  quietHours: boolean;
  signature: string;
  isSetupComplete: boolean;
}

export const DEFAULT_PROFILE: ChallengeProfile = {
  name: 'Bruce',
  email: '',
  identity: 'Skinny-fat to Greek God. Reversing Betnovate-N damage. 100% disciplined.',
  duration: 457,
  startDate: '2026-10-01',
  focusAreas: ['Body Recomp', 'Skin Healing', 'NK Veg Nutrition', 'Deep Work'],
  habits: [
    { id: '1', title: '5:30 AM Wake Up & 500ml Water', category: 'BODY', target: '5:30 AM' },
    { id: '2', title: 'AM Barrier Skin Routine & SPF 50+', category: 'SKIN', target: '10 min' },
    { id: '3', title: 'Progressive Overload Gym Workout', category: 'BODY', target: '60 min' },
    { id: '4', title: 'North Karnataka Veg Diet (140g Protein)', category: 'NUTRITION', target: '1,750 kcal' },
    { id: '5', title: 'PM Skin Healing (Azelaic & Rosehip)', category: 'SKIN', target: '15 min' },
  ],
  morningAlarm: '05:30 AM',
  eveningReview: '09:00 PM',
  quietHours: true,
  signature: 'Bruce',
  isSetupComplete: true,
};

const STORAGE_KEY = 'winter_arc_challenge_profile';

export interface ChallengeDayInfo {
  currentDay: number;
  totalDays: number;
  daysRemaining: number;
  isCompleted: boolean;
  progressPct: number;
}

export function calculateChallengeDay(
  startDateStr?: string,
  durationDays: number = 90
): ChallengeDayInfo {
  const totalDays = Math.max(1, durationDays || 90);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let startMidnight = todayMidnight;
  if (startDateStr) {
    const parts = startDateStr.split('-');
    if (parts.length === 3) {
      const parsed = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(parsed.getTime())) {
        startMidnight = parsed;
      }
    }
  }

  const diffTime = todayMidnight.getTime() - startMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If user signed up today, diffDays = 0 -> currentDay = 1
  // If signed up yesterday, diffDays = 1 -> currentDay = 2
  const currentDay = Math.min(Math.max(1, diffDays + 1), totalDays);
  const daysRemaining = Math.max(0, totalDays - currentDay);
  const isCompleted = diffDays >= totalDays;
  const progressPct = Math.min(100, Math.round((currentDay / totalDays) * 100));

  return {
    currentDay,
    totalDays,
    daysRemaining,
    isCompleted,
    progressPct,
  };
}

export function initNewUserProfile(name: string, email: string): ChallengeProfile {
  const newProfile: ChallengeProfile = {
    ...DEFAULT_PROFILE,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    startDate: getLocalISODate(),
    signature: '',
    isSetupComplete: false,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to init user profile', e);
    }
  }

  return newProfile;
}

export function getUserProfile(): ChallengeProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: Partial<ChallengeProfile>): ChallengeProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
  return updated;
}

export function resetUserProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset profile', e);
  }
}

