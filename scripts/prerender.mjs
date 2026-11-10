// Runs after `vite build`. Copies dist/index.html to dist/<page>.html for
// every page in src/seo.js with that page's title, description and canonical
// URL filled in. GitHub Pages then serves each page with a 200 status instead
// of the 404 fallback, so Google can index it.
import { readFileSync, writeFileSync } from "node:fs";
import { pages, SITE_URL } from "../src/seo.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const template = readFileSync("dist/index.html", "utf8");

for (const [path, { title, description }] of Object.entries(pages)) {
  const url = SITE_URL + path;
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  // GitHub Pages serves dist/contact.html at /contact, with no redirect to a
  // trailing slash, so the URLs stay exactly as the app writes them.
  writeFileSync(path === "/" ? "dist/index.html" : `dist${path}.html`, html);
}
console.log(`Prerendered ${Object.keys(pages).length} pages`);
