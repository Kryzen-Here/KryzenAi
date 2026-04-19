import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Copy, RotateCcw } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ScytheLoader from "./ScytheLoader";
import useChat from "../hooks/useChat";

// ─── Empty State Component ─────────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div
    className="empty-state"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <div className="empty-state-icon">⚔</div>
    <h2 className="empty-state-title">KRYZEN AWAITS</h2>
    <p className="empty-state-subtitle">
      Speak your query into the void. I shall deliver precision.
    </p>
    <div className="empty-state-suggestions">
      {[
        "Explain quantum computing with code examples",
        "Write a Python web scraper",
        "Analyze the philosophy of determinism",
        "Create a REST API in Node.js",
      ].map((suggestion, i) => (
        <motion.button
          key={i}
          className="suggestion-chip"
          whileHover={{ scale: 1.02, borderColor: "#ff0000" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          onClick={() => {
            const event = new CustomEvent("suggestion-click", {
              detail: suggestion,
            });
            window.dispatchEvent(event);
          }}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ─── Toolbar Component ─────────────────────────────────────────────────────────
const ChatToolbar = ({ onClear, messageCount, isStreaming }) => (
  <div className="chat-toolbar">
    <div className="toolbar-left">
      <div className="message-counter">
        <span className="counter-num">{messageCount}</span>
        <span className="counter-label">
          {messageCount === 1 ? "MESSAGE" : "MESSAGES"}
        </span>
      </div>
    </div>
    <div className="toolbar-right">
      <motion.button
        className="toolbar-btn danger"
        onClick={onClear}
        disabled={messageCount === 0 || isStreaming}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Clear conversation"
      >
        <Trash2 size={14} />
        <span>CLEAR</span>
      </motion.button>
    </div>
  </div>
);

// ─── Input Area Component ──────────────────────────────────────────────────────
const InputArea = ({
  onSend,
  isStreaming,
  onStopStream,
  inputRef,
}) => {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const handleSuggestion = (e) => {
      setInput(e.detail);
      inputRef.current?.focus();
    };
    window.addEventListener("suggestion-click", handleSuggestion);
    return () =>
      window.removeEventListener("suggestion-click", handleSuggestion);
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    // Auto-resize textarea
    const lineCount = (value.match(/\n/g) || []).length + 1;
    setRows(Math.min(Math.max(lineCount, 1), 8));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput("");
    setRows(1);
  };

  const charCount = input.length;
  const isNearLimit = charCount > 8000;
  const isOverLimit = charCount > 10000;

  return (
    <div className="input-area">
      <div className="input-area-inner">
        <div className={`input-wrapper ${isStreaming ? "streaming" : ""}`}>
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "KRYZEN is processing..."
                : "Enter your query... (Shift+Enter for new line)"
            }
            rows={rows}
            disabled={isStreaming}
            maxLength={10000}
            aria-label="Chat input"
          />

          {/* Character counter */}
          {charCount > 100 && (
            <div
              className={`char-counter ${
                isNearLimit ? "warning" : ""
              } ${isOverLimit ? "error" : ""}`}
            >
              {charCount}/10000
            </div>
          )}
        </div>

        <div className="input-actions">
          {isStreaming ? (
            <motion.button
              className="send-btn stop-btn"
              onClick={onStopStream}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 10px #ff0000", "0 0 20px #ff0000", "0 0 10px #ff0000"] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <div className="stop-icon" />
              <span>STOP</span>
            </motion.button>
          ) : (
            <motion.button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isOverLimit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={16} />
              <span>SEND</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="input-hint">
        <span>ENTER to send</span>
        <span className="hint-sep">•</span>
        <span>SHIFT+ENTER for new line</span>
        <span className="hint-sep">•</span>
        <span>Markdown supported</span>
      </div>
    </div>
  );
};

// ─── Main ChatInterface ────────────────────────────────────────────────────────
const ChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    clearMessages,
    stopStream,
    retryLast,
  } = useChat();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Auto-scroll logic
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end",
    });
  }, []);

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [messages, streamingContent, autoScroll]);

  // Detect manual scroll
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
    setShowScrollBtn(!isAtBottom);
  };

  return (
    <motion.div
      className="chat-interface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Toolbar */}
      <ChatToolbar
        onClear={clearMessages}
        messageCount={messages.length}
        isStreaming={isStreaming}
      />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="messages-container"
        onScroll={handleScroll}
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !isStreaming ? (
            <EmptyState key="empty" />
          ) : (
            <div className="messages-list" key="messages">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLast={index === messages.length - 1}
                />
              ))}

              {/* Streaming message bubble */}
              {isStreaming && (
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="streaming-container"
                >
                  {streamingContent ? (
                    <MessageBubble
                      message={{
                        id: "streaming",
                        role: "assistant",
                        content: streamingContent,
                        isStreaming: true,
                      }}
                      isLast={true}
                    />
                  ) : (
                    <div className="loader-container">
                      <ScytheLoader />
                      <span className="loader-text">
                        KRYZEN is processing...
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="error-icon">⚠</span>
              <span className="error-message">{error}</span>
              <button className="error-retry" onClick={retryLast}>
                <RotateCcw size={14} />
                RETRY
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            className="scroll-bottom-btn"
            onClick={() => {
              setAutoScroll(true);
              scrollToBottom();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            ↓
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <InputArea
        onSend={sendMessage}
        isStreaming={isStreaming}
        onStopStream={stopStream}
        inputRef={inputRef}
      />
    </motion.div>
  );
};

export default ChatInterface;