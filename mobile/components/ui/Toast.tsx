import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme";

interface Props {
  message: string;
  type?: "success" | "info" | "warning";
  visible: boolean;
  onDismiss?: () => void;
}

export function Toast({ message, type = "success", visible, onDismiss }: Props) {
  useEffect(() => {
    if (visible && onDismiss) {
      const timer = setTimeout(onDismiss, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  let bg: string = colors.textPrimary;
  let icon = "✓";

  if (type === "success") {
    bg = colors.success;
    icon = "⚡";
  } else if (type === "warning") {
    bg = colors.warning;
    icon = "!";
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999,
  },
  icon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginRight: 10,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
});
