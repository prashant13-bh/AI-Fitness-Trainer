'use client';

import React, { useState, useEffect } from 'react';
import { Check, ShoppingBag, Share2, RotateCcw, Sparkles, Shield, Copy, ExternalLink } from 'lucide-react';
import { soundEffects } from '@/lib/feedbackAudio';

interface GroceryItem {
  id: string;
  name: string;
  kannada: string;
  qty1Week: string;
  qty2Weeks: string;
  purpose: string;
  category: 'staples' | 'dairy' | 'veggies' | 'skincare';
}

const GROCERY_ITEMS: GroceryItem[] = [
  // Staples
  { id: 'jowar', name: 'Jowar Flour (Sorghum)', kannada: 'Jolada Hittu', qty1Week: '3.5 kg', qty2Weeks: '7 kg', purpose: 'Daily Jolada Rotti (11g protein/100g, gluten-free)', category: 'staples' },
  { id: 'shenga', name: 'Peanuts / Groundnuts', kannada: 'Shenga / Kadlekayi', qty1Week: '1.5 kg', qty2Weeks: '3 kg', purpose: 'Shengdana chutney (26g protein/100g), pre-workout fuel', category: 'staples' },
  { id: 'moong', name: 'Whole Green Moong', kannada: 'Hesaru Kalu', qty1Week: '1.2 kg', qty2Weeks: '2.5 kg', purpose: 'Daily sprouted Kosambari & Molake Usli (24g protein)', category: 'staples' },
  { id: 'kadle', name: 'Black Chickpeas (Kala Chana)', kannada: 'Kadle / Chana', qty1Week: '1 kg', qty2Weeks: '2 kg', purpose: 'Kadle Usli & Kadle Saaru for high fiber & protein (19g)', category: 'staples' },
  { id: 'toor', name: 'Toor Dal (Pigeon Peas)', kannada: 'Togari Bele', qty1Week: '1 kg', qty2Weeks: '2 kg', purpose: 'Daily Dal pairing with Jowar Roti for complete amino acid profile', category: 'staples' },
  { id: 'soya', name: 'Soya Chunks (Nutrela / Fortune)', kannada: 'Soya Chunks', qty1Week: '500 g', qty2Weeks: '1 kg', purpose: 'High-protein booster (52g protein/100g)', category: 'staples' },
  { id: 'hurigadale', name: 'Roasted Gram (Pappu)', kannada: 'Hurigadale / Putani', qty1Week: '500 g', qty2Weeks: '1 kg', purpose: 'Chutney powder & fast crunch snack', category: 'staples' },
  { id: 'oil', name: 'Cold-Pressed Groundnut Oil', kannada: 'Shenga Enne', qty1Week: '1 L', qty2Weeks: '2 L', purpose: 'Traditional anti-inflammatory cooking fat', category: 'staples' },

  // Dairy & Fresh
  { id: 'paneer', name: 'Fresh Low-Fat Paneer', kannada: 'Paneer', qty1Week: '1.4 kg (200g/day)', qty2Weeks: '2.8 kg', purpose: '36g daily casein protein for overnight muscle repair', category: 'dairy' },
  { id: 'curd', name: 'Fresh Dahi / Curd', kannada: 'Mosaru', qty1Week: '3.5 L (500ml/day)', qty2Weeks: '7 L', purpose: 'Probiotic gut health, Curd Rice & Taak base', category: 'dairy' },
  { id: 'taak', name: 'Jeera & Rock Salt (for Buttermilk)', kannada: 'Jeerige & Saindhava Uppu', qty1Week: '1 packet', qty2Weeks: '1 packet', purpose: 'Electrolyte hydration & digestive fire flush', category: 'dairy' },

  // Veggies & Greens
  { id: 'brinjal', name: 'Small Round Brinjal', kannada: 'Ennegayi Badanekayi', qty1Week: '1 kg', qty2Weeks: '2 kg', purpose: 'Authentic stuffed Ennegayi curry', category: 'veggies' },
  { id: 'carrots', name: 'Fresh Carrots', kannada: 'Gajjari / Carrot', qty1Week: '1 kg', qty2Weeks: '2 kg', purpose: 'Beta-carotene for skin glow in sprouted salads', category: 'veggies' },
  { id: 'coriander', name: 'Fresh Coriander & Curry Leaves', kannada: 'Kothambari & Karibevu', qty1Week: '2 bunches each', qty2Weeks: '4 bunches', purpose: 'Flavonoids & micronutrients for liver detox', category: 'veggies' },
  { id: 'lemons', name: 'Fresh Lemons', kannada: 'Nimbekayi', qty1Week: '8–10 pcs', qty2Weeks: '16–20 pcs', purpose: 'Vitamin C for non-heme iron absorption in sprouts', category: 'veggies' },
  { id: 'ginger_garlic', name: 'Ginger & Garlic', kannada: 'Shunti & Bellulli', qty1Week: '250 g each', qty2Weeks: '500 g each', purpose: 'Anti-inflammatory allicin & digestive support', category: 'veggies' },

  // Skincare Actives
  { id: 'ceramide', name: 'Ceramide Barrier Repair Cream', kannada: 'Skin Barrier Cream', qty1Week: '1 Tube (50g)', qty2Weeks: '1 Tube (50g)', purpose: 'Critical Betnovate-N lipid barrier restoration', category: 'skincare' },
  { id: 'azelaic', name: '10% Azelaic Acid Suspension', kannada: 'Azelaic Acid 10%', qty1Week: '1 Bottle (30ml)', qty2Weeks: '1 Bottle (30ml)', purpose: 'Suppresses tyrosinase, fades steroid hyperpigmentation', category: 'skincare' },
  { id: 'niacinamide', name: '5% Niacinamide Serum', kannada: 'Niacinamide 5%', qty1Week: '1 Bottle (30ml)', qty2Weeks: '1 Bottle (30ml)', purpose: 'Strengthens epidermal barrier & fades redness', category: 'skincare' },
  { id: 'spf', name: 'SPF 50+ PA++++ Sunscreen (UV Doux)', kannada: 'Sunscreen SPF 50+', qty1Week: '1 Tube (50g)', qty2Weeks: '2 Tubes', purpose: 'NON-NEGOTIABLE shield against UV rebound darkening', category: 'skincare' },
  { id: 'rosehip', name: 'Cold-Pressed Rosehip Seed Oil', kannada: 'Rosehip Oil', qty1Week: '1 Bottle (30ml)', qty2Weeks: '1 Bottle (30ml)', purpose: 'Night lipid lock, cellular turnover & scar healing', category: 'skincare' },
];

