// Runs after `vite build`. Copies dist/index.html to dist/<page>.html for
// every page in src/seo.js, and to dist/products/<id>.html for every visible
// product in src/content/products/, with that page's title, description and
// canonical URL filled in, so each page reaches Google with its own title and
// description rather than the home page's. Also writes dist/sitemap.xml.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { pages, SITE_URL, SITE_NAME } from "../src/seo.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const template = readFileSync("dist/index.html", "utf8");

const PRODUCTS_DIR = "src/content/products";
const productPages = Object.fromEntries(
  readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(`${PRODUCTS_DIR}/${f}`, "utf8"))])
    .filter(([, p]) => !p.hidden)
    .map(([id, p]) => [
      `/products/${id}`,
      { title: `${p.name} | ${SITE_NAME}`, description: String(p.description || "").trim() },
    ])
);
const allPages = { ...pages, ...productPages };

mkdirSync("dist/products", { recursive: true });
for (const [path, { title, description }] of Object.entries(allPages)) {
  const url = SITE_URL + path;
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  // Cloudflare Pages serves dist/contact.html at /contact, with no redirect to a
  // trailing slash, so the URLs stay exactly as the app writes them.
  writeFileSync(path === "/" ? "dist/index.html" : `dist${path}.html`, html);
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.keys(allPages).map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>\n`).join("") +
  `</urlset>\n`;
writeFileSync("dist/sitemap.xml", sitemap);
console.log(`Prerendered ${Object.keys(allPages).length} pages and wrote sitemap.xml`);
