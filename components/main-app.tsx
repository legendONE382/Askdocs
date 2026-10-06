"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import {
  FileUp,
  Loader2,
  LogOut,
  SendHorizonal,
  Sparkles,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";

type Citation = {
  source: string;
  snippet: string;
  chunkIndex: number;
};

type DocumentChunk = {
  id: string;
  source: string;
  text: string;
  chunkIndex: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

const QUICK_ACTIONS = [
  "Summarize my uploaded documents.",
  "List important action items from the files.",
  "What risks should I review first?"
];

const EXAMPLE_QUESTIONS = [
  "What are the key findings across these documents?",
  "Summarize the main points in my files.",
  "What action items are mentioned in the documents?"
];

export default function MainApp({ username }: { username: string }) {
  const router = useRouter();
  const [project, setProject] = useState("default-workspace");
  const [files, setFiles] = useState<FileList | null>(null);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [status, setStatus] = useState("No files uploaded yet.");
  const [ingesting, setIngesting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatting, setChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const fileNames = useMemo(() => {
    if (!files?.length) return "";
    return Array.from(files)
      .map((file) => file.name)
      .join(", ");
  }, [files]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function ingestFiles() {
    if (!files?.length) {
      setStatus("Please choose at least one file before indexing.");
      return;
    }

    setIngesting(true);
    setStatus("Reading and indexing your document text...");
    setChunks([]);

    const formData = new FormData();
    formData.append("project", project);
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/documents/ingest", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        chunks?: DocumentChunk[];
        parsedFiles?: Array<{ source: string; chunks: number }>;
      };

      if (!response.ok || !data.ok || !data.chunks?.length) {
        setStatus(data.error || "Unable to index those documents.");
        return;
      }

      setChunks(data.chunks);
      const fileSummary =
        data.parsedFiles
          ?.map((file) => `${file.source}: ${file.chunks} chunks`)
          .join("; ") ?? "";
      setStatus(`Indexed ${data.chunks.length} searchable chunks for "${project}". ${fileSummary}`);
    } catch {
      setStatus("Indexing failed. Please try a smaller supported file.");
    } finally {
      setIngesting(false);
    }
  }

  async function ask(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || chatting) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmedQuestion }]);
    setPrompt("");

    if (!chunks.length) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Please upload and index documents first, then I can answer from their content."
        }
      ]);
      return;
    }

    setChatting(true);

    try {
      const response = await fetch("/api/documents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion, chunks })
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        answer?: string;
        citations?: Citation[];
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.ok && data.answer ? data.answer : data.error || "I could not answer from the indexed documents.",
          citations: data.citations
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "The document chat request failed. Please try again." }
      ]);
    } finally {
      setChatting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-slate-700/40 bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
          <span className="text-lg font-semibold text-slate-50">AskDocs</span>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-panel px-3 py-2 text-sm text-slate-200"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </header>

        <div className="flex flex-1">
          {/* Mobile overlay */}
          {sidebarOpen ? (
            <div
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          ) : null}

          {/* Sidebar - mobile drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Workspace sidebar"
            className={[
              "fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto border-r border-slate-700/40 bg-surface p-4 transition-transform duration-200 lg:static lg:z-auto lg:block lg:h-auto lg:w-80 lg:max-w-none lg:translate-x-0 lg:border-r lg:bg-transparent lg:p-0 lg:shadow-none lg:role-dialog",
              sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            ].join(" ")}
          >
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-lg font-semibold text-slate-50">AskDocs</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg border border-slate-600 bg-panel p-1.5 text-slate-200"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-5 lg:mt-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-50">AskDocs</h1>
                  <p className="mt-1 text-sm text-slate-300">Signed in as {username}</p>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-rose-400 hover:text-rose-200"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-slate-200"
                >
                  Project workspace
                </label>
                <input
                  id="project"
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-panel px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="default-workspace"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-dashed border-slate-500 p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <FileUp size={16} />
                  Upload files
                </label>
                <p className="text-xs text-slate-400">
                  PDF, DOCX, TXT, MD, CSV — up to 8 MB each
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.csv"
                  onChange={(event) => {
                    setFiles(event.target.files);
                    setChunks([]);
                    setStatus("Files selected. Click Index Documents to read them.");
                  }}
                  className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:text-slate-200 file:transition hover:file:bg-slate-700"
                />
                {fileNames ? (
                  <p className="text-xs text-slate-400 break-all">{fileNames}</p>
                ) : null}
              </div>

              <Button
                onClick={ingestFiles}
                disabled={ingesting}
                className="w-full"
              >
                {ingesting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Indexing…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Index Documents
                  </>
                )}
              </Button>

              <div className="rounded-xl bg-slate-900/70 p-3 text-xs text-slate-300">
                {status}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                  Indexed files
                </p>
                {chunks.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No documents indexed yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="info">{chunks.length} chunks</Badge>
                    <Badge tone="default">{project}</Badge>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Chat area */}
          <section className="flex flex-1 flex-col">
            {/* Quick actions */}
            {messages.length === 0 ? (
              <div className="border-b border-slate-700/40 px-4 pb-4 pt-4 sm:px-6">
                <p className="mb-3 text-sm font-medium text-slate-200">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      onClick={() => ask(action)}
                      disabled={chatting}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-200 transition hover:border-accent hover:text-accent disabled:opacity-70"
                    >
                      {action}
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <FileUp className="text-accent" size={22} />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold text-slate-100">
                    Upload documents to get started
                  </h2>
                  <p className="mb-6 max-w-sm text-sm text-slate-300">
                    Upload PDFs, DOCX, TXT, MD, or CSV files, then ask questions
                    against their content. Answers come with source citations so
                    you can verify results.
                  </p>
                  <div className="grid gap-2 text-left text-xs text-slate-300 sm:max-w-sm">
                    {EXAMPLE_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => ask(q)}
                        className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-left transition hover:border-accent hover:text-accent"
                      >
                        &ldquo;{q}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <article
                      key={`${message.role}-${index}`}
                      className={[
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-base animate-fade-in",
                        message.role === "user"
                          ? "ml-auto bg-accent/15 text-slate-100"
                          : "mr-auto bg-slate-800 text-slate-200"
                      ].join(" ")}
                    >
                      {message.role === "assistant" ? (
                        <MarkdownRenderer content={message.content} className="prose prose-invert max-w-none" />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      {message.citations?.length ? (
                        <div className="mt-3 space-y-2 border-t border-slate-700/60 pt-3">
                          <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                            Sources
                          </p>
                          {message.citations.map((citation) => (
                            <div
                              key={`${citation.source}-${citation.chunkIndex}`}
                              className="rounded-lg bg-slate-900/80 p-2.5 text-xs text-slate-300"
                            >
                              <p className="mb-1 font-medium text-slate-100">
                                {citation.source} · chunk {citation.chunkIndex}
                              </p>
                              <p className="leading-relaxed text-slate-300">
                                {citation.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                  {chatting ? (
                    <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin text-accent" size={14} />
                        <span className="text-slate-300">Answering from your documents…</span>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-slate-700/40 bg-surface/80 px-4 pb-4 pt-4 backdrop-blur sm:px-6">
              <form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  ask(prompt);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="Ask a question about your documents…"
                  disabled={chatting}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={chatting || !prompt.trim()}
                  className="p-2.5"
                >
                  {chatting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <SendHorizonal size={18} />
                  )}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
