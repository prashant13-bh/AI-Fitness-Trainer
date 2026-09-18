import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme";

interface Props {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function KeyboardAvoidingScreen({
  children,
  scrollable = true,
  style,
  contentStyle,
}: Props) {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});
