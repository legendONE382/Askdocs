import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, FileSearch, LockKeyhole, Sparkles, UploadCloud, Zap } from "lucide-react";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

const workflowSteps = [
  {
    icon: UploadCloud,
    title: "Upload your knowledge",
    copy: "Bring PDFs, DOCX files, notes, spreadsheets, and research into one clean project workspace."
  },
  {
    icon: BrainCircuit,
    title: "Ask in plain English",
    copy: "Ask for summaries, risks, decisions, timelines, contradictions, or exact answers buried across files."
  },
  {
    icon: CheckCircle2,
    title: "Act with confidence",
    copy: "Move from scattered documents to grounded next steps for research, operations, legal, and reporting work."
  }
];

const useCases = ["Research briefs", "Contract review", "Policy lookup", "Meeting notes", "Financial reports", "Operations manuals"];

const proofPoints = [
  "Project-separated workspaces",
  "Multi-format document ingestion",
  "Secure sign-in with protected sessions",
  "Prompt starters for summaries, risks, and actions"
];

export default function HomePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -left-24 top-44 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-24 bottom-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_top,black,transparent_75%)]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3" aria-label="AskDocs home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-400 to-violet-500 shadow-lg shadow-blue-500/25">
              <FileSearch className="h-5 w-5 text-slate-950" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">AskDocs</span>
              <span className="block text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100/70">by Estech Solutions</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#security" className="transition hover:text-white">
              Security
            </a>
          </div>

          {session.valid ? (
            <Link href="/workspace" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">
              Workspace
            </Link>
          ) : (
            <Link href="/login" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-cyan-200 hover:bg-white/10">
              Sign in
            </Link>
          )}
        </nav>

        <div className="grid min-h-[calc(100vh-6rem)] items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-950/30">
              <Sparkles className="h-4 w-4 text-cyan-200" aria-hidden="true" />
              AI document intelligence for teams that need answers now
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Turn document chaos into clear answers in seconds.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                AskDocs helps people upload files, organize them by project, and ask natural-language questions that reveal summaries, risks, action items, and insights without digging through every page.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {session.valid ? (
                <Link href="/workspace" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-500 px-7 py-4 text-base font-black text-slate-950 shadow-2xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-blue-400/35">
                  Open your workspace
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-500 px-7 py-4 text-base font-black text-slate-950 shadow-2xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-blue-400/35">
                    Start using AskDocs
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:border-cyan-200 hover:bg-white/10">
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <div className="grid max-w-2xl grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <CheckCircle2 className="mb-2 h-4 w-4 text-cyan-300" aria-hidden="true" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-violet-500/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1024] p-5">
                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">Project: Investor diligence</p>
                    <p className="text-xs text-slate-500">12 documents indexed</p>
                  </div>
                  <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">Ready</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["Market Report.pdf", "Board Notes.docx", "Revenue.csv"].map((file, index) => (
                    <div key={file} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">0{index + 1}</div>
                      <p className="text-sm font-bold text-white">{file}</p>
                      <p className="mt-1 text-xs text-slate-500">Indexed for Q&A</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-4 rounded-3xl bg-white/[0.04] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white">
                      <Bot className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-xl">
                      AskDocs found 4 revenue risks, summarized the board decision, and extracted 6 follow-up actions from your uploaded files.
                    </div>
                  </div>
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 text-sm font-semibold leading-6 text-slate-950">
                    Show the top risks and cite which document each came from.
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-2xl font-black text-white">5+</p>
                    <p className="text-xs text-slate-500">file types</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-2xl font-black text-white">24/7</p>
                    <p className="text-xs text-slate-500">self-serve</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-2xl font-black text-white">AI</p>
                    <p className="text-xs text-slate-500">answers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">Built to convert files into momentum</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">A landing experience that matches the power of the product.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl shadow-black/10 backdrop-blur">
              <Zap className="mb-6 h-9 w-9 text-cyan-300" aria-hidden="true" />
              <h3 className="mb-3 text-xl font-bold">Instant clarity</h3>
              <p className="text-slate-300">Give users a direct path from upload to answer, so long documents no longer slow down decision-making.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl shadow-black/10 backdrop-blur">
              <FileSearch className="mb-6 h-9 w-9 text-cyan-300" aria-hidden="true" />
              <h3 className="mb-3 text-xl font-bold">Document-aware chat</h3>
              <p className="text-slate-300">AskDocs is made for questions grounded in the files people actually upload, not generic answers detached from their work.</p>
            </article>
            <article id="security" className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl shadow-black/10 backdrop-blur">
              <LockKeyhole className="mb-6 h-9 w-9 text-cyan-300" aria-hidden="true" />
              <h3 className="mb-3 text-xl font-bold">Protected workspace</h3>
              <p className="text-slate-300">Secure sessions and account gates help keep every project focused, organized, and ready for serious work.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">How it works</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">From upload to answer in three simple moves.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              AskDocs, created by Estech Solutions, is positioned for anyone who wants to stop searching manually and start understanding documents faster.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="group flex gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.08]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-200/20">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold text-cyan-200">Step {index + 1}</p>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{step.copy}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-600 p-[1px] shadow-2xl shadow-blue-950/40">
          <div className="rounded-[2rem] bg-slate-950/90 p-8 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">Use it for</p>
                <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Make every uploaded document easier to use.</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {useCases.map((useCase) => (
                    <span key={useCase} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <h3 className="text-2xl font-black">Ready to ask better questions?</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Create an account and give users a polished, high-trust path into the AskDocs workspace.
                </p>
                <div className="mt-6">
                  {session.valid ? (
                    <Link href="/workspace" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-100">
                      Continue to workspace
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <Link href="/signup" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-100">
                      Create your account
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
