import { env } from "cloudflare:workers";
import { getSenaiSessionUser } from "@/app/api/auth/senai/session-utils";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function configuration() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  return {
    apiKey: runtimeEnv.NGROK_API_KEY?.trim(),
    endpointId: runtimeEnv.NGROK_ENDPOINT_ID?.trim(),
    allowedEmails: new Set(
      (runtimeEnv.NGROK_ALLOWED_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  };
}

export async function GET(request: Request) {
  const session = await getSenaiSessionUser(request);
  const user = session.user;
  if (!user) {
    return json({ configured: false, code: "AUTH_REQUIRED", message: "Entre no modo de teste para verificar a ponte ngrok." }, 401);
  }
  if (!["adm", "desenvolvedor"].includes(user.role)) return json({ configured: true, code: "FORBIDDEN", message: "Somente ADM ou Desenvolvedor podem verificar a integração ngrok." }, 403);

  const config = configuration();
  const missing = [
    !config.apiKey && "NGROK_API_KEY",
    !config.endpointId && "NGROK_ENDPOINT_ID",
    config.allowedEmails.size === 0 && "NGROK_ALLOWED_EMAILS",
  ].filter(Boolean);

  if (missing.length) {
    return json({ configured: false, code: "NGROK_NOT_CONFIGURED", message: "A ponte ngrok é opcional e ainda precisa da chave, do ID do endpoint e da lista de responsáveis autorizados." }, 503);
  }

  if (!user.email || !config.allowedEmails.has(user.email.toLowerCase())) {
    return json({ configured: true, code: "FORBIDDEN", message: "Seu usuário não está autorizado a consultar a integração ngrok." }, 403);
  }

  if (!/^[A-Za-z0-9_-]{3,160}$/.test(config.endpointId as string)) {
    return json({ configured: false, code: "NGROK_INVALID_ENDPOINT_ID", message: "O ID do endpoint ngrok configurado é inválido." }, 500);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const upstream = await fetch(`https://api.ngrok.com/endpoints/${encodeURIComponent(config.endpointId as string)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "ngrok-version": "2",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    const payload = await upstream.json().catch(() => ({})) as Record<string, unknown>;
    if (!upstream.ok) {
      return json({ configured: true, code: "NGROK_UPSTREAM_ERROR", message: "A API ngrok recusou a consulta do endpoint.", upstreamStatus: upstream.status }, 502);
    }

    const endpointUrl = String(payload.url || "");
    let protocol = "";
    try {
      protocol = new URL(endpointUrl).protocol.replace(":", "");
    } catch {
      protocol = "";
    }
    return json({
      configured: true,
      message: "Endpoint ngrok verificado com sucesso pela camada segura.",
      endpoint: {
        id: String(payload.id || ""),
        url: endpointUrl,
        type: String(payload.type || ""),
        region: String(payload.region || ""),
        protocol,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json({ configured: true, code: timedOut ? "NGROK_TIMEOUT" : "NGROK_UNAVAILABLE", message: timedOut ? "A API ngrok excedeu o tempo de resposta." : "Não foi possível acessar a API ngrok." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
