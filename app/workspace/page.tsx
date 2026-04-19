"use client";

import { useMemo, useState } from "react";
import { FileUp, Loader2, SendHorizonal, Sparkles } from "lucide-react";

import AuthGate from "@/components/auth-gate";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const quickActions = [
  "Summarize my uploaded documents.",
  "List important action items from the files.",
  "What risks should I review first?"
];

export default function WorkspacePage() {
  const [project, setProject] = useState("default");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState("No files uploaded yet.");
  const [ingesting, setIngesting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatting, setChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const fileNames = useMemo(() => {
    if (!files?.length) return "";
    return Array.from(files)
      .map((file) => file.name)
      .join(", ");
  }, [files]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function ingestFiles() {
    if (!files?.length) {
      setStatus("Please choose at least one file before indexing.");
      return;
    }

    setIngesting(true);
    setStatus("Indexing files...");

    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus(`Indexed ${files.length} file(s) for project "${project}".`);
    setIngesting(false);
  }

  async function ask(question: string) {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setPrompt("");
    setChatting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const reply = files?.length
      ? `I found ${files.length} uploaded file(s): ${Array.from(files)
          .map((file) => file.name)
          .join(", ")}. Connect the ingestion/chat API for grounded results.`
      : "Upload and index at least one file first so I can answer against your docs.";

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setChatting(false);
  }

  return (
    <AuthGate>
      {(user) => (
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:flex-row">
          <aside className="panel h-fit w-full space-y-5 p-5 lg:sticky lg:top-6 lg:w-[360px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">AskDocs Dashboard</h1>
                <p className="mt-1 text-sm text-slate-300">Welcome, {user.username}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-slate-600 px-3 py-1 text-xs hover:border-accent disabled:opacity-60"
              >
                {loggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>

            <div className="grid gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300">
              <p><span className="text-slate-100">Plan:</span> Demo</p>
              <p><span className="text-slate-100">Workspace:</span> {project}</p>
              <p><span className="text-slate-100">Session expires:</span> {new Date(user.expiresAt).toLocaleTimeString()}</p>
            </div>

            <label className="block text-sm font-medium text-slate-200">Project workspace</label>
            <input
              value={project}
              onChange={(event) => setProject(event.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="default"
            />

            <div className="rounded-xl border border-dashed border-slate-500 p-4">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <FileUp size={16} /> Upload files (pdf, docx, txt, md, csv)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md,.csv"
                onChange={(event) => setFiles(event.target.files)}
                className="mt-3 w-full text-sm"
              />
              {fileNames ? <p className="mt-3 text-xs text-slate-400">{fileNames}</p> : null}
            </div>

            <button
              onClick={ingestFiles}
              disabled={ingesting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-70"
            >
              {ingesting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} Index Documents
            </button>

            <p className="rounded-xl bg-slate-900/70 p-3 text-xs text-slate-300">{status}</p>
          </aside>

          <section className="panel flex flex-1 flex-col p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => ask(action)}
                  disabled={chatting}
                  className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-accent"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl bg-slate-950/60 p-4">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Upload + index your files, then ask questions. This dashboard is ready for API integration.
                </p>
              ) : (
                messages.map((message, index) => (
                  <article
                    key={`${message.role}-${index}`}
                    className={`rounded-xl p-3 text-sm ${
                      message.role === "user" ? "ml-10 bg-accent/20" : "mr-10 bg-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </article>
                ))
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask(prompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask a question about your documents..."
                className="flex-1 rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={chatting}
                className="rounded-xl bg-accent p-2 text-slate-900 transition hover:brightness-110 disabled:opacity-70"
              >
                {chatting ? <Loader2 className="animate-spin" size={18} /> : <SendHorizonal size={18} />}
              </button>
            </form>
          </section>
        </main>
      )}
    </AuthGate>
  );
}
