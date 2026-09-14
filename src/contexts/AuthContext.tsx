'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserProfile, getUserLevel } from '@/lib/types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && db) {
        const docRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserData(snap.data() as User);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    const newUser: User = {
      uid: cred.user.uid,
      email,
      displayName: name,
      level: 'rookie',
      xp: 0,
      streak: 0,
      longestStreak: 0,
      joinedAt: new Date().toISOString(),
      profile: {
        age: 25,
        gender: 'male',
        height: 175,
        weight: 75,
        goal: 'get-fit',
        fitnessLevel: 'beginner',
        daysPerWeek: 4,
        dietPreference: 'standard',
      },
    };

    await setDoc(doc(db, 'users', cred.user.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
    });
    setUserData(newUser);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!firebaseUser || !db) return;
    const docRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(docRef, data, { merge: true });
    setUserData(prev => prev ? { ...prev, ...data } : null);
  };

  const saveProfile = async (profile: UserProfile) => {
    await updateUserData({ profile });
  };

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userData,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      updateUserData,
      saveProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
