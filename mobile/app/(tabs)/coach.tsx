import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { AppBar } from "@/components/ui/AppBar";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { colors, spacing } from "@/theme";
import { useCoach } from "@/hooks/useCoach";

const QUICK_PROMPTS = [
  "⚡ Adjust for low energy",
  "💪 Soreness & recovery advice",
  "📊 Review my 14-day progress",
  "🥗 Optimize protein intake",
];

export default function CoachScreen() {
  const { messages, isTyping, sendMessage } = useCoach();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    sendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <SafeScreen contentStyle={styles.container}>
      <AppBar
        title="AI Arc Coach"
        rightElement={
          <View style={styles.coachBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>ONLINE</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>⚡ Coach is analyzing your Arc...</Text>
              </View>
            ) : null
          }
        />

        {/* Quick Suggestion Chips */}
        <View style={styles.chipsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={QUICK_PROMPTS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.chip}
                onPress={() => handleQuickPrompt(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.chipsContent}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask your Coach anything..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  coachBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.success,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  typingIndicator: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  chipsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  chipsContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral,
    opacity: 0.6,
  },
  sendIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },
});
