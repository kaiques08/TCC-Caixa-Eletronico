import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

const REQUIREMENTS = [
  ["entity_id", "Aplicação", "Entity ID aprovado"],
  ["acs_callback", "Retorno", "ACS / callback HTTPS"],
  ["idp_metadata", "Provedor", "SSO URL e metadata"],
  ["certificate_validator", "Segurança", "Certificado e backend validador"],
  ["secure_session", "Sessão", "Cookie seguro após validação"],
  ["authorized_attributes", "Dados", "Atributos autorizados"],
] as const;

type RequirementId = (typeof REQUIREMENTS)[number][0];
type Requirement = { id: RequirementId; group: string; label: string; ready: boolean; detail: string };

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function configuration() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  return {
    startUrl: (runtimeEnv.SENAI_SSO_START_URL || runtimeEnv.SENAI_ENTRY_POINT)?.trim(),
    allowedHosts: new Set(
      (runtimeEnv.SENAI_SSO_ALLOWED_HOSTS || "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean),
    ),
    entityId: (runtimeEnv.SENAI_SAML_ENTITY_ID || runtimeEnv.SENAI_ISSUER)?.trim(),
    acsUrl: (runtimeEnv.SENAI_SAML_ACS_URL || runtimeEnv.SENAI_CALLBACK_URL)?.trim(),
    validatorUrl: runtimeEnv.SENAI_SAML_VALIDATOR_URL?.trim(),
    statusUrl: runtimeEnv.SENAI_SAML_STATUS_URL?.trim(),
    sessionUrl: runtimeEnv.SENAI_SAML_SESSION_URL?.trim(),
    validatorToken: runtimeEnv.SENAI_SAML_VALIDATOR_TOKEN?.trim(),
  };
}

function validateHttpsUrl(raw: string | undefined, allowedHosts: Set<string>) {
  if (!raw) throw new Error("URL ausente");
  const parsed = new URL(raw);
  if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname.toLowerCase())) throw new Error("Destino não autorizado");
  return parsed;
}

function validateConfiguration(config: ReturnType<typeof configuration>) {
  const missing = [
    !config.startUrl && "SENAI_SSO_START_URL",
    config.allowedHosts.size === 0 && "SENAI_SSO_ALLOWED_HOSTS",
    !config.entityId && "SENAI_SAML_ENTITY_ID",
    !config.acsUrl && "SENAI_SAML_ACS_URL",
    !config.validatorUrl && "SENAI_SAML_VALIDATOR_URL",
    !config.statusUrl && "SENAI_SAML_STATUS_URL",
    !config.sessionUrl && "SENAI_SAML_SESSION_URL",
    !config.validatorToken && "SENAI_SAML_VALIDATOR_TOKEN",
  ].filter(Boolean);
  if (missing.length) return { valid: false as const, code: "SENAI_SSO_NOT_CONFIGURED" };

  try {
    const start = validateHttpsUrl(config.startUrl, config.allowedHosts);
    const acs = validateHttpsUrl(config.acsUrl, config.allowedHosts);
    validateHttpsUrl(config.validatorUrl, config.allowedHosts);
    validateHttpsUrl(config.statusUrl, config.allowedHosts);
    validateHttpsUrl(config.sessionUrl, config.allowedHosts);
    if (acs.protocol !== "https:" || !config.entityId?.startsWith("https://")) throw new Error("HTTPS obrigatório");
    return { valid: true as const, start };
  } catch {
    return { valid: false as const, code: "SENAI_SSO_INVALID_CONFIGURATION" };
  }
}

function emptyRequirements(): Requirement[] {
  return REQUIREMENTS.map(([id, group, label]) => ({ id, group, label, ready: false, detail: "Aguardando configuração oficial." }));
}

async function fetchReadiness(config: ReturnType<typeof configuration>): Promise<{ ready: boolean; requirements: Requirement[] }> {
  const endpoint = validateHttpsUrl(config.statusUrl, config.allowedHosts);
  const upstream = await fetch(endpoint, {
    headers: { Accept: "application/json", Authorization: `Bearer ${config.validatorToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  const received = Array.isArray(payload.requirements) ? payload.requirements : [];
  const byId = new Map<string, Record<string, unknown>>(
    received.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object")).map((item) => [String(item.id || ""), item]),
  );
  const requirements = REQUIREMENTS.map(([id, group, label]) => {
    const item = byId.get(id);
    return {
      id,
      group,
      label,
      ready: Boolean(upstream.ok && item?.ready === true),
      detail: String(item?.detail || "Aguardando configuração oficial.").slice(0, 180),
    };
  });
  return { ready: upstream.ok && payload.ready === true && requirements.every((item) => item.ready), requirements };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const config = configuration();
  const validation = validateConfiguration(config);
  let readiness = { ready: false, requirements: emptyRequirements() };

  if (validation.valid) {
    try {
      readiness = await fetchReadiness(config);
    } catch {
      readiness = { ready: false, requirements: emptyRequirements() };
    }
  }

  if (requestUrl.searchParams.get("status") === "1") {
    const configured = validation.valid && readiness.ready;
    return json({
      configured,
      protocol: "SAML 2.0",
      passwordHandling: "SENAI_ONLY",
      requirements: readiness.requirements,
      message: configured
        ? "Os seis requisitos SAML foram verificados. Entrar com SENAI está pronto para uso."
        : "A estrutura SAML está instalada; a ativação aguarda os dados e aprovações oficiais indicados abaixo.",
    }, configured ? 200 : 503);
  }

  if (!validation.valid || !readiness.ready) {
    return json({
      configured: false,
      code: validation.valid ? "SENAI_SSO_APPROVAL_PENDING" : validation.code,
      message: "O login SENAI só será iniciado depois que os seis requisitos SAML forem verificados pelo backend validador.",
      requirements: readiness.requirements,
    }, 503);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: validation.start.toString(),
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
