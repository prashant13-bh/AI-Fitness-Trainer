import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/theme";

interface Props {
  score: number; // 0 to 1.0
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
}

export function ScoreRing({
  score,
  size = 140,
  strokeWidth = 12,
  subtitle = "Daily Score",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, score));
  const strokeDashoffset = circumference - clamped * circumference;
  const percent = Math.round(clamped * 100);

  // Pick color based on score
  let ringColor: string = colors.primary;
  if (percent >= 80) ringColor = colors.success;
  else if (percent >= 50) ringColor = colors.primary;
  else if (percent > 0) ringColor = colors.warning;
  else ringColor = colors.borderStrong;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground animated progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={[styles.percent, { color: ringColor }]}>{percent}%</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  svg: {
    position: "absolute",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  percent: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
