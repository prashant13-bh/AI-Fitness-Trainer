'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Send, Bot, User, ArrowRight, Volume2, Sparkles, Dumbbell, Apple, ShieldAlert, Zap, Mic, MicOff, Square } from 'lucide-react';
import { getCoachResponse } from '@/lib/coachEngine';
import { soundEffects } from '@/lib/feedbackAudio';
import { getRealArcDayInfo, formatLiveTime } from '@/lib/realTimeSync';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
  category?: string;
}

export default function CoachPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const arcDayInfo = useMemo(() => getRealArcDayInfo(), []);
  const currentArcDay = arcDayInfo.currentDay;

  const [activeCategory, setActiveCategory] = useState<'all' | 'gym' | 'nutrition' | 'skin' | 'mindset'>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'coach',
      text: `Welcome, Bruce! 🔥 (Winter Arc Day ${currentArcDay})\n\nI am your Personal Senior AI Coach — combining your Gym Trainer, North Karnataka Vegetarian Nutritionist, Dermatological Skin Healer, and Senior Developer accountability partner.\n\nWe are targeting 63kg lean athletic muscle, reversing Betnovate-N hyperpigmentation, and locking in your 5:30 AM discipline. What do you need guidance on right now?`,
      time: 'Live',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Hands-free Voice Input (Speech-to-Text)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English accent optimized

        recognition.onstart = () => {
          setIsListening(true);
          soundEffects.playTick();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInputText(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.debug('[SpeechRecognition error]:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          soundEffects.playTick();
        };

        recognitionRef.current = recognition;
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.debug('Failed to start speech recognition:', err);
      }
    }
  };


  const categoryPrompts: Record<string, string[]> = {
    all: [
      '🥗 Recommend my NK veg dinner tonight',
      '🧴 Soothe Betnovate-N burning & redness',
      '💪 Skinny-fat fix: cut to 63kg with muscle',
      '🌾 Can I eat Jowar Roti every day on a cut?',
      '⏰ 5:30 AM discipline reminder',
      '🔥 Motivation: 92kg down to 63kg',
    ],
    gym: [
      '💪 Push Day: Chest, Shoulders, Triceps breakdown',
      '🔥 Pull Day: Lat Pulldowns & V-Taper form',
      '⚡ Leg Day: Heavy Squats & RDL cues',
      '⚔️ Skinny-fat recomp strategy',
    ],
    nutrition: [
      '🥗 Tonight\'s high protein NK vegetarian dinner',
      '🍛 Perfect Jowar Bhakri & Sprouts lunch macros',
      '💪 How to hit 140g pure veg protein',
      '💧 Taak (buttermilk) & electrolyte timing',
    ],
    skin: [
      '🧴 Betnovate-N steroid withdrawal recovery steps',
      '✨ How Azelaic Acid fades dark spots',
      '🧊 Ice therapy & barrier restoration tips',
      '☀️ Sunscreen rules: why SPF 50+ is mandatory',
    ],
    mindset: [
      '👑 92kg to 70kg proof: why I will conquer 2027',
      '⏰ How to jump out of bed at 5:30 AM without snooze',
      '🧘 Deep work focus & Senior Dev mental models',
    ],
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakMessage = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for smoother speech
    const cleanText = text.replace(/[*#_•`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
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

    const replyText = await getCoachResponse(text, {
      currentDay: currentArcDay,
      streak: currentArcDay,
      mode: activeCategory,
    });

    setTimeout(() => {
      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                BRUCE 2027 PERFORMANCE AI
              </span>
              <span className="text-[10px] bg-orange-100 text-[#FF7A00] font-black px-2 py-0.5 rounded-full">
                Winter Arc
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Bruce's AI Coach & Mentor
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Senior Dev · Gym Trainer · NK Veg Nutritionist · Betnovate-N Skin Specialist
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Coach Online · Day {currentArcDay}</span>
            </div>
          </div>
        </header>

        {/* ── TOPIC PILLS ── */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: '🌟 All Guidance', icon: Sparkles },
            { id: 'gym', label: '🏋️ Gym & Recomp', icon: Dumbbell },
            { id: 'nutrition', label: '🥗 NK Veg Diet', icon: Apple },
            { id: 'skin', label: '✨ Skin Healing', icon: ShieldAlert },
            { id: 'mindset', label: '⚡ 5:30 AM Discipline', icon: Zap },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#0085FF] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ── RESPONSIVE GRID (lg:grid-cols-12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* ── MAIN CHAT AREA (lg:col-span-8) ── */}
          <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-[680px] arc-card bg-white border border-[#E8EEF5] overflow-hidden shadow-sm">
            {/* Top Coach Subheader */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-[#0085FF] font-black">
                    ⚡
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#0A192F]">Bruce AI Head Coach</h3>
                  <p className="text-[10px] text-[#64748B]">Personalized to 167cm · 70kg → 63kg · NK Veg · Barrier Repair</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Active Winter Arc
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

                    <div className={`max-w-[85%] sm:max-w-[76%] space-y-1`}>
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          isCoach
                            ? 'bg-slate-50 text-[#1E293B] border border-slate-200/80 rounded-tl-sm'
                            : 'bg-gradient-to-r from-[#0085FF] to-[#7B61FF] text-white rounded-tr-sm shadow-sm'
                        }`}
                      >
                        {m.text}
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <span className="text-[9px] text-[#94A3B8] font-semibold">
                          {m.time}
                        </span>
                        {isCoach && (
                          <button
                            onClick={() => speakMessage(m.id, m.text)}
                            title="Listen to response"
                            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                              speakingId === m.id
                                ? 'bg-orange-100 text-[#FF7A00] animate-pulse'
                                : 'text-slate-400 hover:text-[#0085FF] hover:bg-blue-50'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{speakingId === m.id ? 'Playing...' : 'Listen'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#64748B] p-2.5 bg-slate-50 rounded-2xl w-fit border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-[#0085FF] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#7B61FF] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#FF7A00] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold ml-1">Coach is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Box */}
            <div className="border-t border-slate-100 bg-white">
              {/* Hands-Free Listening Banner */}
              {isListening && (
                <div className="px-4 py-2 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100 flex items-center justify-between text-xs text-rose-700 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-bold text-[11px]">🎙️ Listening... Speak naturally to your AI Coach, Bruce</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg hover:bg-rose-200"
                  >
                    Done Speaking
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice, Bruce...'
                      : 'Ask workouts, NK veg meals, skin healing...'
                  }
                  className={`flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all ${
                    isListening
                      ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-200'
                      : 'border-slate-200 bg-slate-50/50 focus:border-[#0085FF]'
                  }`}
                />

                {/* Microphone Speech-to-Text Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 sm:p-3 rounded-2xl transition shrink-0 flex items-center justify-center ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse ring-2 ring-rose-300'
                        : 'bg-slate-100 text-[#64748B] hover:text-[#0085FF] hover:bg-blue-50 border border-slate-200'
                    }`}
                    title={isListening ? 'Stop listening' : 'Speak to AI Coach (Hands-free)'}
                    aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
                  >
                    {isListening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-sunset px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs font-bold disabled:opacity-40 shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN: BRUCE DECK & TACTICAL PROMPTS (lg:col-span-4) ── */}
          <div className="lg:col-span-4 space-y-4">
            {/* Bruce Profile Snapshot */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                BRUCE ATHLETE SPECIFICATION
              </span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Current → Target</span>
                  <span className="text-sm font-black text-[#0A192F]">70kg → 63kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Height & Frame</span>
                  <span className="text-sm font-black text-[#0A192F]">167 cm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Diet Blueprint</span>
                  <span className="text-sm font-black text-[#10B981]">North Karnataka Veg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Skin Protocol</span>
                  <span className="text-sm font-black text-[#FF7A00]">Barrier & PIH Cure</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#FF7A00] font-bold">
                🔥 92kg → 70kg already done! Only 7kg fat to Greek God physique.
              </div>
            </div>

            {/* Quick Prompts Deck */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A192F] mb-3">
                Suggested Guidance Prompts
              </h4>
              <div className="space-y-2">
                {(categoryPrompts[activeCategory] || categoryPrompts.all).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-200 text-xs font-semibold text-[#475569] hover:text-[#0085FF] transition-all flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#0085FF] shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Philosophy Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-100 text-center">
              <span className="font-handwriting text-xl text-[#0085FF] block">
                Discipline = Freedom
              </span>
              <p className="text-[10px] text-[#64748B] font-semibold mt-1">
                Your AI Coach is ready 24/7 for workouts, skin healing, meals, and mindset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
