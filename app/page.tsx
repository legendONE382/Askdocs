import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold">AskDocs</h1>
      <p className="text-slate-300">
        Upload documents, build semantic indexes, and chat with AI answers grounded in your content.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded-xl border border-slate-600 px-4 py-2 text-sm hover:border-accent">
          Login / Sign Up
        </Link>
        <Link href="/app" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-slate-950">
          Open App Workspace
        </Link>
      </div>
    </main>
  );
}
