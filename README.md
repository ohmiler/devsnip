# DevSnip

DevSnip is a small social web app for developers to share public code snippets. It uses Next.js, Tailwind CSS, shadcn/ui, NextAuth, Prisma, and Supabase Postgres.

## Features

- Public snippet feed
- Email/password registration, email/password sign-in, and GitHub OAuth sign-in
- Snippet create, edit, and delete dashboard
- Likes and bookmarks
- Basic feed search
- Monochrome responsive UI

## Setup

1. Read `docs/setup.md`.
2. Copy `.env.example` to `.env.local`.
3. Fill `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, and `GITHUB_SECRET`.
4. Run `npm install`.
5. Run `npm run prisma:migrate -- --name init`.
6. Run `npm run dev`.

## Verification

```bash
npm run test
npm run lint
npm run build
```
