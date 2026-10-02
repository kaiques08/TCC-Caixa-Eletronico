import { env } from "cloudflare:workers";
import { getSenaiSessionUser } from "@/app/api/auth/senai/session-utils";

export const dynamic = "force-dynamic";

const allowedQueryKeys = new Set(["tipo", "registro", "email", "unidade", "turma", "pagina"]);

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function getConfiguration() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  return {
    baseUrl: runtimeEnv.SENAI_API_BASE_URL?.trim(),
    registryPath: runtimeEnv.SENAI_API_REGISTRO_PATH?.trim(),
    token: runtimeEnv.SENAI_API_TOKEN?.trim(),
    authScheme: runtimeEnv.SENAI_API_AUTH_SCHEME?.trim() || "Bearer",
    authHeader: runtimeEnv.SENAI_API_AUTH_HEADER?.trim() || "Authorization",
  };
}

export async function GET(request: Request) {
  const session = await getSenaiSessionUser(request);
  if (!session.user) {
    return json({ configured: false, code: "AUTH_REQUIRED", message: "Entre no modo de teste para consultar o registro demonstrativo." }, 401);
  }
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("status") === "1") {
    if (!["adm", "desenvolvedor"].includes(session.user.role)) {
      return json({ configured: true, code: "FORBIDDEN", message: "A consulta de configuração está disponível apenas para ADM e Desenvolvedor." }, 403);
    }
  } else if (session.user.role !== "adm") {
    return json({ configured: true, code: "FORBIDDEN", message: "Somente o perfil ADM pode consultar o registro institucional." }, 403);
  }

  const config = getConfiguration();
  const missing = [
    !config.baseUrl && "SENAI_API_BASE_URL",
    !config.registryPath && "SENAI_API_REGISTRO_PATH",
    !config.token && "SENAI_API_TOKEN",
  ].filter(Boolean);

  if (requestUrl.searchParams.get("status") === "1") {
    return json({
      configured: missing.length === 0,
      message: missing.length
        ? "O conector está pronto, mas ainda precisa do endpoint, caminho e credencial fornecidos pela unidade SENAI."
        : "Conector seguro configurado para consultas ao registro institucional.",
    }, missing.length ? 503 : 200);
  }

  if (missing.length) {
    return json({
      configured: false,
      code: "SENAI_API_NOT_CONFIGURED",
      message: "A API institucional ainda não foi configurada neste ambiente.",
    }, 503);
  }

  let upstreamUrl: URL;
  try {
    const base = new URL(config.baseUrl as string);
    if (base.protocol !== "https:") throw new Error("HTTPS obrigatório");
    if (!config.registryPath?.startsWith("/") || config.registryPath.includes("://")) throw new Error("Caminho inválido");
    upstreamUrl = new URL(config.registryPath, base);
  } catch {
    return json({ configured: false, code: "SENAI_API_INVALID_CONFIGURATION", message: "A configuração da API institucional é inválida." }, 500);
  }

  for (const [key, value] of requestUrl.searchParams) {
    if (allowedQueryKeys.has(key) && value.trim()) upstreamUrl.searchParams.set(key, value.trim().slice(0, 160));
  }

  const blockedHeaders = new Set(["host", "content-length", "cookie", "set-cookie"]);
  const headerName = config.authHeader as string;
  if (!/^[A-Za-z0-9-]+$/.test(headerName) || blockedHeaders.has(headerName.toLowerCase())) {
    return json({ configured: false, code: "SENAI_API_INVALID_AUTH_HEADER", message: "O cabeçalho de autenticação configurado não é permitido." }, 500);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const authValue = headerName.toLowerCase() === "authorization"
      ? `${config.authScheme} ${config.token}`
      : config.token as string;
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: { Accept: "application/json", [headerName]: authValue },
      cache: "no-store",
      signal: controller.signal,
    });
    const contentType = upstream.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : { message: (await upstream.text()).slice(0, 2_000) };

    if (!upstream.ok) {
      return json({ configured: true, code: "SENAI_API_UPSTREAM_ERROR", message: "A API institucional recusou a consulta.", upstreamStatus: upstream.status }, 502);
    }

    return json({ configured: true, source: "SENAI", data });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json({ configured: true, code: timedOut ? "SENAI_API_TIMEOUT" : "SENAI_API_UNAVAILABLE", message: timedOut ? "A API institucional excedeu o tempo de resposta." : "Não foi possível acessar a API institucional." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
