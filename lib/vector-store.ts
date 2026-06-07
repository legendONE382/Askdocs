import { cosineSimilarity } from "@/lib/chunker";

export type StoredChunk = {
  id: string;
  source: string;
  part: number;
  text: string;
  embedding: number[];
};

const projects = new Map<string, StoredChunk[]>();

export function addChunks(project: string, chunks: StoredChunk[]): void {
  const existing = projects.get(project) ?? [];
  projects.set(project, [...existing, ...chunks]);
}

export function searchChunks(project: string, queryEmbedding: number[], topK = 5): StoredChunk[] {
  const existing = projects.get(project) ?? [];

  return existing
    .map((chunk) => ({
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
      chunk
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.chunk);
}

export function projectSize(project: string): number {
  return (projects.get(project) ?? []).length;
}
