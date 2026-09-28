'use client';

import React, { useState, useCallback } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Check, ChevronDown, ChevronUp, Flame, Star, Zap } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Meal {
  name: string;         // Kannada/local name
  english: string;      // English description
  items: string[];
  protein: number;      // grams
  kcal: number;
  proteinFoods: string; // what gives protein
  tip: string;
  emoji: string;
}

interface DayPlan {
  day: string;
  dayShort: string;
  workout: string;
  workoutIntensity: 'MAX' | 'HIGH' | 'MOD' | 'LOW';
  preworkout: string;
  breakfast: Meal;
  midMorning: Meal;
  lunch: Meal;
  afternoonSnack: Meal;
  dinner: Meal;
  bedtime: Meal;
  totalProtein: number;
  totalKcal: number;
  specialNote: string;
}

interface IngredientInfo {
  name: string;
  localName: string;
  protein: string;
  per: string;
  benefit: string;
  emoji: string;
  category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'dairy' | 'spice';
}

// ─────────────────────────────────────────────────────────────
// NK SUPERFOODS FOR BRUCE
// ─────────────────────────────────────────────────────────────
const NK_PROTEIN_SOURCES: IngredientInfo[] = [
  { name: 'Peanuts', localName: 'Shenga / Kadlekayi', protein: '26g', per: '100g', benefit: 'Best NK protein source. Cheap, available everywhere, healthy fats + protein.', emoji: '🥜', category: 'protein' },
  { name: 'Moong Dal', localName: 'Hesaru Bele', protein: '24g', per: '100g (dry)', benefit: 'Most digestible dal. High protein, easy on gut. Use sprouted for 30% more nutrition.', emoji: '🫘', category: 'protein' },
  { name: 'Chana Dal', localName: 'Kadale Bele', protein: '22g', per: '100g (dry)', benefit: 'NK staple. Ambode, dal, kosambari — all high protein. Low glycemic index.', emoji: '🫘', category: 'protein' },
  { name: 'Toor Dal', localName: 'Togari Bele', protein: '22g', per: '100g (dry)', benefit: 'Daily NK dal. Rich in lysine. Pair with jowar roti for complete amino acid profile.', emoji: '🫘', category: 'protein' },
  { name: 'Black Chickpeas', localName: 'Kadle / Kala Chana', protein: '19g', per: '100g (cooked)', benefit: 'NK warrior food. Sprout overnight for 40% more protein bioavailability.', emoji: '⚫', category: 'protein' },
  { name: 'Paneer', localName: 'Paneer / Chenna', protein: '18g', per: '100g', benefit: 'Slow-digesting casein protein. Best before sleep for muscle repair. Make at home.', emoji: '🧀', category: 'dairy' },
  { name: 'Curd / Yoghurt', localName: 'Mosaru', protein: '11g', per: '200ml', benefit: 'NK gut health + protein. Probiotics = better skin absorption of nutrients.', emoji: '🥛', category: 'dairy' },
  { name: 'Ragi / Finger Millet', localName: 'Ragi / Nachni', protein: '7g', per: '100g', benefit: 'NK superfood! Highest calcium of all grains. Skin collagen support. Ragi mudde is gold.', emoji: '🌾', category: 'carb' },
  { name: 'Jowar', localName: 'Jola / Jolada', protein: '11g', per: '100g', benefit: 'NK staple grain. Jolada rotti = your main carb source. Gluten-free, fills you for 5+ hrs.', emoji: '🌾', category: 'carb' },
  { name: 'Sprouted Moong', localName: 'Molake Hesaru', protein: '4g', per: '100g (sprouted)', benefit: 'Raw protein + live enzymes = skin glow food. Eat daily as salad.', emoji: '🌱', category: 'protein' },
  { name: 'Buttermilk', localName: 'Majjige / Taak', protein: '3g', per: '200ml', benefit: 'NK gut tonic. Probiotics reduce skin inflammation. Drink after lunch always.', emoji: '🥛', category: 'dairy' },
  { name: 'Groundnut Oil', localName: 'Shenga Enne', protein: '0g', per: '—', benefit: 'NK traditional cooking fat. Anti-inflammatory. Better than refined oils for skin.', emoji: '🫙', category: 'fat' },
];

