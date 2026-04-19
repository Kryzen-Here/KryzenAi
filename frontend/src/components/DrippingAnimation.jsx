import React, { useEffect, useRef, memo } from "react";

// ─── Individual Drip Component ─────────────────────────────────────────────────
const generateDrips = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 98 + 1}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 4}s`,
    width: `${Math.random() * 3 + 1}px`,
    dropSize: `${Math.random() * 6 + 4}px`,
    initialHeight: `${Math.random() * 30 + 5}px`,
    maxHeight: `${Math.random() * 80 + 40}px`,
    opacity: Math.random() * 0.4 + 0.6,
  }));
};

// ─── Main DrippingAnimation Component ─────────────────────────────────────────
const DrippingAnimation = memo(() => {
  const drips = generateDrips(20);

  return (
    <div
      className="dripping-container"
      aria-hidden="true"
      role="presentation"
    >
      {/* Top edge blood pool */}
      <div className="blood-pool-top" />

      {/* Individual drips */}
      {drips.map((drip) => (
        <div
          key={drip.id}
          className="blood-drip-wrapper"
          style={{ left: drip.left }}
        >
          {/* Drip stem */}
          <div
            className="blood-stem"
            style={{
              width: drip.width,
              animationDuration: drip.animationDuration,
              animationDelay: drip.animationDelay,
              opacity: drip.opacity,
            }}
          />

          {/* Drip drop */}
          <div
            className="blood-drop"
            style={{
              width: drip.dropSize,
              height: drip.dropSize,
              animationDuration: drip.animationDuration,
              animationDelay: drip.animationDelay,
              opacity: drip.opacity,
            }}
          />
        </div>
      ))}

      {/* Secondary layer for depth */}
      {generateDrips(10).map((drip) => (
        <div
          key={`secondary-${drip.id}`}
          className="blood-drip-wrapper secondary"
          style={{ left: drip.left }}
        >
          <div
            className="blood-stem"
            style={{
              width: drip.width,
              animationDuration: `${parseFloat(drip.animationDuration) + 1}s`,
              animationDelay: `${parseFloat(drip.animationDelay) + 0.5}s`,
              opacity: drip.opacity * 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
});

DrippingAnimation.displayName = "DrippingAnimation";

export default DrippingAnimation;