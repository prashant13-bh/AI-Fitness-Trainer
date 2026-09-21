// ==============================================================================
// COMPLETE EXERCISE BIOMECHANICS, WORKOUTS & NUTRITION DATABASE
// Compiled from fitness science, exercise physiology, and computer vision standards
// ==============================================================================

export type MuscleGroup =
  | 'Chest'
  | 'Upper Chest'
  | 'Quads'
  | 'Hamstrings'
  | 'Glutes'
  | 'Back'
  | 'Lats'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Core'
  | 'Hip Flexors'
  | 'Calves'
  | 'Cardiovascular';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type EquipmentRequired = 'Bodyweight' | 'Pullup Bar' | 'Dumbbells' | 'Resistance Band' | 'Mat';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Upper Body' | 'Lower Body' | 'Core' | 'Full Body / Cardio';
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  difficulty: DifficultyLevel;
  equipment: EquipmentRequired;
  calorieBurnPerRep: number; // in kcal
  calorieBurnPerMinute: number; // for isometric / cardio
  visionSupported: boolean;
  angleRules?: {
    primaryJoint: string; // e.g. 'Shoulder-Elbow-Wrist' or 'Hip-Knee-Ankle'
    upAngle: number;
    downAngle: number;
    formTolerance: string;
  };
  formCues: {
    setup: string;
    execution: string;
    commonMistakes: string[];
    audioCorrectionCues: string[];
  };
}

