'use client';

import React, { useState, useRef, useEffect } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Send, Bot, User, ArrowRight } from 'lucide-react';
import { getUserProfile } from '@/lib/userProfile';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
}

export default function CoachPage() {
  const profile = getUserProfile();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'coach',
      text: `Good morning ${profile.name.split(' ')[0] || 'Prashant'}! You're on Day 17 of ${profile.duration} with an 8-day streak and 82% consistency. Your body habits (cold shower, workout) are rock-solid. Let's make sure you protect your 90-minute deep work window today. How are your energy levels right now?`,
      time: '09:00 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'How do I defeat afternoon slump?',
    'Review my 7-day consistency',
    'I feel low motivation today',
    'Give me a discipline reminder',
    'How do I protect deep work focus?',
    'Advice for cold showers in winter',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate intelligent coach reply
    setTimeout(() => {
      let replyText = `Remember ${profile.name.split(' ')[0] || 'Prashant'}: action creates motivation, not the other way around. Step into the arena, execute the first 5 minutes, and momentum will take over.`;
      const lower = text.toLowerCase();
      if (lower.includes('afternoon') || lower.includes('slump')) {
        replyText = "For afternoon brain fog: 1) Drink 500ml cold water with a pinch of sea salt. 2) Take a brisk 7-minute walk outside in natural sunlight. 3) Keep lunch low-carb before deep work. You've got this!";
      } else if (lower.includes('review') || lower.includes('consistency')) {
        replyText = "Your 7-day average is 85.7%, which puts you in the top 5% of all Winter Arc practitioners. Your only slight vulnerability is Wednesday afternoon focus. Guard that slot strictly.";
      } else if (lower.includes('deep work') || lower.includes('focus')) {
        replyText = "Put your phone in another room or switch to Do Not Disturb. Use our 'Lock In' timer for 45 or 90 minutes. Remember: single-tasking builds elite mental muscle.";
      } else if (lower.includes('cold shower')) {
        replyText = "The cold shower isn't about the temperature — it's about the conscious decision to do the hard thing when your brain begs for comfort. Step in without hesitating for 3 seconds.";
      }

      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              INTELLIGENT PERFORMANCE COUNSEL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              AI Arc Coach
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Real-time accountability, discipline psychology, and protocol fine-tuning.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0085FF] text-xs font-bold border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Coach Online</span>
            </div>
          </div>
        </header>

        {/* ── RESPONSIVE GRID (lg:grid-cols-12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* ── MAIN CHAT AREA (lg:col-span-8) ── */}
          <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-[680px] arc-card bg-white border border-[#E8EEF5] overflow-hidden shadow-sm">
            {/* Top Coach Subheader */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-[#0085FF]">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#0A192F]">Marcus · Winter Arc AI</h3>
                  <p className="text-[10px] text-[#64748B]">Trained on high-performance discipline protocols</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Active Protocol
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isCoach = m.sender === 'coach';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isCoach ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isCoach
                          ? 'bg-blue-100 text-[#0085FF]'
                          : 'bg-orange-100 text-[#FF7A00]'
                      }`}
                    >
                      {isCoach ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[82%] sm:max-w-[70%] space-y-1`}>
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isCoach
                            ? 'bg-slate-50 text-[#1E293B] border border-slate-200/70 rounded-tl-sm'
                            : 'bg-gradient-to-r from-[#0085FF] to-[#7B61FF] text-white rounded-tr-sm shadow-sm'
                        }`}
                      >
                        {m.text}
                      </div>
                      <div
                        className={`text-[9px] text-[#94A3B8] font-semibold px-1 ${
                          isCoach ? 'text-left' : 'text-right'
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#64748B] p-2 bg-slate-50 rounded-2xl w-fit border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-[#0085FF] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#7B61FF] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#FF7A00] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold ml-1">Marcus is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Box */}
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask for advice, discipline reminders, habit strategies..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0085FF] bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-sunset px-4 sm:px-6 py-3 rounded-2xl text-xs font-bold disabled:opacity-40 shadow-sm shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN: COACH DECK & QUICK PROMPTS (lg:col-span-4) ── */}
          <div className="lg:col-span-4 space-y-5">
            {/* User State Snapshot */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                CHALLENGE STATUS
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#64748B]">Arc Execution</div>
                  <div className="text-xl font-black font-display text-[#0A192F]">
                    Day 17 / {profile.duration}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#64748B]">Streak</div>
                  <div className="text-xl font-black font-display text-[#FF7A00]">8 Days 🔥</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-[#0085FF] font-semibold">
                Target: Lock in 90 min deep work before 5:00 PM.
              </div>
            </div>

            {/* Quick Prompts Deck */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A192F] mb-3">
                Suggested Guidance Prompts
              </h4>
              <div className="space-y-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-200 text-xs font-semibold text-[#475569] hover:text-[#0085FF] transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#0085FF]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Philosophy Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-100 text-center">
              <span className="font-handwriting text-xl text-[#0085FF] block">
                The standard is excellence
              </span>
              <p className="text-[10px] text-[#64748B] font-semibold mt-1">
                Your AI coach adapts to your daily logging pattern and accountability logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
