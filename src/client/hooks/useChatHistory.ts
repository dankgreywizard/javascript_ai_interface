import { useState, useEffect } from "react";
import { Chat, Message } from "../../types/chat";

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      if (saved) setChatHistory(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch {}
  }, [chatHistory]);

  const saveChat = (id: string, messages: Message[]) => {
    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === id);
      const chat: Chat = { id, messages };
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = chat;
        return copy;
      }
      return [chat, ...prev];
    });
  };

  return [chatHistory, setChatHistory, saveChat] as const;
}
