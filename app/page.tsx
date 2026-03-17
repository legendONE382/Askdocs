"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, SendHorizonal, Sparkles } from "lucide-react";

type Citation = {
  label: number;
  source: string;
  part: number;
  snippet: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

const quickActions = [
  "Summarize the uploaded documents.",
  "List key risks and concerns from the documents.",
  "Extract action items and deadlines in bullet points."
];

export default function HomePage() {
  const router = useRouter();
  const [project, setProject] = useState("default");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string>("No files ingested yet.");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const [chatting, setChatting] = useState(false);


  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const fileNames = useMemo(() => {
    if (!files) return "";
    return Array.from(files)
      .map((file) => file.name)
      .join(", ");
  }, [files]);

  async function ingest() {
    if (!files?.length) {
      setStatus("Please choose at least one file.");
      return;
    }

    setIngesting(true);
    try {
      const form = new FormData();
      form.append("project", project);
      Array.from(files).forEach((file) => form.append("files", file));

      const response = await fetch("/api/ingest", { method: "POST", body: form });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Ingest failed.");
      setStatus(
        `Indexed ${data.addedChunks} chunks from ${data.uploadedFiles} files. Project total: ${data.totalChunks}.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unexpected ingest error.");
    } finally {
      setIngesting(false);
    }
  }

  async function ask(question: string) {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setPrompt("");
    setChatting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, question })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat request failed.");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, citations: data.citations ?? [] }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Unexpected chat error."
        }
      ]);
    } finally {
      setChatting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:flex-row">
      <aside className="panel h-fit w-full space-y-5 p-5 lg:sticky lg:top-6 lg:w-[360px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">AskDocs</h1>
            <p className="mt-1 text-sm text-slate-300">Mistral-powered document QA, optimized for Vercel.</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-slate-600 px-3 py-1 text-xs hover:border-accent">Logout</button>
        </div>

        <label className="block text-sm font-medium text-slate-200">Project workspace</label>
        <input
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-accent"
          placeholder="default (letters/numbers/_/-)"
        />

        <div className="rounded-xl border border-dashed border-slate-500 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
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
          onClick={ingest}
          disabled={ingesting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-70"
        >
          {ingesting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} Ingest Documents
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
              Ingest documents first, then ask questions. Answers include source snippets for verification.
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
                {message.citations?.length ? (
                  <div className="mt-3 space-y-2 border-t border-slate-600 pt-3">
                    {message.citations.map((citation) => (
                      <div key={`${citation.source}-${citation.label}`} className="rounded-lg bg-slate-900 p-2 text-xs">
                        <p className="font-medium">
                          [{citation.label}] {citation.source} · part {citation.part}
                        </p>
                        <p className="mt-1 text-slate-300">{citation.snippet}...</p>
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
