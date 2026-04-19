import { useState, useCallback, useRef } from "react";

// ✅ FIXED: Always include /api here
const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3001") + "/api";

const MAX_HISTORY = 3;

const generateId = () =>
  `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const lastUserMessageRef = useRef(null);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isStreaming) return;

      setError(null);

      const userMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      lastUserMessageRef.current = userMessage;

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setStreamingContent("");

      abortControllerRef.current = new AbortController();

      try {
        const historyMessages = [
          ...messages.slice(-MAX_HISTORY),
          userMessage,
        ].map(({ role, content }) => ({ role, content }));

        // ✅ FIXED URL
        const response = await fetch(`${API_BASE_URL}/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: historyMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === "chunk") {
                accumulated += data.content;
                setStreamingContent(accumulated);
              }

              if (data.type === "done") {
                if (accumulated) {
                  const assistantMessage = {
                    id: generateId(),
                    role: "assistant",
                    content: accumulated,
                    timestamp: new Date().toISOString(),
                  };
                  setMessages((prev) => [...prev, assistantMessage]);
                }
                setStreamingContent("");
                setIsStreaming(false);
              }

              if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (err) {
              console.warn("[KRYZEN] Parse issue:", err.message);
            }
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          const currentContent = streamingContent;
          if (currentContent) {
            const partialMessage = {
              id: generateId(),
              role: "assistant",
              content:
                currentContent + "\n\n*[Response interrupted]*",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, partialMessage]);
          }
        } else {
          console.error("[KRYZEN] Error:", err);
          setError(err.message || "Something went wrong.");
        }

        setStreamingContent("");
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, streamingContent]
  );

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    if (isStreaming) stopStream();
    setMessages([]);
    setStreamingContent("");
    setError(null);
    lastUserMessageRef.current = null;
  }, [isStreaming, stopStream]);

  const retryLast = useCallback(() => {
    const lastUserMsg = lastUserMessageRef.current;
    if (!lastUserMsg) return;

    setError(null);

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") return prev.slice(0, -1);
      return prev;
    });

    sendMessage(lastUserMsg.content);
  }, [sendMessage]);

  return {
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    clearMessages,
    stopStream,
    retryLast,
  };
};

export default useChat;