import { clearTestSessionCookie, revokeTestSession } from "../session-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ ok: false }, { status: 403 });
  await revokeTestSession(request).catch(() => {});
  return Response.json({ ok: true }, {
    headers: {
      "Set-Cookie": clearTestSessionCookie(),
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
