import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// ─── Custom Kryzen Dark/Red Theme ──────────────────────────────────────────────
const kryzenTheme = {
  'code[class*="language-"]': {
    color: "#e0e0e0",
    background: "none",
    fontFamily: '"Share Tech Mono", "Fira Code", "Courier New", monospace',
    fontSize: "13px",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    tabSize: "2",
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#e0e0e0",
    background: "#0a0000",
    padding: "1rem",
    margin: "0",
    overflow: "auto",
    borderRadius: "0 0 4px 4px",
    fontSize: "13px",
  },
  comment: { color: "#660000", fontStyle: "italic" },
  prolog: { color: "#660000" },
  doctype: { color: "#660000" },
  cdata: { color: "#660000" },
  punctuation: { color: "#888888" },
  namespace: { opacity: "0.7" },
  property: { color: "#ff4444" },
  tag: { color: "#ff2222" },
  boolean: { color: "#ff6666" },
  number: { color: "#ff8888" },
  constant: { color: "#ff4444" },
  symbol: { color: "#ff4444" },
  deleted: { color: "#ff0000" },
  selector: { color: "#ff6666" },
  "attr-name": { color: "#ff8888" },
  string: { color: "#ff9999" },
  char: { color: "#ff9999" },
  builtin: { color: "#cc3333" },
  inserted: { color: "#aa3333" },
  operator: { color: "#cc4444" },
  entity: { color: "#ff8888", cursor: "help" },
  url: { color: "#ff8888" },
  variable: { color: "#ffaaaa" },
  atrule: { color: "#ff4444" },
  "attr-value": { color: "#ff9999" },
  function: { color: "#ff6666", fontWeight: "bold" },
  "class-name": { color: "#ff4444", fontWeight: "bold" },
  keyword: { color: "#ff0000", fontWeight: "bold" },
  regex: { color: "#ff6666" },
  important: { color: "#ff0000", fontWeight: "bold" },
};

// ─── Language Badge ────────────────────────────────────────────────────────────
const LanguageBadge = ({ language }) => {
  const langMap = {
    js: "JavaScript",
    jsx: "React JSX",
    ts: "TypeScript",
    tsx: "React TSX",
    py: "Python",
    python: "Python",
    rust: "Rust",
    go: "Go",
    java: "Java",
    cpp: "C++",
    c: "C",
    cs: "C#",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    sh: "Shell",
    bash: "Bash",
    sql: "SQL",
    md: "Markdown",
    dockerfile: "Dockerfile",
  };

  return (
    <span className="language-badge">
      {langMap[language?.toLowerCase()] || language?.toUpperCase() || "CODE"}
    </span>
  );
};

// ─── Main CodeBlock Component ──────────────────────────────────────────────────
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lineCount = (code.match(/\n/g) || []).length + 1;
  const isLong = lineCount > 20;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy code");
    }
  };

  return (
    <motion.div
      className="code-block"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Code block header */}
      <div className="code-header">
        <div className="code-header-left">
          <Terminal size={14} className="code-terminal-icon" />
          <LanguageBadge language={language} />
          <span className="code-line-count">{lineCount} lines</span>
        </div>

        <div className="code-header-right">
          {/* Collapse button for long code */}
          {isLong && (
            <motion.button
              className="code-action-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronUp size={14} />
              )}
              <span>{isCollapsed ? "EXPAND" : "COLLAPSE"}</span>
            </motion.button>
          )}

          {/* Copy button */}
          <motion.button
            className="code-action-btn copy-code-btn"
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check size={14} className="copy-success" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>COPY</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Code content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            className="code-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SyntaxHighlighter
              language={language || "text"}
              style={kryzenTheme}
              showLineNumbers={lineCount > 3}
              lineNumberStyle={{
                color: "#440000",
                fontSize: "11px",
                paddingRight: "1rem",
                userSelect: "none",
              }}
              wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                maxHeight: isLong ? "500px" : "none",
                overflow: "auto",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview */}
      {isCollapsed && (
        <div className="code-collapsed-preview">
          <span className="collapsed-text">
            {lineCount} lines hidden — click EXPAND to view
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CodeBlock;