export type SessionUser = {
  userId: string;
  username: string;
  expiresAt: number;
};

export async function fetchSession() {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    return { ok: false as const };
  }

  const data = (await response.json()) as { ok: true; user: SessionUser };
  return { ok: true as const, user: data.user };
}
