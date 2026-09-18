import React from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/theme";
import { shadows } from "@/theme/shadows";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed, style]} onPress={onPress}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceElevated, borderRadius: 16, padding: 16, ...shadows.card },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
