export type LocalUser = {
  username: string;
  password: string;
  createdAt: string;
};

const USERS_KEY = "askdocs_users";
const CURRENT_USER_KEY = "askdocs_current_user";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  return safeParse<LocalUser[]>(window.localStorage.getItem(USERS_KEY), []);
}

export function createUser(username: string, password: string): { ok: boolean; error?: string } {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const users = getUsers();
  if (users.some((user) => user.username === cleanUsername)) {
    return { ok: false, error: "Username already exists. Please sign in." };
  }

  users.push({ username: cleanUsername, password, createdAt: new Date().toISOString() });
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.localStorage.setItem(CURRENT_USER_KEY, cleanUsername);
  return { ok: true };
}

export function loginUser(username: string, password: string): { ok: boolean; error?: string } {
  const cleanUsername = username.trim().toLowerCase();
  const users = getUsers();
  const found = users.find((user) => user.username === cleanUsername && user.password === password);

  if (!found) {
    return { ok: false, error: "Invalid credentials. Create an account first or check your password." };
  }

  window.localStorage.setItem(CURRENT_USER_KEY, cleanUsername);
  return { ok: true };
}

export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}
