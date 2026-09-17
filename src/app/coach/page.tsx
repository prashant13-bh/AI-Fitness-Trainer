'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/layout/BottomNav';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  { label: '📊 Review my week', prompt: 'Review my weekly consistency and where I can tighten up.' },
  { label: '🌅 Plan tomorrow', prompt: 'Help me plan tomorrow so I do not negotiate with myself.' },
  { label: '🛡️ Recover from slip', prompt: 'I felt off track today. How do I recover without spiral?' },
  { label: '⚡ Give me hard truth', prompt: 'Motivate me with hard truth. No sugarcoating.' },
  { label: '🎯 Adjust difficulty', prompt: 'How do I know if my daily habits are too aggressive or too easy?' },
];

export default function CoachPage() {
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'coach',
      text: "Welcome to the Arc Command. I'm your Winter Arc Transformation Coach.\n\nYou're on **Day 17 of 90** with an **82% consistency rate**. You have 73 days to solidify who you are.\n\nWhat are we locking in right now?",
      timestamp: '10:00 AM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          userContext: {
            identityStatement: userData?.identity_statement || 'I am forging an elite, disciplined version of myself.',
            currentDay: 17,
            consistency: 82,
            streak: 8,
          },
        }),
      });

      const data = await res.json();
      const coachReply: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: data.reply || "Focus on keeping today's promise. One rep, one page, one hour at a time.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, coachReply]);
    } catch (err) {
      console.error('Failed to get coach reply', err);
      setMessages(prev => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: 'coach',
          text: "Stay focused on your standard. Win the next decision in front of you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <BottomNav />

      <main className="page-content" style={{ paddingBottom: '7rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* ── Header ── */}
        <header style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            TACTICAL MENTORSHIP
          </div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Arc AI Coach</span>
            <span className="pill pill-blue" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
          </h1>
        </header>

        {/* ── Context Insight Card ── */}
        <section className="glass-card" style={{
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(14,24,48,0.7) 0%, rgba(6,10,20,0.85) 100%)',
          border: '1px solid rgba(0,212,255,0.25)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CURRENT STATE MONITOR
            </div>
            <div style={{ fontSize: '0.88rem', color: 'white', fontWeight: 700, marginTop: '0.15rem' }}>
              Day 17 / 90 · 82% Arc Consistency
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              4 of 5 habits on track · Minimum Day enabled
            </div>
          </div>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', flexShrink: 0
          }}>
            🤖
          </div>
        </section>

        {/* ── Quick Action Prompt Chips ── */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(action.prompt)}
              disabled={isLoading}
              style={{
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '0.45rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* ── Chat Messages Stream ── */}
        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem',
          minHeight: '300px'
        }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', flexShrink: 0, marginTop: '2px'
                  }}>
                    ❄️
                  </div>
                )}

                <div style={{
                  maxWidth: '82%',
                  padding: '0.9rem 1.1rem',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isUser
                    ? 'linear-gradient(135deg, #00D4FF, #0072FF)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  boxShadow: isUser ? '0 4px 16px rgba(0,212,255,0.25)' : 'none'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '0.62rem',
                    color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                    textAlign: 'right',
                    marginTop: '0.4rem'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                ❄️
              </div>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--ice-blue)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="pulse-glow">Coach is formulating tactical advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* ── Input Bar ── */}
        <section style={{
          position: 'sticky',
          bottom: '4.5rem',
          background: 'rgba(6, 10, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.75rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.6rem' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your coach anything..."
              className="input-field"
              style={{ flex: 1, borderRadius: '14px', fontSize: '0.9rem' }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="btn-primary"
              style={{
                borderRadius: '14px',
                padding: '0.75rem 1.25rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !inputValue.trim() ? 0.6 : 1
              }}
            >
              ↑
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
