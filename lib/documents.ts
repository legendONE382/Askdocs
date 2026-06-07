import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);

type PdfParse = (buffer: Buffer) => Promise<{ text?: string }>;
const pdfParse = require("pdf-parse") as PdfParse;

export type DocumentChunk = {
  id: string;
  source: string;
  text: string;
  chunkIndex: number;
};

export type Citation = {
  source: string;
  snippet: string;
  chunkIndex: number;
};

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 140;

function cleanText(text: string) {
  return text.replace(/\r/g, "\n").replace(/[\t ]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120) || "document";
}

function chunkText(source: string, text: string): DocumentChunk[] {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const chunks: DocumentChunk[] = [];
  let cursor = 0;

  while (cursor < cleaned.length) {
    const next = Math.min(cursor + CHUNK_SIZE, cleaned.length);
    const chunk = cleaned.slice(cursor, next).trim();

    if (chunk) {
      chunks.push({
        id: `${source}-${chunks.length}`,
        source,
        text: chunk,
        chunkIndex: chunks.length + 1
      });
    }

    if (next >= cleaned.length) break;
    cursor = Math.max(0, next - CHUNK_OVERLAP);
  }

  return chunks;
}

export async function parseUploadedFile(file: File) {
  const source = safeFileName(file.name);
  const extension = source.split(".").pop()?.toLowerCase() ?? "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (["txt", "md", "csv"].includes(extension)) {
    return { source, text: cleanText(buffer.toString("utf8")) };
  }

  if (extension === "pdf") {
    const parsed = await pdfParse(buffer);
    return { source, text: cleanText(parsed.text ?? "") };
  }

  if (extension === "docx") {
    const parsed = await mammoth.extractRawText({ buffer });
    return { source, text: cleanText(parsed.value ?? "") };
  }

  throw new Error(`Unsupported file type: ${extension || "unknown"}`);
}

export async function buildChunks(files: File[]) {
  const allChunks: DocumentChunk[] = [];
  const parsedFiles: Array<{ source: string; characters: number; chunks: number }> = [];

  for (const file of files) {
    const parsed = await parseUploadedFile(file);
    const chunks = chunkText(parsed.source, parsed.text);
    allChunks.push(...chunks);
    parsedFiles.push({ source: parsed.source, characters: parsed.text.length, chunks: chunks.length });
  }

  return { chunks: allChunks, parsedFiles };
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export function retrieveRelevantChunks(question: string, chunks: DocumentChunk[], limit = 4) {
  const queryTerms = tokenize(question);
  if (!queryTerms.length) return chunks.slice(0, limit);

  const scored = chunks.map((chunk) => {
    const lower = chunk.text.toLowerCase();
    const score = queryTerms.reduce((total, term) => total + (lower.includes(term) ? 1 : 0), 0);
    return { chunk, score };
  });

  const matches = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.chunk);

  return (matches.length ? matches : chunks).slice(0, limit);
}

export function createExtractiveAnswer(question: string, chunks: DocumentChunk[]) {
  const relevant = retrieveRelevantChunks(question, chunks, 3);

  if (!relevant.length) {
    return {
      answer: "I could not find indexed text to answer from. Please upload and index a supported document first.",
      citations: [] as Citation[]
    };
  }

  const citations = relevant.map((chunk) => ({
    source: chunk.source,
    snippet: chunk.text.slice(0, 260),
    chunkIndex: chunk.chunkIndex
  }));

  const answer = [
    "Based on the indexed document text, the most relevant information I found is:",
    ...citations.map((citation, index) => `${index + 1}. ${citation.snippet}${citation.snippet.length >= 260 ? "..." : ""}`),
    "",
    `Sources: ${citations.map((citation) => `${citation.source} (chunk ${citation.chunkIndex})`).join(", ")}`
  ].join("\n");

  return { answer, citations };
}
