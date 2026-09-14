'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Enter your email address'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #060A14 0%, #0A0E1A 100%)' }}>
      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Link href="/login" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Login
        </Link>
        <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔑</div>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800 }}>
            Reset <span className="gradient-text">Password</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Enter your email and we'll send a reset link
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Email Sent!</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Check your inbox at <strong style={{ color: 'var(--ice-blue)' }}>{email}</strong> for the reset link.
            </p>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Back to Login</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '0.75rem', color: '#EF4444', fontSize: '0.85rem' }}>⚠️ {error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Sending...' : '📨 Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
