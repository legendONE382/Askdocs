"use client";

const USERS_KEY = "askdocs_users_v2";
const SESSION_KEY = "askdocs_session_v2";

export type StoredUser = {
  username: string;
  passwordHash: string;
  createdAt: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function isPasswordStrong(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export async function signUp(username: string, password: string): Promise<AuthResult> {
  const normalizedUsername = normalizeUsername(username);

  if (normalizedUsername.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }

  if (!isPasswordStrong(password)) {
    return {
      ok: false,
      error: "Password must be at least 8 characters and include letters and numbers."
    };
  }

  const users = getUsers();

  if (users.some((entry) => entry.username === normalizedUsername)) {
    return { ok: false, error: "Username already exists." };
  }

  const passwordHash = await hashPassword(password);
  users.push({
    username: normalizedUsername,
    passwordHash,
    createdAt: new Date().toISOString()
  });
  saveUsers(users);
  window.localStorage.setItem(SESSION_KEY, normalizedUsername);

  return { ok: true };
}

export async function login(username: string, password: string): Promise<AuthResult> {
  const normalizedUsername = normalizeUsername(username);
  const users = getUsers();

  const account = users.find((entry) => entry.username === normalizedUsername);
  if (!account) {
    return { ok: false, error: "No account found for this username." };
  }

  const providedHash = await hashPassword(password);
  if (providedHash !== account.passwordHash) {
    return { ok: false, error: "Invalid password." };
  }

  window.localStorage.setItem(SESSION_KEY, normalizedUsername);
  return { ok: true };
}
