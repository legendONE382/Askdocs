const COOKIE_NAME = "askdocs_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret(): string {
  const secret = process.env.APP_AUTH_SECRET || "";
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("APP_AUTH_SECRET must be set to a strong value in production.");
  }
  return secret || "dev-only-insecure-secret-change-me";
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

async function sign(input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return Buffer.from(signature).toString("base64url");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encoded = base64urlEncode(JSON.stringify(payload));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(token?: string): Promise<{ valid: boolean; user?: string }> {
  if (!token || !token.includes(".")) return { valid: false };
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return { valid: false };

  const expected = await sign(encoded);
  if (!timingSafeStringEqual(signature, expected)) return { valid: false };

  try {
    const payload = JSON.parse(base64urlDecode(encoded)) as { sub: string; exp: number };
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
  const username = process.env.APP_LOGIN_USER || "admin";
  const password = process.env.APP_LOGIN_PASSWORD || "admin123";

  if (process.env.NODE_ENV === "production" && password === "admin123") {
    throw new Error("APP_LOGIN_PASSWORD must be changed in production.");
  }

  return { username, password };
}
