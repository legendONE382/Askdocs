# AskDocs

AskDocs includes local browser authentication and a protected main workspace where users can upload files, index them, and ask questions.

## Routes

- `/` — Landing page (auto-redirects to `/workspace` when a session exists)
- `/login` — Sign in page (auto-redirects to `/workspace` when already authenticated)
- `/signup` — Create account page (auto-redirects to `/workspace` when already authenticated)
- `/workspace` — Main app page with upload/index/chat UI (protected)

## Auth behavior

- Accounts are stored in browser `localStorage`.
- Passwords are hashed in-browser using `crypto.subtle` (SHA-256) before storage.
- Session state is tracked in `localStorage`.
- Unauthenticated access to `/workspace` redirects to `/login`.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
