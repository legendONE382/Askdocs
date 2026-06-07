import { NextResponse } from "next/server";

import { createExtractiveAnswer, retrieveRelevantChunks, type DocumentChunk } from "@/lib/documents";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

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
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
  }

  try {
    const context = relevant
      .map((chunk, index) => `[${index + 1}] ${chunk.source} chunk ${chunk.chunkIndex}\n${chunk.text}`)
      .join("\n\n");

    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_CHAT_MODEL || "open-mistral-nemo",
        messages: [
          {
            role: "system",
            content:
              "You answer questions only from the supplied document context. If the answer is not in the context, say you do not know. Include concise source references."
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.2
      })
    });

    if (!mistralResponse.ok) {
      return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
    }

    const data = (await mistralResponse.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const answer = data.choices?.[0]?.message?.content?.trim() || fallback.answer;

    return NextResponse.json({ ok: true, answer, citations: fallback.citations, mode: "mistral" });
  } catch {
    return NextResponse.json({ ok: true, answer: fallback.answer, citations: fallback.citations, mode: "extractive" });
  }
}
