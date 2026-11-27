// Checks that a request came through Cloudflare Access and returns the
// signed-in person's email. Access puts a signed token (a JWT) on every
// request it lets through, in the Cf-Access-Jwt-Assertion header. We check
// its signature against Access's public keys, that it was made for this
// Access application (ACCESS_AUD) by our team (ACCESS_TEAM_DOMAIN), and that
// it hasn't expired. Anything else is refused.

const CERTS_TTL_MS = 10 * 60 * 1000;
let certsCache = { url: "", keys: [], fetchedAt: 0 };

export class AccessError extends Error {}

const b64urlToBytes = (s) => {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const b64urlToJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function getKeys(teamDomain, forceRefresh, certsUrl) {
  const url = certsUrl || `https://${teamDomain}/cdn-cgi/access/certs`;
  const fresh = Date.now() - certsCache.fetchedAt < CERTS_TTL_MS;
  if (!forceRefresh && certsCache.url === url && fresh) return certsCache.keys;
  const res = await fetch(url);
  if (!res.ok) throw new AccessError(`Could not load Access keys (${res.status})`);
  const { keys = [] } = await res.json();
  certsCache = { url, keys, fetchedAt: Date.now() };
  return keys;
}

function readToken(request) {
  const header = request.headers.get("Cf-Access-Jwt-Assertion");
  if (header) return header;
  const cookie = request.headers.get("Cookie") || "";
  const m = /(?:^|;\s*)CF_Authorization=([^;]+)/.exec(cookie);
  return m ? m[1] : "";
}

// Returns the lower-cased email of the signed-in person, or throws AccessError.
export async function verifyAccess(request, env) {
  const team = (env.ACCESS_TEAM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const aud = env.ACCESS_AUD || "";
  if (!team || !aud) throw new AccessError("Access is not configured (ACCESS_TEAM_DOMAIN, ACCESS_AUD)");

  const token = readToken(request);
  const parts = token.split(".");
  if (parts.length !== 3) throw new AccessError("Not signed in through Cloudflare Access");

  let header, payload;
  try {
    header = b64urlToJson(parts[0]);
    payload = b64urlToJson(parts[1]);
  } catch {
    throw new AccessError("Unreadable Access token");
  }
  if (header.alg !== "RS256") throw new AccessError("Unexpected token algorithm");

  // ACCESS_CERTS_URL is only for local testing with a stand-in for Access.
  const certsUrl = env.ACCESS_CERTS_URL;
  let jwk = (await getKeys(team, false, certsUrl)).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await getKeys(team, true, certsUrl)).find((k) => k.kid === header.kid);
  if (!jwk) throw new AccessError("Unknown Access signing key");

  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!ok) throw new AccessError("Invalid Access token signature");

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(aud)) throw new AccessError("Access token is for another application");
  if (payload.iss !== `https://${team}`) throw new AccessError("Access token from another team");
  if (!payload.exp || payload.exp < now) throw new AccessError("Access session has expired");
  if (payload.nbf && payload.nbf > now + 60) throw new AccessError("Access token not valid yet");
  if (!payload.email) throw new AccessError("Access token has no email");
  return String(payload.email).toLowerCase();
}
