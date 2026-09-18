import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { AppBar } from "@/components/ui/AppBar";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { HabitCard } from "@/components/ui/HabitCard";
import { HabitBottomSheet } from "@/components/ui/HabitBottomSheet";
import { Toast } from "@/components/ui/Toast";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import type { LocalHabit, HabitStatus } from "@/lib/types";

export default function TodayScreen() {
  const router = useRouter();
  const { userData } = useAuth();
  const {
    habits,
    toggleHabit,
    updateHabitStatus,
    dayScore,
    completedCount,
    totalCount,
    xpEarnedToday,
    isFullDay,
  } = useHabits();

  const [selectedHabit, setSelectedHabit] = useState<LocalHabit | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleToggle = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    const willBeComplete = habit?.status !== "complete";
    toggleHabit(id);

    if (willBeComplete) {
      setToastMsg(`+${habit?.xp_complete ?? 20} XP • Habit completed!`);
      setToastVisible(true);
    }
  };

  const handleOpenDetails = (habit: LocalHabit) => {
    setSelectedHabit(habit);
    setSheetVisible(true);
  };

  const handleSaveStatus = (habitId: string, status: HabitStatus, value?: number) => {
    updateHabitStatus(habitId, status, value);
    setToastMsg(`Status updated: ${status.toUpperCase()}`);
    setToastVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeScreen contentStyle={styles.container}>
      <AppBar
        title="FitArc"
        rightElement={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.name?.slice(0, 2).toUpperCase() ?? "FA"}
            </Text>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Top Arc Banner */}
        <View style={styles.arcBanner}>
          <View>
            <Text style={styles.arcDayTitle}>Day 14 of 90</Text>
            <Text style={styles.arcSubtitle}>Titan Arc 1 • Peak Conditioning</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={styles.streakCount}>{userData?.streak ?? 14} Days</Text>
          </View>
        </View>

        {/* Daily Score Ring Card */}
        <View style={styles.scoreCard}>
          <ScoreRing score={dayScore} size={150} strokeWidth={14} subtitle="Daily Score" />

          {/* Quick Metrics Bar */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{completedCount}/{totalCount}</Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.primary }]}>+{xpEarnedToday} XP</Text>
              <Text style={styles.metricLabel}>XP Earned</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, isFullDay ? { color: colors.success } : {}]}>
                {isFullDay ? "100% Day" : "In Progress"}
              </Text>
              <Text style={styles.metricLabel}>Day Status</Text>
            </View>
          </View>
        </View>

        {/* Habits Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Cornerstone Habits</Text>
          <Text style={styles.sectionHint}>Tap to complete • Long-press for options</Text>
        </View>

        {/* Habits List */}
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onPressDetails={handleOpenDetails}
            />
          ))}
        </View>

        {/* Identity Quote Card */}
        <View style={styles.identityCard}>
          <Text style={styles.identityQuote}>
            "{userData?.identity_statement ?? "I am building relentless discipline, peak fitness, and unwavering mental clarity."}"
          </Text>
          <Text style={styles.identityAuthor}>— Your Arc Identity</Text>
        </View>
      </ScrollView>

      {/* Habit Details & Minimum Viable Dose Sheet */}
      <HabitBottomSheet
        visible={sheetVisible}
        habit={selectedHabit}
        onClose={() => setSheetVisible(false)}
        onSave={handleSaveStatus}
      />

      {/* Interactive Toast */}
      <Toast
        message={toastMsg}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textOnPrimary,
  },
  arcBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingVertical: 4,
  },
  arcDayTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  arcSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakFlame: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C2410C",
  },
  scoreCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metricItem: {
    alignItems: "center",
  },
  metricVal: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  habitsList: {
    marginBottom: spacing.lg,
  },
  identityCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  identityQuote: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  identityAuthor: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 6,
  },
});
