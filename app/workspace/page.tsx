"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGate from "@/components/auth-gate";
import { getCurrentUser, logout } from "@/lib/auth";

export default function WorkspacePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getCurrentUser());
  }, []);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      <AuthGate>
        <section className="panel flex items-center justify-between p-5">
          <div>
            <h1 className="text-2xl font-semibold">Workspace</h1>
            <p className="text-sm text-slate-300">Welcome back, {username ?? "user"}.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm hover:border-accent"
          >
            Logout
          </button>
        </section>

        <section className="panel p-5">
          <h2 className="mb-2 text-lg font-semibold">Ready for app features</h2>
          <p className="text-sm text-slate-300">
            This protected route is where document ingestion and chat modules can now be added safely.
          </p>
        </section>
      </AuthGate>
    </main>
  );
}
