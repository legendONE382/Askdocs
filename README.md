# AskDocs (Vercel + Mistral)

AskDocs is a production-style, Vercel-ready document analysis app built with **Next.js App Router** and the **Mistral API**.
Users authenticate, upload docs, and chat with document-grounded answers + citations.

## What you get

- Professional UI with protected access (login/logout).
- Upload support: **PDF, DOCX, TXT, MD, CSV**.
- Semantic retrieval with Mistral embeddings (`mistral-embed`).
- Default chat model: **`open-mistral-nemo`** (free-tier friendly), override via env.
- RAG answers with source citation snippets.

## Security controls

- Login gate for app and APIs via signed HttpOnly session cookie.
- Project-name validation and filename sanitization.
- File extension allowlist + max file size (8MB/file).
- Ingestion limits (max files/chunks per request).
- Question length + context size limits.
- Basic in-memory per-IP rate limiting (login, ingest, chat).
- Safe API errors (no stack traces leaked to client).

## Local run

```bash
npm install
cp .env.example .env.local
# set your secrets in .env.local
npm run dev
```

Open `http://localhost:3000` and sign in.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Set Environment Variables in Vercel project settings:
   - `MISTRAL_API_KEY`
   - `APP_AUTH_SECRET` (long random value)
   - `APP_LOGIN_USER`
   - `APP_LOGIN_PASSWORD`
   - Optional: `MISTRAL_CHAT_MODEL`, `MISTRAL_EMBED_MODEL`
4. Deploy.

After deployment, users can log in with your configured credentials and use the app.

## Environment variables

- `MISTRAL_API_KEY` (required)
- `MISTRAL_CHAT_MODEL` (optional, default: `open-mistral-nemo`)
- `MISTRAL_EMBED_MODEL` (optional, default: `mistral-embed`)
- `APP_AUTH_SECRET` (required for production)
- `APP_LOGIN_USER` (optional, default: `admin`)
- `APP_LOGIN_PASSWORD` (optional, default: `admin123`)

## Important persistence note

The vector store is in-memory for simplicity. On Vercel serverless, memory is ephemeral.
For production-grade persistence, swap `lib/vector-store.ts` with a durable backend (pgvector/Pinecone/Qdrant/Weaviate).
