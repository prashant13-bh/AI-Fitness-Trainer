import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors, spacing } from "@/theme";
import { useAuth } from "@/contexts/AuthContext";
import type { LifeArea } from "@/lib/types";

const ARCHETYPES = [
  { id: "Relentless Achiever", icon: "🔥", desc: "Builds unyielding work ethic & physical discipline" },
  { id: "Mindful Stoic", icon: "🌿", desc: "Calm focus, resilience, mental clarity & steady power" },
  { id: "Peak Performer", icon: "⚡", desc: "Optimal health, daily deep work, and continuous mastery" },
  { id: "Iron Athlete", icon: "🏋️", desc: "Strength, endurance, metabolic conditioning & nutrition" },
];

const LIFE_AREAS: { area: LifeArea; icon: string; desc: string }[] = [
  { area: "Body", icon: "💪", desc: "Strength, cardio, sleep, nutrition & recovery" },
  { area: "Mind", icon: "🧘", desc: "Meditation, stress control, stillness & breathwork" },
  { area: "Career", icon: "💼", desc: "Deep work, craftsmanship, skills & focused output" },
  { area: "Knowledge", icon: "📚", desc: "Daily reading, learning, research & journaling" },
  { area: "Discipline", icon: "⚔️", desc: "Cold showers, waking early, avoiding cheap dopamine" },
];