// ─────────────────────────────────────────────────────────────
// 7-DAY NK VEGETARIAN MEAL PLAN FOR BRUCE
// ─────────────────────────────────────────────────────────────
const WEEKLY_PLAN: DayPlan[] = [
  // ── MONDAY: Push Day ───────────────────────────────────────
  {
    day: 'Monday',
    dayShort: 'MON',
    workout: 'Push — Chest + Shoulders + Triceps',
    workoutIntensity: 'HIGH',
    preworkout: '🍌 1 Banana + 10 Peanuts (Shenga) — 15 min before workout. Quick energy + protein.',
    breakfast: {
      name: 'Jolada Rotti + Enne + Shengdana Chutney',
      english: 'Jowar Flatbread + Ghee + Peanut Chutney',
      items: ['2 Jolada Rotti (jowar flour)', '1 tsp desi ghee', '3 tbsp Shengdana Chutney (roasted peanuts + coconut + garlic)', '1 cup Toor Dal (togari bele)', '1 cup Mosaru (curd)'],
      protein: 28, kcal: 480,
      proteinFoods: 'Shenga chutney (15g) + Dal (10g) + Mosaru (3g)',
      tip: 'Shengdana chutney is NK\'s hidden protein bomb — 3 tbsp = 15g protein. Make a big batch, keep in fridge for 5 days.',
      emoji: '🌾',
    },
    midMorning: {
      name: 'Molake Kosambari',
      english: 'Sprouted Moong + Carrot Salad',
      items: ['1 cup sprouted hesaru bele (moong)', '1 grated carrot', '1 tbsp lemon juice', '2 tbsp grated coconut', 'Salt, green chilli, coriander'],
      protein: 12, kcal: 180,
      proteinFoods: 'Sprouted moong — live enzymes + protein',
      tip: 'Soak moong overnight, sprout for 12 hrs. Vitamin C in lemon helps iron absorption. This is pure skin glow food.',
      emoji: '🌱',
    },
    lunch: {
      name: 'Ennegayi + Jolada Rotti + Mosaru Anna',
      english: 'Stuffed Brinjal Curry + Jowar Roti + Curd Rice',
      items: ['2 Jolada Rotti', 'Ennegayi (stuffed brinjal with shenga-coconut masala)', '1 cup Curd rice (mosaru anna)', '1 cup Majjige (buttermilk)'],
      protein: 22, kcal: 520,
      proteinFoods: 'Shenga stuffing in ennegayi (12g) + Mosaru (10g)',
      tip: 'Ennegayi masala = roasted peanuts + coconut + spices. Use groundnut oil for cooking. This is your BIGGEST meal — eat it fully.',
      emoji: '🍆',
    },
    afternoonSnack: {
      name: 'Hurigadale + Majjige',
      english: 'Roasted Chana + Buttermilk',
      items: ['50g hurigadale (roasted Bengal gram / futana)', '1 glass salted majjige (buttermilk)', '1 small banana'],
      protein: 14, kcal: 230,
      proteinFoods: 'Hurigadale (10g) + Majjige (4g)',
      tip: 'Hurigadale (futana/roasted chana) is NK\'s best gym snack. 100g = 22g protein, costs ₹20. Always carry in pocket.',
      emoji: '🫘',
    },
    dinner: {
      name: 'Sabsige Soppu Palya + Ragi Mudde',
      english: 'Dill Leaves Stir-fry + Finger Millet Ball',
      items: ['1 Ragi Mudde (250g ragi flour ball)', '2 cups Sabsige soppu palya (dill leaves with dal)', '1 cup Hesaru bele sambar', 'Raw onion + tomato salad'],
      protein: 20, kcal: 380,
      proteinFoods: 'Ragi (7g) + Dal in sambar (10g) + Palya dal (3g)',
      tip: 'Ragi Mudde is North Karnataka\'s BEST night food — no white rice, high fiber, keeps you full while sleeping. Eat with your hands!',
      emoji: '⚫',
    },
    bedtime: {
      name: 'Haldi Doodh',
      english: 'Turmeric Milk',
      items: ['200ml warm milk (or soy milk)', '1/2 tsp haldi (turmeric)', '1 pinch black pepper', '1 tsp honey (optional)'],
      protein: 7, kcal: 120,
      proteinFoods: 'Milk casein protein — slow digesting overnight',
      tip: 'Haldi has curcumin — reduces skin inflammation from Betnovate-N damage. Drink every night. Black pepper increases curcumin absorption 2000%.',
      emoji: '🥛',
    },
    totalProtein: 103, totalKcal: 1910,
    specialNote: '💪 Push Day: Eat extra carbs at breakfast. The Jolada Rotti + dal combination gives you sustained energy for chest workout.',
  },

  // ── TUESDAY: Pull Day ──────────────────────────────────────
  {
    day: 'Tuesday',
    dayShort: 'TUE',
    workout: 'Pull — Back + Biceps',
    workoutIntensity: 'HIGH',
    preworkout: '⚡ 150ml Majjige (buttermilk) + 1 tsp jeera — Light, doesn\'t cause cramps. Best pre-workout on pull day.',
    breakfast: {
      name: 'Akki Rotti + Shenga Chutney + Mosaru',
      english: 'Rice Flour Flatbread + Peanut Chutney + Curd',
      items: ['2 Akki Rotti (rice flour + onion + coriander + green chilli)', '3 tbsp Shengdana chutney pudi (dry peanut chutney)', '1 cup thick curd (mosaru)', '200ml chai (jaggery sweetened)'],
      protein: 26, kcal: 460,
      proteinFoods: 'Shenga chutney (15g) + Mosaru (8g) + Rotti (3g)',
      tip: 'Shengdana chutney PUDI (dry) is even better — mix into rotti dough directly. Lasts 2 weeks in airtight container.',
      emoji: '🫓',
    },
    midMorning: {
      name: 'Kadale Usli',
      english: 'Black Chickpea Stir-fry',
      items: ['100g cooked kala chana (kadle)', '1 tsp coconut oil', 'Mustard, curry leaves, green chilli tempering', '2 tbsp grated coconut', 'Lemon squeeze'],
      protein: 15, kcal: 220,
      proteinFoods: 'Kadale — 19g/100g cooked. Best NK protein food.',
      tip: 'Soak kadale overnight → pressure cook → season. This alone gives 15-19g protein. Make big batch on Sunday for whole week.',
      emoji: '⚫',
    },
    lunch: {
      name: 'Shenga Holige + Dal + Sabzi',
      english: 'Peanut Stuffed Sweet Roti + Dal + Stir-fry',
      items: ['1 Shenga Holige (but low sugar — make with less jaggery)', '2 Jolada Rotti', '1 cup Togari bele dal (toor dal)', 'Methi palya (fenugreek leaves stir-fry)', '1 cup Majjige'],
      protein: 24, kcal: 540,
      proteinFoods: 'Shenga holige filling (10g) + Toor dal (12g) + Majjige (2g)',
      tip: 'Shenga Holige = NK comfort food AND protein source. Keep jaggery minimal for fat loss. Methi (fenugreek) leaves are INCREDIBLE for skin — anti-inflammatory.',
      emoji: '🫓',
    },
    afternoonSnack: {
      name: 'Groundnut + Coconut Ladoo',
      english: 'Peanut Energy Ball',
      items: ['30g roasted peanuts (coarsely ground)', '10g grated coconut', '1 tsp jaggery', 'Cardamom — roll into 2 small balls'],
      protein: 10, kcal: 180,
      proteinFoods: 'Shenga (8g) + Coconut (2g)',
      tip: 'Make 10 balls on Sunday, refrigerate. Each ball is a pre/post workout NK snack. No sugar crash unlike protein bars.',
      emoji: '🥜',
    },
    dinner: {
      name: 'Vangi Bath + Paneer Palya + Kosambari',
      english: 'Brinjal Spiced Rice + Paneer Stir-fry + Dal Salad',
      items: ['1 cup Vangi bath (small portion)', '100g Paneer bhurji (with veggies)', 'Hesaru bele kosambari (moong dal salad)', '1 cup thin majjige'],
      protein: 28, kcal: 420,
      proteinFoods: 'Paneer (18g) + Hesaru bele kosambari (7g) + Vangi bath dal (3g)',
      tip: 'Make paneer at home from 1L milk = 200g paneer for ₹30. Way cheaper than store bought. NK style paneer = bhurji with NK spices.',
      emoji: '🍆',
    },
    bedtime: {
      name: 'Shenga + Warm Water',
      english: 'Peanut + Warm Water',
      items: ['20g roasted peanuts (shenga)', '1 glass warm water with pinch of turmeric'],
      protein: 5, kcal: 120,
      proteinFoods: 'Shenga slow protein release overnight',
      tip: 'Peanuts at bedtime provide slow-release protein during deep sleep muscle recovery. Don\'t exceed 20g.',
      emoji: '🥜',
    },
    totalProtein: 108, totalKcal: 1940,
    specialNote: '💪 Pull Day (Back+Biceps): Highest protein day. Kadale + Paneer + Shenga = Bruce\'s back gets wider every week.',
  },

  // ── WEDNESDAY: Legs + Core ─────────────────────────────────
  {
    day: 'Wednesday',
    dayShort: 'WED',
    workout: 'Legs + Core (FAT BURN)',
    workoutIntensity: 'HIGH',
    preworkout: '🍌 1 Banana + 1 cup black coffee (no milk) — Maximum energy, no bloating for leg workout.',
    breakfast: {
      name: 'Ragi Mudde + Hesaru Bele Sambar',
      english: 'Finger Millet Ball + Moong Dal Sambar',
      items: ['250g Ragi Mudde (2 small balls)', '1.5 cups Hesaru bele (moong) sambar with drumstick', '1 tsp ghee on mudde', '1 cup curd'],
      protein: 24, kcal: 490,
      proteinFoods: 'Ragi (14g) + Hesaru bele sambar (10g)',
      tip: 'Ragi Mudde is Bruce\'s SECRET WEAPON — finger millet has HIGHEST calcium of any grain, boosts skin collagen. Traditional NK wrestlers ate this daily.',
      emoji: '⚫',
    },
    midMorning: {
      name: 'Shenga Chikki + Majjige',
      english: 'Peanut Jaggery Bar + Buttermilk',
      items: ['40g shenga chikki (peanut jaggery bar — 1 small piece)', '1 glass majjige with jeera + salt', '1 small orange'],
      protein: 10, kcal: 210,
      proteinFoods: 'Shenga (8g) + Majjige protein (2g)',
      tip: 'NK-made shenga chikki from local stores = protein + iron + natural sugar. Much better than commercial protein bars. Eat before leg day afternoon.',
      emoji: '🍫',
    },
    lunch: {
      name: 'Bisibele Bath + Raita + Papad',
      english: 'Hot Lentil Rice Stew + Yoghurt Side',
      items: ['1.5 cups Bisibele bath (rice + toor dal + vegetables + spices)', '1 cup thick curd raita with cucumber + carrot', '1 roasted papad (no oil)', '1 cup majjige'],
      protein: 20, kcal: 560,
      proteinFoods: 'Toor dal in bisibele (15g) + Curd raita (5g)',
      tip: 'Bisibele bath = complete meal. NK version uses more dal, less rice. Load it with vegetables. The spices (sambar powder, tamarind) are anti-inflammatory.',
      emoji: '🍲',
    },
    afternoonSnack: {
      name: 'Chana + Onion Chaat',
      english: 'Spiced Chickpea Salad',
      items: ['100g boiled kala chana / kabuli chana', '1 onion (chopped)', '1 tomato (chopped)', 'Lemon, coriander, green chilli, chaat masala', 'No fried things'],
      protein: 15, kcal: 190,
      proteinFoods: 'Chana — 15g protein per 100g boiled. NK high-protein snack.',
      tip: 'This is Bruce\'s pre-evening-walk snack. Keeps energy up for the 30-min fat burn walk. Chana has resistant starch = fat burning even hours after eating.',
      emoji: '🫘',
    },
    dinner: {
      name: 'Jolada Rotti + Palak Paneer (NK style)',
      english: 'Jowar Roti + Spinach Paneer',
      items: ['2 Jolada Rotti', '150g NK-style palak paneer (sabsige soppu / spinach + paneer + NK masalas)', 'Thin toor dal', 'Raw onion salad'],
      protein: 28, kcal: 400,
      proteinFoods: 'Paneer (18g) + Toor dal (7g) + Rotti (3g)',
      tip: 'NK-style spinach = sabsige soppu (dill) or palak. Both are BEST for skin recovery — zinc, iron, vitamin A. Paneer + spinach at dinner = perfect muscle repair combo.',
      emoji: '🥬',
    },
    bedtime: {
      name: 'Haldi Doodh',
      english: 'Turmeric Milk',
      items: ['200ml warm milk', '1/2 tsp haldi', 'Pinch black pepper', 'Small pinch ashwagandha (optional)'],
      protein: 7, kcal: 120,
      proteinFoods: 'Milk casein protein for overnight recovery',
      tip: 'Leg day = most recovery needed. Haldi doodh reduces muscle soreness (DOMS) by 30–40%. Ashwagandha reduces cortisol = better sleep quality.',
      emoji: '🥛',
    },
    totalProtein: 104, totalKcal: 1970,
    specialNote: '🦵 Legs Day: Eat more carbs today! Bisibele bath at lunch fuels leg workout. Ragi Mudde at breakfast = long slow energy all morning.',
  },

  // ── THURSDAY: Push Variation ───────────────────────────────
  {
    day: 'Thursday',
    dayShort: 'THU',
    workout: 'Push Variation — Incline + OHP + Arnold Press',
    workoutIntensity: 'MOD',
    preworkout: '🫘 50g roasted peanuts (shenga) + 1 cup chai — 30 min before workout. Steady energy.',
    breakfast: {
      name: 'Uppittu + Kadle Chutney + Mosaru',
      english: 'Semolina Upma + Chickpea Chutney + Curd',
      items: ['1.5 cups Uppittu (rave upma with vegetables, shenga, curry leaves)', '3 tbsp thick kadale chutney (Bengal gram chutney)', '1 cup thick mosaru (curd)', '1 glass warm water with lemon'],
      protein: 22, kcal: 440,
      proteinFoods: 'Shenga in uppittu (10g) + Kadale chutney (8g) + Mosaru (4g)',
      tip: 'NK uppittu MUST have roasted peanuts inside. Shenga in uppittu = extra protein + crunch. Add sabsige soppu (dill) for skin benefits.',
      emoji: '🍲',
    },
    midMorning: {
      name: 'Molake Kadale + Lemon',
      english: 'Sprouted Chickpeas with Lemon',
      items: ['1 cup sprouted kadale / kabuli chana', '1/2 lemon squeezed', 'Pinch of salt + jeera powder', '1 small apple or guava'],
      protein: 12, kcal: 170,
      proteinFoods: 'Sprouted chana = highest protein bioavailability',
      tip: 'Bruce\'s secret: sprouting increases protein availability by 40% AND creates vitamin C. Fresh vitamin C = collagen synthesis = skin repair. This is WHY Bruce sprouts.',
      emoji: '🌱',
    },
    lunch: {
      name: 'Jola Rotti + Ennegayi + Dalimbe Gojju',
      english: 'Jowar Roti + Stuffed Brinjal + Pomegranate Raita',
      items: ['2 Jolada Rotti', 'Ennegayi (stuffed with shenga + coconut masala)', '1 cup Dalimbe mosaru (pomegranate yoghurt)', '1 cup sambar'],
      protein: 26, kcal: 510,
      proteinFoods: 'Ennegayi shenga filling (15g) + Mosaru (8g) + Sambar dal (3g)',
      tip: 'Dalimbe (pomegranate) in curd = best skin food combination. Pomegranate = antioxidants to fight hyperpigmentation. Eat this every skin-recovery day.',
      emoji: '🍆',
    },
    afternoonSnack: {
      name: 'Ambode + Majjige',
      english: 'Masala Lentil Fritters (Baked/Air Fried) + Buttermilk',
      items: ['2 baked ambode (chana dal vada — air fry NOT deep fry)', '1 glass thick majjige', 'Green chutney'],
      protein: 14, kcal: 240,
      proteinFoods: 'Chana dal in ambode (12g) + Majjige (2g)',
      tip: 'Traditional NK ambode is deep fried. For Bruce — air fry or shallow fry with minimal oil. Still tastes great, but saves 150 kcal per serving.',
      emoji: '🥜',
    },
    dinner: {
      name: 'Ragi Rotti + Shenga Chutney + Sabzi',
      english: 'Finger Millet Flatbread + Peanut Chutney + Vegetable',
      items: ['2 Ragi Rotti (ragi flour + onion + green chilli + coriander)', '2 tbsp shenga chutney', '1.5 cups gorikayi (cluster beans) + potato palya', 'Thin sambar'],
      protein: 18, kcal: 360,
      proteinFoods: 'Shenga chutney (10g) + Ragi (5g) + Sambar dal (3g)',
      tip: 'Ragi Rotti is easier than Jolada Rotti for beginners. Mix ragi flour + finely chopped onion + green chilli + coriander + salt + water. Spread thin on tawa.',
      emoji: '⚫',
    },
    bedtime: {
      name: 'Mosaru + Shenga',
      english: 'Curd + Peanuts',
      items: ['150ml thick curd (mosaru)', '15g roasted peanuts', 'Pinch of salt + jeera'],
      protein: 9, kcal: 150,
      proteinFoods: 'Combined slow protein for overnight recovery',
      tip: 'Casein from curd + protein from shenga = slow-release protein stream throughout the night. Perfect for muscle building during sleep.',
      emoji: '🥛',
    },
    totalProtein: 101, totalKcal: 1870,
    specialNote: '💪 Moderate day: Focus on quality over quantity. The Dalimbe (pomegranate) curd is Bruce\'s skin secret weapon — eat it 3x/week minimum.',
  },

  // ── FRIDAY: Pull + Core ────────────────────────────────────
  {
    day: 'Friday',
    dayShort: 'FRI',
    workout: 'Pull + Core — Back Width + Hanging Leg Raises',
    workoutIntensity: 'HIGH',
    preworkout: '🍌 1 Banana + 5g creatine in water (if using) — 20 min before. Or just banana alone.',
    breakfast: {
      name: 'Shenga Holige + Hesaru Bele Dal + Curd',
      english: 'Peanut Sweet Flatbread + Moong Dal + Curd',
      items: ['1 Shenga Holige (low jaggery version)', '1 Jolada Rotti', '1 cup Hesaru bele dal (thick moong)', '1 cup mosaru', '5 dates or jaggery piece for energy'],
      protein: 28, kcal: 510,
      proteinFoods: 'Holige shenga (12g) + Hesaru bele (12g) + Mosaru (4g)',
      tip: 'FRIDAY = biggest workout protein day. Hesaru bele dal + shenga holige = complete amino acid profile. Your back grows from what you eat on Friday.',
      emoji: '🫓',
    },
    midMorning: {
      name: 'Shenga + Dates Energy Mix',
      english: 'Power Snack',
      items: ['30g roasted peanuts (shenga)', '3-4 medjool dates or regular khajoor', '1 glass warm water'],
      protein: 8, kcal: 220,
      proteinFoods: 'Shenga protein + dates natural sugar for energy',
      tip: 'The peanut + date combo gives: protein + iron + natural sugar. Iron = oxygen to muscles during pull workout. Khajoor is available in all NK markets.',
      emoji: '🥜',
    },
    lunch: {
      name: 'Jolada Rotti + Kadle Saaru + Kosambari',
      english: 'Jowar Roti + Black Chickpea Rasam + Moong Salad',
      items: ['2 Jolada Rotti', '1 cup thick kadle saaru (black chickpea curry)', 'Hesaru bele kosambari (moong dal raw salad)', '1 cup Majjige', 'Onion + tomato with lemon'],
      protein: 30, kcal: 520,
      proteinFoods: 'Kadle saaru (18g) + Kosambari (8g) + Majjige (4g)',
      tip: 'Kadle (kala chana) saaru = NK\'s most protein-dense curry. 1 cup cooked kadle = 19g protein. Better than rajma, cheaper than paneer. Make 500g batch on Sunday.',
      emoji: '⚫',
    },
    afternoonSnack: {
      name: 'Mosaru Vade (Curd Vada)',
      english: 'Lentil Fritter in Curd',
      items: ['1-2 baked/air-fried vade (moong + urad dal)', '1 cup thick mosaru with mustard tempering', 'Coriander, pomegranate seeds'],
      protein: 14, kcal: 220,
      proteinFoods: 'Dal vade (9g) + Mosaru (5g)',
      tip: 'Mosaru vade gives protein + probiotics together. The probiotics from curd repair gut lining = better nutrient absorption = better gains for Bruce.',
      emoji: '🍢',
    },
    dinner: {
      name: 'Paneer NK Masala + Ragi Mudde + Sambar',
      english: 'NK Spiced Paneer + Ragi Ball + Lentil Soup',
      items: ['150g paneer NK masala (paneer + NK spice mix + minimal oil)', '1 Ragi Mudde', '1 cup thin sambar (toor dal)', 'Green salad'],
      protein: 28, kcal: 400,
      proteinFoods: 'Paneer (18g) + Ragi (7g) + Sambar dal (3g)',
      tip: 'NK Paneer Masala: Sauté onion-tomato in groundnut oil + NK garam masala + dry coconut. ZERO cream, ZERO butter. Tastes amazing, saves 300 kcal.',
      emoji: '🧀',
    },
    bedtime: {
      name: 'Haldi Doodh + Ashwagandha',
      english: 'Power Sleep Drink',
      items: ['200ml warm milk', '1/2 tsp haldi', '1/4 tsp ashwagandha powder', 'Pinch black pepper'],
      protein: 7, kcal: 120,
      proteinFoods: 'Milk protein + ashwagandha for recovery',
      tip: 'Friday night = best sleep recovery needed. Ashwagandha (KSM-66) reduces cortisol, improves testosterone. Bruce sleeps like a beast tonight.',
      emoji: '🌙',
    },
    totalProtein: 115, totalKcal: 1990,
    specialNote: '🔥 Bruce\'s highest protein day. Kadle + Paneer + Shenga = V-taper back gets built Friday night while sleeping.',
  },

  // ── SATURDAY: HIIT Fat Burn ────────────────────────────────
  {
    day: 'Saturday',
    dayShort: 'SAT',
    workout: 'Full Body HIIT — Maximum Fat Burn',
    workoutIntensity: 'MAX',
    preworkout: '☕ 1 black coffee (no milk) + 1 banana — MAX fat burn mode. Coffee mobilizes fat cells before HIIT.',
    breakfast: {
      name: 'Chitranna + Mosaru + Shenga',
      english: 'NK Lemon Rice + Curd + Peanuts',
      items: ['1 cup Chitranna (lemon rice with peanuts, curry leaves, mustard)', '1 cup thick mosaru', '20g extra roasted peanuts', '1 glass warm lemon water'],
      protein: 20, kcal: 420,
      proteinFoods: 'Shenga in chitranna + extra (15g) + Mosaru (5g)',
      tip: 'NK Chitranna MUST have lots of shenga. The lemon + turmeric in chitranna is HIIT recovery food — reduces oxidative stress after intense training.',
      emoji: '🍋',
    },
    midMorning: {
      name: 'Jamun + Shenga',
      english: 'Blackberry + Peanuts',
      items: ['1 cup jamun (black berry — seasonal) or 1 cup pomegranate', '20g roasted shenga', '1 glass water with rock salt'],
      protein: 6, kcal: 160,
      proteinFoods: 'Shenga (5g) + fruit antioxidants for skin recovery',
      tip: 'HIIT day = maximum oxidative stress. Jamun (kala jamun) has highest antioxidants of any Indian fruit — 3x blueberries. SKIN GLOW FOOD after intense training.',
      emoji: '🫐',
    },
    lunch: {
      name: 'Jolada Rotti + Saaru + Kadale Palya + Raita',
      english: 'Jowar Roti + Rasam + Chickpea Stir-fry + Yoghurt',
      items: ['2 Jolada Rotti', '1 cup tomato saaru (rasam)', '1 cup kadale palya (black chickpea with coconut)', '1 cup thick curd raita', 'Raw onion + cucumber'],
      protein: 28, kcal: 500,
      proteinFoods: 'Kadale palya (18g) + Curd (8g) + Rotti (2g)',
      tip: 'Tomato saaru after HIIT = electrolytes + potassium + anti-inflammation. The rasam spices (black pepper, jeera, rasam powder) help protein absorption.',
      emoji: '🍲',
    },
    afternoonSnack: {
      name: 'Tender Coconut + Shenga',
      english: 'Coconut Water + Peanuts',
      items: ['1 tender coconut (elaneer) — with water AND malai', '20g roasted peanuts', 'Optional: pinch of rock salt in coconut water'],
      protein: 7, kcal: 190,
      proteinFoods: 'Coconut malai (3g) + Shenga (4g) — electrolyte recovery',
      tip: 'SATURDAY HIIT RECOVERY: Tender coconut water = best natural electrolyte drink. Replenishes sodium, potassium, magnesium lost in sweating. Much better than sports drinks.',
      emoji: '🥥',
    },
    dinner: {
      name: 'Meal Prep Bowl (Light NK Recovery)',
      english: 'NK Recovery Dinner Bowl',
      items: ['1 cup Hesaru bele dal (moong)', '100g paneer (lightly sautéed)', '2 cups mixed sabzi (beans + carrot + beans)', '1 Jolada Rotti (just 1 — low carb night)', '1 cup majjige'],
      protein: 30, kcal: 380,
      proteinFoods: 'Paneer (18g) + Hesaru bele (9g) + Majjige (3g)',
      tip: 'SATURDAY = Meal Prep Night. While eating, cook Sunday\'s kadle, soak moong for sprouts, prepare shengdana chutney pudi. Bruce preps = Bruce wins.',
      emoji: '🥣',
    },
    bedtime: {
      name: 'Warm Milk + Dry Fruits',
      english: 'Recovery Night Drink',
      items: ['200ml warm milk', '3 almonds (badam)', '3 cashews (kaju)', '2 walnuts (akhrot — for Omega-3)', 'Pinch haldi'],
      protein: 9, kcal: 180,
      proteinFoods: 'Milk (7g) + Dry fruit protein (2g) + Omega-3 from walnuts',
      tip: 'Walnuts (akhrot) = BEST skin food. Omega-3 fatty acids in walnuts rebuild the skin barrier destroyed by Betnovate-N. Eat 2 walnuts EVERY NIGHT.',
      emoji: '🌰',
    },
    totalProtein: 100, totalKcal: 1830,
    specialNote: '🔥 MAX FAT BURN DAY. Lower carbs at dinner tonight. The Chitranna breakfast + Kadale lunch combination keeps energy high for brutal HIIT.',
  },

  // ── SUNDAY: Active Recovery ─────────────────────────────────
  {
    day: 'Sunday',
    dayShort: 'SUN',
    workout: 'Active Recovery — Face Yoga + Long Walk + Meal Prep',
    workoutIntensity: 'LOW',
    preworkout: '☀️ Just sunlight + morning walk. No intense pre-workout needed on Sunday.',
    breakfast: {
      name: 'Idli + Sambar + Shengdana Chutney (NK Fusion)',
      english: 'Steamed Rice Cakes + Lentil Soup + Peanut Chutney',
      items: ['4 soft idli', '1 cup NK-style sambar (with more dal, NK spices)', '2 tbsp shengdana chutney (fresh)', '1 cup mosaru (curd)', '1 glass warm water'],
      protein: 18, kcal: 380,
      proteinFoods: 'Idli dal (8g) + Shengdana chutney (8g) + Mosaru (2g)',
      tip: 'SUNDAY TREAT BREAKFAST. NK shengdana chutney transforms simple idli into high-protein meal. Make FRESH chutney today for the week.',
      emoji: '🫓',
    },
    midMorning: {
      name: 'Fruit Salad with Shenga',
      english: 'NK Protein Fruit Salad',
      items: ['1 banana, 1 apple, 1 guava (or seasonal fruits)', '20g roasted peanuts', '1 tsp lemon', '1 tsp jaggery (optional)', 'Chaat masala pinch'],
      protein: 7, kcal: 200,
      proteinFoods: 'Shenga (5g) + Fruit vitamins for skin',
      tip: 'Guava (peru) is BEST NK skin food — 4x more vitamin C than orange. Vitamin C = skin collagen = faster healing of Betnovate-N damage. Eat guava daily when in season.',
      emoji: '🍎',
    },
    lunch: {
      name: 'Pulav + Kadale Curry + Curd',
      english: 'NK Style Vegetable Pulav + Black Chickpea Curry',
      items: ['1.5 cups vegetable pulav (with carrot, peas, beans)', '1 cup kadale curry (NK spiced black chickpea)', '1 cup thick curd', '2 tbsp shenga chutney pudi', 'Papad + pickle'],
      protein: 28, kcal: 550,
      proteinFoods: 'Kadale (18g) + Curd (8g) + Peas in pulav (2g)',
      tip: 'SUNDAY SPECIAL LUNCH. This is the meal that motivates Bruce all week. NK kadale curry is unbeatable — make double and freeze half for Wednesday.',
      emoji: '🍚',
    },
    afternoonSnack: {
      name: 'Shenga Chikki + Chai',
      english: 'Peanut Bar + Ginger Tea',
      items: ['1 piece shenga chikki (40g)', '1 cup adrak chai (ginger tea with minimal milk, no sugar)', '5-10 min face yoga'],
      protein: 10, kcal: 200,
      proteinFoods: 'Shenga (8g) + Milk (2g)',
      tip: 'SUNDAY REST: Shenga chikki + chai = NK Sunday ritual. Enjoy it guilt-free — it\'s jaggery + peanuts, not chocolate. Bruce earned this.',
      emoji: '🍫',
    },
    dinner: {
      name: 'Ragi Mudde + Soppu Saaru + Palya',
      english: 'Finger Millet Ball + Greens Rasam + Stir-fry',
      items: ['1 Ragi Mudde', '1.5 cups soppu saaru (greens rasam — methi + spinach + dal)', '1 cup mixed palya (seasonal vegetables)', '1 cup mosaru'],
      protein: 20, kcal: 370,
      proteinFoods: 'Ragi (7g) + Dal in saaru (8g) + Mosaru (5g)',
      tip: 'Soppu saaru = NK vegetable rasam with greens. Methi + spinach = folic acid + iron + zinc. These are the minerals that repair skin from inside. ESSENTIAL for Bruce\'s skin journey.',
      emoji: '🌿',
    },
    bedtime: {
      name: 'Haldi Doodh + Walnuts',
      english: 'The Bruce Sunday Night Recovery',
      items: ['200ml warm milk', '1/2 tsp haldi', '2 walnuts (crushed)', 'Pinch ashwagandha', 'Pinch black pepper'],
      protein: 9, kcal: 180,
      proteinFoods: 'Milk casein + walnuts Omega-3',
      tip: 'Sunday night sleep = MOST IMPORTANT of the week. The whole body resets. Bruce drinks this EVERY Sunday. Walnuts + haldi = anti-inflammatory sleep cocktail.',
      emoji: '🥛',
    },
    totalProtein: 92, totalKcal: 1880,
    specialNote: '😴 Active Recovery + Meal Prep Day. Lower protein today is fine — muscles rest. Use Sunday evening to prep the week\'s kadale, sprouted moong, and shengdana chutney pudi.',
  },
];

