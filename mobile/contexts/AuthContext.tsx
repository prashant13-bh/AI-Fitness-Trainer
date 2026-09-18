import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import type { UserRow } from "@/lib/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  userData: UserRow | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<Omit<UserRow, "id">>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: UserRow = {
  id: "demo-user-123",
  email: "prashant@example.com",
  name: "Prashant",
  avatar_url: undefined,
  identity_archetype: "Relentless Achiever",
  identity_statement: "I am building peak discipline, vibrant health, and boundless energy.",
  selected_life_areas: ["Body", "Mind", "Discipline"],
  xp: 450,
  level: 2,
  streak: 14,
  longest_streak: 21,
  total_days_complete: 12,
  total_days_minimum: 2,
  total_days_missed: 0,
  onboarded: true,
  notifications_enabled: true,
  theme: "light",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_STORAGE_KEY = "@fitarc_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();
      if (error) {
        console.warn("[AuthContext]", error.message);
        return null;
      }
      return data as UserRow;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Check for persisted demo user first
        const cachedDemo = await AsyncStorage.getItem(DEMO_STORAGE_KEY);
        if (cachedDemo && mounted) {
          const parsed = JSON.parse(cachedDemo);
          setUserData(parsed);
          setLoading(false);
          return;
        }

        // Try Supabase session if configured
        if (process.env.EXPO_PUBLIC_SUPABASE_URL && !process.env.EXPO_PUBLIC_SUPABASE_URL.includes("your_supabase")) {
          const { data: { session: s } } = await supabase.auth.getSession();
          if (!mounted) return;
          setSession(s);
          setUser(s?.user ?? null);
          if (s?.user) {
            const profile = await fetchUserData(s.user.id);
            if (mounted) setUserData(profile);
          }
        }
      } catch (err) {
        console.warn("[AuthContext init error]", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          const profile = await fetchUserData(s.user.id);
          if (mounted) setUserData(profile);
        } else {
          // If no active demo user
          const cachedDemo = await AsyncStorage.getItem(DEMO_STORAGE_KEY);
          if (!cachedDemo) setUserData(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {
      return () => { mounted = false; };
    }
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await AsyncStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const signup = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, name } },
    });
    if (error) throw error;
    await AsyncStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const continueAsDemo = async () => {
    setUserData(DEMO_USER);
    await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(DEMO_USER));
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    await AsyncStorage.removeItem(DEMO_STORAGE_KEY);
    setUserData(null);
    setSession(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateUserData = async (data: Partial<Omit<UserRow, "id">>) => {
    if (userData?.id === DEMO_USER.id) {
      const updated = { ...userData, ...data, updated_at: new Date().toISOString() };
      setUserData(updated);
      await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
      return;
    }

    if (!user) return;
    const { error } = await (supabase as any)
      .from("users")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) throw error;
    setUserData(prev => (prev ? { ...prev, ...data } : null));
  };

  const refreshUserData = async () => {
    if (userData?.id === DEMO_USER.id) return;
    if (!user) return;
    const profile = await fetchUserData(user.id);
    setUserData(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userData,
        loading,
        login,
        signup,
        continueAsDemo,
        logout,
        resetPassword,
        updateUserData,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
