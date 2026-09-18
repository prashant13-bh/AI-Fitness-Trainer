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
  name: 'Prashant Hiremath',
  email: 'prashant@example.com',
  identity: 'disciplined, strong and focused.',
  duration: 90,
  startDate: new Date().toISOString().split('T')[0],
  focusAreas: ['Body', 'Mind', 'Career', 'Knowledge'],
  habits: [
    { id: '1', title: 'Morning Cold Shower & Hydration', category: 'BODY', target: '1 cold shower' },
    { id: '2', title: 'Strength Workout / Conditioning', category: 'BODY', target: '45 min' },
    { id: '3', title: 'Deep Work / High Output', category: 'CAREER', target: '90 min' },
    { id: '4', title: 'Read Non-Fiction', category: 'KNOWLEDGE', target: '15 pages' },
    { id: '5', title: 'Clean Nutrition & No Sugar', category: 'BODY', target: 'Zero refined sugar' },
  ],
  morningAlarm: '07:00 AM',
  eveningReview: '09:30 PM',
  quietHours: true,
  signature: 'Prashant Hiremath',
  isSetupComplete: false,
};

const STORAGE_KEY = 'winter_arc_challenge_profile';

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
