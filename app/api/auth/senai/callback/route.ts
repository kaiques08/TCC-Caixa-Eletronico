import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type SenaiRole = "aluno" | "professor" | "adm";

function runtimeConfiguration() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const allowedHosts = new Set(
    (runtimeEnv.SENAI_SSO_ALLOWED_HOSTS || "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
  return {
    validatorUrl: runtimeEnv.SENAI_SAML_VALIDATOR_URL?.trim(),
    sessionUrl: runtimeEnv.SENAI_SAML_SESSION_URL?.trim(),
    validatorToken: runtimeEnv.SENAI_SAML_VALIDATOR_TOKEN?.trim(),
    entityId: (runtimeEnv.SENAI_SAML_ENTITY_ID || runtimeEnv.SENAI_ISSUER)?.trim(),
    acsUrl: (runtimeEnv.SENAI_SAML_ACS_URL || runtimeEnv.SENAI_CALLBACK_URL)?.trim(),
    allowedHosts,
  };
}

function normalizeRole(value: unknown): SenaiRole | null {
  const role = String(value || "").trim().toLocaleLowerCase("pt-BR");
  if (role === "aluno" || role === "estudante") return "aluno";
  if (role === "professor" || role === "docente") return "professor";
  if (role === "diretor" || role === "diretora" || role === "direcao" || role === "direção" || role === "adm" || role === "admin") return "adm";
  return null;
}

function errorRedirect(request: Request, code: string) {
  const destination = new URL("/", request.url);
  destination.searchParams.set("erro", code);
  return new Response(null, {
    status: 303,
    headers: {
      Location: destination.toString(),
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function validateEndpoint(raw: string | undefined, allowedHosts: Set<string>) {
  if (!raw) throw new Error("URL ausente");
  const endpoint = new URL(raw);
  if (endpoint.protocol !== "https:" || !allowedHosts.has(endpoint.hostname.toLowerCase())) throw new Error("Destino não autorizado");
  return endpoint;
}

function sessionResponse(request: Request, sessionToken: string, maxAgeValue: unknown) {
  const parsedMaxAge = Number(maxAgeValue);
  const maxAge = Number.isFinite(parsedMaxAge) ? Math.max(300, Math.min(28_800, parsedMaxAge)) : 3_600;
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/", request.url).toString(),
      "Set-Cookie": `__Host-finup.sid=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${Math.round(maxAge)}`,
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function validIdentity(payload: Record<string, unknown>) {
  const user = (payload.user || {}) as Record<string, unknown>;
  const role = normalizeRole(user.role || user.perfil || user.tipoUsuario);
  const userId = String(user.id || user.senaiId || "").trim();
  return Boolean(role && userId);
}

async function validateOpaqueSession(config: ReturnType<typeof runtimeConfiguration>, sessionToken: string) {
  const endpoint = validateEndpoint(config.sessionUrl, config.allowedHosts);
  const upstream = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.validatorToken}`,
      "X-SENAI-Session": sessionToken,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  if (!upstream.ok || payload.authenticated !== true || !validIdentity(payload)) throw new Error("Sessão inválida");
  return payload;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 2_200_000) return errorRedirect(request, "resposta_muito_grande");

  const config = runtimeConfiguration();
  if (!config.validatorToken || config.allowedHosts.size === 0) return errorRedirect(request, "validador_nao_configurado");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorRedirect(request, "resposta_invalida");
  }

  const bridgeToken = String(form.get("session_token") || "");
  if (bridgeToken) {
    if (bridgeToken.length < 32 || bridgeToken.length > 8_192) return errorRedirect(request, "sessao_invalida");
    try {
      const payload = await validateOpaqueSession(config, bridgeToken);
      return sessionResponse(request, bridgeToken, payload.maxAge);
    } catch {
      return errorRedirect(request, "sessao_invalida");
    }
  }

  if (!config.validatorUrl || !config.entityId || !config.acsUrl) return errorRedirect(request, "validador_nao_configurado");
  let validator: URL;
  try {
    validator = validateEndpoint(config.validatorUrl, config.allowedHosts);
  } catch {
    return errorRedirect(request, "validador_invalido");
  }

  const samlResponse = String(form.get("SAMLResponse") || "");
  const relayState = String(form.get("RelayState") || "");
  if (samlResponse.length < 64 || samlResponse.length > 2_000_000 || relayState.length > 2_048) return errorRedirect(request, "resposta_invalida");

  try {
    const upstream = await fetch(validator, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.validatorToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ SAMLResponse: samlResponse, RelayState: relayState, entityId: config.entityId, acsUrl: config.acsUrl }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
    const sessionToken = String(payload.sessionToken || "");
    if (!upstream.ok || payload.valid !== true || !validIdentity(payload) || sessionToken.length < 32 || sessionToken.length > 8_192) {
      return errorRedirect(request, "saml_invalido");
    }
    return sessionResponse(request, sessionToken, payload.maxAge);
  } catch {
    return errorRedirect(request, "validador_indisponivel");
  }
}
