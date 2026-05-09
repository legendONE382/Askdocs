# AskDocs

AskDocs is a Next.js document Q&A application scaffold where users can sign up, sign in, open a protected workspace, upload documents, and interact with a chat-style interface for grounded answers.

## Highlights

- **Authentication Flow:** Username/password sign up + login with HTTP-only session cookies.
- **Protected App Route:** `/workspace` is gated and redirects to `/login` if session is missing/expired.
- **Document UX:** Multi-file upload input for PDF, DOCX, TXT, MD, and CSV.
- **RAG-Ready Chat UI:** Chat panel + quick prompts for document-analysis interactions.
- **Deployment-Ready:** Built with Next.js App Router and designed to run on Vercel.

## Routes

- `/` → Smart entry point (redirects to `/workspace` when authenticated, else `/login`)
- `/login` → Sign in page
- `/signup` → Create account page
- `/workspace` → Main AskDocs interface (protected)

## Authentication Architecture


- API routes:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/session`
  - `POST /api/auth/logout`
- Sessions are stateless signed tokens stored in an HTTP-only cookie (`askdocs_session`).
- Session expiration is enforced server-side based on token payload.
- Signup/login are demo-mode credential gates (no persistent user database yet).

> Note: This eliminates Vercel serverless memory issues. For production, replace with a persistent database-backed user/session store and real credential verification.

## Local Development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Production Notes

- Set `NODE_ENV=production` in deployment environments (Vercel does this automatically).
- Session cookie is marked `secure` in production.
- Replace prototype ingestion/chat simulation with real RAG endpoints for embeddings, retrieval, and cited answers.
