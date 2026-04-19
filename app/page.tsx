"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { fetchSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await fetchSession();
      if (session.ok) {
        router.replace("/workspace");
      }
    }

    checkSession();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 p-6 text-center">
      <h1 className="text-4xl font-semibold">AskDocs</h1>
      <p className="max-w-2xl text-slate-300">
        Upload documents, build search-ready context, and chat with your files in a secure workspace.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/login" className="rounded-xl border border-slate-600 px-4 py-2 text-sm hover:border-accent">
          Login
        </Link>
        <Link href="/signup" className="rounded-xl border border-slate-600 px-4 py-2 text-sm hover:border-accent">
          Create Account
        </Link>
        <Link href="/workspace" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-slate-950">
          Open Workspace
        </Link>
      </div>
    </main>
  );
}
