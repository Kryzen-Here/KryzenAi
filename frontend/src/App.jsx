import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "./components/ChatInterface";
import DrippingAnimation from "./components/DrippingAnimation";
import "./GoreStyles.css";

// ─── Boot Screen Component ────────────────────────────────────────────────────
const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const bootLines = [
    "INITIALIZING KRYZEN CORE...",
    "LOADING NEURAL MATRICES...",
    "CALIBRATING DARK PROTOCOLS...",
    "GROQ INTERFACE: CONNECTED",
    "KRYZEN AI: ONLINE",
  ];

  useEffect(() => {
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setPhase(i + 1), i * 400 + 400)
    );
    const finalTimer = setTimeout(onComplete, bootLines.length * 400 + 800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, []);

  return (
    <motion.div
      className="boot-screen"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <div className="boot-content">
        <motion.div
          className="boot-logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="boot-logo-text">KRYZEN</span>
          <span className="boot-logo-ai">AI</span>
        </motion.div>

        <div className="boot-lines">
          {bootLines.map((line, i) => (
            <motion.div
              key={i}
              className="boot-line"
              initial={{ opacity: 0, x: -20 }}
              animate={phase > i ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3 }}
            >
              <span className="boot-prompt">&gt;&gt; </span>
              {line}
              {phase === i + 1 && i === bootLines.length - 1 && (
                <span className="boot-cursor">█</span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="boot-progress-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="boot-progress-bar"
            initial={{ width: "0%" }}
            animate={{ width: `${(phase / bootLines.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Header Component ─────────────────────────────────────────────────────────
const Header = () => {
  return (
    <motion.header
      className="kryzen-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-inner">
        {/* Left decorative element */}
        <div className="header-decoration left">
          <div className="deco-line" />
          <div className="deco-diamond" />
        </div>

        {/* Main title */}
        <div className="header-title-group">
          <motion.div
            className="header-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ADVANCED INTELLIGENCE SYSTEM
          </motion.div>

          <h1 className="kryzen-title">
            <motion.span
              className="title-kryzen"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.15em" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              KRYZEN
            </motion.span>
            <motion.span
              className="title-ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {" "}
              AI
            </motion.span>
          </h1>

          <motion.div
            className="header-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            &ldquo;Precision in the darkness. Excellence in the void.&rdquo;
          </motion.div>
        </div>

        {/* Right decorative element */}
        <div className="header-decoration right">
          <div className="deco-diamond" />
          <div className="deco-line" />
        </div>
      </div>

      {/* Status indicator */}
      <div className="header-status">
        <div className="status-dot" />
        <span className="status-text">KRYZEN ONLINE</span>
        <div className="status-dot" />
      </div>

      {/* Header bottom border with drip effect */}
      <div className="header-drip-border" />
    </motion.header>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const handleBootComplete = () => {
    setIsBooting(false);
    setTimeout(() => setIsReady(true), 100);
  };

  return (
    <div className="app-root">
      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      {/* Ambient red glow corners */}
      <div className="ambient-glow top-left" aria-hidden="true" />
      <div className="ambient-glow top-right" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {isBooting ? (
          <BootScreen key="boot" onComplete={handleBootComplete} />
        ) : (
          <motion.div
            key="main"
            className="main-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Persistent dripping animation */}
            <DrippingAnimation />

            {/* Header */}
            <Header />

            {/* Main chat interface */}
            <main className="main-content">
              {isReady && <ChatInterface />}
            </main>

            {/* Footer */}
            <motion.footer
              className="kryzen-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span>KRYZEN AI v1.0 </span>
              <span className="footer-sep">◆</span>
              <span> Powered by Groq + LLaMA3-70B</span>
              <span className="footer-sep">◆</span>
              <span> The void awaits your query</span>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;