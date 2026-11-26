import { defineConfig } from "vite";

// The site is served from "/". Set BASE_PATH (e.g. "/elvaso") only to build it
// for a sub-folder.
const base = (process.env.BASE_PATH || "").replace(/\/$/, "") + "/";

export default defineConfig({
  base,
  // Use React's automatic JSX runtime so files don't need `import React`.
  esbuild: { jsx: "automatic" },
});
