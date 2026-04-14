"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace("/workspace");
    }
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);
    if (!result.ok) {
      setError(result.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.replace("/workspace");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <section className="panel w-full p-6">
        <h1 className="mb-4 text-2xl font-semibold">Login</h1>
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
          Don&apos;t have an account? <Link href="/signup" className="underline">Create one</Link>
        </p>
      </section>
    </main>
  );
}
