import { env } from "cloudflare:workers";

export type TestRole = "aluno" | "professor" | "adm" | "desenvolvedor";

export type TestSessionUser = {
  id: string;
  name: string;
  email: string;
  role: TestRole;
  matricula: string;
  mode: "test";
};

type SessionResult = {
  user: TestSessionUser | null;
  code?: string;
  status: number;
};

type SessionRow = {
  viewer_email: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  registration: string;
  expires_at: number;
};

type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1Statement;
  batch: (statements: D1Statement[]) => Promise<unknown>;
};

const COOKIE_NAME = "__Host-finup-test";
const MAX_AGE_SECONDS = 4 * 60 * 60;
const profiles: Record<TestRole, Omit<TestSessionUser, "mode">> = {
  aluno: {
    id: "teste-aluno-ds2",
    name: "Kaique Silva",
    email: "aluno.teste@finup.invalid",
    role: "aluno",
    matricula: "DS2 • TESTE",
  },
  professor: {
    id: "teste-professor-ds2",
    name: "Marcos Lima",
    email: "professor.teste@finup.invalid",
    role: "professor",
    matricula: "Docência • TESTE",
  },
  adm: {
    id: "teste-adm-unidade",
    name: "Ana Paula Rocha",
    email: "adm.teste@finup.invalid",
    role: "adm",
    matricula: "ADM • TESTE",
  },
  desenvolvedor: {
    id: "teste-desenvolvedor",
    name: "Equipe FinUp",
    email: "desenvolvedor.teste@finup.invalid",
    role: "desenvolvedor",
    matricula: "Desenvolvimento • TESTE",
  },
};

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS test_sessions (
    token_hash TEXT PRIMARY KEY NOT NULL,
    viewer_email TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    registration TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS test_sessions_expires_at_idx ON test_sessions (expires_at)",
  "CREATE INDEX IF NOT EXISTS test_sessions_viewer_email_idx ON test_sessions (viewer_email)",
];

function getDatabase(): D1DatabaseLike | null {
  return (env as unknown as { DB?: D1DatabaseLike }).DB ?? null;
}

async function ensureSchema(database: D1DatabaseLike) {
  await database.batch(schemaStatements.map((statement) => database.prepare(statement)));
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(48));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function viewerEmail(request: Request) {
  return (request.headers.get("oai-authenticated-user-email") || "visitante-teste@finup.invalid").trim().toLowerCase().slice(0, 200);
}

export function isTestRole(value: unknown): value is TestRole {
  return value === "aluno" || value === "professor" || value === "adm" || value === "desenvolvedor";
}

function storedRole(value: unknown): TestRole | null {
  if (isTestRole(value)) return value;
  if (value === "diretor" || value === "admin") return "adm";
  return null;
}

export function testSessionCookie(token: string) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearTestSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function createTestSession(request: Request, role: TestRole) {
  const database = getDatabase();
  if (!database) throw new Error("TEST_DATABASE_UNAVAILABLE");
  await ensureSchema(database);
  const token = randomToken();
  const hash = await tokenHash(token);
  const now = Date.now();
  const expiresAt = now + MAX_AGE_SECONDS * 1_000;
  const profile = profiles[role];
  await database.batch([
    database.prepare("DELETE FROM test_sessions WHERE expires_at <= ?").bind(now),
    database.prepare(`INSERT INTO test_sessions
      (token_hash, viewer_email, user_id, name, email, role, registration, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(hash, viewerEmail(request), profile.id, profile.name, profile.email, profile.role, profile.matricula, now, expiresAt),
  ]);
  return { token, maxAge: MAX_AGE_SECONDS, user: { ...profile, mode: "test" as const } };
}

export async function getTestSessionUser(request: Request): Promise<SessionResult> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token || token.length < 40 || token.length > 256) return { user: null, status: 401 };
  const database = getDatabase();
  if (!database) return { user: null, code: "TEST_DATABASE_UNAVAILABLE", status: 503 };
  try {
    await ensureSchema(database);
    const hash = await tokenHash(token);
    const row = await database.prepare(`SELECT viewer_email, user_id, name, email, role, registration, expires_at
      FROM test_sessions WHERE token_hash = ? LIMIT 1`).bind(hash).first<SessionRow>();
    const role = storedRole(row?.role);
    if (!row || row.viewer_email !== viewerEmail(request) || row.expires_at <= Date.now() || !role) {
      if (row) await database.prepare("DELETE FROM test_sessions WHERE token_hash = ?").bind(hash).run();
      return { user: null, status: 401 };
    }
    if (row.role !== role) {
      await database.prepare("UPDATE test_sessions SET role = ? WHERE token_hash = ?").bind(role, hash).run();
    }
    return {
      status: 200,
      user: {
        id: row.user_id,
        name: row.name,
        email: row.email,
        role,
        matricula: row.registration,
        mode: "test",
      },
    };
  } catch {
    return { user: null, code: "TEST_SESSION_UNAVAILABLE", status: 503 };
  }
}

export async function revokeTestSession(request: Request) {
  const token = readCookie(request, COOKIE_NAME);
  const database = getDatabase();
  if (!token || !database) return;
  await ensureSchema(database);
  await database.prepare("DELETE FROM test_sessions WHERE token_hash = ?").bind(await tokenHash(token)).run();
}
