import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import createFileStore from "session-file-store";
import helmet from "helmet";
import passport from "passport";
import { loadConfig } from "./config.js";
import { generateSpMetadata, loadIdpMetadata } from "./metadata.js";
import { buildReadiness, createSamlStrategy, sanitizeProfile } from "./saml.js";
import { BridgeSessionStore, FileRequestCache, safeEqual } from "./stores.js";

const config = loadConfig();
let metadata;
let metadataError = "";
try {
  metadata = await loadIdpMetadata(config);
} catch {
  metadataError = "A metadata foi encontrada, mas não pôde ser validada.";
  metadata = { configured: false, entityId: "", ssoUrl: "", binding: "", certificates: [], fingerprints: [] };
}

const readiness = buildReadiness(config, metadata, metadataError);
const requestCache = new FileRequestCache(config.requestCacheDir, config.requestIdExpirationMs);
const bridgeSessions = new BridgeSessionStore(config.bridgeSessionDir, config.sessionMaxAgeSeconds);
const strategy = createSamlStrategy(config, metadata, requestCache);
if (strategy) passport.use("senai-saml", strategy);

const app = express();
const FileStore = createFileStore(session);
app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));
app.use(express.json({ limit: "2mb", strict: true }));
app.use(session({
  name: config.production ? "__Host-finup.sid" : "finup.sid",
  secret: config.sessionSecret || crypto.randomBytes(48).toString("hex"),
  store: new FileStore({ path: config.sessionDir, ttl: config.sessionMaxAgeSeconds, retries: 1, reapInterval: 3_600 }),
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    path: "/",
    httpOnly: true,
    secure: config.production,
    sameSite: config.production ? "none" : "lax",
    maxAge: config.sessionMaxAgeSeconds * 1_000,
  },
}));
app.use(passport.initialize());

function requireTechnicalAuth(request, response, next) {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!safeEqual(token, config.bridgeToken)) return response.status(401).json({ error: "UNAUTHORIZED" });
  return next();
}

function regenerateSession(request) {
  return new Promise((resolve, reject) => {
    request.session.regenerate((error) => {
      if (error) return reject(error);
      return resolve();
    });
  });
}

function saveSession(request) {
  return new Promise((resolve, reject) => request.session.save((error) => error ? reject(error) : resolve()));
}

function samlAuthenticate(handler) {
  return (request, response, next) => {
    if (!strategy || !readiness.ready) return response.status(503).json({ error: "SAML_NOT_READY" });
    return passport.authenticate("senai-saml", { session: false }, async (error, profile) => {
      if (error || !profile) return response.status(401).json({ error: "SAML_RESPONSE_REJECTED" });
      try {
        const user = sanitizeProfile(profile, config.attributes);
        await handler(request, response, user);
      } catch {
        return response.status(401).json({ error: "AUTHORIZED_ATTRIBUTES_MISSING" });
      }
    })(request, response, next);
  };
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function autoPost(response, token) {
  const nonce = crypto.randomBytes(18).toString("base64url");
  response.set("Content-Security-Policy", `default-src 'none'; base-uri 'none'; form-action ${new URL(config.finupCallbackUrl).origin}; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'`);
  response.type("html").send(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Concluindo acesso SENAI</title></head><body style="font-family:Arial,sans-serif;padding:2rem;color:#202124"><main><h1>Identidade SENAI validada</h1><p>Estamos criando sua sessão segura no FinUp.</p><form id="continue" method="post" action="${escapeHtml(config.finupCallbackUrl)}"><input type="hidden" name="session_token" value="${escapeHtml(token)}"><button type="submit">Continuar para o FinUp</button></form><noscript><p>O JavaScript está desativado. Use o botão Continuar para concluir.</p></noscript></main><script nonce="${nonce}">document.getElementById("continue").submit();</script></body></html>`);
}

async function finishInteractive(request, response, user) {
  await regenerateSession(request);
  request.session.user = user;
  request.session.authenticatedAt = new Date().toISOString();
  await saveSession(request);
  const token = await bridgeSessions.issue(user);
  autoPost(response, token);
}

async function finishBridge(_request, response, user) {
  const token = await bridgeSessions.issue(user);
  response.json({ valid: true, user, sessionToken: token, maxAge: config.sessionMaxAgeSeconds });
}

app.get("/healthz", (_request, response) => response.json({ ok: true, ready: readiness.ready, protocol: "SAML 2.0" }));

app.get("/saml/metadata", (_request, response) => {
  try {
    response.type("application/samlmetadata+xml").send(generateSpMetadata(config));
  } catch {
    response.status(503).json({ error: "SP_METADATA_NOT_CONFIGURED" });
  }
});

app.get("/api/saml/status", requireTechnicalAuth, (_request, response) => {
  response.set("Cache-Control", "no-store").json({ ready: readiness.ready, protocol: "SAML 2.0", requirements: readiness.requirements });
});

app.get("/auth/senai/start", (request, response, next) => {
  if (!strategy || !readiness.ready) return response.status(503).json({ error: "SAML_NOT_READY", requirements: readiness.requirements });
  return passport.authenticate("senai-saml", { session: false })(request, response, next);
});

app.post("/auth/senai/callback", samlAuthenticate(finishInteractive));

app.post("/api/bridge/validate", requireTechnicalAuth, (request, response, next) => {
  if (request.body.entityId && request.body.entityId !== config.spEntityId) return response.status(400).json({ error: "ENTITY_ID_MISMATCH" });
  if (request.body.acsUrl && request.body.acsUrl !== config.acsUrl) return response.status(400).json({ error: "ACS_URL_MISMATCH" });
  return samlAuthenticate(finishBridge)(request, response, next);
});

app.get("/api/bridge/session", requireTechnicalAuth, async (request, response) => {
  const token = request.get("x-senai-session") || "";
  const active = await bridgeSessions.read(token);
  if (!active) return response.status(401).json({ authenticated: false });
  const maxAge = Math.max(0, Math.floor((active.expiresAt - Date.now()) / 1_000));
  return response.set("Cache-Control", "no-store").json({ authenticated: true, user: active.user, maxAge });
});

app.post("/api/bridge/logout", requireTechnicalAuth, async (request, response) => {
  await bridgeSessions.revoke(request.get("x-senai-session") || "");
  response.status(204).end();
});

app.use((error, _request, response, _next) => {
  const status = error?.type === "entity.too.large" ? 413 : 500;
  response.status(status).json({ error: status === 413 ? "PAYLOAD_TOO_LARGE" : "INTERNAL_ERROR" });
});

app.listen(config.port, () => {
  process.stdout.write(`SENAI SAML validator listening on port ${config.port}; ready=${readiness.ready}\n`);
});
