// /api/auth : the "Login with GitHub" step Decap CMS expects. Staff are already
// signed in through Cloudflare Access, so instead of sending them to GitHub we
// check their Access login and hand Decap a placeholder token. The real GitHub
// token never leaves the server (see server/github-proxy.js).
import { verifyAccess, AccessError } from "../../server/access.js";

const page = (script) =>
  new Response(`<!doctype html><meta charset="utf-8"><title>Signing in</title><script>${script}</script>`, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function onRequestGet({ request, env }) {
  let status = "success";
  let content = { token: "cloudflare-access", provider: "github" };
  try {
    await verifyAccess(request, env);
  } catch (e) {
    if (!(e instanceof AccessError)) throw e;
    status = "error";
    content = { message: e.message };
  }
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  // Decap's login handshake: tell the editor window we're here, wait for it
  // to answer, then send the result back to that same site only.
  return page(`(function () {
  if (!window.opener) { document.body.textContent = "You can close this window."; return; }
  function receive(e) {
    if (e.origin !== location.origin) return;
    window.removeEventListener("message", receive);
    window.opener.postMessage(${message}, location.origin);
  }
  window.addEventListener("message", receive);
  window.opener.postMessage("authorizing:github", location.origin);
})();`);
}
