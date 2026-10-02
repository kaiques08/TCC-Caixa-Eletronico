import { getSenaiSessionUser } from "../session-utils";

export const dynamic = "force-dynamic";

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

export async function GET(request: Request) {
  const session = await getSenaiSessionUser(request);
  if (!session.user) return json({ authenticated: false, code: session.code }, session.status);
  return json({ authenticated: true, user: session.user });
}
