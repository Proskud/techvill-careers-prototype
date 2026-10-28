import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typographyPlugin from "./scripts/typography-plugin.mjs";
import basePathPlugin from "./scripts/base-path-plugin.mjs";

// Local dev and the Sites build serve from "/". The GitHub Pages build sets VITE_BASE="/<repo>/".
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  build: {
    outDir: process.env.VITE_OUT_DIR || "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react({ include: /\.[cm]?[jt]sx?$/, babel: { plugins: [typographyPlugin, basePathPlugin(base)] } })],
});
