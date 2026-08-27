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

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const context = relevant
      .map((chunk, index) => `[${index + 1}] ${chunk.source} chunk ${chunk.chunkIndex}\n${chunk.text}`)
      .join("\n\n");

    const answer = (await generateAnswer(context, question)).trim();

    if (!answer) {
      const fallback = createExtractiveAnswer(question, relevant);
      return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
    }

    const citations = relevant.map((chunk, index) => ({
      label: index + 1,
      source: chunk.source,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text.slice(0, 260)
    }));

    return NextResponse.json({ ok: true, answer, citations, mode: "gemini" });
  } catch (error) {
    console.error("Gemini document chat error:", error);
    const fallback = createExtractiveAnswer(question, relevant);
    return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
  }
}
