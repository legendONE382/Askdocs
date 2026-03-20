"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { createUser, getCurrentUser, loginUser } from "@/lib/client-auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace("/");
    }
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = mode === "login" ? loginUser(username, password) : createUser(username, password);

      if (!result.ok) {
        setError(result.error || "Authentication failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Authentication storage failed in this browser. Try disabling private mode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <section className="panel w-full p-6">
        <div className="mb-6 flex items-center gap-2">
          <Lock size={18} className="text-accent" />
          <h1 className="text-xl font-semibold">AskDocs {mode === "login" ? "Login" : "Sign Up"}</h1>
        </div>

        <div className="mb-4 flex gap-2 rounded-lg bg-slate-900 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "login" ? "bg-accent text-slate-950" : "text-slate-300"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "signup" ? "bg-accent text-slate-950" : "text-slate-300"}`}
          >
            Sign Up
          </button>
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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-2 font-medium text-slate-950 disabled:opacity-70"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-400">
          Accounts are stored locally in this browser for now (no cloud user database yet).
        </p>
      </section>
    </main>
  );
}
