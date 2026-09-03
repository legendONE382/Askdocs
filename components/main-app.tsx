"use client";

import { useMemo, useState } from "react";
import { FileUp, Loader2, LogOut, SendHorizonal, Sparkles, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
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

const quickActions = [
  "Summarize my uploaded documents.",
  "List important action items from the files.",
  "What risks should I review first?"
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
      const fileSummary = data.parsedFiles?.map((file) => `${file.source}: ${file.chunks} chunks`).join("; ");
      setStatus(`Indexed ${data.chunks.length} searchable chunks for "${project}". ${fileSummary ?? ""}`);
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
        { role: "assistant", content: "Please upload and index documents first, then I can answer from their content." }
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
      const data = (await response.json()) as { ok: boolean; error?: string; answer?: string; citations?: Citation[] };

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

  const sidebar = (
    <aside className="panel h-fit w-full space-y-5 p-5 lg:sticky lg:top-6 lg:w-[360px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">AskDocs</h1>
          <p className="mt-1 text-sm text-slate-300">Signed in as {username}</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-rose-400"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">Project workspace</label>
        <input
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-accent"
          placeholder="default-workspace"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-slate-500 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <FileUp size={16} /> Upload files
        </label>
        <p className="text-xs text-slate-400">pdf, docx, txt, md, csv</p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv"
          onChange={(event) => {
            setFiles(event.target.files);
            setChunks([]);
            setStatus("Files selected. Click Index Documents to read them.");
          }}
          className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:text-slate-200 hover:file:bg-slate-700"
        />
        {fileNames ? <p className="text-xs text-slate-400 break-all">{fileNames}</p> : null}
      </div>

      <button
        onClick={ingestFiles}
        disabled={ingesting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-70"
      >
        {ingesting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
        {ingesting ? "Indexing..." : "Index Documents"}
      </button>

      <div className="rounded-xl bg-slate-900/70 p-3 text-xs text-slate-300">{status}</div>
    </aside>
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row">
      {/* Mobile sidebar toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          {sidebarOpen ? "Close menu" : "Workspace"}
        </button>
        <h1 className="text-lg font-semibold text-slate-50">AskDocs</h1>
      </div>

      {/* Sidebar - mobile drawer / desktop sticky */}
      <div className={`${sidebarOpen ? "fixed inset-0 z-50 flex bg-slate-950/80 p-4" : "hidden"} lg:relative lg:block lg:z-auto lg:bg-transparent lg:p-0`}>
        <div className="panel w-full max-w-sm overflow-y-auto lg:max-w-none">{sidebar}</div>
      </div>

      {/* Chat area */}
      <section className="panel flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => ask(action)}
              disabled={chatting}
              className="rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-200 transition hover:border-accent disabled:opacity-70"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl bg-slate-950/60 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">
              Upload + index your files, then ask questions. AskDocs will answer from indexed document text and show source snippets.
            </p>
          ) : (
            messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`rounded-xl p-3 text-sm sm:text-base ${
                  message.role === "user" ? "ml-0 sm:ml-10 bg-accent/20" : "mr-0 sm:mr-10 bg-slate-800"
                }`}
              >
                {message.role === "assistant" ? (
                  <MarkdownRenderer content={message.content} className="prose prose-invert max-w-none" />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.citations?.length ? (
                  <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
                    {message.citations.map((citation) => (
                      <div key={`${citation.source}-${citation.chunkIndex}`} className="rounded-lg bg-slate-900 p-2 text-xs text-slate-300">
                        <p className="font-semibold text-slate-100">
                          {citation.source} · chunk {citation.chunkIndex}
                        </p>
                        <p className="mt-1">{citation.snippet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
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
  );
}