// ─────────────────────────────────────────────────────────────
// NK DAILY RULES FOR BRUCE
// ─────────────────────────────────────────────────────────────
const NK_DAILY_RULES = [
  { emoji: '🥜', rule: 'Eat Shenga (Peanuts) Daily', why: '26g protein per 100g. Cheapest protein in NK. Roast them at home. Eat as snack, add to every dal, use in chutney.' },
  { emoji: '🌾', rule: 'Jolada Rotti > White Rice', why: 'Jowar roti = 11g protein, low GI, fills for 5 hrs. White rice = 3g protein, spikes insulin. NK body runs on jowar.' },
  { emoji: '⚫', rule: 'Kadle (Black Chana) 3x/Week', why: '100g cooked kadle = 19g protein + iron + zinc. NK\'s answer to chicken breast. Soak Sunday, cook batch.' },
  { emoji: '⚫', rule: 'Ragi Mudde 4x/Week', why: 'NK athletes ate ragi mudde for 1000 years. Highest calcium grain. Collagen builder. Skin glow food. Bruce eats mudde.' },
  { emoji: '🌱', rule: 'Sprouted Dal Every Morning', why: 'Sprout hesaru bele or kadale overnight. Sprouting increases protein by 40% + creates vitamin C in the food itself.' },
  { emoji: '🥛', rule: 'Majjige After Every Lunch', why: 'NK gut secret. Probiotic buttermilk aids digestion + protein absorption. Your gains improve when gut is healthy.' },
  { emoji: '🚫', rule: 'No Maida, No Bakery Items', why: 'Maida (refined flour) causes insulin spike → fat storage + acne. NK traditional food (jowar, ragi) is naturally maida-free.' },
  { emoji: '🫙', rule: 'Cook in Groundnut Oil Only', why: 'Shenga enne (groundnut oil) is NK\'s traditional oil. High smoke point, anti-inflammatory. Better for skin than refined oils.' },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function MealCard({ meal, label, labelColor }: { meal: Meal; label: string; labelColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E8EEF5] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{meal.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white" style={{ background: labelColor }}>{label}</span>
              <span className="text-xs font-black text-[#0A192F] leading-tight">{meal.name}</span>
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">{meal.english}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-xs font-black text-[#0085FF]">{meal.protein}g P</p>
            <p className="text-[9px] text-[#94A3B8]">{meal.kcal} kcal</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E8EEF5] p-3.5 space-y-3 bg-slate-50/50">
          {/* Items */}
          <div>
            <p className="text-[9px] font-black text-[#0085FF] uppercase mb-1.5">What to Eat</p>
            <ul className="space-y-1">
              {meal.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: labelColor }} />
                  <span className="text-[11px] text-[#475569] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Protein source */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5">
            <p className="text-[9px] font-black text-[#0085FF] uppercase mb-1">💪 Protein Breakdown</p>
            <p className="text-[11px] text-[#475569]">{meal.proteinFoods}</p>
          </div>
          {/* Bruce tip */}
          <div className="rounded-xl bg-orange-50 border border-orange-100 p-2.5">
            <p className="text-[9px] font-black text-[#FF7A00] uppercase mb-1">🔥 Bruce's Tip</p>
            <p className="text-[11px] text-[#475569]">{meal.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const INTENSITY_STYLE: Record<string, string> = {
  MAX: 'bg-red-500 text-white',
  HIGH: 'bg-orange-500 text-white',
  MOD: 'bg-blue-500 text-white',
  LOW: 'bg-emerald-500 text-white',
};

const MEAL_COLORS: Record<string, string> = {
  'Pre-Workout': '#7B61FF',
  'Breakfast': '#FF9500',
  'Mid-Morning': '#10B981',
  'Lunch': '#0085FF',
  'Afternoon': '#FF7A00',
  'Dinner': '#6366F1',
  'Bedtime': '#0A192F',
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function NKVegetarianPage() {
  const todayIndex = new Date().getDay(); // 0=Sun
  // Map: Mon=0,Tue=1...Sun=6
  const dayMapIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const [selectedDay, setSelectedDay] = useState(dayMapIndex);
  const [activeTab, setActiveTab] = useState<'meal' | 'foods' | 'rules'>('meal');

  const plan = WEEKLY_PLAN[selectedDay];

  const meals: { label: string; meal: Meal }[] = [
    { label: 'Breakfast',  meal: plan.breakfast },
    { label: 'Mid-Morning', meal: plan.midMorning },
    { label: 'Lunch',      meal: plan.lunch },
    { label: 'Afternoon',  meal: plan.afternoonSnack },
    { label: 'Dinner',     meal: plan.dinner },
    { label: 'Bedtime',    meal: plan.bedtime },
  ];

  return (
    <ResponsiveShell>
      <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-32">

        {/* ── HERO HEADER ── */}
        <div
          className="rounded-3xl p-5 mb-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7C3A00 0%, #B45309 40%, #92400E 100%)' }}
        >
          <div className="absolute top-0 right-0 opacity-15 text-[100px] leading-none">🌾</div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">BRUCE · NORTH KARNATAKA</span>
            <h1 className="text-2xl font-black text-white mt-1 leading-tight">
              NK Vegetarian<br />Muscle Plan 💪
            </h1>
            <p className="text-xs font-semibold text-amber-200 mt-2 leading-relaxed">
              Jolada Rotti · Shenga · Ragi Mudde · Kadale · Mosaru —<br />
              North Karnataka's traditional foods, engineered for body recomposition.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Daily Protein', val: '100–115g' },
                { label: 'Daily Calories', val: '1830–1990' },
                { label: 'Cost/Day', val: '₹80–120' },
              ].map(s => (
                <div key={s.label} className="bg-white/15 rounded-xl p-2 text-center">
                  <p className="text-sm font-black text-white">{s.val}</p>
                  <p className="text-[9px] font-bold text-amber-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'meal', label: '🍽️ Weekly Plan' },
            { key: 'foods', label: '💪 NK Superfoods' },
            { key: 'rules', label: '📋 Bruce\'s Rules' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                activeTab === t.key ? 'text-white shadow-md' : 'bg-slate-100 text-[#64748B]'
              }`}
              style={activeTab === t.key ? { background: 'linear-gradient(135deg, #B45309, #92400E)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MEAL PLAN TAB ── */}
        {activeTab === 'meal' && (
          <div className="space-y-4">
            {/* DAY SELECTOR */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {WEEKLY_PLAN.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(i)}
                  className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-2xl transition-all ${
                    selectedDay === i
                      ? 'text-white shadow-md'
                      : 'bg-white border border-[#E8EEF5] text-[#64748B]'
                  }`}
                  style={selectedDay === i ? { background: 'linear-gradient(135deg, #B45309, #7C3A00)' } : {}}
                >
                  <span className="text-[9px] font-black">{d.dayShort}</span>
                  <span className={`text-[8px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full ${INTENSITY_STYLE[d.workoutIntensity]}`}>
                    {d.workoutIntensity}
                  </span>
                </button>
              ))}
            </div>

            {/* WORKOUT CONTEXT CARD */}
            <div
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0A192F, #1E3A5F)' }}
            >
              <div className="absolute right-3 top-3 opacity-20 text-5xl">💪</div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${INTENSITY_STYLE[plan.workoutIntensity]}`}>
                    {plan.workoutIntensity}
                  </span>
                  <span className="text-[10px] font-black text-white">{plan.day} Workout</span>
                </div>
                <p className="text-xs font-bold text-white/80">{plan.workout}</p>
                <div className="mt-2 p-2.5 rounded-xl bg-white/10">
                  <p className="text-[9px] font-black text-[#FF7A00] uppercase mb-1">⚡ Pre-Workout Fuel</p>
                  <p className="text-[11px] text-white/80">{plan.preworkout}</p>
                </div>
                <div className="mt-2 p-2.5 rounded-xl bg-amber-900/30">
                  <p className="text-[11px] text-amber-200 italic">{plan.specialNote}</p>
                </div>
              </div>
            </div>

            {/* MACRO SUMMARY */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Protein', val: `${plan.totalProtein}g`, color: '#0085FF', emoji: '💪' },
                { label: 'Calories', val: `${plan.totalKcal}`, color: '#10B981', emoji: '🔥' },
                { label: 'Meals', val: '6', color: '#7B61FF', emoji: '🍽️' },
                { label: 'Cost', val: '~₹100', color: '#FF7A00', emoji: '💰' },
              ].map(s => (
                <div key={s.label} className="arc-card p-3 bg-white text-center">
                  <div className="text-lg">{s.emoji}</div>
                  <div className="text-sm font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[9px] font-bold text-[#94A3B8]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* MEALS */}
            <div className="space-y-2">
              {meals.map(({ label, meal }) => (
                <MealCard
                  key={label}
                  label={label}
                  meal={meal}
                  labelColor={MEAL_COLORS[label] || '#0085FF'}
                />
              ))}
            </div>

            {/* NAVIGATION ARROWS */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDay(d => Math.max(0, d - 1))}
                disabled={selectedDay === 0}
                className="flex-1 py-2.5 rounded-xl border border-[#E8EEF5] text-xs font-black text-[#64748B] disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                ← {selectedDay > 0 ? WEEKLY_PLAN[selectedDay - 1].day : ''}
              </button>
              <button
                onClick={() => setSelectedDay(d => Math.min(6, d + 1))}
                disabled={selectedDay === 6}
                className="flex-1 py-2.5 rounded-xl border border-[#E8EEF5] text-xs font-black text-[#64748B] disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                {selectedDay < 6 ? WEEKLY_PLAN[selectedDay + 1].day : ''} →
              </button>
            </div>
          </div>
        )}

        {/* ── NK SUPERFOODS TAB ── */}
        {activeTab === 'foods' && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-4 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #065F46, #10B981)' }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">North Karnataka Protein Arsenal</p>
              <p className="text-sm font-black">These are Bruce's weapons. Local, cheap, powerful.</p>
            </div>

            {/* Category filter */}
            {(['protein', 'carb', 'dairy', 'fat'] as const).map(cat => {
              const items = NK_PROTEIN_SOURCES.filter(i => i.category === cat);
              if (!items.length) return null;
              const catLabels: Record<string, { label: string; color: string; emoji: string }> = {
                protein: { label: 'Protein Sources', color: '#0085FF', emoji: '💪' },
                carb: { label: 'Smart Carbs', color: '#FF9500', emoji: '🌾' },
                dairy: { label: 'Dairy / Probiotics', color: '#7B61FF', emoji: '🥛' },
                fat: { label: 'Healthy Fats', color: '#10B981', emoji: '🫙' },
              };
              const cfg = catLabels[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{cfg.emoji}</span>
                    <span className="text-xs font-black uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.name} className="arc-card p-3.5 bg-white">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl shrink-0">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="text-xs font-black text-[#0A192F]">{item.name}</p>
                                <p className="text-[10px] font-bold" style={{ color: cfg.color }}>{item.localName}</p>
                              </div>
                              {item.protein !== '0g' && (
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-black text-[#0085FF]">{item.protein}</p>
                                  <p className="text-[9px] text-[#94A3B8]">per {item.per}</p>
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] text-[#475569] mt-1.5 leading-relaxed">{item.benefit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* SHOPPING LIST */}
            <div
              className="rounded-3xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #7C3A00, #B45309)' }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">🛒 Bruce's Weekly Shopping (₹200–300)</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  '500g Hesaru bele (Moong dal)', '500g Togari bele (Toor dal)',
                  '500g Kadle bele (Chana dal)', '500g Kala chana (Black chickpeas)',
                  '200g Jolada hittu (Jowar flour)', '200g Ragi hittu (Ragi flour)',
                  '500g Shenga (Raw peanuts)', 'Shenga chikki (½ kg)',
                  '200g Paneer (home-made)', '1L Mosaru (Curd)',
                  'Seasonal sabsige soppu (Dill)', 'Kadle (Black chickpeas to sprout)',
                ].map((item, i) => (
                  <p key={i} className="text-[10px] font-semibold opacity-90 py-0.5">• {item}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BRUCE'S RULES TAB ── */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div
              className="rounded-3xl p-5 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #0A192F, #1E3A5F, #2D1B4E)' }}
            >
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-black">Bruce's NK Nutrition Code</p>
              <p className="text-xs opacity-70 mt-1">Break these and the transformation slows. Follow these and the body changes.</p>
            </div>

            <div className="space-y-2">
              {NK_DAILY_RULES.map((rule, i) => (
                <div key={i} className="arc-card p-4 bg-white flex items-start gap-3">
                  <span className="text-2xl shrink-0">{rule.emoji}</span>
                  <div>
                    <p className="text-xs font-black text-[#0A192F] mb-1">{rule.rule}</p>
                    <p className="text-[11px] text-[#475569] leading-relaxed">{rule.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WHAT TO AVOID */}
            <div className="arc-card p-4 bg-white">
              <p className="text-xs font-black text-red-500 mb-3">🚫 What Bruce NEVER Eats</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Maida / white bread', 'Biscuits / bakery',
                  'Namkeen / chips', 'Cold drinks / soda',
                  'Sugar tea (more than 1)', 'Fried puri / bhature',
                  'Junk oily bhajji', 'Restaurant food daily',
                  'Packaged juices', 'Maggi / noodles',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-red-50 rounded-lg px-2 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-[10px] text-red-600 font-semibold">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SUNDAY MEAL PREP */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'linear-gradient(135deg, #065F46, #10B981)' }}
            >
              <p className="text-[10px] font-black uppercase text-white/80 mb-2">📦 Bruce's Sunday Meal Prep (1 hr)</p>
              <div className="space-y-1.5">
                {[
                  '✅ Soak 250g kala chana + 250g moong overnight',
                  '✅ Cook big batch of kadle curry (freeze half)',
                  '✅ Make shengdana chutney pudi (lasts 2 weeks)',
                  '✅ Sprout hesaru bele (hang in damp cloth for Mon-Tue)',
                  '✅ Make 10 peanut energy balls for weekday snacks',
                  '✅ Cook 500g toor dal — store for 3 days',
                  '✅ Prep Ragi flour mix for quick ragi rotti',
                ].map((task, i) => (
                  <p key={i} className="text-[11px] text-white/90">{task}</p>
                ))}
              </div>
            </div>

            {/* MOTIVATION */}
            <div
              className="rounded-3xl p-5 text-white text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7C3A00, #FF7A00)' }}
            >
              <div className="absolute inset-0 opacity-10 text-8xl flex items-center justify-center">🌾</div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">BRUCE'S NORTH KARNATAKA OATH</p>
                <p className="text-base font-black leading-snug">
                  "NK warriors ate Jolada Rotti and Ragi Mudde and became legends.<br />Bruce eats the same food — and builds a legendary body."
                </p>
                <p className="text-xs font-bold mt-3 opacity-70">Shenga + Kadale + Ragi = Bruce's muscle fuel 🔥</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </ResponsiveShell>
  );
}
