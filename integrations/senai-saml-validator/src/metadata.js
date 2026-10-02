import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const REDIRECT_BINDING = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect";

function asArray(value) {
  return value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
}

function walk(value, key, results = []) {
  if (!value || typeof value !== "object") return results;
  for (const [childKey, childValue] of Object.entries(value)) {
    if (childKey === key) results.push(...asArray(childValue));
    walk(childValue, key, results);
  }
  return results;
}

function pem(raw) {
  const base64 = String(raw || "").replace(/\s+/g, "");
  if (!base64) return "";
  return `-----BEGIN CERTIFICATE-----\n${base64.match(/.{1,64}/g).join("\n")}\n-----END CERTIFICATE-----`;
}

function fingerprint(certificate) {
  const der = Buffer.from(certificate.replace(/-----[^-]+-----|\s+/g, ""), "base64");
  return crypto.createHash("sha256").update(der).digest("hex").match(/.{2}/g).join(":").toUpperCase();
}

function validateMetadataUrl(raw, allowedHosts) {
  const parsed = new URL(raw);
  if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname.toLowerCase())) throw new Error("URL de metadata não autorizada");
  return parsed;
}

async function readXml(config) {
  if (config.metadataUrl) {
    const endpoint = validateMetadataUrl(config.metadataUrl, config.metadataAllowedHosts);
    const response = await fetch(endpoint, { headers: { Accept: "application/samlmetadata+xml, application/xml, text/xml" }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`Metadata indisponível (${response.status})`);
    const xml = await response.text();
    if (xml.length < 100 || xml.length > 2_000_000) throw new Error("Tamanho de metadata inválido");
    return xml;
  }
  try {
    return await fs.readFile(path.resolve(config.metadataFile), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
}

export async function loadIdpMetadata(config) {
  const xml = await readXml(config);
  if (!xml) return { configured: false, entityId: "", ssoUrl: "", binding: "", certificates: [], fingerprints: [] };
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, processEntities: false, allowBooleanAttributes: false });
  const document = parser.parse(xml);
  const entities = walk(document, "EntityDescriptor");
  const entity = entities.find((item) => walk(item, "IDPSSODescriptor").length > 0);
  if (!entity) throw new Error("Metadata não contém IDPSSODescriptor");
  const descriptors = walk(entity, "IDPSSODescriptor");
  const services = descriptors.flatMap((item) => walk(item, "SingleSignOnService"));
  const service = services.find((item) => item?.["@_Binding"] === REDIRECT_BINDING) || services[0];
  const signingKeys = descriptors.flatMap((item) => walk(item, "KeyDescriptor")).filter((item) => !item?.["@_use"] || item?.["@_use"] === "signing");
  const certificateValues = signingKeys.flatMap((item) => walk(item, "X509Certificate"));
  const certificates = [...new Set(certificateValues.map(pem).filter(Boolean))];
  const entityId = String(entity["@_entityID"] || "").trim();
  const ssoUrl = String(service?.["@_Location"] || "").trim();
  if (!entityId || !ssoUrl || !certificates.length) throw new Error("Metadata sem Entity ID, SSO URL ou certificado de assinatura");
  if (!ssoUrl.startsWith("https://")) throw new Error("SSO URL precisa usar HTTPS");
  return {
    configured: true,
    entityId,
    ssoUrl,
    binding: String(service?.["@_Binding"] || ""),
    certificates,
    fingerprints: certificates.map(fingerprint),
  };
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function certBody(certificate) {
  return certificate.replace(/-----[^-]+-----|\s+/g, "");
}

export function generateSpMetadata(config) {
  if (!config.spEntityId || !config.acsUrl) throw new Error("SAML_SP_ENTITY_ID e SAML_ACS_URL são obrigatórios");
  const key = config.spPublicCert
    ? `<md:KeyDescriptor use="signing"><ds:KeyInfo><ds:X509Data><ds:X509Certificate>${certBody(config.spPublicCert)}</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="${escapeXml(config.spEntityId)}"><md:SPSSODescriptor AuthnRequestsSigned="${Boolean(config.spPrivateKey)}" WantAssertionsSigned="${config.wantAssertionsSigned}" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">${key}<md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat><md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${escapeXml(config.acsUrl)}" index="1" isDefault="true"/></md:SPSSODescriptor></md:EntityDescriptor>`;
}
