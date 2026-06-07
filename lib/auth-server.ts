import { createHmac } from "crypto";

const COOKIE_NAME = "askdocs_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const SECRET = process.env.APP_AUTH_SECRET || "askdocs-demo-secret-change-me";

type SessionPayload = {
  userId: string;
  username: string;
  expiresAt: number;
};

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(data: string) {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

function createToken(payload: SessionPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parseToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload?.username || !payload?.userId || !payload?.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function validatePasswordStrength(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function validateUsername(username: string) {
  return normalizeUsername(username).length >= 3;
}

export function createSession(user: { username: string }) {
  const normalizedUsername = normalizeUsername(user.username);
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload: SessionPayload = {
    userId: normalizedUsername,
    username: normalizedUsername,
    expiresAt
  };

  return {
    token: createToken(payload),
    username: normalizedUsername,
    expiresAt
  };
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return { valid: false as const };

  const payload = parseToken(token);
  if (!payload) return { valid: false as const };

  if (payload.expiresAt <= Date.now()) {
    return { valid: false as const };
  }

  return {
    valid: true as const,
    session: {
      userId: payload.userId,
      username: payload.username,
      expiresAt: payload.expiresAt
    }
  };
}

export function revokeSession(_token: string | undefined) {
  // Stateless demo session: cookie expiration handles sign-out.
}
