# 🔱 Bruce Glow-Up 2027 — Implementation Roadmap & Task Tracker

**Athlete:** Bruce  
**Goal:** 70kg → 63kg Greek God Recomp | 140g North Karnataka Pure Veg Nutrition | Betnovate-N Steroid Recovery  
**Total Timeline:** 457 Days (Oct 1, 2026 – Dec 31, 2027)

---

## 📋 Task Pipeline

### [x] Task 1: Hands-Free Voice Dictation (STT) in AI Coach
- [x] Add Web Speech Recognition API (`webkitSpeechRecognition` / `SpeechRecognition`)
- [x] Pulsing animated microphone button in [`src/app/coach/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/coach/page.tsx)
- [x] Real-time listening indicator & interim speech transcription
- [x] Hands-free voice query submission to Senior AI Coach
- [x] Fallback for browsers without speech recognition support

### [x] Task 2: Weekly North Karnataka Kirana & Grocery Shopping Generator
- [x] Create interactive checklist component [`src/components/nutrition/KiranaShoppingList.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/components/nutrition/KiranaShoppingList.tsx)
- [x] Itemized categories: Staples (Jowar, Shenga, Dal, Moong, Soya), Dairy (Paneer, Curd, Taak), Veggies & Spices, Skincare Actives
- [x] Quantity calculator for 1 week vs 2 weeks
- [x] 1-Click WhatsApp Share button (formats clean message for shopping/family)
- [x] Embed in [`src/app/nk-diet/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/nk-diet/page.tsx) with tab navigation

### [x] Task 3: Native Google Calendar / iCal (.ics) Routine Export
- [x] Build RFC 5545 calendar file generator [`src/lib/calendarExport.ts`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/lib/calendarExport.ts)
- [x] Export daily recurring reminders: 5:30 AM Wake-up, 6:30 AM Gym PPL, 1:00 PM NK Fuel, 9:00 PM Skin Recovery
- [x] 1-Click "Add to Google Calendar" web links + `.ics` file download
- [x] Wire to [`src/app/glowup/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/glowup/page.tsx) and [`src/app/profile/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/profile/page.tsx)

### [x] Task 4: High-Contrast Printable A4 Poster / Wall Cheat Sheet View
- [x] Create dedicated print route [`src/app/poster/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/poster/page.tsx)
- [x] High-contrast black & white / gold layout designed for A4 wall printing
- [x] Includes weekly PPL matrix, 6 daily meals with timings/macros, AM/PM skin rules, Bruce 2027 pledge
- [x] 1-Click Print button with `@media print` styling

### [x] Task 5: Real-time Audio Voice Rep & Form Coaching in Camera Tracker
- [x] Connect Web Speech synthesis voice to [`src/components/trainer/PoseWorkoutTracker.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/components/trainer/PoseWorkoutTracker.tsx)
- [x] Spoken rep counting ("One... Two... Halfway there, Bruce!... Eight!")
- [x] Real-time form alerts ("Keep back straight!", "Go lower on the squat!")
- [x] Audio toggle to mute/unmute voice coach

### [x] Task 6: Real-Time Clock & Date Synchronization Engine
- [x] Create timezone-safe local date calculation (`getLocalISODate`) eliminating UTC midnight rollbacks in IST
- [x] Live ticking 12-hour clock (with seconds: `01:14:05 AM`) updating every 1000ms
- [x] Live 24-Hour schedule block tracker highlighting active routine (Deep Sleep, 5:30 AM Rise, AM Skin, Gym, NK Meals, PM Skin)
- [x] Global `<RealTimeClockBar />` integrated into desktop topbar and mobile sticky banner
- [x] Dynamic Arc Day & real weekday matching in [`src/app/arc/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/arc/page.tsx) and [`src/app/progress/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/progress/page.tsx)
- [x] Real-time Current Meal Advisor and pulsing "TODAY" tab indicator in [`src/app/nk-diet/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/nk-diet/page.tsx)
- [x] Synchronized AI Coach context with live Arc day and current day streak in [`src/app/coach/page.tsx`](file:///c:/Users/prashant%20B%20hiremath/.gemini/antigravity/scratch/ai-fitness-trainer/src/app/coach/page.tsx)
- [x] Timezone-safe local ISO dates wired across local storage keys, Supabase sync, backup export, and profile models

---
*Status: All 6 Tasks Complete & Verified.*
