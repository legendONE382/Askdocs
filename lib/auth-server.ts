import { createHash, randomUUID, timingSafeEqual } from "crypto";

const COOKIE_NAME = "askdocs_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
};

type SessionRecord = {
  token: string;
  userId: string;
  username: string;
  expiresAt: number;
};

type AuthStore = {
  users: Map<string, UserRecord>;
  sessions: Map<string, SessionRecord>;
};

const globalForAuth = globalThis as typeof globalThis & { __askdocsAuthStore?: AuthStore };

const store =
  globalForAuth.__askdocsAuthStore ??
  (globalForAuth.__askdocsAuthStore = {
    users: new Map<string, UserRecord>(),
    sessions: new Map<string, SessionRecord>()
  });

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function validatePasswordStrength(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function createUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username);

  if (normalizedUsername.length < 3) {
    return { ok: false as const, error: "Username must be at least 3 characters." };
  }

  if (!validatePasswordStrength(password)) {
    return {
      ok: false as const,
      error: "Password must be at least 8 characters and include letters and numbers."
    };
  }

  if (store.users.has(normalizedUsername)) {
    return { ok: false as const, error: "Username already exists." };
  }

  const user: UserRecord = {
    id: randomUUID(),
    username: normalizedUsername,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  store.users.set(normalizedUsername, user);

  return { ok: true as const, user };
}

export function verifyCredentials(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username);
  const user = store.users.get(normalizedUsername);
  if (!user) return null;

  const providedHash = hashPassword(password);
  if (!safeEqual(providedHash, user.passwordHash)) {
    return null;
  }

  return user;
}

export function createSession(user: { id: string; username: string }) {
  const token = randomUUID();
  const session: SessionRecord = {
    token,
    userId: user.id,
    username: user.username,
    expiresAt: Date.now() + SESSION_TTL_MS
  };

  store.sessions.set(token, session);
  return session;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return { valid: false as const };

  const session = store.sessions.get(token);
  if (!session) return { valid: false as const };

  if (session.expiresAt <= Date.now()) {
    store.sessions.delete(token);
    return { valid: false as const };
  }

  return {
    valid: true as const,
    session: {
      userId: session.userId,
      username: session.username,
      expiresAt: session.expiresAt
    }
  };
}

export function revokeSession(token: string | undefined) {
  if (!token) return;
  store.sessions.delete(token);
}
