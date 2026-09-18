import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { colors } from "@/theme";

function RootNavigation() {
  const { userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (!userData) {
      // Not logged in -> go to login
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else if (!userData.onboarded) {
      // Logged in but not onboarded -> go to onboarding
      if (!inOnboarding) {
        router.replace("/onboarding");
      }
    } else {
      // Authenticated and onboarded -> go to main tabs
      if (inAuthGroup || inOnboarding) {
        router.replace("/(tabs)/today");
      }
    }
  }, [userData, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
