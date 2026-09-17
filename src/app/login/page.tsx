'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState('');

  const nextPath = searchParams.get('next') || '/today';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(nextPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGLoading(true);
    try {
      await loginWithGoogle();
      // Redirect handled by OAuth callback
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
      setGLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #060A14 0%, #0A0E1A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fadeInUp">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❄️</div>
          <h1 className="font-display gradient-text" style={{ fontSize: '1.75rem', fontWeight: 900 }}>
            Winter Arc
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Welcome back. Keep the promise.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="animate-fadeInUp delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={gLoading}
            className="btn-secondary"
            style={{ gap: '0.75rem', opacity: gLoading ? 0.7 : 1 }}
          >
            {gLoading ? '⏳ Signing in...' : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Email */}
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ marginTop: '0.4rem' }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="input-label" style={{ margin: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--ice-blue)', textDecoration: 'none' }}>
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}
          >
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--ice-blue)', textDecoration: 'none', fontWeight: 600 }}>
              Start your Arc
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
