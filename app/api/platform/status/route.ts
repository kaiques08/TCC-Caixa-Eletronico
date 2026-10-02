import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export async function GET() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const ssoConfigured = Boolean(
    (runtimeEnv.SENAI_SSO_START_URL || runtimeEnv.SENAI_ENTRY_POINT)?.trim() &&
    (runtimeEnv.SENAI_SAML_ENTITY_ID || runtimeEnv.SENAI_ISSUER)?.trim() &&
    (runtimeEnv.SENAI_SAML_ACS_URL || runtimeEnv.SENAI_CALLBACK_URL)?.trim() &&
    runtimeEnv.SENAI_SAML_VALIDATOR_URL?.trim() &&
    runtimeEnv.SENAI_SAML_STATUS_URL?.trim() &&
    runtimeEnv.SENAI_SAML_SESSION_URL?.trim() &&
    runtimeEnv.SENAI_SAML_VALIDATOR_TOKEN?.trim(),
  );
  const registryConfigured = Boolean(
    runtimeEnv.SENAI_API_BASE_URL?.trim() &&
    runtimeEnv.SENAI_API_REGISTRO_PATH?.trim() &&
    runtimeEnv.SENAI_API_TOKEN?.trim(),
  );

  return Response.json(
    {
      ok: true,
      service: "Caixa SENAI Backend",
      mode: "test",
      servicesAvailable: 6,
      checkedAt: new Date().toISOString(),
      services: {
        authentication: { available: true, configured: true, mode: "test", officialSsoConfigured: ssoConfigured },
        testSessions: { available: true, persistence: "D1", expiresInHours: 4 },
        supportAssistant: { available: true },
        communityChat: { available: true, persistence: "D1" },
        serviceNegotiation: { available: true, initialCredits: 10, negotiable: true },
        registryAdapter: { available: true, configured: registryConfigured },
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, private",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
