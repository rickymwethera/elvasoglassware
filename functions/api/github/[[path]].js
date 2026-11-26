// /api/github/* : the admin's GitHub connection. See server/github-proxy.js.
// The path is taken from the raw URL so encoded parts such as "main:src%2Fcontent"
// reach GitHub exactly as Decap sent them.
import { handleGithubProxy } from "../../../server/github-proxy.js";

export const onRequest = ({ request, env }) =>
  handleGithubProxy({
    request,
    env,
    path: new URL(request.url).pathname.replace(/^\/api\/github/, ""),
  });
