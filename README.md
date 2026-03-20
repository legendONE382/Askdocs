# AskDocs (Vercel + Mistral)

AskDocs is a document analysis app built with **Next.js App Router** and the **Mistral API**.
Users can create a local account in-browser, upload documents, and chat with cited answers.

## What changed

- Authentication is now **local-first**: accounts are stored in browser `localStorage`.
- Session is browser-local (`askdocs_current_user`) so users can sign up/login without server-side user setup.
- Document vectors are still in server memory for now (demo behavior).

## Full app flow

1. User opens `/login`.
2. User can **Sign Up** or **Login**.
3. Account/session is stored in local browser storage.
4. User uploads docs and ingests them.
5. User asks questions and gets RAG answers with citations.
6. User logs out (local session removed).

## Local run

```bash
npm install
cp .env.example .env.local
# set MISTRAL_API_KEY in .env.local
npm run dev
```

## Environment variables

- `MISTRAL_API_KEY` (required)
- `MISTRAL_CHAT_MODEL` (optional, default: `open-mistral-nemo`)
- `MISTRAL_EMBED_MODEL` (optional, default: `mistral-embed`)

## Notes

- Current user accounts are local to each browser/device.
- Vector memory is ephemeral on serverless instances.
- For production durable state, add a real DB + vector store.
