// GitHub Pages has no SPA rewrites: serve the app shell for deep links (/blog, /vacancies/1 …) via 404.html,
// and disable Jekyll so files are served as built.
import { copyFileSync, writeFileSync } from "node:fs";

const out = process.env.VITE_OUT_DIR || "dist/pages";
copyFileSync(`${out}/index.html`, `${out}/404.html`);
writeFileSync(`${out}/.nojekyll`, "");