export const COMPREHENSIVE_EXERCISE_DATABASE: ExerciseDefinition[] = [
  // ── UPPER BODY ─────────────────────────────────────────────────────────────
  {
    id: 'pushups',
    name: 'Standard Push-Up',
    category: 'Upper Body',
    primaryMuscles: ['Chest', 'Triceps'],
    secondaryMuscles: ['Shoulders', 'Core'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.5,
    calorieBurnPerMinute: 8.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Elbow-Wrist',
      upAngle: 155,
      downAngle: 90,
      formTolerance: 'Spine line (Shoulder-Hip-Ankle) > 150°',
    },
    formCues: {
      setup: 'Hands slightly wider than shoulder-width, fingers forward, toes tucked, body forming a straight plank.',
      execution: 'Inhale and lower chest to 2 inches off the ground; flare elbows at ~45 degrees. Exhale and drive up to full arm extension.',
      commonMistakes: ['Sagging lower back / dropping hips', 'Flaring elbows at 90 degrees', 'Incomplete lockout at top'],
      audioCorrectionCues: ['Keep your hips elevated!', 'Tuck your elbows to 45 degrees', 'Chest all the way to floor', 'Drive through palms!'],
    },
  },
  {
    id: 'diamond_pushups',
    name: 'Diamond Push-Up',
    category: 'Upper Body',
    primaryMuscles: ['Triceps', 'Chest'],
    secondaryMuscles: ['Shoulders', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.6,
    calorieBurnPerMinute: 8.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Elbow-Wrist',
      upAngle: 150,
      downAngle: 85,
      formTolerance: 'Hands touching under sternum',
    },
    formCues: {
      setup: 'Place index fingers and thumbs together under chest forming a diamond shape.',
      execution: 'Lower chest directly toward diamond, keeping elbows close to your torso. Press up explosively.',
      commonMistakes: ['Allowing elbows to flare outward', 'Arching back instead of holding tight core'],
      audioCorrectionCues: ['Keep elbows tucked to ribcage', 'Tighten glutes and abs', 'Full tricep extension!'],
    },
  },
  {
    id: 'dips',
    name: 'Parallel Bar / Bench Dips',
    category: 'Upper Body',
    primaryMuscles: ['Triceps', 'Chest'],
    secondaryMuscles: ['Shoulders'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.7,
    calorieBurnPerMinute: 9.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Elbow-Wrist',
      upAngle: 160,
      downAngle: 90,
      formTolerance: 'Avoid dipping below 85° to protect rotator cuff',
    },
    formCues: {
      setup: 'Grip bars or bench firmly with arms straight, chest up, shoulders depressed down.',
      execution: 'Lower body until elbows bend to 90 degrees. Drive upward using triceps and chest to lockout.',
      commonMistakes: ['Dropping too low causing shoulder strain', 'Shrugging shoulders into ears'],
      audioCorrectionCues: ['Keep chest proud', 'Stop at 90 degrees', 'Lock out triceps at the top'],
    },
  },
  {
    id: 'pullups',
    name: 'Standard Pull-Up',
    category: 'Upper Body',
    primaryMuscles: ['Lats', 'Back'],
    secondaryMuscles: ['Biceps', 'Core'],
    difficulty: 'Advanced',
    equipment: 'Pullup Bar',
    calorieBurnPerRep: 1.0,
    calorieBurnPerMinute: 9.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Elbow-Wrist',
      upAngle: 50, // Chin over bar, elbow acute
      downAngle: 165, // Dead hang
      formTolerance: 'Chin passes bar horizontal plane',
    },
    formCues: {
      setup: 'Overhand grip wider than shoulder width. Start from a dead hang with engaged lats.',
      execution: 'Drive elbows down and back toward ribs until chin clears bar. Lower under control without swinging.',
      commonMistakes: ['Kicking legs / kipping', 'Half reps without full extension', 'Craning neck instead of chest up'],
      audioCorrectionCues: ['Full dead hang at bottom', 'Pull elbows to your pockets', 'No swinging or kicking!'],
    },
  },
  {
    id: 'bicep_curls',
    name: 'Bicep Curl',
    category: 'Upper Body',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Core'],
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    calorieBurnPerRep: 0.35,
    calorieBurnPerMinute: 6.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Elbow-Wrist',
      upAngle: 40,
      downAngle: 160,
      formTolerance: 'Elbows pinned to sides (minimal shoulder swing)',
    },
    formCues: {
      setup: 'Stand tall with weights at sides, palms facing forward, elbows pinned to hips.',
      execution: 'Curl weights upward squeezing biceps at peak contraction. Lower under controlled 2-second negative.',
      commonMistakes: ['Swinging torso or using momentum', 'Elbows drifting forward during lift'],
      audioCorrectionCues: ['Pin elbows to your sides', 'Slow down the negative', 'Squeeze at the top!'],
    },
  },
  {
    id: 'shoulder_press',
    name: 'Overhead Shoulder Press',
    category: 'Upper Body',
    primaryMuscles: ['Shoulders', 'Triceps'],
    secondaryMuscles: ['Core', 'Upper Chest'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    calorieBurnPerRep: 0.6,
    calorieBurnPerMinute: 7.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Elbow-Shoulder-Hip',
      upAngle: 165,
      downAngle: 85,
      formTolerance: 'Arms align overhead without hyperextending lumbar spine',
    },
    formCues: {
      setup: 'Weights at collarbone height, knuckles to ceiling, core and glutes engaged.',
      execution: 'Press vertically until arms lock overhead. Lower slowly back to ear/collar level.',
      commonMistakes: ['Arching lower back', 'Pressing forward rather than directly overhead'],
      audioCorrectionCues: ['Brace your core', 'Lock out over your crown', 'Control the descent'],
    },
  },

  // ── LOWER BODY ─────────────────────────────────────────────────────────────
  {
    id: 'squats',
    name: 'Bodyweight Deep Squat',
    category: 'Lower Body',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core', 'Calves'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.45,
    calorieBurnPerMinute: 8.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Hip-Knee-Ankle',
      upAngle: 165,
      downAngle: 90,
      formTolerance: 'Hip crease drops below knee level (parallel or below)',
    },
    formCues: {
      setup: 'Feet shoulder-width apart, toes slightly flared outward (15–30°), weight distributed across mid-foot and heel.',
      execution: 'Hinge hips back and bend knees, driving knees outward in line with toes until parallel depth. Drive through heels to stand.',
      commonMistakes: ['Knees caving inward (valgus collapse)', 'Rising onto toes', 'Rounding upper or lower spine'],
      audioCorrectionCues: ['Knees out over toes!', 'Break parallel depth', 'Drive through your heels', 'Chest high!'],
    },
  },
  {
    id: 'jump_squats',
    name: 'Plyometric Jump Squat',
    category: 'Lower Body',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Calves', 'Hamstrings', 'Cardiovascular'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.8,
    calorieBurnPerMinute: 11.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Hip-Knee-Ankle',
      upAngle: 175,
      downAngle: 95,
      formTolerance: 'Explosive jump with soft toe-to-heel landing absorption',
    },
    formCues: {
      setup: 'Athletic stance, feet shoulder-width, arms held in front.',
      execution: 'Descend into a quarter-to-half squat, then explode vertically pushing through the floor. Land softly absorbing impact.',
      commonMistakes: ['Stiff-legged landing causing joint shock', 'Landing with knees buckled inwards'],
      audioCorrectionCues: ['Land softly on balls of feet', 'Explode upward!', 'Absorb into next squat'],
    },
  },
  {
    id: 'lunges',
    name: 'Walking / Alternating Lunge',
    category: 'Lower Body',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.4,
    calorieBurnPerMinute: 7.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Hip-Knee-Ankle (Front Leg)',
      upAngle: 160,
      downAngle: 90,
      formTolerance: 'Front knee stays over ankle; back knee taps ground lightly',
    },
    formCues: {
      setup: 'Stand upright with core braced, hands on hips or chest.',
      execution: 'Step forward ~3 feet, lower hips until both knees form 90° angles. Press off front heel to return.',
      commonMistakes: ['Front knee drifting far past toes', 'Torso collapsing forward', 'Back knee slamming into floor'],
      audioCorrectionCues: ['Step out further', 'Keep torso vertical', 'Bend back knee to 90 degrees'],
    },
  },
  {
    id: 'glute_bridges',
    name: 'Glute Bridge / Hip Thrust',
    category: 'Lower Body',
    primaryMuscles: ['Glutes', 'Hamstrings'],
    secondaryMuscles: ['Core'],
    difficulty: 'Beginner',
    equipment: 'Mat',
    calorieBurnPerRep: 0.35,
    calorieBurnPerMinute: 6.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Hip-Knee',
      upAngle: 175,
      downAngle: 110,
      formTolerance: 'Straight line from shoulder to knee at peak contraction',
    },
    formCues: {
      setup: 'Lie on back with knees bent at 90°, feet flat on floor hip-width apart.',
      execution: 'Drive through heels to lift hips toward ceiling until thighs and torso align. Squeeze glutes for 1 second at top.',
      commonMistakes: ['Hyperextending lumbar spine instead of glute engagement', 'Pushing through toes instead of heels'],
      audioCorrectionCues: ['Squeeze glutes at top', 'Drive through heels', 'Do not arch lower back'],
    },
  },
  {
    id: 'calf_raises',
    name: 'Standing Calf Raise',
    category: 'Lower Body',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Core'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.2,
    calorieBurnPerMinute: 5.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Knee-Ankle-Toe',
      upAngle: 140,
      downAngle: 90,
      formTolerance: 'Full plantar flexion at peak',
    },
    formCues: {
      setup: 'Stand on edge of step or flat ground with balls of feet firmly planted.',
      execution: 'Raise heels as high as possible, holding peak contraction for 1 second. Lower heels below step level for deep stretch.',
      commonMistakes: ['Bouncing rapidly without pause', 'Rolling ankles outward'],
      audioCorrectionCues: ['Pause at top for 1 second', 'Full stretch at bottom', 'Control tempo'],
    },
  },

  // ── CORE & ISOMETRICS ──────────────────────────────────────────────────────
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    difficulty: 'Beginner',
    equipment: 'Mat',
    calorieBurnPerRep: 0.15,
    calorieBurnPerMinute: 6.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Hip-Ankle',
      upAngle: 175,
      downAngle: 175,
      formTolerance: 'Straight line 160° - 190°',
    },
    formCues: {
      setup: 'Forearms on ground under shoulders, elbows 90°, legs extended behind with toes tucked.',
      execution: 'Hold rigid body alignment. Squeeze glutes, draw navel into spine, breathe steadily.',
      commonMistakes: ['Piking hips into tent', 'Hips sagging toward ground putting stress on lower back', 'Holding breath'],
      audioCorrectionCues: ['Lower your hips slightly', 'Tighten your core!', 'Keep breathing steadily', 'Glutes locked in!'],
    },
  },
  {
    id: 'side_plank',
    name: 'Side Plank',
    category: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    difficulty: 'Intermediate',
    equipment: 'Mat',
    calorieBurnPerRep: 0.15,
    calorieBurnPerMinute: 7.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Shoulder-Hip-Ankle',
      upAngle: 180,
      downAngle: 180,
      formTolerance: 'Linear lateral spine line',
    },
    formCues: {
      setup: 'Lie on side with elbow directly under shoulder, feet stacked or staggered.',
      execution: 'Lift hips off ground until body forms straight diagonal line from head to feet. Hold.',
      commonMistakes: ['Hips sagging toward floor', 'Top shoulder rolling forward'],
      audioCorrectionCues: ['Lift hips higher', 'Keep chest open', 'Engage bottom oblique'],
    },
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'Core',
    primaryMuscles: ['Core', 'Cardiovascular'],
    secondaryMuscles: ['Shoulders', 'Quads'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.3,
    calorieBurnPerMinute: 10.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Hip-Knee (alternating)',
      upAngle: 60,
      downAngle: 160,
      formTolerance: 'Hips remain level during knee drives',
    },
    formCues: {
      setup: 'Start in top push-up plank position with wrists directly under shoulders.',
      execution: 'Drive one knee toward chest without letting hips rise, then quickly switch legs in running motion.',
      commonMistakes: ['Bouncing hips up and down', 'Hands drifting forward ahead of shoulders'],
      audioCorrectionCues: ['Keep hips down', 'Drive knees fast', 'Hands under shoulders'],
    },
  },
  {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunch',
    category: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Hip Flexors'],
    difficulty: 'Beginner',
    equipment: 'Mat',
    calorieBurnPerRep: 0.35,
    calorieBurnPerMinute: 7.5,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Elbow to opposite Knee',
      upAngle: 30,
      downAngle: 150,
      formTolerance: 'Shoulder blades off mat throughout',
    },
    formCues: {
      setup: 'Lie flat with hands supporting head, knees at tabletop 90°.',
      execution: 'Bring right elbow to left knee while extending right leg out to 45°. Alternate sides rhythmically.',
      commonMistakes: ['Pulling on neck with hands', 'Moving too fast without full rotation'],
      audioCorrectionCues: ['Rotate torso, not just elbows', 'Extend leg fully', 'Control the pace'],
    },
  },

  // ── FULL BODY & CARDIO ─────────────────────────────────────────────────────
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'Full Body / Cardio',
    primaryMuscles: ['Cardiovascular', 'Calves'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.25,
    calorieBurnPerMinute: 9.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Wrist-Shoulder-Ankle spread',
      upAngle: 180, // Hands overhead, feet wide
      downAngle: 0, // Hands at sides, feet together
      formTolerance: 'Wrists cross above shoulder level',
    },
    formCues: {
      setup: 'Stand upright with feet together and arms at sides.',
      execution: 'Jump feet apart wider than shoulders while swinging arms overhead. Jump back to starting stance.',
      commonMistakes: ['Incomplete arm movement (hands not meeting top)', 'Landing heavily on heels'],
      audioCorrectionCues: ['Reach arms all the way up', 'Land lightly on balls of feet', 'Maintain steady rhythm'],
    },
  },
  {
    id: 'burpees',
    name: 'Full Body Burpee',
    category: 'Full Body / Cardio',
    primaryMuscles: ['Cardiovascular', 'Chest', 'Quads'],
    secondaryMuscles: ['Core', 'Shoulders', 'Calves'],
    difficulty: 'Advanced',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 1.2,
    calorieBurnPerMinute: 13.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Full transition: Plank -> Pushup -> Jump',
      upAngle: 180,
      downAngle: 90,
      formTolerance: 'Chest touches deck + vertical jump with clap overhead',
    },
    formCues: {
      setup: 'Stand tall with feet hip-width apart.',
      execution: 'Drop hands to floor, kick feet back into plank, drop chest to floor, push up, jump feet forward, explode into vertical jump.',
      commonMistakes: ['Arching lower back on push-up', 'Skipping chest-to-floor phase'],
      audioCorrectionCues: ['Chest to deck!', 'Jump and clap overhead', 'Pace your breathing'],
    },
  },
  {
    id: 'high_knees',
    name: 'High Knees Sprint',
    category: 'Full Body / Cardio',
    primaryMuscles: ['Cardiovascular', 'Quads'],
    secondaryMuscles: ['Calves', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    calorieBurnPerRep: 0.2,
    calorieBurnPerMinute: 11.0,
    visionSupported: true,
    angleRules: {
      primaryJoint: 'Hip-Knee elevation',
      upAngle: 90, // Knee reaches hip height
      downAngle: 170,
      formTolerance: 'Knee crosses horizontal hip plane (90°)',
    },
    formCues: {
      setup: 'Stand tall with core braced and chest lifted.',
      execution: 'Run in place pumping knees rapidly up to hip level while synchronizing arm swing.',
      commonMistakes: ['Leaning backward', 'Knees only reaching half height'],
      audioCorrectionCues: ['Knees up to hip level!', 'Pump your arms', 'Stay on your toes'],
    },
  },
];

