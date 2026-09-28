export interface CoachContext {
  identityStatement?: string;
  currentDay?: number;
  consistency?: number;
  streak?: number;
  mode?: 'all' | 'gym' | 'nutrition' | 'skin' | 'mindset';
}

export async function getCoachResponse(message: string, context?: CoachContext): Promise<string> {
  const currentDay = context?.currentDay || 1;
  const streak = context?.streak || currentDay;
  const msg = message.toLowerCase().trim();

  // ─────────────────────────────────────────────────────────────
  // 1. SKIN & BETNOVATE-N RECOVERY
  // ─────────────────────────────────────────────────────────────
  if (
    msg.includes('skin') ||
    msg.includes('betnovate') ||
    msg.includes('hyperpigmentation') ||
    msg.includes('acne') ||
    msg.includes('scar') ||
    msg.includes('face') ||
    msg.includes('pigment') ||
    msg.includes('barrier') ||
    msg.includes('cream') ||
    msg.includes('burning') ||
    msg.includes('redness')
  ) {
    if (msg.includes('betnovate') || msg.includes('withdraw') || msg.includes('steroid')) {
      return `**🛡️ Betnovate-N Withdrawal & Barrier Recovery Protocol:**\n\n` +
        `Bruce, stopping Betnovate-N completely was the smartest decision of your life. Betnovate-N contains a potent corticosteroid (Betamethasone) that thins the epidermis, creates steroid dependency, and leaves behind rebound hyperpigmentation and damaged capillaries.\n\n` +
        `**Here is your exact recovery roadmap:**\n` +
        `1. **Rule #1: ZERO Steroids Forever.** Never touch Betnovate, Tenovate, or Cortisone creams again, no matter the temptation.\n` +
        `2. **AM Barrier Shield:** Gentle non-foaming hydrating cleanser (Cetaphil or CeraVe) → 5% Niacinamide serum (repairs lipid barrier) → Ceramide moisturizer → Non-comedogenic SPF 50+ PA++++.\n` +
        `3. **PM Active Repair:** Double cleanse (if wearing sunscreen) → Azelaic Acid 10% (the gold standard for steroid-induced hyperpigmentation and redness) → Heavy Ceramide barrier cream → 2 drops 100% cold-pressed Rosehip Seed Oil.\n` +
        `4. **Ice Therapy:** Wrap an ice cube in clean cotton cloth or use an ice roller for 2–3 minutes after morning wash to constrict inflamed capillaries.\n\n` +
        `Skin barrier renewal takes 45–60 days. Trust the biology, Bruce. Your skin will glow naturally.`;
    }

    if (msg.includes('hyperpigmentation') || msg.includes('dark spot') || msg.includes('pigment')) {
      return `**✨ Fading Hyperpigmentation Naturally (Bruce Protocol):**\n\n` +
        `Hyperpigmentation happens when melanocytes overproduce melanin due to trauma/inflammation (like past acne + steroid use). Here is how we reverse it:\n\n` +
        `• **Topical Active:** **Azelaic Acid 10–15%** inhibits tyrosinase (the enzyme producing excess melanin) without bleaching healthy skin.\n` +
        `• **Sun Protection (Critical):** UV rays stimulate melanin. If you step outside for even 10 minutes without SPF 50+, you undo 2 weeks of healing. Re-apply at 3:00 PM!\n` +
        `• **Internal Collagen Booster:** Drink 1 glass fresh Amla juice or eat 1 whole Amla daily (North Karnataka superpower — 20x more Vitamin C than oranges).\n` +
        `• **Night Repair:** Cold-pressed Rosehip Seed Oil is rich in provitamin A and linoleic acid which speeds cellular turnover.\n\n` +
        `Expected timeline: 6–8 weeks for noticeable lightening, 6 months for complete even tone.`;
    }

    return `**✨ Bruce's Daily Skin Healing Protocol:**\n\n` +
      `**Morning (5:35 AM):**\n` +
      `1. Splash lukewarm or cool water (never hot water — it strips your compromised barrier).\n` +
      `2. Gentle Ceramide Cleanser.\n` +
      `3. Niacinamide 5% Serum (soothes redness & strengthens barrier).\n` +
      `4. Barrier Relief Moisturizer.\n` +
      `5. Matte SPF 50+ PA++++ (non-negotiable, even indoors on cloudy days).\n\n` +
      `**Night (9:00 PM):**\n` +
      `1. Gentle Cleanser.\n` +
      `2. Azelaic Acid 10% (pea-sized amount on marks).\n` +
      `3. Ceramide Repair Cream.\n` +
      `4. Rosehip Seed Oil (2 drops pressed into skin).\n` +
      `5. 5 min gentle Gua Sha or jade roller toward lymphatic nodes.\n\n` +
      `Are your skin products fully stocked, or do you need recommendations?`;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. NORTH KARNATAKA VEGETARIAN NUTRITION
  // ─────────────────────────────────────────────────────────────
  if (
    msg.includes('diet') ||
    msg.includes('meal') ||
    msg.includes('eat') ||
    msg.includes('food') ||
    msg.includes('nutrition') ||
    msg.includes('jowar') ||
    msg.includes('bhakri') ||
    msg.includes('roti') ||
    msg.includes('paneer') ||
    msg.includes('soya') ||
    msg.includes('protein') ||
    msg.includes('karnataka') ||
    msg.includes('dinner') ||
    msg.includes('lunch') ||
    msg.includes('breakfast') ||
    msg.includes('vegetarian')
  ) {
    if (msg.includes('dinner')) {
      return `**🥗 North Karnataka Evening Protocol (Clean Cut Dinner):**\n\n` +
        `Bruce, the golden rule for cutting skinny-fat from 70kg to 63kg is: **Zero heavy carbs after 7:30 PM.**\n\n` +
        `**Tonight's Ideal Menu (Target: ~38g Protein, <350 kcal):**\n` +
        `• **Main:** 150g Fresh Paneer (dry sautéed with jeera, turmeric, black pepper, and green chilies) OR 50g Soya chunks dry bhurji.\n` +
        `• **Veggies:** Large bowl of warm Methi (fenugreek) or Palak (spinach) sabzi cooked with garlic & 1 tsp mustard oil.\n` +
        `• **Digestive:** 1 big glass freshly churned Taak (buttermilk) with roasted jeera powder, rock salt, and chopped coriander.\n` +
        `• **Rule:** Skip Jowar roti at dinner! Save your grains for lunch when your metabolism is at its peak.`;
    }

    if (msg.includes('lunch')) {
      return `**🍛 North Karnataka Powerhouse Lunch (Fuel & Recovery):**\n\n` +
        `• **Grains:** 1 medium hot **Jowar Bhakri (Roti)** — gluten-free, low glycemic index, packed with complex fiber.\n` +
        `• **Protein Core:** 1 big bowl Sprouted Moong & Chana Usli (cooked with tadka of curry leaves, mustard seeds, and pinch of hing).\n` +
        `• **Skin Booster:** 1 tablespoon Shengada Chutney (ground peanut + garlic + dry red chili) — provides healthy monounsaturated fats & zinc for tissue repair.\n` +
        `• **Gut Health:** 1 bowl fresh homemade Curd (dahi).\n` +
        `• **Raw Salad:** 1 sliced cucumber + 1 tomato with lemon squeeze.\n\n` +
        `Total: ~35g Protein, ~520 kcal. High satiety, zero afternoon brain fog.`;
    }

    if (msg.includes('jowar') || msg.includes('bhakri')) {
      return `**🌾 Can You Eat Jowar Roti on a Cut? YES!**\n\n` +
        `Jowar (Sorghum) is North Karnataka's greatest gift to fitness athletes:\n` +
        `• **Slow Digesting:** Low Glycemic Index (~62) prevents the insulin spikes that wheat/maida cause.\n` +
        `• **Rich in Micronutrients:** High in magnesium, iron, calcium, and antioxidants (polyphenols) that combat systemic inflammation.\n` +
        `• **Optimal Portion:** Have **1 to 1.5 Jowar Bhakris at lunch** with high-protein usli or dal. Avoid having it late at night so your body burns stored glycogen during sleep.`;
    }

    if (msg.includes('protein') || msg.includes('140g')) {
      return `**💪 How Bruce Hits 140g Pure Vegetarian Protein Every Single Day:**\n\n` +
        `Without meat or eggs, here is your ironclad daily protein math:\n` +
        `1. **Post-Workout (8:00 AM):** 1 scoop Whey Protein or Sattu Shake + 20g soaked almonds = **28g**\n` +
        `2. **Mid-Morning (10:30 AM):** 1 bowl Sprouted Moong Usli + Taak = **16g**\n` +
        `3. **Lunch (1:00 PM):** 1 Jowar Roti + Thick Toor/Chana Dal + Curd = **25g**\n` +
        `4. **Evening Snack (4:30 PM):** 40g roasted chana or roasted soya nuts = **15g**\n` +
        `5. **Dinner (7:30 PM):** 150g low-fat Paneer or 50g Soya Chunk Bhurji = **38g**\n` +
        `6. **Before Bed (9:30 PM):** 200ml warm turmeric milk with 1 tbsp chia/flax seeds = **10g**\n\n` +
        `**Total: ~142g Protein.** Pure vegetarian. 100% locally sourced in Karnataka.`;
    }

    return `**🥗 Bruce's North Karnataka Nutrition Philosophy:**\n\n` +
      `You are cutting from **70kg → 63kg** while curing skinny-fat and healing your skin. We use your traditional North Karnataka food as medicine:\n\n` +
      `• **Daily Calorie Target:** ~1,750 – 1,850 kcal (300 kcal gentle deficit preserves muscle mass).\n` +
      `• **Protein Target:** 140g pure vegetarian.\n` +
      `• **Staples:** Jowar Bhakri, Sprouted Moong, Soya chunks, Paneer, Shengada Chutney, Buttermilk (Taak), Amla, Flaxseeds.\n` +
      `• **Strict Exclusions:** Refined white sugar, deep fried bajjis/pakodas, refined seed oils, packaged snacks.\n\n` +
      `What meal are you planning right now, Bruce?`;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. WORKOUT & GYM TRAINING (SKINNY-FAT FIX)
  // ─────────────────────────────────────────────────────────────
  if (
    msg.includes('workout') ||
    msg.includes('gym') ||
    msg.includes('exercise') ||
    msg.includes('lift') ||
    msg.includes('skinny fat') ||
    msg.includes('push') ||
    msg.includes('pull') ||
    msg.includes('legs') ||
    msg.includes('muscle') ||
    msg.includes('chest') ||
    msg.includes('squat') ||
    msg.includes('deadlift') ||
    msg.includes('reps') ||
    msg.includes('sets') ||
    msg.includes('63kg')
  ) {
    if (msg.includes('skinny fat') || msg.includes('recomp')) {
      return `**⚔️ The Skinny-Fat Annihilation Blueprint (167cm, 70kg → 63kg):**\n\n` +
        `Bruce, "skinny fat" means high visceral body fat percentage combined with underdeveloped muscle mass. If you do extreme starvation cardio, you will end up looking frail. If you dirty bulk, your belly fat will explode.\n\n` +
        `**Here is the exact scientific fix:**\n` +
        `1. **Lifting is Priority #1:** Heavy compound lifts 5 days a week (Push / Pull / Legs). Every session must apply **Progressive Overload** (adding 1 rep or 1.25kg to the bar each week).\n` +
        `2. **Slight Deficit Only (300 kcal):** We eat at ~1,750 kcal so your body is forced to burn abdominal fat for energy while using 140g protein to synthesize dense contractile muscle tissue.\n` +
        `3. **Step Count (NEAT):** 8,000 to 10,000 steps daily. Do not run marathons. Brisk walking burns pure fat without spiking cortisol or muscle-catabolizing hormones.\n` +
        `4. **Greek God Ratios:** Build wide upper lats (Pull-ups) and round lateral deltoids (Side lateral raises) to create the V-taper illusion that makes your waist appear narrower instantly.`;
    }

    if (msg.includes('push') || msg.includes('chest')) {
      return `**💪 Push Day Masterclass (Chest, Shoulders, Triceps):**\n\n` +
        `• **Incline Dumbbell Press:** 4 sets × 8–10 reps. (30-degree incline targets upper clavicular chest — critical for the Greek God armor plate look).\n` +
        `• **Flat Barbell / Machine Press:** 3 sets × 8–10 reps. (Control the 3-second eccentric lower, explosive press).\n` +
        `• **Standing Overhead Press (OHP):** 3 sets × 8–10 reps. (Lock core tight, squeeze glutes).\n` +
        `• **Cable / DB Lateral Raises:** 4 sets × 12–15 reps. (Lead with elbows, pause at parallel for 1 sec).\n` +
        `• **Overhead Rope Tricep Extensions:** 3 sets × 12 reps. (Full stretch on the tricep long head).\n\n` +
        `*Rest:* 90s on compounds, 60s on isolations. Track your numbers in the Arc Day logger!`;
    }

    if (msg.includes('pull') || msg.includes('back')) {
      return `**🔥 Pull Day Masterclass (Upper Back, Lats, Rear Delts, Biceps):**\n\n` +
        `• **Wide Grip Lat Pulldown / Pull-ups:** 4 sets × 8–10 reps. (Drive elbows down into your back pockets).\n` +
        `• **Barbell or Chest-Supported Row:** 4 sets × 8–10 reps. (Squeeze shoulder blades for 1 second at full retraction).\n` +
        `• **Face Pulls with Rope:** 4 sets × 15 reps. (Crucial for posture, rear delts, and shoulder joint health).\n` +
        `• **Incline Dumbbell Bicep Curls:** 3 sets × 10–12 reps. (Maximum stretch on biceps).\n` +
        `• **Hammer Curls:** 3 sets × 10 reps. (Builds brachialis for arm thickness).\n\n` +
        `Leave no reps in reserve on your final set. Let's build that V-Taper!`;
    }

    if (msg.includes('legs') || msg.includes('squat')) {
      return `**⚡ Leg Day Masterclass (Quads, Hamstrings, Glutes, Calves):**\n\n` +
        `Never skip legs, Bruce. Heavy leg training releases natural growth hormone and testosterone that accelerates upper body fat loss.\n\n` +
        `• **Barbell Back Squat or Hack Squat:** 4 sets × 8–10 reps. (Deep depth, knees tracking over toes).\n` +
        `• **Romanian Deadlift (RDL):** 4 sets × 8–10 reps. (Hinge at hips, stretch hamstrings, maintain flat spine).\n` +
        `• **Walking DB Lunges:** 3 sets × 12 steps per leg. (Ultimate quad pump & metabolic furnace).\n` +
        `• **Seated or Lying Leg Curl:** 3 sets × 12 reps.\n` +
        `• **Standing Calf Raises:** 4 sets × 15 reps. (2-second pause at bottom stretch).\n\n` +
        `Warm up thoroughly with hip openers and bodyweight squats before touching the weights.`;
    }

    return `**🏋️ Bruce's 5-Day Winter Arc Training Split:**\n\n` +
      `• **Monday:** Push A (Incline DB, Overhead Press, Lateral Raises, Triceps)\n` +
      `• **Tuesday:** Pull A (Pull-ups/Pulldowns, Rows, Face Pulls, Biceps)\n` +
      `• **Wednesday:** Legs & Core (Squats, RDLs, Lunges, Hanging Leg Raises)\n` +
      `• **Thursday:** Push B (Flat Bench, Shoulder DB Press, Cable Flyes, Dips)\n` +
      `• **Friday:** Pull B (Single Arm DB Row, Lat Pulldowns, Hammer Curls, Rear Delts)\n` +
      `• **Saturday:** High-Intensity Core & 10k Steps Fat Burn Walk\n` +
      `• **Sunday:** Active Recovery, Sauna/Hot Bath, Deep Mobility & Rest\n\n` +
      `What muscle group are you hitting today?`;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. DISCIPLINE, 5:30 AM WAKE UP, & MINDSET
  // ─────────────────────────────────────────────────────────────
  if (
    msg.includes('wake') ||
    msg.includes('alarm') ||
    msg.includes('morning') ||
    msg.includes('motivation') ||
    msg.includes('discipline') ||
    msg.includes('lazy') ||
    msg.includes('tired') ||
    msg.includes('hard') ||
    msg.includes('92kg') ||
    msg.includes('give up')
  ) {
    return `**👑 The Bruce Mindset: You Already Cut 22kg. Now We Achieve Greatness.**\n\n` +
      `Listen to me very clearly, Bruce:\n\n` +
      `4 years ago, you stood at **92 kg**. Most people would have given up. They would have accepted being overweight and made endless excuses. **You didn't.** You ground through the sweat and dropped all the way to **70 kg**.\n\n` +
      `Do you realize what kind of willpower that takes? That is **22 kilograms of pure fat destroyed**.\n\n` +
      `Now you are at the final frontier. We are dropping from **70 kg down to 63 kg**, carving out chiseled abs, broad shoulders, and healing your skin naturally so you look in the mirror with 100% pride.\n\n` +
      `• When that 5:30 AM alarm rings: Feet on the floor in 3 seconds. No snooze button. No negotiation.\n` +
      `• When you feel like eating junk: Remember the 2027 goal.\n` +
      `• When skin healing feels slow: Cells take 45 days to renew. The clock is ticking in your favor.\n\n` +
      `Winter Arc Day ${currentDay} is yours to conquer. Let's get to work! 🔥`;
  }

  // ─────────────────────────────────────────────────────────────
  // 5. DEFAULT HOLISTIC COACH COUNSEL
  // ─────────────────────────────────────────────────────────────
  return `**🔥 Bruce, I am here as your Senior Coach, Gym Trainer, & Nutritionist.**\n\n` +
    `Current Arc Day: **Day ${currentDay}** | Current Streak: **${streak} Days**\n\n` +
    `Here is where we stand on your 2027 transformation:\n` +
    `• **Body:** 167cm | 70kg → 63kg Greek God cut (140g pure vegetarian protein, 1750 kcal)\n` +
    `• **Skin:** Active Betnovate-N steroid withdrawal recovery (Ceramides + Azelaic + SPF 50+)\n` +
    `• **Diet:** North Karnataka vegetarian power staples (Jowar, Sprouts, Soya, Paneer, Taak)\n` +
    `• **Routine:** 5:30 AM wakeup locked in\n\n` +
    `Ask me anything specific right now:\n` +
    `1. *"What should I eat for my next meal?"*\n` +
    `2. *"Give me my workout routine for today"*\n` +
    `3. *"How do I speed up hyperpigmentation healing?"*\n` +
    `4. *"I feel low energy, how do I reset?"*`;
}
