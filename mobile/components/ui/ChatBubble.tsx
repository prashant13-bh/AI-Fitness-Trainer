import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme";
import type { ChatMessage } from "@/lib/types";

interface Props {
  message: ChatMessage;
}

export function ChatBubble({ message }: Props) {
  const isCoach = message.sender === "coach";

  return (
    <View
      style={[
        styles.row,
        isCoach ? styles.rowCoach : styles.rowUser,
      ]}
    >
      {isCoach && (
        <View style={styles.coachAvatar}>
          <Text style={styles.coachAvatarText}>⚡</Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isCoach ? styles.bubbleCoach : styles.bubbleUser,
        ]}
      >
        <Text
          style={[
            styles.text,
            isCoach ? styles.textCoach : styles.textUser,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.time,
            isCoach ? styles.timeCoach : styles.timeUser,
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: "flex-end",
  },
  rowCoach: {
    justifyContent: "flex-start",
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  coachAvatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleCoach: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  textCoach: {
    color: colors.textPrimary,
  },
  textUser: {
    color: colors.textPrimary,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
  },
  timeCoach: {
    color: colors.textMuted,
    textAlign: "left",
  },
  timeUser: {
    color: colors.primaryDark,
    textAlign: "right",
  },
});
