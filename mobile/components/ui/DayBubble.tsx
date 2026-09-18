import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "@/theme";

export type DayStatus = "complete" | "minimum" | "missed" | "today" | "future";

interface Props {
  dayNumber: number;
  status: DayStatus;
  score?: number;
  isMilestone?: boolean;
  onPress?: (dayNumber: number) => void;
  size?: number;
}

export function DayBubble({
  dayNumber,
  status,
  isMilestone = false,
  onPress,
  size = 36,
}: Props) {
  const isToday = status === "today";
  const isComplete = status === "complete";
  const isMinimum = status === "minimum";
  const isMissed = status === "missed";
  const isFuture = status === "future";

  let bg: string = colors.surface;
  let borderColor: string = colors.border;
  let textColor: string = colors.textSecondary;

  if (isComplete) {
    bg = colors.success;
    borderColor = colors.success;
    textColor = colors.white;
  } else if (isMinimum) {
    bg = colors.warning;
    borderColor = colors.warning;
    textColor = colors.white;
  } else if (isMissed) {
    bg = colors.errorLight;
    borderColor = colors.error;
    textColor = colors.error;
  } else if (isToday) {
    bg = colors.primaryLight;
    borderColor = colors.primary;
    textColor = colors.primary;
  } else if (isFuture) {
    bg = colors.surface;
    borderColor = colors.border;
    textColor = colors.textMuted;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor,
        },
        isToday && styles.todayRing,
        isMilestone && styles.milestoneBorder,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(dayNumber)}
      disabled={isFuture && !onPress}
      accessibilityLabel={`Day ${dayNumber} status ${status}`}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          isToday && styles.todayText,
          isMilestone && styles.milestoneText,
        ]}
      >
        {dayNumber}
      </Text>
      {isMilestone && (
        <View style={styles.starBadge}>
          <Text style={styles.starText}>★</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    margin: 3,
  },
  todayRing: {
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  milestoneBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.92 }],
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
  todayText: {
    fontWeight: "800",
  },
  milestoneText: {
    fontWeight: "800",
  },
  starBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#F59E0B",
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  starText: {
    fontSize: 8,
    color: "#FFFFFF",
    lineHeight: 9,
  },
});
