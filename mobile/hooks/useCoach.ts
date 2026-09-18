import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChatMessage } from "@/lib/types";

const STORAGE_KEY = "@fitarc_coach_messages";

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "coach",
    text: "Welcome back, Prashant. You're on Day 14 of your 90-day Arc. Your streak is at 14 days and consistency is 92%. How is your body feeling after this morning's session?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function useCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setMessages(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load coach messages", e);
      }
    };
    load();
  }, []);

  const saveMessages = async (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch (e) {
      console.warn("Failed to save coach messages", e);
    }
  };

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userText.trim(),
        timestamp: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMsg];
      await saveMessages(nextMessages);
      setIsTyping(true);

      // Generate intelligent Coach response
      setTimeout(async () => {
        let reply = "";
        const lower = userText.toLowerCase();

        if (lower.includes("sore") || lower.includes("tired") || lower.includes("fatigue") || lower.includes("sleep")) {
          reply = "High training frequency requires high recovery. Today, utilize your 'Minimum Dose' for physical habits (15 mins light stretching), drink 500ml water with electrolytes, and aim for 8 hours of sleep. A minimum day protects your streak without stalling recovery.";
        } else if (lower.includes("workout") || lower.includes("exercise") || lower.includes("routine") || lower.includes("plan")) {
          reply = "For today's Arc focus: Prioritize compound mobility drills followed by moderate tempo resistance. If energy is 8/10+, hit your target 45 mins. If you're pressed for time, 20 mins of high-intensity supersets will secure your 100% daily check-in.";
        } else if (lower.includes("streak") || lower.includes("arc") || lower.includes("progress") || lower.includes("score")) {
          reply = "You are currently holding a 14-day streak with 92% consistency. You're just 7 days away from your Day 21 Milestone! Keep the momentum high. Small disciplines repeated every day compound into remarkable results.";
        } else if (lower.includes("diet") || lower.includes("food") || lower.includes("nutrition") || lower.includes("protein")) {
          reply = "Fueling your identity: Aim for 1.8g - 2.0g protein per kg of target weight, front-load your hydration before 2 PM, and keep your post-workout meal within 90 minutes of training. Consistency beats perfection.";
        } else {
          reply = `Understood. When obstacles arise during your Arc, remember the rule: never miss two days in a row, and honor your minimum habits on tough days. What is the single highest-priority habit you will execute in the next 2 hours?`;
        }

        const coachMsg: ChatMessage = {
          id: `coach-${Date.now()}`,
          sender: "coach",
          text: reply,
          timestamp: new Date().toISOString(),
        };

        await saveMessages([...nextMessages, coachMsg]);
        setIsTyping(false);
      }, 900);
    },
    [messages]
  );

  const clearChat = async () => {
    await saveMessages(DEFAULT_MESSAGES);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}
