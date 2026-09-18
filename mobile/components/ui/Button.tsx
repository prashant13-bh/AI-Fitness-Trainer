import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, spacing } from "@/theme";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function Button({ title, onPress, variant = "primary", loading = false, disabled = false, style, textStyle, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.base, styles[variant], (disabled || loading) && styles.disabled, pressed && styles.pressed, style]}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
    >
      {loading
        ? <ActivityIndicator color={variant === "primary" ? colors.white : colors.primary} size="small" />
        : <Text style={[styles.text, styles[`${variant}Text` as const], textStyle]}>{title}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 52, borderRadius: 14, paddingHorizontal: spacing['2xl'], justifyContent: "center", alignItems: "center" },
  primary: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
  ghost: { backgroundColor: colors.transparent },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  text: { fontSize: 16, fontWeight: "600" },
  primaryText: { color: colors.textOnPrimary },
  secondaryText: { color: colors.textPrimary },
  ghostText: { color: colors.primary },
});
