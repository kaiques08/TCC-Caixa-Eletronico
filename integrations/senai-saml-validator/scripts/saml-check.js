import { loadConfig } from "../src/config.js";
import { loadIdpMetadata } from "../src/metadata.js";
import { buildReadiness } from "../src/saml.js";

const config = loadConfig();
let metadata;
try {
  metadata = await loadIdpMetadata(config);
} catch (error) {
  process.stderr.write(`Metadata IdP: inválida (${error.message})\n`);
  process.exitCode = 1;
  metadata = { configured: false, entityId: "", ssoUrl: "", binding: "", certificates: [], fingerprints: [] };
}
const readiness = buildReadiness(config, metadata);
process.stdout.write(`SP Entity ID: ${config.spEntityId || "PENDENTE"}\n`);
process.stdout.write(`ACS: ${config.acsUrl || "PENDENTE"}\n`);
process.stdout.write(`IdP Entity ID: ${metadata.entityId || "PENDENTE"}\n`);
process.stdout.write(`SSO URL: ${metadata.ssoUrl || "PENDENTE"}\n`);
process.stdout.write(`Certificados de assinatura: ${metadata.certificates.length}\n`);
for (const value of metadata.fingerprints) process.stdout.write(`SHA-256: ${value}\n`);
for (const item of readiness.requirements) process.stdout.write(`${item.ready ? "✓" : "○"} ${item.id}: ${item.detail}\n`);
if (!readiness.ready) process.exitCode = 1;
