import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { AppBar } from "@/components/ui/AppBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";
import { calculateLevel } from "@/lib/scoring";

const WEEK_DAYS = [
  { day: "M", score: 100, status: "complete" },
  { day: "T", score: 95, status: "complete" },
  { day: "W", score: 60, status: "minimum" },
  { day: "T", score: 100, status: "complete" },
  { day: "F", score: 100, status: "complete" },
  { day: "S", score: 85, status: "complete" },
  { day: "S", score: 75, status: "today" },
];

const PILLARS = [
  { name: "Discipline", rate: 100, count: "14/14 days", icon: "⚔️" },
  { name: "Body", rate: 95, count: "27/28 sessions", icon: "💪" },
  { name: "Career", rate: 92, count: "13/14 deep blocks", icon: "💼" },
  { name: "Mind", rate: 85, count: "12/14 sessions", icon: "🧘" },
  { name: "Knowledge", rate: 80, count: "240/300 pages", icon: "📚" },
];

export default function ProgressScreen() {
  const { userData } = useAuth();
  const xp = userData?.xp ?? 450;
  const levelInfo = calculateLevel(xp);

  return (
    <SafeScreen contentStyle={styles.container}>
      <AppBar title="Analytics & Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Level & XP Progression Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelTop}>
            <View>
              <Text style={styles.levelTitle}>Level {levelInfo.level} Practitioner</Text>
              <Text style={styles.levelSubtitle}>Total XP: {xp} XP</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>LVL {levelInfo.level}</Text>
            </View>
          </View>

          <View style={{ marginVertical: spacing.md }}>
            <ProgressBar value={levelInfo.progressPercent / 100} color={colors.primary} height={10} />
          </View>

          <Text style={styles.levelProgressText}>
            {levelInfo.progressPercent}% toward Level {levelInfo.level + 1} ({levelInfo.nextLevelXp - xp} XP needed)
          </Text>
        </View>

        {/* Weekly Consistency Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>7-Day Arc Consistency</Text>
          <Text style={styles.sectionSubtitle}>Last 7 daily performance scores</Text>
        </View>

        <View style={styles.weekCard}>
          <View style={styles.barsContainer}>
            {WEEK_DAYS.map((d, index) => {
              const isToday = d.status === "today";
              const barHeight = (d.score / 100) * 80;
              const barColor =
                d.status === "complete"
                  ? colors.success
                  : d.status === "minimum"
                  ? colors.warning
                  : colors.primary;

              return (
                <View key={index} style={styles.barColumn}>
                  <Text style={styles.barPercent}>{d.score}%</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: barHeight, backgroundColor: barColor },
                        isToday && styles.barToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Pillar Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Life Area Consistency</Text>
          <Text style={styles.sectionSubtitle}>Execution rates by focus area</Text>
        </View>

        <View style={styles.pillarsCard}>
          {PILLARS.map((pillar) => (
            <View key={pillar.name} style={styles.pillarItem}>
              <View style={styles.pillarHeader}>
                <View style={styles.pillarTitleRow}>
                  <Text style={styles.pillarIcon}>{pillar.icon}</Text>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                </View>
                <Text style={styles.pillarRate}>{pillar.rate}%</Text>
              </View>
              <ProgressBar value={pillar.rate / 100} color={colors.primary} height={6} />
              <Text style={styles.pillarSub}>{pillar.count}</Text>
            </View>
          ))}
        </View>

        {/* Key Performance Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Arc Vital Records</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>14 Days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>21 Days</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>12</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>92%</Text>
            <Text style={styles.statLabel}>Arc Consistency</Text>
          </View>
        </View>
      </ScrollView>
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
  levelCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  levelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  levelSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  levelProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weekCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
  },
  barColumn: {
    alignItems: "center",
    width: 32,
  },
  barPercent: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 6,
  },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: 7,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 7,
  },
  barToday: {
    borderColor: colors.primaryDark,
    borderWidth: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 6,
  },
  dayLabelToday: {
    color: colors.primary,
    fontWeight: "800",
  },
  pillarsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pillarItem: {},
  pillarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  pillarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillarIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  pillarName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pillarRate: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pillarSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  statVal: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },
});
