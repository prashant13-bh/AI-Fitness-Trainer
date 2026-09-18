'use client';

import React, { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/userProfile';
import OnboardingPage from './onboarding/page';
import TodayPage from './today/page';

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setIsSetupComplete(Boolean(profile?.isSetupComplete));
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0085FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user has not completed setup, show streamlined Details Filling & Challenge Setup
  if (!isSetupComplete) {
    return <OnboardingPage />;
  }

  // Once setup is complete, show the Daily Protocol Dashboard
  return <TodayPage />;
}
