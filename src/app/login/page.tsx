'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      const code = err?.code;
      setError(
        code === 'auth/user-not-found' ? 'No account with this email.' :
        code === 'auth/wrong-password' ? 'Incorrect password.' :
        code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        'Login failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #060A14 0%, #0A0E1A 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '430px', margin: '0 auto', width: '100%', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
          ← Back
        </Link>

        <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }} className="animate-fadeInUp">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❄️</div>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            Welcome<br /><span className="gradient-text">Back, Athlete</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Sign in to continue your training
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }} className="animate-fadeInUp delay-100">
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <Link href="/forgot-password" style={{ textDecoration: 'none', textAlign: 'right', color: 'var(--ice-blue)', fontSize: '0.82rem', fontWeight: 600, marginTop: '-0.5rem' }}>
            Forgot password?
          </Link>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#EF4444', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            New here?{' '}
            <Link href="/signup" style={{ color: 'var(--ice-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
