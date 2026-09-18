import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, continueAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)/today");
    } catch (err: any) {
      Alert.alert("Sign In Failed", err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await continueAsDemo();
      router.replace("/(tabs)/today");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen scrollable contentStyle={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>⚡</Text>
        </View>
        <Text style={styles.title}>FitArc</Text>
        <Text style={styles.subtitle}>
          Build Your Identity. Master Your 90-Day Arc.
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeading}>Sign In to Your Account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
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

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        {/* Instant Access Demo */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or quick preview</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="⚡ Continue in Demo Mode"
          variant="secondary"
          onPress={handleDemo}
          style={styles.demoBtn}
        />
      </View>

      {/* Footer link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signUpLink}>Create one</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logoBadgeText: {
    fontSize: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
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
  cardHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
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
  loginBtn: {
    marginTop: spacing.md,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 10,
    textTransform: "uppercase",
  },
  demoBtn: {
    borderColor: colors.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
