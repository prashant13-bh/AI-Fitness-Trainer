import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "@/theme";
import type { LifeArea } from "@/lib/types";

interface Props {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "primary" | LifeArea;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: "sm" | "md";
}

const areaColorMap: Record<LifeArea, { bg: string; text: string }> = {
  Body: { bg: "#FEF3C7", text: "#D97706" }, // warm amber
  Mind: { bg: "#EDE9FE", text: "#7C3AED" }, // soft purple
  Career: { bg: "#E0F2FE", text: "#0284C7" }, // sky
  Knowledge: { bg: "#FCE7F3", text: "#DB2777" }, // rose
  Discipline: { bg: "#DCFCE7", text: "#16A34A" }, // emerald
};

export function Badge({ label, variant = "default", style, textStyle, size = "md" }: Props) {
  let bg: string = colors.surface;
  let textColor: string = colors.textSecondary;

  if (variant in areaColorMap) {
    const config = areaColorMap[variant as LifeArea];
    bg = config.bg;
    textColor = config.text;
  } else if (variant === "primary") {
    bg = colors.primaryLight;
    textColor = colors.primary;
  } else if (variant === "success") {
    bg = colors.successLight;
    textColor = colors.success;
  } else if (variant === "warning") {
    bg = colors.warningLight;
    textColor = colors.warning;
  } else if (variant === "error") {
    bg = colors.errorLight;
    textColor = colors.error;
  }

  const isSmall = size === "sm";

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSm, style]}>
      <Text style={[styles.text, { color: textColor }, isSmall && styles.textSm, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  textSm: {
    fontSize: 10,
    fontWeight: "600",
  },
});
