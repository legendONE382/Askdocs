import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessageSquareQuote,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

type LandingProps = {
  isLoggedIn: boolean;
};

export default function LandingPage({ isLoggedIn }: LandingProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-700/40 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <FileText className="text-accent" size={18} />
            </div>
            AskDocs
          </Link>
          <nav className="flex items-center gap-3" aria-label="Account">
            {isLoggedIn ? (
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Open Workspace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-slate-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <TrustBar />
        <HowItWorks />
        <ProductPreview />
        <WhyAskDocs />
        <UseCases />
        <SupportedFiles />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>

      <footer className="border-t border-slate-700/40 py-8 text-center text-xs text-slate-400">
        <p>AskDocs · AI Document Q&A</p>
      </footer>
    </div>
  );
}

function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-36 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(94,161,255,0.08),transparent_60%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-6 inline-flex rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          Chat with your documents
        </span>
        <SectionHeading level={1} className="mb-6">
          Turn your documents into answers.
          <span className="block text-accent">No more endless searching.</span>
        </SectionHeading>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Upload your PDFs, Word docs, and text files. AskDocs reads them and
          answers your questions with direct references back to the source.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:brightness-110"
            >
              Open Workspace
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:brightness-110"
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3 font-medium text-slate-200 transition hover:border-slate-400 hover:bg-slate-800/50"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Free to use. No credit card required.
        </p>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, text: "HTTP-only sessions" },
    { icon: Globe, text: "Runs locally in your workspace" },
    { icon: Zap, text: "Answers in seconds" }
  ];

  return (
    <section className="border-y border-slate-700/40 bg-slate-900/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
              <item.icon size={16} className="text-accent" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description:
        "Drop in your PDFs, Word docs, text files, markdown, or CSVs. AskDocs parses and chunks the content."
    },
    {
      icon: MessageSquareQuote,
      title: "Ask",
      description:
        "Type a question in plain English. AskDocs retrieves the most relevant parts of your documents."
    },
    {
      icon: FileText,
      title: "Get answers",
      description:
        "Receive a clear answer grounded in your files, with clickable source snippets to verify the result."
    }
  ];

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionHeading level={2} className="mb-3">
            How it works
          </SectionHeading>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Three steps from document collection to answer.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="panel flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <step.icon className="text-accent" size={22} />
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                Step {index + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-100">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section className="border-y border-slate-700/40 bg-slate-900/40 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionHeading level={2} className="mb-3">
            See AskDocs in action
          </SectionHeading>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Upload documents, ask questions, and get cited answers inside a single workspace.
          </p>
        </div>

        <div className="panel overflow-hidden">
          <div className="grid divide-x divide-slate-700/60 lg:grid-cols-[280px_1fr]">
            <div className="hidden bg-panel/80 p-4 lg:block">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="h-2 w-2 rounded-full bg-accent" />
                Workspace
              </div>
              <div className="mb-3 rounded-xl border border-dashed border-slate-600 p-3">
                <div className="mb-2 text-xs font-medium text-slate-200">
                  Uploaded files
                </div>
                <div className="space-y-2">
                  {[
                    "annual-report-2024.pdf",
                    "project-brief.docx",
                    "notes.md",
                    "data.csv"
                  ].map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1.5 text-xs text-slate-300"
                    >
                      <FileText size={12} className="shrink-0 text-subtle" />
                      <span className="truncate">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {["3 chunks indexed", "Ready to search"].map((line) => (
                  <div
                    key={line}
                    className="rounded-lg bg-slate-900/60 px-2 py-1.5 text-[11px] text-subtle"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="min-h-[360px] space-y-4 p-4 sm:p-6">
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-sm text-slate-950">
                  <p className="font-medium">What were the main findings?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[85%] space-y-3 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3 text-sm text-slate-200">
                  <p>
                    Based on the uploaded documents, the main findings are:
                  </p>
                  <ul className="ml-5 list-disc space-y-1">
                    <li>
                      Revenue grew 18% year-over-year, driven primarily by the
                      enterprise segment.
                    </li>
                    <li>
                      Customer acquisition cost decreased while retention improved.
                    </li>
                    <li>
                      The project brief highlights three operational risks to
                      review before launch.
                    </li>
                  </ul>
                  <div className="space-y-2 pt-2">
                    <div className="rounded-xl bg-slate-900/80 p-3">
                      <p className="mb-1 text-xs font-medium text-slate-100">
                        annual-report-2024.pdf
                      </p>
                      <p className="text-xs text-slate-300">
                        &quot;...revenue grew 18% year-over-year, driven primarily
                        by the enterprise segment...&quot;
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-900/80 p-3">
                      <p className="mb-1 text-xs font-medium text-slate-100">
                        project-brief.docx
                      </p>
                      <p className="text-xs text-slate-300">
                        &quot;...three operational risks to review before
                        launch...&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyAskDocs() {
  const benefits = [
    {
      title: "Grounded answers",
      description:
        "Every answer is tied to the actual text in your documents. No guessing, no hallucinations from general knowledge."
    },
    {
      title: "Source citations",
      description:
        "See exactly where the answer came from. Click through to the original document snippet to verify or dig deeper."
    },
    {
      title: "Multiple formats",
      description:
        "Works with PDFs, Word documents, plain text, markdown, and CSV files. Upload what you already have."
    },
    {
      title: "Private workspace",
      description:
        "Your documents stay in your workspace session. AskDocs is designed for focused, private document work."
    }
  ];

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionHeading level={2} className="mb-3">
            Why AskDocs
          </SectionHeading>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Built around the actual way people work with documents.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="panel flex h-full flex-col gap-3 p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="text-accent" size={18} />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      title: "Research",
      description:
        "Quickly search across papers, notes, and literature reviews without switching tabs."
    },
    {
      title: "Legal & document review",
      description:
        "Find specific clauses, dates, or obligations across contracts and policy documents."
    },
    {
      title: "Business reporting",
      description:
        "Ask questions about quarterly reports, board packs, and internal memos."
    },
    {
      title: "Studying",
      description:
        "Turn textbooks and lecture notes into an interactive Q&A study companion."
    },
    {
      title: "Operations",
      description:
        "Pull answers from SOPs, handbooks, and runbooks without reading every page."
    },
    {
      title: "Large document collections",
      description:
        "Upload multiple files and ask across them as if they were one searchable library."
    }
  ];

  return (
    <section className="border-y border-slate-700/40 bg-slate-900/40 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionHeading level={2} className="mb-3">
            Built for real document workflows
          </SectionHeading>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            From researchers to ops teams, AskDocs helps you work with document collections faster.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <div
              key={item.title}
              className="panel flex h-full flex-col gap-2 p-5"
            >
              <h3 className="text-sm font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportedFiles() {
  const formats = ["PDF", "DOCX", "TXT", "MD", "CSV"];

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading level={2} className="mb-3">
          Works with the files you already use
        </SectionHeading>
        <p className="mb-8 text-sm text-slate-300 sm:text-base">
          AskDocs parses common document formats directly in your workspace.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {formats.map((format) => (
            <span
              key={format}
              className="rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="border-t border-slate-700/40 bg-slate-900/40 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading level={2} className="mb-4">
          Ready to try AskDocs?
        </SectionHeading>
        <p className="mx-auto mb-8 max-w-xl text-sm text-slate-300 sm:text-base">
          Create a workspace, upload your documents, and start asking questions in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:brightness-110"
            >
              Go to workspace
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:brightness-110"
            >
              Create your workspace
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
