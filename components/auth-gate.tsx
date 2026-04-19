"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchSession, type SessionUser } from "@/lib/auth-client";

export default function AuthGate({ children }: { children: (user: SessionUser) => React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready">("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function validate() {
      const session = await fetchSession();
      if (!session.ok) {
        router.replace("/login?reason=session-expired");
        return;
      }
      setUser(session.user);
      setState("ready");
    }

    validate();
  }, [router]);

  if (state === "loading" || !user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
        <section className="panel w-full p-6 text-center">
          <p className="animate-pulse text-sm text-slate-300">Checking your secure session…</p>
        </section>
      </main>
    );
  }

  return <>{children(user)}</>;
}
