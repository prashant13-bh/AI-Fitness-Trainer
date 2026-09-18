import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateDayScore } from "@/lib/scoring";
import type { LocalHabit, HabitStatus } from "@/lib/types";

const INITIAL_HABITS: LocalHabit[] = [
  {
    id: "habit-1",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "Morning Strength & Mobility",
    area: "Body",
    icon: "dumbbell",
    type: "duration",
    difficulty: 2,
    target_value: 45,
    target_unit: "mins",
    minimum_value: 15,
    minimum_unit: "mins",
    xp_complete: 25,
    xp_minimum: 10,
    sort_order: 1,
    is_active: true,
    status: "pending",
  },
  {
    id: "habit-2",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "Hydration & Electrolytes (3L)",
    area: "Body",
    icon: "water",
    type: "quantity",
    difficulty: 1,
    target_value: 3000,
    target_unit: "ml",
    minimum_value: 1500,
    minimum_unit: "ml",
    xp_complete: 15,
    xp_minimum: 5,
    sort_order: 2,
    is_active: true,
    status: "complete",
  },
  {
    id: "habit-3",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "Stillness & Breathwork",
    area: "Mind",
    icon: "brain",
    type: "duration",
    difficulty: 1,
    target_value: 15,
    target_unit: "mins",
    minimum_value: 5,
    minimum_unit: "mins",
    xp_complete: 15,
    xp_minimum: 5,
    sort_order: 3,
    is_active: true,
    status: "pending",
  },
  {
    id: "habit-4",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "90-Min Deep Work Sprint",
    area: "Career",
    icon: "laptop",
    type: "duration",
    difficulty: 3,
    target_value: 90,
    target_unit: "mins",
    minimum_value: 30,
    minimum_unit: "mins",
    xp_complete: 35,
    xp_minimum: 15,
    sort_order: 4,
    is_active: true,
    status: "complete",
  },
  {
    id: "habit-5",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "Read 20 Pages Non-Fiction",
    area: "Knowledge",
    icon: "book",
    type: "quantity",
    difficulty: 1,
    target_value: 20,
    target_unit: "pages",
    minimum_value: 5,
    minimum_unit: "pages",
    xp_complete: 20,
    xp_minimum: 5,
    sort_order: 5,
    is_active: true,
    status: "pending",
  },
  {
    id: "habit-6",
    arc_id: "arc-1",
    user_id: "user-1",
    name: "Zero Cheap Dopamine Before Noon",
    area: "Discipline",
    icon: "shield",
    type: "binary",
    difficulty: 2,
    xp_complete: 20,
    xp_minimum: 10,
    sort_order: 6,
    is_active: true,
    status: "complete",
  },
];

const STORAGE_KEY = "@fitarc_today_habits";

export function useHabits() {
  const [habits, setHabits] = useState<LocalHabit[]>(INITIAL_HABITS);
  const [loading, setLoading] = useState(true);

  // Load habits
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setHabits(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load habits", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveHabits = async (newHabits: LocalHabit[]) => {
    setHabits(newHabits);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
    } catch (e) {
      console.warn("Failed to save habits", e);
    }
  };

  const toggleHabit = useCallback(
    (habitId: string) => {
      setHabits((prev) => {
        const updated = prev.map((h) => {
          if (h.id !== habitId) return h;
          const nextStatus: HabitStatus = h.status === "complete" ? "pending" : "complete";
          return {
            ...h,
            status: nextStatus,
            value: nextStatus === "complete" ? h.target_value : 0,
          };
        });
        saveHabits(updated);
        return updated;
      });
    },
    []
  );

  const updateHabitStatus = useCallback(
    (habitId: string, status: HabitStatus, value?: number) => {
      setHabits((prev) => {
        const updated = prev.map((h) => {
          if (h.id !== habitId) return h;
          return {
            ...h,
            status,
            value: value !== undefined ? value : h.target_value,
          };
        });
        saveHabits(updated);
        return updated;
      });
    },
    []
  );

  // Calculate day score
  const scoreResult = calculateDayScore(
    habits.map((h) => ({
      id: h.id,
      type: h.type,
      status: h.status,
      value: h.value,
      targetValue: h.target_value,
      minimumValue: h.minimum_value,
      difficulty: h.difficulty,
    }))
  );

  return {
    habits,
    loading,
    toggleHabit,
    updateHabitStatus,
    dayScore: scoreResult.dailyScore,
    completedCount: scoreResult.completedCount,
    totalCount: habits.length,
    xpEarnedToday: scoreResult.xpEarned,
    isFullDay: scoreResult.isFullDay,
  };
}
