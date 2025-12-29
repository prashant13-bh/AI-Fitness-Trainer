import { UserStats } from "./analysis";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  videoUrl?: string; // Placeholder for future video integration
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

export function generateWorkoutPlan(stats: UserStats): WorkoutDay[] {
  const plan: WorkoutDay[] = [];

  // Logic based on goal and experience (simplified for MVP)
  if (stats.goal === "build_muscle" || stats.goal === "recomp") {
    // Push/Pull/Legs Split
    plan.push({
      day: "Monday",
      focus: "Push (Chest, Shoulders, Triceps)",
      exercises: [
        { name: "Pushups", sets: 3, reps: "10-15" },
        { name: "Incline Pushups", sets: 3, reps: "10-12" },
        { name: "Pike Pushups (Shoulders)", sets: 3, reps: "8-10" },
        { name: "Tricep Dips", sets: 3, reps: "10-12" },
      ]
    });
    plan.push({
      day: "Tuesday",
      focus: "Pull (Back, Biceps)",
      exercises: [
        { name: "Pull-ups (or Negatives)", sets: 3, reps: "Max" },
        { name: "Door Frame Rows", sets: 3, reps: "12-15" },
        { name: "Chin-ups", sets: 3, reps: "Max" },
        { name: "Superman Hold", sets: 3, reps: "30s" },
      ]
    });
    plan.push({
      day: "Wednesday",
      focus: "Legs & Core",
      exercises: [
        { name: "Bodyweight Squats", sets: 4, reps: "20" },
        { name: "Lunges", sets: 3, reps: "12 each leg" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "8 each leg" },
        { name: "Plank", sets: 3, reps: "45s" },
      ]
    });
    plan.push({ day: "Thursday", focus: "Rest / Active Recovery", exercises: [] });
    plan.push({
      day: "Friday",
      focus: "Upper Body",
      exercises: [
        { name: "Diamond Pushups", sets: 3, reps: "8-10" },
        { name: "Wide Pushups", sets: 3, reps: "12-15" },
        { name: "Door Rows", sets: 3, reps: "15" },
      ]
    });
    plan.push({
      day: "Saturday",
      focus: "Lower Body & HIIT",
      exercises: [
        { name: "Jump Squats", sets: 3, reps: "15" },
        { name: "Burpees", sets: 3, reps: "10" },
        { name: "Calf Raises", sets: 4, reps: "20" },
      ]
    });
    plan.push({ day: "Sunday", focus: "Rest", exercises: [] });
  } else {
    // Weight Loss Focus (Full Body Circuits)
    const circuit = [
      { name: "Jumping Jacks", sets: 3, reps: "45s" },
      { name: "Bodyweight Squats", sets: 3, reps: "20" },
      { name: "Pushups", sets: 3, reps: "10" },
      { name: "Mountain Climbers", sets: 3, reps: "30s" },
      { name: "Plank", sets: 3, reps: "30s" },
    ];
    
    ["Monday", "Wednesday", "Friday"].forEach(day => {
      plan.push({ day, focus: "Full Body Circuit", exercises: circuit });
    });
    ["Tuesday", "Thursday"].forEach(day => {
      plan.push({ day, focus: "Cardio / Walk", exercises: [{ name: "Brisk Walk / Jog", sets: 1, reps: "30 mins" }] });
    });
    plan.push({ day: "Saturday", focus: "Active Fun", exercises: [{ name: "Sports / Hiking", sets: 1, reps: "60 mins" }] });
    plan.push({ day: "Sunday", focus: "Rest", exercises: [] });
  }

  return plan;
}

export function generateDietPlan(stats: UserStats, dailyCalories: number): DietPlan {
  // Simplified logic - in a real app, this would be much more complex or use an API
  // Adjusting portion sizes based on calories roughly
  
  const isVeg = true; // Assuming vegetarian based on prompt, but could be dynamic
  
  if (isVeg) {
    return {
      breakfast: {
        name: "Power Oats / Poha",
        calories: Math.round(dailyCalories * 0.25),
        protein: 15,
        carbs: 40,
        fats: 10,
        description: "Oats with milk/water, nuts, and a banana. Or Poha with peanuts."
      },
      lunch: {
        name: "Roti, Dal & Sabji",
        calories: Math.round(dailyCalories * 0.35),
        protein: 25,
        carbs: 60,
        fats: 15,
        description: "2-3 Rotis, thick Dal (lentils), green leafy vegetable, and salad."
      },
      snack: {
        name: "Protein Boost",
        calories: Math.round(dailyCalories * 0.10),
        protein: 10,
        carbs: 15,
        fats: 5,
        description: "Roasted Chana, Peanuts, or a fruit."
      },
      dinner: {
        name: "Light & High Protein",
        calories: Math.round(dailyCalories * 0.30),
        protein: 20,
        carbs: 30,
        fats: 10,
        description: "Soya Chunks curry with Rice/Roti or Paneer salad."
      }
    };
  }
  
  // Default return (should handle non-veg too)
  return {} as DietPlan;
}
