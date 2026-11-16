# Ori Web

The user-facing Ori Platform web application.

## Stack

- Next.js App Router, React, and TypeScript
- Clerk for account authentication
- Neon Postgres for server-side conversation storage
- Ori Text, Ori Display, and Ori Mono fonts
- CSS modules and global design tokens

## Routes

- `/` — public landing page; signed-in users are redirected to Chat
- `/chat` — conversations with Ori and chat history
- `/settings` — appearance and accent preferences
- `/onboarding` — initial account setup
- `/sign-in` and `/sign-up` — authentication

## Local development

Run `npm install` from the repository root, then `npm run dev --workspace @ori/web`. The app uses the server environment variables documented in the root `.env.example`.

## Product boundary

This application owns the user-facing chat experience. Developer project records and developer documentation live in the separate Ori Developer Platform. Model inference runs in the separately deployed Ori Intelligence service; credentials stay on the server.
