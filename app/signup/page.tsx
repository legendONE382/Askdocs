"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { fetchSession } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const session = await fetchSession();
      if (session.ok) {
        setRedirecting(true);
        setTimeout(() => router.replace("/workspace"), 220);
        return;
      }
      setCheckingSession(false);
    }

    checkSession();
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = (await result.json()) as { ok: boolean; error?: string };

    if (!result.ok || !data.ok) {
      setError(data.error || "Sign up failed.");
      setLoading(false);
      return;
    }

    setRedirecting(true);
    setTimeout(() => router.replace("/workspace"), 220);
  }

  if (checkingSession || redirecting) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
        <section className="panel w-full p-6 text-center">
          <p className="text-sm text-slate-300">{redirecting ? "Redirecting to dashboard..." : "Checking session..."}</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded bg-slate-700">
            <div className="h-full w-1/2 animate-pulse rounded bg-accent" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <section className="panel w-full p-6">
        <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
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
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            required
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-2 font-medium text-slate-950 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account? <Link href="/login" className="underline">Login</Link>
        </p>
      </section>
    </main>
  );
}
