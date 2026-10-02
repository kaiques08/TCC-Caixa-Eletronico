import { createTestSession, isTestRole, testSessionCookie } from "../session-store";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200, cookie = "") {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store, private",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  };
  if (cookie) headers["Set-Cookie"] = cookie;
  return Response.json(body, { status, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ code: "INVALID_ORIGIN", message: "Origem não autorizada." }, 403);
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ code: "INVALID_JSON", message: "Escolha um perfil de teste válido." }, 400);
  }
  if (!isTestRole(body.role)) return json({ code: "INVALID_ROLE", message: "Perfil de teste inválido." }, 422);
  try {
    const session = await createTestSession(request, body.role);
    return json({ authenticated: true, mode: "test", user: session.user, maxAge: session.maxAge }, 201, testSessionCookie(session.token));
  } catch {
    return json({ code: "TEST_LOGIN_UNAVAILABLE", message: "O backend de teste não conseguiu criar a sessão agora." }, 503);
  }
}
