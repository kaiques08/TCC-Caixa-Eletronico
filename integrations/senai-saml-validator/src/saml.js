import { Strategy as SamlStrategy } from "@node-saml/passport-saml";

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function claim(profile, name) {
  if (!name) return "";
  return String(first(profile?.[name]) ?? "").trim();
}

function normalizeRole(value) {
  const role = String(value || "").trim().toLocaleLowerCase("pt-BR");
  if (["aluno", "estudante", "student"].includes(role)) return "aluno";
  if (["professor", "docente", "teacher", "faculty"].includes(role)) return "professor";
  if (["diretor", "diretora", "direcao", "direção", "director"].includes(role)) return "diretor";
  return null;
}

export function sanitizeProfile(profile, attributes) {
  const id = claim(profile, attributes.uniqueId).slice(0, 160);
  const role = normalizeRole(claim(profile, attributes.role));
  if (!id || !role) throw new Error("A resposta não contém identificador e perfil autorizados");
  const email = claim(profile, attributes.email).slice(0, 200);
  return Object.freeze({
    id,
    name: (claim(profile, attributes.name) || "Usuário SENAI").slice(0, 120),
    email: email.includes("@") ? email : "",
    role,
    matricula: claim(profile, attributes.registration).slice(0, 80),
  });
}

export function createSamlStrategy(config, metadata, cacheProvider) {
  if (!metadata.configured) return null;
  const options = {
    callbackUrl: config.acsUrl,
    entryPoint: metadata.ssoUrl,
    issuer: config.spEntityId,
    audience: config.spEntityId,
    idpCert: metadata.certificates,
    privateKey: config.spPrivateKey || undefined,
    signatureAlgorithm: config.signatureAlgorithm,
    digestAlgorithm: config.digestAlgorithm,
    validateInResponseTo: "always",
    requestIdExpirationPeriodMs: config.requestIdExpirationMs,
    cacheProvider,
    acceptedClockSkewMs: config.clockSkewMs,
    maxAssertionAgeMs: config.maxAssertionAgeMs,
    wantAssertionsSigned: config.wantAssertionsSigned,
    wantAuthnResponseSigned: config.wantAuthnResponseSigned,
    authnRequestBinding: "HTTP-Redirect",
    identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
    passReqToCallback: false,
  };
  return new SamlStrategy(options, (profile, done) => done(null, profile));
}

export function buildReadiness(config, metadata, metadataError = "") {
  const attributesReady = [config.attributes.uniqueId, config.attributes.name, config.attributes.email, config.attributes.role].every(Boolean);
  const safeguardsReady = config.wantAssertionsSigned && config.wantAuthnResponseSigned && config.signatureAlgorithm === "sha256" && config.digestAlgorithm === "sha256";
  const requirements = [
    {
      id: "entity_id",
      ready: config.spApproved && config.spEntityId.startsWith("https://"),
      detail: config.spApproved ? "Entity ID HTTPS marcado como aprovado." : "Aguardando aprovação formal do Entity ID pelo SENAI.",
    },
    {
      id: "acs_callback",
      ready: config.acsApproved && config.acsUrl.startsWith("https://"),
      detail: config.acsApproved ? "ACS HTTPS marcado como cadastrado." : "Aguardando cadastro do ACS HTTPS no provedor.",
    },
    {
      id: "idp_metadata",
      ready: metadata.configured && Boolean(metadata.entityId && metadata.ssoUrl),
      detail: metadata.configured ? "Metadata oficial carregada com Entity ID e SSO URL." : metadataError || "Aguardando metadata oficial do IdP SENAI.",
    },
    {
      id: "certificate_validator",
      ready: metadata.certificates.length > 0 && safeguardsReady,
      detail: metadata.certificates.length > 0 && safeguardsReady ? "Certificado do IdP e validações obrigatórias carregados." : "Aguardando certificado de assinatura e validações SHA-256.",
    },
    {
      id: "secure_session",
      ready: config.production && config.sessionSecret.length >= 32 && config.bridgeToken.length >= 32 && config.finupCallbackUrl.startsWith("https://"),
      detail: config.production && config.sessionSecret.length >= 32 && config.bridgeToken.length >= 32 ? "Sessão de produção usa cookie __Host-, Secure, HttpOnly e SameSite=None." : "Configure produção, segredos fortes e callback HTTPS.",
    },
    {
      id: "authorized_attributes",
      ready: config.attributesApproved && attributesReady,
      detail: config.attributesApproved && attributesReady ? "Identificador, nome, e-mail e perfil foram autorizados." : "Aguardando allowlist de atributos aprovada pelo SENAI.",
    },
  ];
  return { ready: requirements.every((item) => item.ready), requirements };
}
