import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

function text(name, fallback = "") {
  return String(process.env[name] ?? fallback).trim();
}

function bool(name, fallback = false) {
  const value = text(name, String(fallback)).toLowerCase();
  return ["1", "true", "yes", "sim", "on"].includes(value);
}

function number(name, fallback, minimum, maximum) {
  const value = Number(text(name, String(fallback)));
  return Number.isFinite(value) ? Math.max(minimum, Math.min(maximum, Math.round(value))) : fallback;
}

function optionalFile(name) {
  const filename = text(name);
  if (!filename) return "";
  return fs.readFileSync(path.resolve(filename), "utf8").trim();
}

export function loadConfig() {
  const production = text("NODE_ENV", "development") === "production";
  return Object.freeze({
    production,
    port: number("PORT", 4100, 1, 65_535),
    trustProxy: number("TRUST_PROXY", 1, 0, 10),
    spEntityId: text("SAML_SP_ENTITY_ID"),
    acsUrl: text("SAML_ACS_URL"),
    finupCallbackUrl: text("FINUP_CALLBACK_URL"),
    spApproved: bool("SENAI_SP_APPROVED"),
    acsApproved: bool("SENAI_ACS_APPROVED"),
    metadataFile: text("SENAI_IDP_METADATA_FILE", "config/senai-idp-metadata.xml"),
    metadataUrl: text("SENAI_IDP_METADATA_URL"),
    metadataAllowedHosts: new Set(text("SENAI_METADATA_ALLOWED_HOSTS").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean)),
    spPrivateKey: optionalFile("SAML_SP_PRIVATE_KEY_FILE"),
    spPublicCert: optionalFile("SAML_SP_PUBLIC_CERT_FILE"),
    sessionSecret: text("SAML_SESSION_SECRET"),
    bridgeToken: text("SAML_BRIDGE_TOKEN"),
    sessionMaxAgeSeconds: number("SAML_SESSION_MAX_AGE_SECONDS", 3_600, 300, 28_800),
    sessionDir: path.resolve(text("SAML_SESSION_DIR", ".data/sessions")),
    requestCacheDir: path.resolve(text("SAML_REQUEST_CACHE_DIR", ".data/request-cache")),
    bridgeSessionDir: path.resolve(text("SAML_BRIDGE_SESSION_DIR", ".data/bridge-sessions")),
    clockSkewMs: number("SAML_CLOCK_SKEW_MS", 60_000, 0, 300_000),
    maxAssertionAgeMs: number("SAML_MAX_ASSERTION_AGE_MS", 300_000, 30_000, 900_000),
    requestIdExpirationMs: number("SAML_REQUEST_ID_EXPIRATION_MS", 600_000, 60_000, 900_000),
    wantAssertionsSigned: bool("SAML_WANT_ASSERTIONS_SIGNED", true),
    wantAuthnResponseSigned: bool("SAML_WANT_AUTHN_RESPONSE_SIGNED", true),
    signatureAlgorithm: text("SAML_SIGNATURE_ALGORITHM", "sha256"),
    digestAlgorithm: text("SAML_DIGEST_ALGORITHM", "sha256"),
    attributesApproved: bool("SENAI_ATTRIBUTES_APPROVED"),
    attributes: Object.freeze({
      uniqueId: text("SAML_ATTR_UNIQUE_ID"),
      name: text("SAML_ATTR_NAME"),
      email: text("SAML_ATTR_EMAIL"),
      role: text("SAML_ATTR_ROLE"),
      registration: text("SAML_ATTR_REGISTRATION"),
    }),
  });
}

export function isHttps(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
