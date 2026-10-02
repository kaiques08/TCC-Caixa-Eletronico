import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

async function ensure(directory) {
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
}

function filename(directory, key) {
  const digest = crypto.createHash("sha256").update(String(key)).digest("hex");
  return path.join(directory, `${digest}.json`);
}

async function atomicWrite(target, payload) {
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(payload), { encoding: "utf8", mode: 0o600, flag: "wx" });
  await fs.rename(temporary, target);
}

export class FileRequestCache {
  constructor(directory, expirationMs) {
    this.directory = directory;
    this.expirationMs = expirationMs;
  }

  async saveAsync(key, value) {
    await ensure(this.directory);
    const target = filename(this.directory, key);
    try {
      await fs.access(target);
      return null;
    } catch {
      const item = { createdAt: Date.now(), value };
      await atomicWrite(target, item);
      return item;
    }
  }

  async getAsync(key) {
    const target = filename(this.directory, key);
    try {
      const item = JSON.parse(await fs.readFile(target, "utf8"));
      if (!Number.isFinite(item.createdAt) || Date.now() - item.createdAt > this.expirationMs) {
        await fs.unlink(target).catch(() => {});
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  async removeAsync(key) {
    const value = await this.getAsync(key);
    await fs.unlink(filename(this.directory, key)).catch(() => {});
    return value;
  }
}

export class BridgeSessionStore {
  constructor(directory, maxAgeSeconds) {
    this.directory = directory;
    this.maxAgeSeconds = maxAgeSeconds;
  }

  async issue(user) {
    await ensure(this.directory);
    const token = crypto.randomBytes(48).toString("base64url");
    const createdAt = Date.now();
    await atomicWrite(filename(this.directory, token), { createdAt, expiresAt: createdAt + this.maxAgeSeconds * 1_000, user });
    return token;
  }

  async read(token) {
    if (!token || token.length < 32 || token.length > 8_192) return null;
    const target = filename(this.directory, token);
    try {
      const session = JSON.parse(await fs.readFile(target, "utf8"));
      if (!Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) {
        await fs.unlink(target).catch(() => {});
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  async revoke(token) {
    if (!token) return;
    await fs.unlink(filename(this.directory, token)).catch(() => {});
  }
}

export function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}