const HABIT_PRESETS: { name: string; area: LifeArea; target: string; min: string }[] = [
  { name: "Morning Strength & Mobility", area: "Body", target: "45 mins", min: "15 mins" },
  { name: "Clean Nutrition & Hydration", area: "Body", target: "3 Liters", min: "1.5 Liters" },
  { name: "Mindfulness & Stillness", area: "Mind", target: "15 mins", min: "5 mins" },
  { name: "Deep Work Block", area: "Career", target: "90 mins", min: "30 mins" },
  { name: "Daily Book Reading", area: "Knowledge", target: "20 pages", min: "5 pages" },
  { name: "Zero Cheap Dopamine Before Noon", area: "Discipline", target: "12:00 PM", min: "10:00 AM" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { userData, updateUserData } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form states
  const [archetype, setArchetype] = useState(ARCHETYPES[0].id);
  const [identityStatement, setIdentityStatement] = useState(
    "I am building relentless discipline, peak fitness, and unwavering mental clarity."
  );
  const [selectedAreas, setSelectedAreas] = useState<LifeArea[]>(["Body", "Mind", "Discipline"]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    "Morning Strength & Mobility",
    "Clean Nutrition & Hydration",
    "Daily Book Reading",
  ]);
  const [arcName, setArcName] = useState("Titan Arc 1");
  const [loading, setLoading] = useState(false);

  const toggleArea = (area: LifeArea) => {
    if (selectedAreas.includes(area)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter((a) => a !== area));
      }
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const toggleHabit = (habitName: string) => {
    if (selectedHabits.includes(habitName)) {
      if (selectedHabits.length > 1) {
        setSelectedHabits(selectedHabits.filter((h) => h !== habitName));
      }
    } else {
      setSelectedHabits([...selectedHabits, habitName]);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    // Final step complete
    setLoading(true);
    try {
      await updateUserData({
        identity_archetype: archetype,
        identity_statement: identityStatement,
        selected_life_areas: selectedAreas,
        onboarded: true,
      });
      router.replace("/(tabs)/today");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <SafeScreen contentStyle={styles.container}>
      {/* Top Header & Progress */}
      <View style={styles.topBar}>
        {step > 1 ? (
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={{ width: 60 }} />
        )}
        <Text style={styles.stepIndicator}>Step {step} of {totalSteps}</Text>
        <View style={{ width: 60 }} />
      </View>
      <ProgressBar value={step / totalSteps} height={4} color={colors.primary} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Define Your Identity</Text>
            <Text style={styles.subtitle}>
              True habits are an expression of who you are. Choose your primary archetype.
            </Text>

            <View style={styles.cardsList}>
              {ARCHETYPES.map((item) => {
                const active = archetype === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.optionCard, active && styles.optionCardActive]}
                    onPress={() => setArchetype(item.id)}
                  >
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                        {item.id}
                      </Text>
                      <Text style={styles.cardDesc}>{item.desc}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Your Core Identity Statement:</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                value={identityStatement}
                onChangeText={setIdentityStatement}
              />
            </View>
          </View>
        )}

        {/* STEP 2: LIFE AREAS */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Select Focus Areas</Text>
            <Text style={styles.subtitle}>
              Choose 2 to 4 life pillars you will fortify during this 90-day Arc.
            </Text>

            <View style={styles.cardsList}>
              {LIFE_AREAS.map((item) => {
                const active = selectedAreas.includes(item.area);
                return (
                  <Pressable
                    key={item.area}
                    style={[styles.optionCard, active && styles.optionCardActive]}
                    onPress={() => toggleArea(item.area)}
                  >
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                        {item.area}
                      </Text>
                      <Text style={styles.cardDesc}>{item.desc}</Text>
                    </View>
                    <View style={[styles.checkIndicator, active && styles.checkIndicatorActive]}>
                      {active && <Text style={styles.checkIcon}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: CORE HABITS */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Pick Cornerstone Habits</Text>
            <Text style={styles.subtitle}>
              Select the daily habits that build your foundation. Each includes an emergency Minimum Viable Dose.
            </Text>

            <View style={styles.cardsList}>
              {HABIT_PRESETS.map((item) => {
                const active = selectedHabits.includes(item.name);
                return (
                  <Pressable
                    key={item.name}
                    style={[styles.optionCard, active && styles.optionCardActive]}
                    onPress={() => toggleHabit(item.name)}
                  >
                    <View style={styles.cardInfo}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                          {item.name}
                        </Text>
                      </View>
                      <Text style={styles.cardDesc}>
                        Target: {item.target} • Minimum: {item.min}
                      </Text>
                    </View>
                    <View style={[styles.checkIndicator, active && styles.checkIndicatorActive]}>
                      {active && <Text style={styles.checkIcon}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 4: ARC NAME */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Name Your 90-Day Arc</Text>
            <Text style={styles.subtitle}>
              Give your upcoming season of focused growth a powerful, inspiring title.
            </Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Arc Title:</Text>
              <TextInput
                style={styles.textInput}
                value={arcName}
                onChangeText={setArcName}
                placeholder="e.g. Iron Arc 1, Rebirth 90"
              />
            </View>

            <View style={styles.arcRulesCard}>
              <Text style={styles.arcRulesTitle}>⚡ The 90-Day Arc Contract</Text>
              <Text style={styles.arcRulesText}>
                • Score 80%+ daily for full day points{"\n"}
                • On rough days, do your Minimum Habit to preserve your streak{"\n"}
                • Never miss two days in a row{"\n"}
                • Milestones unlock at Day 7, 14, 21, 30, 45, 60, 90
              </Text>
            </View>
          </View>
        )}

        {/* STEP 5: CONFIRMATION & COMMIT */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Your Arc is Ready</Text>
            <Text style={styles.subtitle}>
              Review your setup before taking the first step.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Arc Name</Text>
                <Text style={styles.summaryValue}>{arcName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Identity</Text>
                <Text style={styles.summaryValue}>{archetype}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pillars</Text>
                <Text style={styles.summaryValue}>{selectedAreas.join(", ")}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cornerstones</Text>
                <Text style={styles.summaryValue}>{selectedHabits.length} Habits</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>90 Days (Day 1 Today)</Text>
              </View>
            </View>

            <Text style={styles.commitmentNotice}>
              "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time."
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Continue Action */}
      <View style={styles.bottomBar}>
        <Button
          title={step === totalSteps ? "⚡ Launch My 90-Day Arc" : "Continue"}
          onPress={handleNext}
          loading={loading}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: spacing.xl,
  },
  cardsList: {
    gap: 12,
    marginBottom: spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  cardTitleActive: {
    color: colors.primaryDark,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  checkIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  checkIndicatorActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIcon: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
  inputBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    minHeight: 70,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  arcRulesCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  arcRulesTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B45309",
    marginBottom: 8,
  },
  arcRulesText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  commitmentNotice: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
