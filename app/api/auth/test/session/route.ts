import { getTestSessionUser } from "../session-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getTestSessionUser(request);
  return Response.json(
    session.user ? { authenticated: true, mode: "test", user: session.user } : { authenticated: false, code: session.code },
    {
      status: session.status,
      headers: {
        "Cache-Control": "no-store, private",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
