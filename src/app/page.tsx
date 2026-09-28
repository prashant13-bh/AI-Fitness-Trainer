'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect straight to Prashant's personalized Glow-Up 2027 dashboard
    router.replace('/glowup');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A192F' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #0085FF, #7B61FF, #FF7A00)' }}
        >
          B
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#FF7A00] border-t-transparent animate-spin" />
        <p className="text-[#94A3B8] text-xs font-bold">Loading Bruce's Glow-Up 2027...</p>
      </div>
    </div>
  );
}
