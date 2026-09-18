import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing } from "@/theme";
import { Badge } from "./Badge";
import type { LocalHabit } from "@/lib/types";

interface Props {
  habit: LocalHabit;
  onToggle: (habitId: string) => void;
  onPressDetails?: (habit: LocalHabit) => void;
}

export function HabitCard({ habit, onToggle, onPressDetails }: Props) {
  const isComplete = habit.status === "complete";
  const isMinimum = habit.status === "minimum";
  const isDone = isComplete || isMinimum;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isComplete && styles.cardComplete,
        pressed && styles.pressed,
      ]}
      onPress={() => onToggle(habit.id)}
      onLongPress={() => onPressDetails?.(habit)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isComplete }}
    >
      <View style={styles.left}>
        {/* Toggle Checkbox Circle */}
        <Pressable
          style={[
            styles.checkCircle,
            isComplete && styles.checkComplete,
            isMinimum && styles.checkMinimum,
          ]}
          onPress={() => onToggle(habit.id)}
          hitSlop={8}
        >
          {isComplete && <Text style={styles.checkMark}>✓</Text>}
          {isMinimum && <Text style={styles.minMark}>½</Text>}
        </Pressable>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text
              style={[
                styles.name,
                isDone && styles.nameDone,
              ]}
              numberOfLines={1}
            >
              {habit.name}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Badge label={habit.area} variant={habit.area} size="sm" />
            {habit.target_value ? (
              <Text style={styles.targetText}>
                {habit.target_value} {habit.target_unit ?? ""}
              </Text>
            ) : null}
            {habit.minimum_value ? (
              <Text style={styles.minText}>
                Min: {habit.minimum_value} {habit.minimum_unit ?? ""}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <View style={[styles.xpPill, isComplete && styles.xpPillComplete]}>
          <Text style={[styles.xpText, isComplete && styles.xpTextComplete]}>
            +{habit.xp_complete} XP
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardComplete: {
    borderColor: "#DCFCE7",
    backgroundColor: "#FDFCFA",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    backgroundColor: colors.background,
  },
  checkComplete: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkMinimum: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  checkMark: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  minMark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  nameDone: {
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },
  targetText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  minText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  right: {
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  xpPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  xpPillComplete: {
    backgroundColor: colors.successLight,
  },
  xpText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  xpTextComplete: {
    color: colors.success,
  },
});
