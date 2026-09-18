import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from "react-native";
import { colors, spacing } from "@/theme";
import { Button } from "./Button";
import { Badge } from "./Badge";
import type { LocalHabit, HabitStatus } from "@/lib/types";

interface Props {
  visible: boolean;
  habit: LocalHabit | null;
  onClose: () => void;
  onSave: (habitId: string, status: HabitStatus, value?: number) => void;
}

export function HabitBottomSheet({ visible, habit, onClose, onSave }: Props) {
  if (!habit) return null;

  const [customVal, setCustomVal] = useState(
    habit.value !== undefined ? String(habit.value) : (habit.target_value ? String(habit.target_value) : "")
  );

  const handleSelectStatus = (status: HabitStatus) => {
    const val = customVal ? parseFloat(customVal) : habit.target_value;
    onSave(habit.id, status, val);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.indicator} />

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{habit.name}</Text>
              <Badge label={habit.area} variant={habit.area} />
            </View>
            <Text style={styles.subtitle}>
              Difficulty: {habit.difficulty === 3 ? "Hard" : habit.difficulty === 2 ? "Medium" : "Easy"} • +{habit.xp_complete} XP
            </Text>
          </View>

          {/* Value input if target value exists */}
          {habit.target_value ? (
            <View style={styles.inputSection}>
              <Text style={styles.label}>
                Recorded Value ({habit.target_unit ?? "units"}):
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={customVal}
                  onChangeText={setCustomVal}
                  placeholder={`Target: ${habit.target_value}`}
                  placeholderTextColor={colors.textMuted}
                />
                <Text style={styles.unitText}>{habit.target_unit}</Text>
              </View>
            </View>
          ) : null}

          {/* Action choices */}
          <View style={styles.actions}>
            <Button
              title="✓ Complete (100% XP)"
              variant="primary"
              onPress={() => handleSelectStatus("complete")}
              style={styles.actionBtn}
            />

            {habit.minimum_value ? (
              <Button
                title={`⚡ Minimum Habit (${habit.minimum_value} ${habit.minimum_unit ?? ""})`}
                variant="secondary"
                onPress={() => handleSelectStatus("minimum")}
                style={styles.actionBtn}
              />
            ) : null}

            <Button
              title="Skip for Today"
              variant="ghost"
              onPress={() => handleSelectStatus("skipped")}
              style={styles.actionBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  inputSection: {
    marginVertical: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  unitText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.sm,
    gap: 8,
  },
  actionBtn: {
    marginVertical: 4,
  },
});
