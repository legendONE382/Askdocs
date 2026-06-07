import Link from "next/link";
import { cookies } from "next/headers";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function HomePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-6">
      <section className="panel grid w-full gap-8 p-8 lg:grid-cols-2 lg:p-12">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">
            AskDocs · AI Document Q&A
          </p>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            Understand any document collection with faster, grounded answers.
          </h1>
          <p className="max-w-xl text-slate-300">
            Upload PDFs, DOCX, TXT, MD, and CSV files, index them by project, then ask questions in natural language.
            AskDocs is designed for research, legal review, operations, and reporting workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            {session.valid ? (
              <Link href="/workspace" className="rounded-xl bg-accent px-5 py-2 font-semibold text-slate-950">
                Open Workspace
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-xl bg-accent px-5 py-2 font-semibold text-slate-950">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl border border-slate-500 px-5 py-2 font-semibold text-slate-100 hover:border-slate-300"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold">What the app does</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Multi-file document upload with project workspace separation.</li>
            <li>• Document indexing workflow ready for production ingestion APIs.</li>
            <li>• Chat interface with quick prompts for summaries, risks, and action items.</li>
            <li>• Auth-protected workspace session using secure HTTP-only cookies.</li>
          </ul>
          <p className="text-xs text-slate-400">
            This landing page appears before login so users can understand AskDocs before entering the workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
