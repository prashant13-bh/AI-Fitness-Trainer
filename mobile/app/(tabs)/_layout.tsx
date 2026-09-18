import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme";

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{icon}</Text>
      <Text style={[styles.labelText, focused && styles.labelTextFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="☀️" label="Today" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="arc"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎯" label="Arc" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚡" label="Coach" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📈" label="Progress" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  iconText: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconTextFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  labelText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 2,
  },
  labelTextFocused: {
    color: colors.primary,
    fontWeight: "700",
  },
});