// ==============================================================================
// PRE-BUILT 90-DAY WINTER ARC PROTOCOLS & WORKOUT ROUTINES
// ==============================================================================

export interface WorkoutRoutine {
  id: string;
  name: string;
  targetArcDayRange: string;
  estimatedDurationMin: number;
  totalCaloriesBurnedEst: number;
  description: string;
  exercises: {
    exerciseId: string;
    targetReps?: number;
    targetSets?: number;
    targetDurationSec?: number;
    restSecBetweenSets: number;
  }[];
}

export const WINTER_ARC_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'phase1_foundation',
    name: 'Phase 1: The Armor Foundation',
    targetArcDayRange: 'Days 1 - 30',
    estimatedDurationMin: 35,
    totalCaloriesBurnedEst: 280,
    description: 'Rebuild baseline muscular endurance, joint mobility, and core integrity. Non-negotiable execution.',
    exercises: [
      { exerciseId: 'pushups', targetSets: 4, targetReps: 15, restSecBetweenSets: 60 },
      { exerciseId: 'squats', targetSets: 4, targetReps: 20, restSecBetweenSets: 60 },
      { exerciseId: 'lunges', targetSets: 3, targetReps: 12, restSecBetweenSets: 45 },
      { exerciseId: 'plank', targetSets: 3, targetDurationSec: 45, restSecBetweenSets: 45 },
      { exerciseId: 'jumping_jacks', targetSets: 3, targetReps: 40, restSecBetweenSets: 30 },
    ],
  },
  {
    id: 'phase2_hypertrophy_grit',
    name: 'Phase 2: Hypertrophy & Unbroken Grit',
    targetArcDayRange: 'Days 31 - 60',
    estimatedDurationMin: 45,
    totalCaloriesBurnedEst: 390,
    description: 'Escalate progressive overload, time under tension, and high-intensity metabolic conditioning.',
    exercises: [
      { exerciseId: 'diamond_pushups', targetSets: 4, targetReps: 12, restSecBetweenSets: 60 },
      { exerciseId: 'jump_squats', targetSets: 4, targetReps: 15, restSecBetweenSets: 60 },
      { exerciseId: 'pullups', targetSets: 4, targetReps: 8, restSecBetweenSets: 90 },
      { exerciseId: 'mountain_climbers', targetSets: 3, targetDurationSec: 40, restSecBetweenSets: 45 },
      { exerciseId: 'side_plank', targetSets: 3, targetDurationSec: 30, restSecBetweenSets: 30 },
    ],
  },
  {
    id: 'phase3_ironclad_finisher',
    name: 'Phase 3: The Ironclad Apex',
    targetArcDayRange: 'Days 61 - 90',
    estimatedDurationMin: 50,
    totalCaloriesBurnedEst: 470,
    description: 'Elite conditioning, mental resilience, and peak physical definition to seal the 90-Day Arc.',
    exercises: [
      { exerciseId: 'burpees', targetSets: 4, targetReps: 15, restSecBetweenSets: 60 },
      { exerciseId: 'pullups', targetSets: 4, targetReps: 10, restSecBetweenSets: 90 },
      { exerciseId: 'squats', targetSets: 5, targetReps: 25, restSecBetweenSets: 45 },
      { exerciseId: 'diamond_pushups', targetSets: 4, targetReps: 15, restSecBetweenSets: 60 },
      { exerciseId: 'plank', targetSets: 3, targetDurationSec: 60, restSecBetweenSets: 45 },
    ],
  },
];

