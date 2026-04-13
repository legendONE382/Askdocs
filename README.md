# AskDocs

AskDocs now includes a fresh authentication foundation with dedicated login, signup, and protected workspace routes.

## Routes

- `/` — Landing page
- `/login` — Sign in page
- `/signup` — Create account page
- `/workspace` — Protected app route (requires active session)

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
