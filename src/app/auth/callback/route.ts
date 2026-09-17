import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// OAuth callback handler — exchanges code for session
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/today';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error fallback
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
