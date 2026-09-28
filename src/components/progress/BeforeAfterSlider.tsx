'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Sliders, Columns, Camera, ChevronRight, Eye } from 'lucide-react';

export interface PhotoItem {
  type: string;
  dataUrl: string;
  caption: string;
  timestamp: string;
  day: number;
  date: string;
}

interface BeforeAfterSliderProps {
  photos: PhotoItem[];
}

export default function BeforeAfterSlider({ photos }: BeforeAfterSliderProps) {
  const [category, setCategory] = useState<'all' | 'body' | 'face' | 'skin'>('body');
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter photos by selected category
  const filteredPhotos = photos.filter(p => category === 'all' || p.type === category);

  // Default Before = earliest photo; After = latest photo
  const [beforeIdx, setBeforeIdx] = useState<number>(0);
  const [afterIdx, setAfterIdx] = useState<number>(Math.max(0, filteredPhotos.length - 1));

  // Sync indices when filter changes
  useEffect(() => {
    if (filteredPhotos.length >= 2) {
      setBeforeIdx(0);
      setAfterIdx(filteredPhotos.length - 1);
    }
  }, [category, filteredPhotos.length]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  // Demo transformation cards when < 2 user photos exist
  const DEMO_TRANSFORMATIONS = [
    {
      title: 'Physique Recomposition (70kg → 63kg)',
      category: 'body',
      before: {
        tag: 'DAY 1 · START',
        weight: '70.0 kg',
        bf: '~22% Body Fat',
        metrics: 'Skinny-Fat, High Cortisol, Inconsistent Lift',
        bg: 'from-amber-900/60 to-slate-900',
        badge: 'Baseline',
      },
      after: {
        tag: 'TARGET · 2027',
        weight: '63.0 kg',
        bf: '10–12% Greek God',
        metrics: 'Sculpted V-Taper, 140g NK Veg Muscle, Defined Abs',
        bg: 'from-emerald-900/60 to-slate-900',
        badge: 'Greek God',
      },
    },
    {
      title: 'Steroid Withdrawal Skin Healing',
      category: 'skin',
      before: {
        tag: 'DAY 1 · WITHDRAWAL',
        weight: 'Steroid Rebound',
        bf: 'Barrier Damaged',
        metrics: 'Hyperpigmentation, Flaking, Betnovate-N Trauma',
        bg: 'from-rose-950/70 to-slate-900',
        badge: 'Rebound Phase',
      },
      after: {
        tag: 'DAY 90+ · HEALED',
        weight: 'Ceramide Shield',
        bf: 'Melanin Suppressed',
        metrics: 'Azelaic 10% Clarified, Hydrated, Zero Corticosteroids',
        bg: 'from-cyan-950/70 to-slate-900',
        badge: 'Glass Skin',
      },
    },
  ];

  const hasPhotos = filteredPhotos.length >= 2;
  const beforePhoto = filteredPhotos[beforeIdx] || filteredPhotos[0];
  const afterPhoto = filteredPhotos[afterIdx] || filteredPhotos[filteredPhotos.length - 1];

  return (
    <div className="arc-card p-5 bg-white border border-[#E8EEF5] shadow-sm rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A00] to-[#0085FF] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0A192F] tracking-tight">Transformation Split View</h3>
            <p className="text-[10px] text-[#64748B] font-medium">Compare your Day 1 baseline with current evolution</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        {hasPhotos && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition ${
                viewMode === 'slider' ? 'bg-white text-[#0085FF] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              <Sliders className="w-3 h-3" /> Split
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition ${
                viewMode === 'side-by-side' ? 'bg-white text-[#0085FF] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              <Columns className="w-3 h-3" /> Side-by-Side
            </button>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'body', label: '💪 Body Physique' },
          { id: 'face', label: '✨ Face Evolution' },
          { id: 'skin', label: '🔬 Skin Healing' },
          { id: 'all', label: '📸 All Photos' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id as 'all' | 'body' | 'face' | 'skin')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex-shrink-0 ${
              category === c.id
                ? 'bg-[#0A192F] text-white shadow-sm'
                : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Comparison Area */}
      {hasPhotos && beforePhoto && afterPhoto ? (
        <div className="space-y-3">
          {/* Photo selectors */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black text-[#FF7A00] uppercase block">Before Photo</span>
              <select
                aria-label="Select Before Photo"
                value={beforeIdx}
                onChange={(e) => setBeforeIdx(Number(e.target.value))}
                className="w-full text-xs font-bold bg-transparent text-[#0A192F] focus:outline-none cursor-pointer mt-0.5"
              >
                {filteredPhotos.map((p, idx) => (
                  <option key={idx} value={idx}>
                    Day {p.day} ({p.date}) — {p.caption || p.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black text-[#10B981] uppercase block">After Photo</span>
              <select
                aria-label="Select After Photo"
                value={afterIdx}
                onChange={(e) => setAfterIdx(Number(e.target.value))}
                className="w-full text-xs font-bold bg-transparent text-[#0A192F] focus:outline-none cursor-pointer mt-0.5"
              >
                {filteredPhotos.map((p, idx) => (
                  <option key={idx} value={idx}>
                    Day {p.day} ({p.date}) — {p.caption || p.type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Split Slider View */}
          {viewMode === 'slider' ? (
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[500px] rounded-2xl overflow-hidden shadow-inner bg-slate-900 cursor-ew-resize select-none border border-slate-200 touch-pan-y"
            >
              {/* AFTER IMAGE (Bottom Layer) */}
              <img
                src={afterPhoto.dataUrl}
                alt={`Day ${afterPhoto.day} After`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10">
                AFTER · Day {afterPhoto.day}
              </div>

              {/* BEFORE IMAGE (Top Layer with Clip Path) */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <img
                  src={beforePhoto.dataUrl}
                  alt={`Day ${beforePhoto.day} Before`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute top-3 left-3 bg-[#FF7A00]/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10 pointer-events-none"
                style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
              >
                BEFORE · Day {beforePhoto.day}
              </div>

              {/* SLIDER DIVIDER LINE */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Central Handle */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#0A192F] shadow-2xl flex items-center justify-center border-2 border-[#0085FF] font-black text-xs">
                  ‹ ›
                </div>
              </div>
            </div>
          ) : (
            /* SIDE-BY-SIDE VIEW */
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={beforePhoto.dataUrl}
                  alt={`Day ${beforePhoto.day} Before`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                  DAY {beforePhoto.day}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                  <p className="text-[10px] font-bold truncate">{beforePhoto.caption || 'Before baseline'}</p>
                  <p className="text-[8px] text-white/70">{beforePhoto.date}</p>
                </div>
              </div>

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={afterPhoto.dataUrl}
                  alt={`Day ${afterPhoto.day} After`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                  DAY {afterPhoto.day}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                  <p className="text-[10px] font-bold truncate">{afterPhoto.caption || 'Current progress'}</p>
                  <p className="text-[8px] text-white/70">{afterPhoto.date}</p>
                </div>
              </div>
            </div>
          )}

          {/* Slider instruction */}
          {viewMode === 'slider' && (
            <p className="text-center text-[10px] font-semibold text-[#64748B]">
              👈 Drag slider left and right to reveal transformation 👉
            </p>
          )}
        </div>
      ) : (
        /* DEMO MODE WHEN FEWER THAN 2 PHOTOS LOGGED */
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3">
            <span className="text-xl">📸</span>
            <div>
              <p className="text-xs font-black text-[#0A192F]">Visual Proof Vault Active</p>
              <p className="text-[11px] text-[#475569] mt-0.5 leading-relaxed">
                Log at least 2 photos (e.g. Day 1 and Day 7) in the <strong>Arc Day</strong> tab to activate real-time photo splitting. Here is your roadmap projection:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEMO_TRANSFORMATIONS.map((demo, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-4 bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#FF7A00] uppercase tracking-wider">{demo.title}</span>
                  <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/70 font-bold">Projection</span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2">
                  {/* Before */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] font-black text-amber-400 block">{demo.before.tag}</span>
                    <p className="text-xs sm:text-sm font-black text-white mt-1">{demo.before.weight}</p>
                    <p className="text-[10px] text-white/60 font-medium">{demo.before.bf}</p>
                    <p className="text-[9px] text-white/40 mt-1.5 leading-snug line-clamp-2">{demo.before.metrics}</p>
                  </div>

                  {/* After */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[9px] font-black text-emerald-400 block">{demo.after.tag}</span>
                    <p className="text-xs sm:text-sm font-black text-white mt-1">{demo.after.weight}</p>
                    <p className="text-[10px] text-emerald-300 font-medium">{demo.after.bf}</p>
                    <p className="text-[9px] text-white/60 mt-1.5 leading-snug line-clamp-2">{demo.after.metrics}</p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                  <span>Transformation target</span>
                  <span className="text-emerald-400 font-bold">457-Day Protocol</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <a
              href="/arc"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0085FF] to-[#7B61FF] text-white text-xs font-black shadow-md hover:opacity-95 transition"
            >
              <Camera className="w-3.5 h-3.5" />
              Upload Day 1 Baseline Photos in Arc Day →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
