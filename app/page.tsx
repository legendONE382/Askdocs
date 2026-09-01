import Link from "next/link";
import { cookies } from "next/headers";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function HomePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
      <section className="panel grid w-full gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2 lg:p-12">
        <div className="space-y-5">
          <p className="inline-flex w-fit rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
            AskDocs · AI Document Q&A
          </p>
          <h1 className="text-3xl font-bold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Understand any document collection with faster, grounded answers.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Upload PDFs, DOCX, TXT, MD, and CSV files, index them by project, then ask questions in natural language.
            AskDocs is designed for research, legal review, operations, and reporting workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            {session.valid ? (
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 font-semibold text-slate-950 transition hover:brightness-110"
              >
                Open Workspace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 font-semibold text-slate-950 transition hover:brightness-110"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-5 py-2.5 font-semibold text-slate-100 transition hover:border-slate-300"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">What the app does</h2>
          <ul className="space-y-3 text-sm text-slate-300 sm:text-base">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Multi-file document upload with project workspace separation.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Document indexing workflow ready for production ingestion APIs.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Chat interface with quick prompts for summaries, risks, and action items.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Auth-protected workspace session using secure HTTP-only cookies.</span>
            </li>
          </ul>
          <p className="text-xs text-slate-400">
            This landing page appears before login so users can understand AskDocs before entering the workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
