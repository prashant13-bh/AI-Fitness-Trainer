import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function AppBar({ title = "FitArc", showBack = false, rightElement }: Props) {
  const router = useRouter();
  const { userData } = useAuth();
  const initials = userData?.name?.slice(0, 2).toUpperCase() ?? "FA";

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>FitArc</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightElement ?? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 22, color: colors.textPrimary },
  logoBox: { width: 36 },
  logoText: { fontSize: 16, fontWeight: "700", color: colors.primary },
  title: { flex: 1, fontSize: 18, fontWeight: "600", color: colors.textPrimary, textAlign: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 13, fontWeight: "700", color: colors.textOnPrimary },
});
