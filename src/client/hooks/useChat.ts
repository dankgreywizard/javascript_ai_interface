import { useState, useCallback, useRef } from "react";
import { Message } from "../../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const handleCancel = useCallback(() => {
    const ctrl = abortRef.current;
    if (ctrl) ctrl.abort();
  }, []);

  const sendMessage = useCallback(async (
    userInput: string, 
    onSuccess?: () => void, 
    onUpdateStatus?: (text: string, color: "gray" | "yellow" | "green" | "red") => void,
    scrollToBottom?: () => void
  ) => {
    if (!userInput || sending) return;

    addMessage("user", userInput);
    setSending(true);
    onUpdateStatus?.("Sending...", "yellow");

    // Placeholder assistant message index to append stream
    let aiIndex = -1;
    setMessages((prev) => {
      aiIndex = prev.length + 1; // after appending user
      return [...prev, { role: "assistant", content: "" }];
    });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const payload = [...messages, { role: "user", content: userInput }].map((m) => JSON.stringify(m));
      const res = await fetch("/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(res.statusText || "Request failed");
      onUpdateStatus?.("Streaming...", "yellow");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Streaming not supported");
      const decoder = new TextDecoder();
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((m, i) => m.role === "assistant" && i >= aiIndex - 1);
          const target = idx >= 0 ? idx : copy.length - 1;
          copy[target] = { ...copy[target], content: aiText };
          return copy;
        });
        scrollToBottom?.();
      }
      
      const finalChunk = decoder.decode();
      if (finalChunk) {
        const finalText = aiText + finalChunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: finalText };
          return copy;
        });
      }
      
      setSending(false);
      onUpdateStatus?.("Ready", "green");
      scrollToBottom?.();
      onSuccess?.();
    } catch (e: any) {
      if (controller.signal.aborted) {
        onUpdateStatus?.("Cancelled", "yellow");
      } else {
        console.error(e);
        onUpdateStatus?.("Error", "red");
      }
      setSending(false);
    } finally {
      abortRef.current = null;
    }
  }, [messages, sending, addMessage]);

  const sendAnalysisRequest = useCallback(async (
    userMsg: string,
    payload: any,
    onUpdateStatus?: (text: string, color: "gray" | "yellow" | "green" | "red") => void,
    scrollToBottom?: () => void
  ) => {
    addMessage('user', userMsg);
    setSending(true);
    onUpdateStatus?.('Analyzing commits...', 'yellow');

    let aiIndex = -1;
    setMessages((prev) => {
      aiIndex = prev.length + 1; // after appended user
      return [...prev, { role: 'assistant', content: '' }];
    });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/analyze-commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error((await res.text()) || 'Analyze failed');
      onUpdateStatus?.('Streaming analysis...', 'yellow');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming not supported');
      const decoder = new TextDecoder();
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((m, i) => m.role === 'assistant' && i >= aiIndex - 1);
          const target = idx >= 0 ? idx : copy.length - 1;
          copy[target] = { ...copy[target], content: aiText };
          return copy;
        });
        scrollToBottom?.();
      }
      
      const finalChunk = decoder.decode();
      if (finalChunk) {
        const finalText = aiText + finalChunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: finalText };
          return copy;
        });
      }
      
      setSending(false);
      onUpdateStatus?.('Ready', 'green');
      scrollToBottom?.();
    } catch (e: any) {
      if (controller.signal.aborted) {
        onUpdateStatus?.('Cancelled', 'yellow');
      } else {
        console.error(e);
        onUpdateStatus?.('Error', 'red');
      }
      setSending(false);
    } finally {
      abortRef.current = null;
    }
  }, [addMessage]);

  return {
    messages,
    setMessages,
    sending,
    handleCancel,
    sendMessage,
    sendAnalysisRequest,
    addMessage
  };
}
