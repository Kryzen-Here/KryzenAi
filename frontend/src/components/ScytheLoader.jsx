import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── Trail Particle ────────────────────────────────────────────────────────────
const TrailParticle = ({ angle, delay }) => (
  <motion.div
    className="trail-particle"
    style={{
      position: "absolute",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      background: "#ff0000",
      top: "50%",
      left: "50%",
    }}
    animate={{
      x: [0, Math.cos((angle * Math.PI) / 180) * 30],
      y: [0, Math.sin((angle * Math.PI) / 180) * 30],
      opacity: [0.8, 0],
      scale: [1, 0.2],
    }}
    transition={{
      duration: 0.8,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

// ─── Scythe SVG ────────────────────────────────────────────────────────────────
const ScytheSVG = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="scythe-svg"
  >
    {/* Blade */}
    <path
      d="M20 8 C8 8, 4 16, 4 20 C4 24, 8 28, 16 28 C20 28, 24 25, 26 22"
      stroke="#ff0000"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      filter="url(#red-glow)"
    />
    {/* Blade edge highlight */}
    <path
      d="M20 10 C10 10, 7 17, 7 20 C7 23, 10 26, 16 26"
      stroke="#ff4444"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
    {/* Handle */}
    <line
      x1="26"
      y1="22"
      x2="36"
      y2="36"
      stroke="#cc0000"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Handle grip */}
    <line
      x1="28"
      y1="26"
      x2="30"
      y2="24"
      stroke="#ff0000"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="31"
      y1="30"
      x2="33"
      y2="28"
      stroke="#ff0000"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Glow filter */}
    <defs>
      <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// ─── Main ScytheLoader Component ───────────────────────────────────────────────
const ScytheLoader = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const trailAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="scythe-loader">
      {/* Rotating scythe with trail */}
      <div className="scythe-container">
        {/* Red trail ring */}
        <motion.div
          className="scythe-trail-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Trail particles */}
        {trailAngles.map((angle, i) => (
          <TrailParticle key={angle} angle={angle} delay={i * 0.1} />
        ))}

        {/* Main scythe rotation */}
        <motion.div
          className="scythe-icon-wrapper"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <ScytheSVG />
        </motion.div>

        {/* Outer pulse ring */}
        <motion.div
          className="scythe-pulse"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Processing text */}
      <div className="scythe-text-container">
        <motion.span
          className="scythe-processing-text"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          PROCESSING{dots}
        </motion.span>
        <div className="scythe-sub-text">
          KRYZEN IS THINKING
        </div>
      </div>
    </div>
  );
};

export default ScytheLoader;