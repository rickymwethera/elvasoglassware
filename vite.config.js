import { defineConfig } from "vite";

// The deploy workflow passes BASE_PATH from GitHub Pages: empty when the site
// has a custom domain (https://www.elvasoglassware.com/), "/<repo>" when it is
// still served from https://<owner>.github.io/<repo>/. Locally it is "/".
const base = (process.env.BASE_PATH || "").replace(/\/$/, "") + "/";

export default defineConfig({
  base,
  // Use React's automatic JSX runtime so files don't need `import React`.
  esbuild: { jsx: "automatic" },
});
