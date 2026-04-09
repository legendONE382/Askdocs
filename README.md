# AskDocs

AskDocs is a Next.js document Q&A application that lets users upload files, build semantic indexes, and chat with AI answers grounded in uploaded content.

## Highlights

- **Upload + Ingest:** PDF, DOCX, TXT, MD, CSV.
- **RAG Chat:** Uses Mistral embeddings + chat completions.
- **Source Snippets:** Answers include citation snippets from retrieved chunks.
- **Local-First Auth:** Sign up/login is stored in the browser for a simple, backend-free demo flow.

## Architecture (Demo)

- **Frontend:** Next.js App Router (`app/page.tsx`, `app/login/page.tsx`).
- **Ingestion API:** `POST /api/ingest` parses documents and stores vectors in memory.
- **Chat API:** `POST /api/chat` retrieves top chunks and generates grounded responses.
- **Vector Store:** In-memory (`lib/vector-store.ts`) for demonstration.

## Run locally

```bash
npm install
cp .env.example .env.local
# set MISTRAL_API_KEY in .env.local
npm run dev
```

Then open: `http://localhost:3000`

## Required environment variables

- `MISTRAL_API_KEY`

Optional:
- `MISTRAL_CHAT_MODEL` (default: `open-mistral-nemo`)
- `MISTRAL_EMBED_MODEL` (default: `mistral-embed`)

## Auth model (important)

User accounts and session state are stored on the client (browser storage). This is intentional for demo simplicity.

## Production notes

For production use, replace:

- Browser-local auth with real server auth (e.g., NextAuth/Auth.js + DB)
- In-memory vectors with persistent storage (pgvector/Pinecone/Qdrant/Weaviate)
- In-memory rate limits with distributed rate limiting
