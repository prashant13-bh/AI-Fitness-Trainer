'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { UserRow } from '@/lib/supabase/types';

// ── Context value shape ────────────────────────────────────────
interface AuthContextValue {
  session: Session | null;
  user: User | null;
  userData: UserRow | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Omit<Partial<UserRow>, 'id'>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient();

  const [session, setSession]   = useState<Session | null>(null);
  const [user, setUser]         = useState<User | null>(null);
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [loading, setLoading]   = useState(true);

  // ── Fetch user profile from public.users ─────────────────────
  const fetchUserData = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) {
      // Row might not exist yet (trigger handles creation, but may race)
      console.warn('[AuthContext] fetchUserData:', error.message);
      return null;
    }
    return data as UserRow;
  }, [supabase]);

  // ── Bootstrap session on mount ────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: existingSession } } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        const profile = await fetchUserData(existingSession.user.id);
        if (mounted) setUserData(profile);
      }

      setLoading(false);
    };

    init();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const profile = await fetchUserData(newSession.user.id);
          if (mounted) setUserData(profile);
        } else {
          setUserData(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData, supabase]);

  // ── Auth actions ──────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const isPlaceholder =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co');

    if (isPlaceholder) {
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { email },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      setUserData({
        id: mockUser.id,
        name: email.split('@')[0],
        email,
        created_at: new Date().toISOString(),
      } as unknown as UserRow);
      return;
    }

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const isPlaceholder =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co');

    if (isPlaceholder) {
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: name, name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      setUserData({
        id: mockUser.id,
        name,
        email,
        created_at: new Date().toISOString(),
      } as unknown as UserRow);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, name },
      },
    });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
    }
    // The DB trigger (handle_new_user) auto-creates the public.users row
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  };

  const updateUserData = async (data: Omit<Partial<UserRow>, 'id'>) => {
    if (!user) return;
    const payload = { ...data, updated_at: new Date().toISOString() };
    // Cast to untyped client to bypass supabase-js Update<> generic resolving to 'never'
    // on manually-written (non-auto-generated) Database types. RLS still enforces security.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('users')
      .update(payload)
      .eq('id', user.id);
    if (error) throw error;
    setUserData(prev => prev ? { ...prev, ...data } : null);
  };

  const refreshUserData = async () => {
    if (!user) return;
    const profile = await fetchUserData(user.id);
    setUserData(profile);
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      userData,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      resetPassword,
      updateUserData,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
