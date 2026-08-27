import { NextResponse } from "next/server";

import { generateAnswer } from "@/lib/gemini";
import { createExtractiveAnswer, retrieveRelevantChunks, type DocumentChunk } from "@/lib/documents";

export async function POST(request: Request) {
  const body = (await request.json()) as { question?: string; chunks?: DocumentChunk[] };
  const question = body.question?.trim() ?? "";
  const chunks = Array.isArray(body.chunks) ? body.chunks : [];

  if (!question) {
    return NextResponse.json({ ok: false, error: "Ask a question first." }, { status: 400 });
  }

  if (!chunks.length) {
    return NextResponse.json({ ok: false, error: "Index documents before asking questions." }, { status: 400 });
  }

  const relevant = retrieveRelevantChunks(question, chunks, 5);
  const fallback = createExtractiveAnswer(question, relevant);

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
  }

  try {
    const context = relevant
      .map((chunk, index) => `[${index + 1}] ${chunk.source} chunk ${chunk.chunkIndex}\n${chunk.text}`)
      .join("\n\n");

    const answer = (await generateAnswer(context, question)).trim() || fallback.answer;

    return NextResponse.json({ ok: true, answer, citations: fallback.citations, mode: "gemini" });
  } catch (error) {
    console.error("Gemini document chat error:", error);
    return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
  }
}
