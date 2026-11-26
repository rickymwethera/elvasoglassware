// Cloudflare Pages ignores "Range" requests for static files and always sends
// the whole video. Browsers need a partial (206) response to jump to another
// point in a video, so without this the founder video can't be skipped
// forward or back. This answers Range requests for anything under /videos/.
export async function onRequest({ request, env }) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const asset = await env.ASSETS.fetch(new URL(request.url));
  if (!asset.ok) return asset;
  // A missing file falls back to the app's HTML page; report it as missing.
  if ((asset.headers.get("Content-Type") || "").startsWith("text/html")) {
    return new Response("Not found", { status: 404 });
  }

  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=86400");
  headers.delete("Content-Encoding");

  const range = parseRange(request.headers.get("Range"), size);
  if (range === null) {
    headers.set("Content-Length", String(size));
    return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
  }
  if (range === false) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const [start, end] = range;
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  const part = new Uint8Array(body, start, end - start + 1);
  return new Response(request.method === "HEAD" ? null : part, { status: 206, headers });
}

// Returns [start, end] for one "bytes=" range, null when there is no usable
// Range header (send the whole file), or false when it is out of bounds.
function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec((header || "").trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  let start, end;
  if (m[1] === "") {
    // "bytes=-500" means the last 500 bytes.
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return false;
  return [start, end];
}
