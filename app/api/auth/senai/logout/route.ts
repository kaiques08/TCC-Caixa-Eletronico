import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

export async function GET(request: Request) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const configuredLogout = runtimeEnv.SENAI_SSO_LOGOUT_URL?.trim();
  const validatorLogout = runtimeEnv.SENAI_SAML_LOGOUT_URL?.trim();
  const validatorToken = runtimeEnv.SENAI_SAML_VALIDATOR_TOKEN?.trim();
  const allowedHosts = new Set(
    (runtimeEnv.SENAI_SSO_ALLOWED_HOSTS || "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
  let destination = new URL("/", request.url);

  if (validatorLogout && validatorToken) {
    try {
      const endpoint = new URL(validatorLogout);
      const sessionToken = readCookie(request, "__Host-finup.sid");
      if (sessionToken && endpoint.protocol === "https:" && allowedHosts.has(endpoint.hostname.toLowerCase())) {
        await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${validatorToken}`, "X-SENAI-Session": sessionToken },
          cache: "no-store",
          signal: AbortSignal.timeout(5_000),
        });
      }
    } catch {
      // A sessão local é encerrada mesmo se a revogação remota estiver indisponível.
    }
  }

  if (configuredLogout) {
    try {
      const candidate = new URL(configuredLogout);
      if (candidate.protocol === "https:" && allowedHosts.has(candidate.hostname.toLowerCase())) destination = candidate;
    } catch {
      destination = new URL("/", request.url);
    }
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: destination.toString(),
      "Set-Cookie": "__Host-finup.sid=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0",
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
