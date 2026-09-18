import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { AppBar } from "@/components/ui/AppBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { userData, logout } = useAuth();
  const [notifications, setNotifications] = useState(userData?.notifications_enabled ?? true);

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeScreen contentStyle={styles.container}>
      <AppBar title="Profile & Identity" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {userData?.name?.slice(0, 2).toUpperCase() ?? "FA"}
            </Text>
          </View>
          <Text style={styles.userName}>{userData?.name ?? "Prashant"}</Text>
          <Text style={styles.userEmail}>{userData?.email ?? "prashant@example.com"}</Text>
          <View style={styles.archetypeBadge}>
            <Text style={styles.archetypeBadgeText}>
              ⚡ {userData?.identity_archetype ?? "Relentless Achiever"}
            </Text>
          </View>
        </View>

        {/* Identity & Archetype Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Identity Statement</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.statementText}>
            "{userData?.identity_statement ?? "I am building relentless discipline, peak fitness, and unwavering mental clarity."}"
          </Text>
          <View style={styles.pillarsRow}>
            {(userData?.selected_life_areas ?? ["Body", "Mind", "Discipline"]).map((area) => (
              <Badge key={area} label={area} variant={area} />
            ))}
          </View>
        </View>

        {/* Preferences & Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Daily Habit Reminders</Text>
              <Text style={styles.settingSub}>Receive notifications for habit check-ins</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.neutral, true: colors.primaryLight }}
              thumbColor={notifications ? colors.primary : colors.neutralDark}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Theme Mode</Text>
              <Text style={styles.settingSub}>Clean Light Theme (Optimized for eye comfort)</Text>
            </View>
            <View style={styles.themeTag}>
              <Text style={styles.themeTagText}>☀️ Light</Text>
            </View>
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>App Version</Text>
              <Text style={styles.settingSub}>FitArc Android • Expo SDK 57</Text>
            </View>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>

        {/* Account Actions */}
        <Button
          title="Sign Out"
          variant="secondary"
          onPress={handleLogout}
          style={styles.logoutBtn}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
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
  userCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarLargeText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textOnPrimary,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  archetypeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  archetypeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  infoCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  statementText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    fontStyle: "italic",
    marginBottom: spacing.md,
  },
  pillarsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  settingsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  themeTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  themeTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  versionText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  logoutBtn: {
    borderColor: colors.errorLight,
    backgroundColor: colors.errorLight,
  },
});
