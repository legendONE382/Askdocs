# AskDocs

AskDocs is a Next.js document Q&A application. Users can sign up, sign in, upload documents (PDF, DOCX, TXT, MD, CSV), and ask grounded questions against the indexed content using Gemini-powered generation with source citations.

## Features

- Username/password sign up and login with HTTP-only session cookies
- Protected workspace (`/workspace`) gated by session token
- Multi-file upload with parsing for PDF, DOCX, TXT, MD, CSV
- Document chunking and keyword-based retrieval
- AI-powered answers via Gemini with fallback extractive answering
- Source citations returned with answers
- Health check endpoint at `GET /api/health`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript 5.9
- React 18
- Tailwind CSS
- mammoth (DOCX parsing)
- pdf-parse (PDF parsing)
- Google Gemini API (optional — falls back to local extractive answering)

## Requirements

- Node.js 18+ (Node.js 22 recommended)
- npm

## Installation

```bash
npm ci
```

## Environment Configuration

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for AI answers and embeddings |
| `GEMINI_CHAT_MODEL` | Gemini model for chat (default: `gemini-3.6-flash`) |
| `GEMINI_EMBED_MODEL` | Gemini model for embeddings (default: `gemini-embedding-001`) |
| `APP_AUTH_SECRET` | Long random secret used to sign session cookies |

> **Security note:** `APP_AUTH_SECRET` must be set in all environments. The application will fail to start if it is missing. For local development, use a random string. In production, use a strong, unique secret.

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Testing

```bash
npm test           # Run all tests once
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Quality Checks

```bash
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript type checking
npm run build      # Production build
```

## Architecture

### Frontend

- `/` — Public landing page
- `/login` — Sign in
- `/signup` — Create account
- `/workspace` — Main document Q&A interface (protected)

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | Create account and set session cookie |
| `/api/auth/login` | POST | Validate credentials and set session cookie |
| `/api/auth/session` | GET | Check current session from cookie |
| `/api/auth/logout` | POST | Clear session cookie |
| `/api/health` | GET | Health check |
| `/api/ingest` | POST | Ingest documents, chunk, embed, store |
| `/api/chat` | POST | Query documents with Gemini or fallback |
| `/api/documents/ingest` | POST | Parse and chunk uploaded files |
| `/api/documents/chat` | POST | Chat against in-memory chunks |

### Document Ingestion

Files are parsed based on extension (TXT/MD/CSV as text, PDF via pdf-parse, DOCX via mammoth). Text is cleaned and split into ~900-character chunks with 140-character overlap. Chunks are stored in an in-memory project map.

### Chunking

Text is split into chunks with overlap to preserve context at boundaries. Empty input returns no chunks.

### Retrieval

Questions are tokenized and matched against chunk text. Matching chunks are scored by term frequency and ranked. If no matches are found, the top chunks are returned as a fallback.

### AI Integration

When `GEMINI_API_KEY` is configured, questions are answered using the configured Gemini chat model with a system instruction to answer only from provided context and cite sources. If the API key is missing or the request fails, the application falls back to a local extractive answer built from the matching chunks.

### Authentication

Sessions are stateless signed tokens (HMAC-SHA256) stored in HTTP-only cookies. Tokens include username, userId, and expiration. Session creation and verification happen server-side. Tokens expire after 12 hours. There is no persistent user database in this prototype.

## Known Limitations

- User accounts are not persisted across server restarts (demo mode)
- Document embeddings and chunks are stored in memory and lost on restart
- No persistent database for users or documents
- Gemini API key is required for AI-powered answers; without it, only extractive answers are available
- Rate limiting uses in-memory counters and does not persist across instances
- File size limit is 8 MB per file, 5 files per ingest request
