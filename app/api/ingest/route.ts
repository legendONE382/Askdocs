import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import mammoth from "mammoth";

import { chunkText } from "@/lib/chunker";
import { embedTexts } from "@/lib/mistral";
import { addChunks, projectSize, type StoredChunk } from "@/lib/vector-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { AppError, LIMITS, safeErrorMessage, sanitizeFileName, sanitizeProject } from "@/lib/security";

type PdfParseFn = (dataBuffer: Buffer, options?: Record<string, unknown>) => Promise<{ text?: string }>;
const pdfParse = require("pdf-parse") as PdfParseFn;

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "txt", "md", "csv"]);

async function extractText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === "pdf") {
    const parsed = await pdfParse(buffer);
    return parsed.text ?? "";
  }

  if (extension === "docx") {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value ?? "";
  }

  if (extension && ["txt", "md", "csv"].includes(extension)) {
    return buffer.toString("utf-8");
  }

  throw new AppError("Unsupported file type.", 400, true);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`ingest:${ip}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const project = sanitizeProject(formData.get("project"));
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (!files.length) {
      throw new AppError("No files were uploaded.", 400, true);
    }
    if (files.length > LIMITS.maxFiles) {
      throw new AppError(`Too many files. Max is ${LIMITS.maxFiles}.`, 400, true);
    }

    const chunksToStore: Omit<StoredChunk, "embedding">[] = [];

    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
        throw new AppError(`File type not allowed: ${file.name}`, 400, true);
      }
      if (file.size > LIMITS.maxFileBytes) {
        throw new AppError(`File too large: ${file.name}. Max size is 8MB.`, 400, true);
      }

      const safeName = sanitizeFileName(file.name);
      const text = await extractText(file);
      const chunks = chunkText(text);
      chunks.forEach((chunk, index) => {
        if (chunksToStore.length < LIMITS.maxChunksPerRequest) {
          chunksToStore.push({
            id: randomUUID(),
            source: safeName,
            part: index + 1,
            text: chunk
          });
        }
      });
    }

    if (!chunksToStore.length) {
      throw new AppError("No readable text found in uploaded files.", 400, true);
    }

    const embeddings = await embedTexts(chunksToStore.map((chunk) => chunk.text));
    const ready = chunksToStore.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index]
    }));

    addChunks(project, ready);

    return NextResponse.json({
      project,
      uploadedFiles: files.length,
      addedChunks: ready.length,
      totalChunks: projectSize(project)
    });
  } catch (error) {
    const { status, message } = safeErrorMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
