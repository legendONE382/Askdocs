export type LocalUser = {
  username: string;
  password: string;
  createdAt: string;
};

const USERS_KEY = "askdocs_users";
const CURRENT_USER_KEY = "askdocs_current_user";

let memoryUsers: LocalUser[] = [];
let memoryCurrentUser: string | null = null;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function hasPersistentStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "askdocs_storage_test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readUsers(): LocalUser[] {
  if (!hasPersistentStorage()) return memoryUsers;
  return safeParse<LocalUser[]>(window.localStorage.getItem(USERS_KEY), []);
}

function writeUsers(users: LocalUser[]): void {
  if (!hasPersistentStorage()) {
    memoryUsers = users;
    return;
  }
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUser(): string | null {
  if (!hasPersistentStorage()) return memoryCurrentUser;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

function writeCurrentUser(username: string | null): void {
  if (!hasPersistentStorage()) {
    memoryCurrentUser = username;
    return;
  }
  if (username) {
    window.localStorage.setItem(CURRENT_USER_KEY, username);
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getUsers(): LocalUser[] {
  return readUsers();
}

export function createUser(username: string, password: string): { ok: boolean; error?: string } {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const users = readUsers();
  if (users.some((user) => user.username === cleanUsername)) {
    return { ok: false, error: "Username already exists. Please sign in." };
  }

  users.push({ username: cleanUsername, password, createdAt: new Date().toISOString() });
  writeUsers(users);
  writeCurrentUser(cleanUsername);
  return { ok: true };
}

export function loginUser(username: string, password: string): { ok: boolean; error?: string } {
  const cleanUsername = username.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((user) => user.username === cleanUsername && user.password === password);

  if (!found) {
    return { ok: false, error: "Invalid credentials. Create an account first or check your password." };
  }

  writeCurrentUser(cleanUsername);
  return { ok: true };
}

export function getCurrentUser(): string | null {
  return readCurrentUser();
}

export function logoutUser(): void {
  writeCurrentUser(null);
}
