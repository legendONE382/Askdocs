# AskDocs

AskDocs is a document Q&A demo experience designed for presentations and rapid prototyping.

## Overview

The app opens directly to the main workspace so presenters can immediately:

- Upload one or more documents
- Simulate indexing of uploaded files
- Ask questions in a chat-style interface
- Demonstrate a clean dashboard UX for a future RAG pipeline

> **Current demo mode:** authentication is intentionally paused for presentation simplicity.

## Demo Routes

- `/` → Main application workspace (default entry)
- `/workspace` → Same main workspace (alias route)

## Product Highlights

- **Professional dashboard layout** with clear left-panel controls and right-panel conversation area
- **Multi-file upload input** with immediate file list feedback
- **Indexing status flow** that mimics production ingestion lifecycle
- **Quick action prompts** for common document-analysis questions
- **Chat transcript panel** for user and assistant message flow

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React + Tailwind CSS
- **Icons:** lucide-react

## Run Locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Next Planned Upgrades

- Re-enable authentication (server sessions)
- Connect real document ingestion APIs
- Add vector search + grounded response citations
- Add persistent storage for projects and chat history
