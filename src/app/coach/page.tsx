'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { Send, Bot, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'coach',
      text: "Good morning Prashant! You're on Day 17 of 90 with an 8-day streak and 82% consistency. Your body habits (cold shower, workout) are rock-solid. Let's make sure you protect your 90-minute deep work window today. How are your energy levels right now?",
      time: '9:00 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'How do I defeat afternoon slump?',
    'Review my 7-day consistency',
    'I feel low motivation today',
    'Give me a discipline reminder',
  ];

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

    // Simulate smart AI coach reply
    setTimeout(() => {
      let replyText = "Remember Prashant: action creates motivation, not the other way around. Step into the arena, execute the first 5 minutes, and momentum will take over.";
      if (text.includes('afternoon') || text.includes('slump')) {
        replyText = "For afternoon brain fog: 1) Drink 500ml cold water with a pinch of salt. 2) Take a brisk 7-minute walk outside in sunlight. 3) Avoid high carb meals before deep work. You've got this!";
      } else if (text.includes('Review') || text.includes('consistency')) {
        replyText = "Your 7-day average is 85.7%, which puts you in the top 5% of all Winter Arc practitioners. Your only vulnerability is Wednesday mid-day focus. Guard that time strictly.";
      }

      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col justify-between select-none">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col px-4 pt-4 pb-36">
        {/* ── HEADER ── */}
        <header className="pt-2 pb-3 border-b border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#0085FF]">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-black font-display text-[#0A192F]">
                  AI Winter Arc Coach
                </h1>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active · Day 17 Context Loaded</span>
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0085FF] text-[10px] font-black">
              8D Streak
            </div>
          </div>
        </header>

        {/* ── CHAT MESSAGES ── */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0085FF] text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-[#0A192F] border border-[#E8EEF5] rounded-tl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#94A3B8] font-semibold mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-[#E8EEF5] px-3.5 py-2 rounded-2xl w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0085FF] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* ── QUICK PROMPT CHIPS ── */}
        <div className="flex gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-[#E8EEF5] text-[10px] font-bold text-[#475569] hover:border-[#0085FF] hover:text-[#0085FF] transition-colors shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── INPUT BAR ── */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white border border-[#E8EEF5] rounded-full p-1.5 shadow-md"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your coach anything about your Arc..."
              className="flex-1 bg-transparent px-4 text-xs text-[#0A192F] focus:outline-none placeholder:text-[#94A3B8]"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full btn-sunset flex items-center justify-center text-white shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
