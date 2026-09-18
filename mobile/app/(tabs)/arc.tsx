import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { AppBar } from "@/components/ui/AppBar";
import { DayBubble, DayStatus } from "@/components/ui/DayBubble";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";
import { isMilestoneDay } from "@/lib/scoring";

const MILESTONES = [
  { day: 7, title: "Foundation Established", desc: "First 7 consecutive days locked in.", unlocked: true },
  { day: 14, title: "Habit Loop Rewired", desc: "Neuro-pathways begin automating behavior.", unlocked: true },
  { day: 21, title: "Identity Shift", desc: "Actions reflect your chosen archetype effortlessly.", unlocked: false },
  { day: 30, title: "First Trimester Mastery", desc: "1/3 of the Arc complete. Baseline established.", unlocked: false },
  { day: 60, title: "Iron Resilience", desc: "Resistant to friction and disruption.", unlocked: false },
  { day: 90, title: "Arc Completion & Ascension", desc: "Permanent transformation achieved.", unlocked: false },
];

export default function ArcScreen() {
  const currentDay = 14;
  const totalDays = 90;
  const arcProgress = currentDay / totalDays;

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generate 90 days with sample history
  const days = Array.from({ length: 90 }, (_, i) => {
    const dayNum = i + 1;
    let status: DayStatus = "future";
    let score = 0;

    if (dayNum < currentDay) {
      if (dayNum === 5 || dayNum === 11) {
        status = "minimum";
        score = 0.6;
      } else {
        status = "complete";
        score = 0.95;
      }
    } else if (dayNum === currentDay) {
      status = "today";
      score = 0.75;
    }

    return {
      dayNumber: dayNum,
      status,
      score,
      isMilestone: isMilestoneDay(dayNum),
    };
  });

  return (
    <SafeScreen contentStyle={styles.container}>
      <AppBar title="90-Day Arc" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Arc Overview Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroTitle}>Titan Arc 1</Text>
              <Text style={styles.heroSubtitle}>Day {currentDay} of {totalDays} • 16% Complete</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>ACTIVE</Text>
            </View>
          </View>

          <View style={{ marginVertical: spacing.md }}>
            <ProgressBar value={arcProgress} color={colors.primary} height={10} />
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>92%</Text>
              <Text style={styles.heroStatLabel}>Consistency</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>12</Text>
              <Text style={styles.heroStatLabel}>100% Days</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>2</Text>
              <Text style={styles.heroStatLabel}>Minimum Days</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>0</Text>
              <Text style={styles.heroStatLabel}>Missed</Text>
            </View>
          </View>
        </View>

        {/* 90-Day Interactive Calendar Matrix */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>The 90-Day Journey</Text>
          <Text style={styles.sectionSubtitle}>Every circle is a day in your transformation</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Complete</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Minimum</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { borderColor: colors.primary, borderWidth: 2 }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} />
              <Text style={styles.legendText}>Future</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {days.map((d) => (
              <DayBubble
                key={d.dayNumber}
                dayNumber={d.dayNumber}
                status={d.status}
                score={d.score}
                isMilestone={d.isMilestone}
                onPress={(num) => setSelectedDay(num)}
              />
            ))}
          </View>
        </View>

        {/* Milestones Roadmap */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Milestone Checkpoints</Text>
          <Text style={styles.sectionSubtitle}>Key thresholds that anchor permanent growth</Text>
        </View>

        <View style={styles.milestoneList}>
          {MILESTONES.map((m) => (
            <View
              key={m.day}
              style={[styles.milestoneCard, m.unlocked && styles.milestoneCardUnlocked]}
            >
              <View
                style={[
                  styles.milestoneBadge,
                  m.unlocked ? styles.milestoneBadgeUnlocked : styles.milestoneBadgeLocked,
                ]}
              >
                <Text
                  style={[
                    styles.milestoneBadgeText,
                    m.unlocked ? styles.milestoneBadgeTextUnlocked : {},
                  ]}
                >
                  Day {m.day}
                </Text>
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text style={styles.milestoneDesc}>{m.desc}</Text>
              </View>
              <Text style={styles.milestoneStatusIcon}>
                {m.unlocked ? "✓" : "🔒"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Day Inspector Modal */}
      <Modal
        visible={selectedDay !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDay(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedDay(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Day {selectedDay} Summary</Text>
            <Text style={styles.modalDesc}>
              {selectedDay === currentDay
                ? "Today's active session. Complete your pending habits to lock in a 100% day score."
                : selectedDay && selectedDay < currentDay
                ? `Day ${selectedDay} was successfully completed with full habit execution.`
                : `Day ${selectedDay} is scheduled in your 90-day Arc timeline.`}
            </Text>
            <Button
              title="Close"
              variant="secondary"
              onPress={() => setSelectedDay(null)}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </Pressable>
      </Modal>
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
  heroCard: {
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
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heroStatItem: {
    alignItems: "center",
  },
  heroStatVal: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  heroStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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
  calendarCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  milestoneList: {
    gap: 10,
    marginBottom: spacing.xl,
  },
  milestoneCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  milestoneCardUnlocked: {
    backgroundColor: colors.surfaceElevated,
    borderColor: "#DCFCE7",
  },
  milestoneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 12,
  },
  milestoneBadgeUnlocked: {
    backgroundColor: colors.successLight,
  },
  milestoneBadgeLocked: {
    backgroundColor: colors.surface,
  },
  milestoneBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  milestoneBadgeTextUnlocked: {
    color: colors.success,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  milestoneStatusIcon: {
    fontSize: 16,
    color: colors.success,
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
