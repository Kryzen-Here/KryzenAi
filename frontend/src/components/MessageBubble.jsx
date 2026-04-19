import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, User, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

// ─── Copy Button ───────────────────────────────────────────────────────────────
const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.button
      className={`copy-btn ${className}`}
      onClick={handleCopy}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={copied ? "Copied!" : "Copy message"}
    >
      {copied ? (
        <Check size={12} className="copy-check" />
      ) : (
        <Copy size={12} />
      )}
    </motion.button>
  );
};

// ─── Markdown Components ───────────────────────────────────────────────────────
const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    if (!inline && (language || codeString.includes("\n"))) {
      return <CodeBlock code={codeString} language={language} />;
    }

    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  },

  p({ children }) {
    return <p className="md-paragraph">{children}</p>;
  },

  h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="md-h3">{children}</h3>,

  ul({ children }) {
    return <ul className="md-ul">{children}</ul>;
  },

  ol({ children }) {
    return <ol className="md-ol">{children}</ol>;
  },

  li({ children }) {
    return <li className="md-li">{children}</li>;
  },

  blockquote({ children }) {
    return <blockquote className="md-blockquote">{children}</blockquote>;
  },

  strong({ children }) {
    return <strong className="md-strong">{children}</strong>;
  },

  em({ children }) {
    return <em className="md-em">{children}</em>;
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        className="md-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },

  hr() {
    return <hr className="md-hr" />;
  },

  table({ children }) {
    return (
      <div className="md-table-wrapper">
        <table className="md-table">{children}</table>
      </div>
    );
  },

  th({ children }) {
    return <th className="md-th">{children}</th>;
  },

  td({ children }) {
    return <td className="md-td">{children}</td>;
  },
};

// ─── Glitch Animation Variants ─────────────────────────────────────────────────
const assistantVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const userVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// ─── Timestamp Formatter ───────────────────────────────────────────────────────
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// ─── Main MessageBubble Component ─────────────────────────────────────────────
const MessageBubble = memo(({ message, isLast }) => {
  const { role, content, isStreaming, timestamp } = message;
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  return (
    <motion.div
      className={`message-wrapper ${isUser ? "user" : "assistant"}`}
      variants={isUser ? userVariants : assistantVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
        {isUser ? (
          <User size={16} />
        ) : (
          <span className="ai-avatar-symbol">⚔</span>
        )}
      </div>

      {/* Bubble */}
      <div className="message-content-wrapper">
        {/* Role label */}
        <div className="message-meta">
          <span className="message-role">
            {isUser ? "YOU" : "KRYZEN AI"}
          </span>
          {timestamp && (
            <span className="message-time">{formatTime(timestamp)}</span>
          )}
        </div>

        {/* Main bubble */}
        <div
          className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"} ${
            isStreaming ? "streaming-bubble" : ""
          } ${isLast && isAssistant ? "glitch-entry" : ""}`}
        >
          {isUser ? (
            <div className="user-text">{content}</div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && <span className="typing-cursor">▋</span>}
            </div>
          )}
        </div>

        {/* Message actions */}
        {!isStreaming && content && (
          <div className="message-actions">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;