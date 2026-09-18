import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen scrollable contentStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to Login</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account and we'll send a recovery link.
        </Text>
      </View>

      <View style={styles.formCard}>
        {sent ? (
          <View style={styles.sentBox}>
            <Text style={styles.sentIcon}>✉️</Text>
            <Text style={styles.sentTitle}>Check Your Inbox</Text>
            <Text style={styles.sentMessage}>
              We sent password reset instructions to {email}.
            </Text>
            <Button
              title="Return to Sign In"
              variant="secondary"
              onPress={() => router.replace("/(auth)/login")}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Button
              title="Send Reset Instructions"
              onPress={handleReset}
              loading={loading}
              style={styles.resetBtn}
            />
          </>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background,
  },
  backBtn: {
    marginBottom: spacing.md,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  resetBtn: {
    marginTop: spacing.md,
  },
  sentBox: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  sentIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  sentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sentMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