export default function KiranaShoppingList() {
  const [durationWeeks, setDurationWeeks] = useState<1 | 2>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Load checked items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bruce_kirana_checklist');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleItem = (id: string) => {
    soundEffects.playTick();
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('bruce_kirana_checklist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleReset = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('bruce_kirana_checklist');
    } catch {}
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = GROCERY_ITEMS.length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);

  // Generate WhatsApp formatted text
  const generateShareText = () => {
    let text = `🛒 *BRUCE'S NORTH KARNATAKA VEG & SKIN SUPPLY LIST (${durationWeeks} WEEK)*\n`;
    text += `Target: 140g Pure Veg Protein · 70kg→63kg Recomp · Skin Healing\n`;
    text += `----------------------------------------\n\n`;

    const categories = [
      { key: 'staples', title: '🌾 STAPLES & PROTEIN' },
      { key: 'dairy', title: '🥛 DAIRY & BUTTERMILK' },
      { key: 'veggies', title: '🥬 VEGETABLES & AROMATICS' },
      { key: 'skincare', title: '🧴 SKINCARE PROTOCOL' },
    ];

    categories.forEach((cat) => {
      text += `*${cat.title}:*\n`;
      GROCERY_ITEMS.filter((i) => i.category === cat.key).forEach((item) => {
        const qty = durationWeeks === 1 ? item.qty1Week : item.qty2Weeks;
        const check = checkedItems[item.id] ? '✅' : '⬜';
        text += `${check} ${item.name} (${item.kannada}) — *${qty}*\n`;
      });
      text += `\n`;
    });

    text += `_Generated from Bruce Glow-Up 2027 Winter Arc Engine_`;
    return text;
  };

  const handleWhatsAppShare = () => {
    const text = generateShareText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCategory = (
    title: string,
    catKey: 'staples' | 'dairy' | 'veggies' | 'skincare',
    emoji: string,
    color: string
  ) => {
    const items = GROCERY_ITEMS.filter((i) => i.category === catKey);
    const catChecked = items.filter((i) => checkedItems[i.id]).length;

    return (
      <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-[#0A192F]">{title}</h3>
              <p className="text-[9px] text-[#64748B]">North Karnataka pure vegetarian essentials</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
            {catChecked}/{items.length} bought
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const isDone = !!checkedItems[item.id];
            const qty = durationWeeks === 1 ? item.qty1Week : item.qty2Weeks;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-[#E8EEF5] hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  aria-label={`Mark ${item.name} as purchased`}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <p className={`text-xs font-black ${isDone ? 'line-through text-slate-400' : 'text-[#0A192F]'}`}>
                      {item.name}
                    </p>
                    <span className="text-xs font-black text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-md">
                      {qty}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#FF7A00] font-bold mt-0.5">{item.kannada}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.purpose}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="rounded-3xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 50%, #065F46 100%)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              BRUCE · NORTH KARNATAKA KIRANA SUPPLY
            </span>
            <h2 className="text-2xl font-black font-display tracking-tight mt-0.5">
              Weekly Grocery Generator
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              Exact items & quantities needed to hit 140g protein daily without meat or eggs.
            </p>
          </div>

          {/* 1-Week vs 2-Week Toggle */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl self-start sm:self-auto border border-white/15">
            <button
              onClick={() => setDurationWeeks(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                durationWeeks === 1 ? 'bg-white text-[#0A192F] shadow-sm' : 'text-white/70'
              }`}
            >
              1 Week Supply
            </button>
            <button
              onClick={() => setDurationWeeks(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                durationWeeks === 2 ? 'bg-white text-[#0A192F] shadow-sm' : 'text-white/70'
              }`}
            >
              2 Weeks Supply
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-white/80">Shopping Completion</span>
            <span className="font-black text-emerald-400">
              {checkedCount} / {totalCount} items bought ({progressPct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#0085FF] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 min-w-[150px] py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Send to WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy List'}</span>
          </button>

          {checkedCount > 0 && (
            <button
              onClick={handleReset}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 text-xs font-bold flex items-center gap-1 transition"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Grocery Categories */}
      {renderCategory('Pantry & High-Protein Grains', 'staples', '🌾', '#0085FF')}
      {renderCategory('Fresh Dairy & Buttermilk', 'dairy', '🥛', '#10B981')}
      {renderCategory('Fresh Vegetables & Aromatics', 'veggies', '🥬', '#FF7A00')}
      {renderCategory('Dermatology & Skin Restock (Betnovate Recovery)', 'skincare', '🧴', '#A855F7')}
    </div>
  );
}
