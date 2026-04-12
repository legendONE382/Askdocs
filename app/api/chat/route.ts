import { NextResponse } from "next/server";

import { embedTexts, generateAnswer } from "@/lib/mistral";
import { searchChunks } from "@/lib/vector-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { AppError, LIMITS, safeErrorMessage, sanitizeProject } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`chat:${ip}`, 60, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { project?: string; question?: string };
    const project = sanitizeProject(body.project);
    const question = body.question?.trim();

    if (!question) {
      throw new AppError("Question is required.", 400, true);
    }
    if (question.length > LIMITS.maxQuestionLength) {
      throw new AppError(`Question too long. Max ${LIMITS.maxQuestionLength} characters.`, 400, true);
    }

    const [questionEmbedding] = await embedTexts([question]);
    const results = searchChunks(project, questionEmbedding, 5);

    if (!results.length) {
      return NextResponse.json({
        answer:
          "I could not find relevant document context in this project yet. Upload files, then ask again.",
        citations: []
      });
    }

    const context = results
      .map((chunk, index) => `[${index + 1}] ${chunk.source} (part ${chunk.part})\n${chunk.text}`)
      .join("\n\n")
      .slice(0, LIMITS.maxContextChars);

    const answer = await generateAnswer(context, question);

    const citations = results.map((chunk, index) => ({
      label: index + 1,
      source: chunk.source,
      part: chunk.part,
      snippet: chunk.text.slice(0, 260)
    }));

    return NextResponse.json({ answer, citations });
  } catch (error) {
    const { status, message } = safeErrorMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
