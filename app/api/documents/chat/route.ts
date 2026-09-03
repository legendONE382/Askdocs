import { NextResponse } from "next/server";

import { generateAnswer } from "@/lib/gemini";
import { retrieveRelevantChunks, type DocumentChunk } from "@/lib/documents";

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

    const answer = await generateAnswer(context, question);

    const trimmed = answer.trim();
    if (!trimmed) {
      return NextResponse.json({
        ok: false,
        error: "The AI could not generate an answer from the provided document context.",
        citations: relevant.map((chunk, index) => ({
          label: index + 1,
          source: chunk.source,
          chunkIndex: chunk.chunkIndex,
          snippet: chunk.text.slice(0, 260)
        }))
      }, { status: 502 });
    }

    const citations = relevant.map((chunk, index) => ({
      label: index + 1,
      source: chunk.source,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text.slice(0, 260)
    }));

    return NextResponse.json({ ok: true, answer: trimmed, citations, mode: "gemini" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Answer generation failed. The AI service could not process the request.";
    console.error("Gemini document chat error:", message);
    return NextResponse.json({
      ok: false,
      error: message,
      citations: relevant.map((chunk, index) => ({
        label: index + 1,
        source: chunk.source,
        chunkIndex: chunk.chunkIndex,
        snippet: chunk.text.slice(0, 260)
      }))
    }, { status: 502 });
  }
}
