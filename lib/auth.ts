import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "askdocs_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret(): string {
  return process.env.APP_AUTH_SECRET || "change-me-in-production";
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(input: string): string {
  return createHmac("sha256", getSecret()).update(input).digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token?: string): { valid: boolean; user?: string } {
  if (!token || !token.includes(".")) return { valid: false };
  const [encoded, signature] = token.split(".");
  const expected = sign(encoded);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return { valid: false };
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return { valid: false };

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      sub: string;
      exp: number;
    };
    if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }
    return { valid: true, user: payload.sub };
  } catch {
    return { valid: false };
  }
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionTtl(): number {
  return SESSION_TTL_SECONDS;
}

export function getCredentials() {
  return {
    username: process.env.APP_LOGIN_USER || "admin",
    password: process.env.APP_LOGIN_PASSWORD || "admin123"
  };
}
