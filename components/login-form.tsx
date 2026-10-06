"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSessionExpired(params.get("reason") === "session-expired");
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
    <form onSubmit={onSubmit} className="space-y-5">
      {sessionExpired ? (
        <div
          className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-sm text-amber-200"
          role="alert"
        >
          Your session expired. Please sign in again.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-sm text-rose-200" role="alert">
          {error}
        </div>
      ) : null}

      <Input
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={setUsername}
        autoComplete="username"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        required
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
