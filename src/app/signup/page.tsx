'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signup(email, password, name);
      router.push('/onboarding');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF7A00] text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MAXXDADDY.AI TRANSFORMATION</span>
          </div>
          <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
            Join <span className="gradient-text">MaxxDaddy</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            Discipline today creates a different tomorrow.
          </p>
        </div>

        <div className="arc-card p-6 bg-white border border-[#E8EEF5] shadow-lg shadow-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#0A192F] block mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prashant Hiremath"
                  className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#0085FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A192F] block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prashant@example.com"
                  className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#0085FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A192F] block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 focus:outline-none focus:border-[#0085FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-sunset py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <span>{loading ? 'Creating Account...' : 'Get Started →'}</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-[#0085FF] hover:underline"
            >
              Already have an account? Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
