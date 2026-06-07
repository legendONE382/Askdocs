"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("reason=session-expired")) {
      setSessionExpired(true);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = (await result.json()) as { ok: boolean; error?: string };

      if (!result.ok || !data.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      window.location.href = "/workspace";
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <section className="panel w-full p-6">
        <h1 className="mb-4 text-2xl font-semibold">AskDocs Login</h1>

        {sessionExpired ? (
          <p className="mb-4 rounded-xl border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-200">
            Your session expired. Please sign in again.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            required
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-2 font-medium text-slate-950 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