// ==============================================================================
// NUTRITION & METABOLIC CALCULATION UTILITIES
// ==============================================================================

export interface MetabolicMetrics {
  bmr: number; // Basal Metabolic Rate (kcal)
  tdee: number; // Total Daily Energy Expenditure (kcal)
  targetCalories: {
    maintenance: number;
    cutDeficit: number; // For fat loss (-500 kcal)
    leanBulk: number; // For muscle building (+300 kcal)
  };
  dailyMacros: {
    proteinGrams: number; // 2.0g per kg
    fatsGrams: number; // 25% of calories
    carbsGrams: number; // Remainder
  };
  hydrationTargetLiters: number;
}

/**
 * Calculates BMR and TDEE using the clinical Mifflin-St Jeor equation
 */
export function calculateMetabolicProfile(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female',
  activityMultiplier: number = 1.4 // Moderately active default
): MetabolicMetrics {
  // Mifflin-St Jeor formula
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = Math.round(gender === 'male' ? baseBMR + 5 : baseBMR - 161);
  const tdee = Math.round(bmr * activityMultiplier);

  const maintenance = tdee;
  const cutDeficit = Math.round(tdee - 500);
  const leanBulk = Math.round(tdee + 300);

  // Target macros for athletic body composition (cut/maintenance baseline)
  const proteinGrams = Math.round(weightKg * 2.0); // 2g/kg
  const fatCalories = maintenance * 0.25;
  const fatsGrams = Math.round(fatCalories / 9);
  const carbCalories = maintenance - (proteinGrams * 4 + fatCalories);
  const carbsGrams = Math.max(0, Math.round(carbCalories / 4));

  // Hydration standard: ~35ml per kg of body weight + 500ml for training
  const hydrationTargetLiters = Number(((weightKg * 35 + 500) / 1000).toFixed(1));

  return {
    bmr,
    tdee,
    targetCalories: {
      maintenance,
      cutDeficit,
      leanBulk,
    },
    dailyMacros: {
      proteinGrams,
      fatsGrams,
      carbsGrams,
    },
    hydrationTargetLiters,
  };
}
