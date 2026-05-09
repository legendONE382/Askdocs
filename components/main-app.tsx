"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileUp, Loader2, LogOut, SendHorizonal, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ label: number; source: string; part: number; snippet: string }>;
};

const quickActions = [
  "Summarize my uploaded documents.",
  "List the key findings and recommendations.",
  "What are the main risks and opportunities?",
  "Extract important dates and deadlines."
];

export default function MainApp({ username }: { username: string }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState("default-workspace");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState("Ready to upload files.");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [ingesting, setIngesting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatting, setChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileNames = useMemo(() => {
    if (!files?.length) return "";
    return Array.from(files)
      .map((file) => file.name)
      .join(", ");
  }, [files]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function ingestFiles() {
    if (!files?.length) {
      setStatus("Please choose at least one file before indexing.");
      setStatusType("error");
      return;
    }

    setIngesting(true);
    setStatus("Indexing files...");
    setStatusType("loading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("project", project);
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      setStatus(`✓ Indexed ${files.length} file(s) successfully`);
      setStatusType("success");
      setMessages([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to index files";
      setStatus(message);
      setStatusType("error");
      setError(message);
    } finally {
      setIngesting(false);
    }
  }

  async function ask(question: string) {
    if (!question.trim()) return;
    if (!files?.length) {
      setError("Please upload and index files first.");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setPrompt("");
    setChatting(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, question })
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        answer: string;
        citations?: Array<{ label: number; source: string; part: number; snippet: string }>;
        error?: string;
      };

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, citations: data.citations }
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get response";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` }
      ]);
    } finally {
      setChatting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 md:p-6 lg:flex-row">
      {/* Sidebar */}
      <aside className="panel h-fit w-full space-y-5 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-lg lg:sticky lg:top-6 lg:w-[380px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AskDocs
            </h1>
            <p className="mt-2 text-xs text-slate-400">👤 {username}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1.5 text-xs text-slate-200 hover:bg-rose-950 hover:border-rose-500 transition"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
            Project Workspace
          </label>
          <input
            value={project}
            onChange={(event) => setProject(event.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition"
            placeholder="default-workspace"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
            Upload Files
          </label>
          <div className="rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-400 transition p-4 bg-slate-700/20">
            <label htmlFor="file-upload" className="flex items-center justify-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-blue-400 transition">
              <FileUp size={18} /> Choose files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md,.csv"
              onChange={(event) => setFiles(event.target.files)}
              className="hidden"
            />
            {fileNames ? (
              <p className="mt-3 text-xs text-blue-400 font-medium bg-blue-950/30 rounded p-2 break-words">
                📄 {fileNames}
              </p>
            ) : null}
          </div>
        </div>

        <button
          onClick={ingestFiles}
          disabled={ingesting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {ingesting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Indexing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Index Documents
            </>
          )}
        </button>

        {/* Status Message */}
        <div
          className={`rounded-lg p-3 text-xs font-medium flex items-start gap-2 transition ${
            statusType === "success"
              ? "bg-emerald-950/50 text-emerald-300 border border-emerald-700"
              : statusType === "error"
              ? "bg-red-950/50 text-red-300 border border-red-700"
              : statusType === "loading"
              ? "bg-blue-950/50 text-blue-300 border border-blue-700 animate-pulse"
              : "bg-slate-700/50 text-slate-300 border border-slate-600"
          }`}
        >
          {statusType === "success" && <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />}
          {statusType === "error" && <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
          {statusType === "loading" && <Loader2 size={16} className="flex-shrink-0 mt-0.5 animate-spin" />}
          <span>{status}</span>
        </div>
      </aside>

      {/* Main Chat Section */}
      <section className="panel flex-1 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg flex flex-col overflow-hidden">
        {/* Quick Actions */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur p-4">
          <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wide">Quick Questions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => ask(action)}
                disabled={chatting || !files?.length}
                className="rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:border-blue-400 hover:text-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Sparkles className="mx-auto mb-3 text-slate-600" size={32} />
                <p className="text-sm text-slate-400">
                  {files?.length
                    ? "Upload files to start asking questions about your documents."
                    : "Upload documents to begin. I'll help you find answers in your files."}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`flex gap-3 animate-fadeIn ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-slate-50 rounded-br-none"
                      : "bg-slate-700 text-slate-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600/50 space-y-1">
                      <p className="text-xs font-semibold text-slate-300">📚 Sources:</p>
                      {message.citations.map((citation) => (
                        <div
                          key={`${citation.source}-${citation.part}`}
                          className="text-xs bg-slate-600/30 rounded p-2 hover:bg-slate-600/50 transition"
                        >
                          <span className="font-semibold text-blue-300">[{citation.label}]</span>{" "}
                          <span className="text-slate-300">
                            {citation.source} (part {citation.part})
                          </span>
                          <p className="text-slate-400 mt-1 italic">"{citation.snippet}..."</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 rounded-lg border border-red-700 bg-red-950/50 p-3 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            ask(prompt);
          }}
          className="border-t border-slate-700 bg-slate-800/50 backdrop-blur p-4 flex items-center gap-2"
        >
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={files?.length ? "Ask a question about your documents..." : "Upload files first..."}
            disabled={!files?.length}
            className="flex-1 rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={chatting || !files?.length}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-slate-950 font-semibold transition hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            {chatting ? <Loader2 className="animate-spin" size={20} /> : <SendHorizonal size={20} />}
          </button>
        </form>
      </section>
    </main>
  );
}
