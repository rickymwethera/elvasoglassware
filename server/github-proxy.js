// Saves /admin (Decap CMS) edits to GitHub with one shared GitHub token, so
// staff don't need GitHub accounts. Decap sends its GitHub API calls here
// instead of to api.github.com. For each call we:
//   1. check the person signed in through Cloudflare Access (see access.js),
//   2. allow only the calls Decap needs, on this one repository,
//   3. allow writes only to the content files and the photo upload folder,
//   4. add the GitHub token, which only this function knows,
//   5. record the staff member's email as the author of each saved change.
import { verifyAccess, AccessError } from "./access.js";

// Files staff may change. Anything else (the site's code) is refused.
const EDITABLE = [
  "src/content/products/",
  "src/content/categories.json",
  "src/content/settings.json",
  "src/content/sale.json",
  "public/images/uploads/",
];
// Files only the emails in ADMIN_EMAILS may change, when ADMIN_EMAILS is set.
const ADMIN_ONLY = ["src/content/settings.json", "src/content/sale.json"];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
const refuse = (status, message) => json(status, { message });

// Uploads must be photos, and product entries must be JSON. This stops anyone
// slipping a web page or script (.html, .svg, .js) onto the site as a "photo".
const PHOTO = /\.(jpe?g|png|webp|gif|avif)$/i;

const isEditable = (path) =>
  EDITABLE.some((p) => (p.endsWith("/") ? path.startsWith(p) : path === p)) &&
  !path.split("/").includes("..") &&
  (!path.startsWith("public/images/uploads/") || PHOTO.test(path)) &&
  (!path.startsWith("src/content/products/") || /^src\/content\/products\/[^/]+\.json$/.test(path));

export async function handleGithubProxy({ request, env, path }) {
  let email;
  try {
    email = await verifyAccess(request, env);
  } catch (e) {
    if (e instanceof AccessError) return refuse(401, e.message);
    throw e;
  }
  if (!env.GITHUB_TOKEN) return refuse(500, "GITHUB_TOKEN is not set");

  const repo = env.GITHUB_REPO || "rickymwethera/elvasoglassware";
  const branch = env.GITHUB_BRANCH || "main";
  const admins = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = admins.length === 0 || admins.includes(email);

  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const repoPath = `/repos/${repo}`;
  path = "/" + String(path || "").replace(/^\/+/, "");
  const inRepo = path === repoPath || path.startsWith(repoPath + "/");
  let body = null;

  if (method === "GET" || method === "HEAD") {
    if (path !== "/user" && !inRepo) return refuse(403, "Only this site's repository can be read");
  } else if (method === "POST" && path === `${repoPath}/git/blobs`) {
    body = await request.text();
  } else if (method === "POST" && path === `${repoPath}/git/trees`) {
    const data = await request.json().catch(() => null);
    if (!data || !data.base_tree || !Array.isArray(data.tree))
      return refuse(400, "Unexpected save request");
    for (const entry of data.tree) {
      const p = String(entry.path || "");
      if (!isEditable(p)) return refuse(403, `The admin can't change ${p}`);
      if (entry.type && entry.type !== "blob") return refuse(403, `The admin can't change ${p}`);
      if (entry.mode && entry.mode !== "100644") return refuse(403, `The admin can't change ${p}`);
      if (!isAdmin && ADMIN_ONLY.includes(p))
        return refuse(403, "Only the site's admins can change contact details and sales. Ask Ricky.");
    }
    body = JSON.stringify(data);
  } else if (method === "POST" && path === `${repoPath}/git/commits`) {
    const data = await request.json().catch(() => null);
    if (!data || !data.tree) return refuse(400, "Unexpected save request");
    const name = email.split("@")[0];
    const commit = {
      message: `${String(data.message || "Update content").trim()}\n\nEdited by ${email} in /admin`,
      tree: data.tree,
      parents: data.parents,
      author: { name, email, date: new Date().toISOString() },
    };
    body = JSON.stringify(commit);
  } else if (method === "PATCH" && path === `${repoPath}/git/refs/heads/${branch}`) {
    const data = await request.json().catch(() => null);
    if (!data || !data.sha) return refuse(400, "Unexpected save request");
    body = JSON.stringify({ sha: data.sha, force: false });
  } else {
    return refuse(403, `The admin can't do ${method} ${path}`);
  }

  const api = (env.GITHUB_API_URL || "https://api.github.com").replace(/\/+$/, "");
  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: request.headers.get("Accept") || "application/vnd.github+json",
    "User-Agent": "elvaso-admin",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (body !== null) headers["Content-Type"] = "application/json";
  const upstream = await fetch(api + path + url.search, { method, headers, body });

  const out = new Headers({ "Cache-Control": "no-store" });
  for (const h of ["Content-Type", "ETag", "Link", "Last-Modified"]) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }
  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers: out,
  });
}
