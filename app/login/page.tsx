"use client";

import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <section className="panel w-full p-6">
        <div className="mb-6 flex items-center gap-2">
          <Lock size={18} className="text-accent" />
          <h1 className="text-xl font-semibold">AskDocs Login</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            autoComplete="current-password"
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
      </section>
    </main>
  );
}
