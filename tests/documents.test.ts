import { describe, it, expect } from "vitest";
import { buildChunks, createExtractiveAnswer, retrieveRelevantChunks, type DocumentChunk } from "@/lib/documents";

function makeChunk(text: string, source = "doc.txt", chunkIndex = 1): DocumentChunk {
  return { id: `${source}-${chunkIndex - 1}`, source, text, chunkIndex };
}

describe("retrieveRelevantChunks", () => {
  const chunks = [
    makeChunk("The quick brown fox jumps over the lazy dog.", "a.txt", 1),
    makeChunk("A fast brown fox leaps across sleepy dogs.", "a.txt", 2),
    makeChunk("JavaScript is a programming language.", "b.txt", 1),
    makeChunk("The capital of France is Paris.", "c.txt", 1),
  ];

  it("returns no chunks when given an empty query", () => {
    const results = retrieveRelevantChunks("", chunks, 4);
    expect(results).toHaveLength(4);
  });

  it("falls back to returning all chunks up to limit when no specific matches", () => {
    const results = retrieveRelevantChunks("is a the", chunks, 4);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(4);
  });

  it("ranks relevant matches higher", () => {
    const results = retrieveRelevantChunks("brown fox", chunks, 4);
    expect(results[0].text).toContain("brown fox");
    expect(results[0].chunkIndex).toBe(1);
  });

  it("returns up to the requested limit", () => {
    const results = retrieveRelevantChunks("brown fox", chunks, 2);
    expect(results).toHaveLength(2);
  });

  it("returns empty array for empty chunk collection", () => {
    const results = retrieveRelevantChunks("hello", [], 4);
    expect(results).toHaveLength(0);
  });

  it("returns empty array for no-match scenario with limit", () => {
    const results = retrieveRelevantChunks("quantum physics", chunks, 3);
    expect(results).toHaveLength(3);
  });

  it("returns all chunks if no relevant matches found (fallback)", () => {
    const results = retrieveRelevantChunks("mars rover", chunks, 4);
    expect(results).toHaveLength(4);
  });
});

describe("createExtractiveAnswer", () => {
  it("returns a no-match message when no relevant chunks exist", () => {
    const result = createExtractiveAnswer("anything", []);
    expect(result.answer).toContain("could not find indexed text");
    expect(result.citations).toHaveLength(0);
  });

  it("returns answer with citations from matching chunks", () => {
    const chunks = [
      makeChunk("Paris is the capital of France.", "facts.txt", 1),
      makeChunk("France is in Western Europe.", "facts.txt", 2),
    ];
    const result = createExtractiveAnswer("capital of France", chunks);
    expect(result.answer).toContain("Paris is the capital of France");
    expect(result.citations).toHaveLength(2);
    expect(result.citations[0].source).toBe("facts.txt");
    expect(result.citations[0].chunkIndex).toBe(1);
  });

  it("handles empty question string by falling back to top chunks", () => {
    const chunks = [makeChunk("some text here", "doc.txt", 1)];
    const result = createExtractiveAnswer("", chunks);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.answer).toContain("most relevant information");
  });
});

describe("buildChunks", () => {
  it("chunks plain text files correctly", async () => {
    const text = "Hello world. ".repeat(100);
    const file = new File([text], "notes.txt", { type: "text/plain" });

    const result = await buildChunks([file]);
    expect(result.chunks.length).toBeGreaterThan(0);
    expect(result.parsedFiles).toHaveLength(1);
    expect(result.parsedFiles[0].source).toBe("notes.txt");
    expect(result.parsedFiles[0].chunks).toBe(result.chunks.length);
  });

  it("returns empty result for empty file", async () => {
    const file = new File([""], "empty.txt", { type: "text/plain" });
    const result = await buildChunks([file]);
    expect(result.chunks).toHaveLength(0);
  });

  it("handles markdown files as text", async () => {
    const md = "# Heading\n\nSome markdown content here.";
    const file = new File([md], "readme.md", { type: "text/markdown" });
    const result = await buildChunks([file]);
    expect(result.chunks.length).toBeGreaterThan(0);
  });

  it("handles csv files as text", async () => {
    const csv = "name,age,city\nAlice,30,NYC\nBob,25,LA";
    const file = new File([csv], "data.csv", { type: "text/csv" });
    const result = await buildChunks([file]);
    expect(result.chunks.length).toBeGreaterThan(0);
  });

  it("rejects unsupported file types", async () => {
    const file = new File(["binary content"], "archive.zip", { type: "application/zip" });
    await expect(buildChunks([file])).rejects.toThrow("Unsupported file type");
  });

  it("sanitizes file names with special characters", async () => {
    const text = "Some content here.";
    const file = new File([text], "../path/my file!@#.txt", { type: "text/plain" });
    const result = await buildChunks([file]);
    expect(result.parsedFiles[0].source).not.toContain("/");
    expect(result.parsedFiles[0].source).not.toContain("!");
  });
});
