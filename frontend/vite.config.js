import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ─── Vite Configuration ────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to backend during development
      // Swap backend URL here without touching component code
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["framer-motion"],
          syntax: ["react-syntax-highlighter"],
          markdown: ["react-markdown", "remark-gfm"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "react-markdown",
      "remark-gfm",
      "react-syntax-highlighter",
      "lucide-react",
    ],
  },
});