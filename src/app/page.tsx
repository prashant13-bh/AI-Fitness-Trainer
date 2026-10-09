'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';

export default function HomePage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Check if user is logged in via Supabase Auth
    if (user) {
      const profile = getUserProfile();
      const hasCompletedOnboarding = userData?.onboarding_completed || profile?.isSetupComplete;
      if (hasCompletedOnboarding) {
        router.replace('/today');
      } else {
        router.replace('/onboarding');
      }
    } else {
      // Check if user has an existing local profile setup
      const localProfile = getUserProfile();
      if (localProfile?.isSetupComplete && localProfile?.name) {
        router.replace('/today');
      } else {
        // New visitor / unauthenticated -> send to login / welcome
        router.replace('/login');
      }
    }
  }, [user, userData, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F]">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #0085FF, #7B61FF, #FF7A00)' }}
        >
          ⚡
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#FF7A00] border-t-transparent animate-spin" />
        <h2 className="text-white text-base font-extrabold tracking-tight">
          MaxxDaddy.ai
        </h2>
        <p className="text-[#94A3B8] text-xs font-medium">
          Loading your personalized habit protocol...
        </p>
      </div>
    </div>
  );
}
