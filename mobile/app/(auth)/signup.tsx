import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please complete all fields to sign up.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, name);
      router.replace("/onboarding");
    } catch (err: any) {
      Alert.alert("Signup Failed", err.message || "Could not register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen scrollable contentStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Begin Your Arc</Text>
        <Text style={styles.subtitle}>
          Transform your habits through a structured 90-day journey.
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Prashant Hiremath"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
          style={styles.signupBtn}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginLink}>Sign In</Text>
        </Pressable>
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
  signupBtn: {
    marginTop: spacing.md,
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
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
