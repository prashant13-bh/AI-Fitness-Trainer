'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get('code');
        const next = searchParams.get('next') || '/today';

        if (code) {
          const supabase = getSupabaseClient();
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setErrorMsg(error.message);
            setTimeout(() => router.replace('/login?error=oauth_failed'), 2000);
            return;
          }
        }
        router.replace(next);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setErrorMsg(message);
        setTimeout(() => router.replace('/login?error=oauth_failed'), 2000);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-300">
          {errorMsg ? `Error: ${errorMsg}` : 'Completing secure authentication...'}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
