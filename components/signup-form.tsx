"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = (await result.json()) as { ok: boolean; error?: string };

      if (!result.ok || !data.ok) {
        setError(data.error || "Sign up failed.");
        return;
      }

      window.location.href = "/workspace";
    } catch {
      setError("Unable to sign up right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-sm text-rose-200" role="alert">
          {error}
        </div>
      ) : null}

      <Input
        label="Username"
        placeholder="Choose a username"
        value={username}
        onChange={setUsername}
        autoComplete="username"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters with letters and numbers"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        required
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
