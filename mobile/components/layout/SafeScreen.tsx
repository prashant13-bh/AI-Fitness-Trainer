import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme";

interface Props {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function SafeScreen({ children, scrollable = false, style, contentStyle }: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={[styles.scroll, contentStyle]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.safe, style]} edges={["top", "left", "right"]}>
      <View style={[styles.inner, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 24 },
  inner: { flex: 1 },
});
