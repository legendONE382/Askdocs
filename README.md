# AskDocs

AskDocs now uses a production-style cookie session flow with middleware-protected routes.

## Routes

- `/` — Landing page (checks session and redirects to workspace)
- `/login` — Login form (handles session-expired banner + redirect animation)
- `/signup` — Account creation form
- `/workspace` — Main dashboard with upload/index/chat UI (protected)
- `/api/auth/login` — Server login + secure cookie set
- `/api/auth/signup` — Server signup + secure cookie set
- `/api/auth/session` — Session validation endpoint
- `/api/auth/logout` — Session revoke endpoint

## Auth architecture

- Sessions are stored in secure, HTTP-only cookies.
- Middleware validates cookies for `/workspace` and redirects unauthenticated users.
- Login/signup are server API calls that set session cookies.
- Session expiry redirects users to `/login?reason=session-expired`.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
