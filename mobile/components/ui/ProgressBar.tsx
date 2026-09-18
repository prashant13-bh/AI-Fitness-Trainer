import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/theme";

interface Props { value: number; color?: string; height?: number; }

export function ProgressBar({ value, color = colors.primary, height = 8 }: Props) {
  const pct = Math.min(1, Math.max(0, value));
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.neutral, borderRadius: 999, overflow: "hidden", width: "100%" },
  fill: { borderRadius: 999 },
});
