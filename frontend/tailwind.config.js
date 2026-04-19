/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kryzen: {
          black: "#000000",
          "deep-black": "#050000",
          "dark-red": "#1a0000",
          "mid-red": "#440000",
          red: "#ff0000",
          "red-dim": "#cc0000",
        },
      },
      fontFamily: {
        display: ["Orbitron", "Arial Black", "sans-serif"],
        body: ["Rajdhani", "Arial", "sans-serif"],
        mono: ["Share Tech Mono", "Fira Code", "Courier New", "monospace"],
      },
      animation: {
        "drip": "dripStem 3s ease-in-out infinite",
        "glow-pulse": "titlePulse 3s ease-in-out infinite",
        "boot-cursor": "blink 0.7s step-end infinite",
      },
      boxShadow: {
        "red-sm": "0 0 10px rgba(255, 0, 0, 0.2)",
        "red-md": "0 0 20px rgba(255, 0, 0, 0.3)",
        "red-lg": "0 0 40px rgba(255, 0, 0, 0.4)",
        "red-glow": "0 0 60px rgba(255, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};