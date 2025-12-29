export interface UserStats {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: "male" | "female";
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  goal: "lose_weight" | "build_muscle" | "maintain" | "recomp";
}

export interface AnalysisResult {
  bmi: number;
  bmiCategory: string;
  tdee: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  bodyArchetype: string;
}

export function calculateAnalysis(stats: UserStats): AnalysisResult {
  // 1. Calculate BMI
  const heightM = stats.height / 100;
  const bmi = parseFloat((stats.weight / (heightM * heightM)).toFixed(1));
  
  let bmiCategory = "Normal";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
  else if (bmi >= 30) bmiCategory = "Obese";

  // 2. Calculate BMR (Mifflin-St Jeor Equation)
  let bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age;
  if (stats.gender === "male") bmr += 5;
  else bmr -= 161;

  // 3. Calculate TDEE
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const tdee = Math.round(bmr * activityMultipliers[stats.activityLevel]);

  // 4. Calculate Target Calories & Macros
  let dailyCalories = tdee;
  if (stats.goal === "lose_weight") dailyCalories -= 500;
  else if (stats.goal === "build_muscle") dailyCalories += 300;
  else if (stats.goal === "recomp") dailyCalories -= 200; // Slight deficit for recomp

  // Macros (Protein heavy for muscle)
  // Protein: 2g per kg of bodyweight (approx)
  const protein = Math.round(stats.weight * 2);
  const proteinCals = protein * 4;
  
  // Fats: 0.8g per kg
  const fats = Math.round(stats.weight * 0.8);
  const fatsCals = fats * 9;

  // Carbs: Remainder
  const remainingCals = dailyCalories - (proteinCals + fatsCals);
  const carbs = Math.round(remainingCals / 4);

  // 5. Assign Archetype
  let bodyArchetype = "The Balanced Warrior";
  if (bmi < 18.5) bodyArchetype = "The Hardgainer";
  else if (bmi > 25 && stats.goal === "lose_weight") bodyArchetype = "The Titan";
  else if (stats.goal === "recomp") bodyArchetype = "The Phoenix";

  return {
    bmi,
    bmiCategory,
    tdee,
    dailyCalories,
    protein,
    carbs,
    fats,
    bodyArchetype
  };
}
