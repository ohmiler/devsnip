# DevSnip MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working DevSnip MVP where developers can sign in with GitHub, post public code snippets, manage their own snippets, like/bookmark snippets, and browse a polished monochrome social feed.

**Architecture:** Use Next.js App Router with server-rendered pages for feed/dashboard data and server actions for mutations. Use NextAuth/Auth.js with GitHub OAuth and the Prisma adapter, with Supabase Postgres as the database. Keep Prisma, validation, data access, server actions, and UI components in focused files with clear ownership.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, NextAuth/Auth.js, Prisma, Supabase Postgres, Zod, Vitest, Testing Library, lucide-react.

---

## Reference Documents

- Design spec: `docs/superpowers/specs/2026-05-17-devsnip-design.md`
- Local Next.js docs read before planning:
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  - `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
  - `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- Official implementation references:
  - Auth.js Next.js shape: `https://authjs.dev/`
  - Prisma adapter with Auth.js: `https://www.prisma.io/docs/guides/authentication/authjs/nextjs`
  - Supabase Postgres with Prisma: `https://supabase.com/docs/guides/database/prisma`
  - shadcn/ui for Next.js and Tailwind v4: `https://v3.shadcn.com/docs/installation/next`

## Scope Check

This is one cohesive MVP. It has multiple features, but they share one domain model and one UI shell. Splitting into separate specs would slow execution because auth, snippets, likes, bookmarks, feed, and dashboard all depend on the same user/session and snippet schema.

## File Structure

### Project And Tooling

- Modify: `package.json` for scripts and installed dependencies.
- Modify: `package-lock.json` through npm commands.
- Create: `vitest.config.ts` for unit/component test setup.
- Create: `tests/setup.ts` for Testing Library matchers.
- Create: `tests/smoke.test.ts` as an initial passing harness test.

### Database And Auth

- Create: `prisma/schema.prisma` for Auth.js models plus snippets, likes, and bookmarks.
- Create: `prisma.config.ts` for Prisma configuration.
- Modify: `.gitignore` to ignore generated Prisma client output if the generator writes inside `app/generated`.
- Create: `.env.example` with required local variables.
- Create: `lib/prisma.ts` for the singleton Prisma client.
- Create: `auth.ts` for NextAuth/Auth.js config.
- Create: `app/api/auth/[...nextauth]/route.ts` for Auth.js route handlers.
- Create: `types/next-auth.d.ts` for `session.user.id`.
- Create: `components/auth/auth-buttons.tsx` for server-action sign in and sign out forms.
- Create: `app/signin/page.tsx` for a branded sign-in page.

### Domain And Mutations

- Create: `lib/snippet-schema.ts` for language options, form parsing, and validation types.
- Create: `lib/snippets.ts` for feed, dashboard, bookmark, and ownership data access.
- Create: `app/actions/snippets.ts` for create/update/delete server actions.
- Create: `app/actions/social.ts` for like/bookmark toggle server actions.
- Create: `tests/snippet-schema.test.ts` for validation behavior.

### App Shell And UI

- Modify: `app/globals.css` for the monochrome theme and base layout polish.
- Modify: `app/layout.tsx` for metadata and body classes.
- Create or modify shadcn/ui files under `components/ui/`.
- Create: `lib/utils.ts` from shadcn if the CLI does not create it.
- Create: `components/layout/app-shell.tsx`.
- Create: `components/layout/sidebar.tsx`.
- Create: `components/layout/top-bar.tsx`.
- Create: `components/layout/right-panel.tsx`.
- Create: `components/layout/search-form.tsx`.
- Create: `components/snippets/snippet-card.tsx`.
- Create: `components/snippets/social-actions.tsx`.
- Create: `components/snippets/snippet-form.tsx`.
- Create: `components/snippets/snippet-list-empty.tsx`.
- Create: `components/dashboard/dashboard-stats.tsx`.
- Create: `components/dashboard/snippet-management-list.tsx`.

### Routes

- Modify: `app/page.tsx` for the public searchable feed.
- Create: `app/dashboard/page.tsx` for user snippet management.
- Create: `app/bookmarks/page.tsx` for saved snippets.
- Create: `app/snippets/new/page.tsx` for creation.
- Create: `app/snippets/[id]/edit/page.tsx` for owner-only editing.
- Create: `app/not-found.tsx` for a plain app-level not-found state.

### Docs And Verification

- Modify: `README.md` with setup and usage.
- Create: `docs/setup.md` with Supabase and GitHub OAuth steps.

## Task 1: Dependencies And Test Harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/smoke.test.ts`

- [ ] **Step 1: Install runtime dependencies**

Run:

```powershell
cmd.exe /c npm.cmd install next-auth@beta @auth/prisma-adapter @prisma/client @prisma/adapter-pg pg dotenv zod lucide-react class-variance-authority clsx tailwind-merge
```

Expected: `package.json` includes the listed dependencies and `package-lock.json` updates.

- [ ] **Step 2: Install development dependencies**

Run:

```powershell
cmd.exe /c npm.cmd install -D prisma tsx @types/pg vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: `package.json` includes the listed dev dependencies and `package-lock.json` updates.

- [ ] **Step 3: Add scripts to `package.json`**

Update the `scripts` block to this shape while preserving existing scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

- [ ] **Step 5: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Create `tests/smoke.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs Vitest", () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 7: Run the test harness**

Run:

```powershell
npm run test
```

Expected: PASS with `tests/smoke.test.ts`.

- [ ] **Step 8: Commit**

```powershell
git add package.json package-lock.json vitest.config.ts tests/setup.ts tests/smoke.test.ts
git commit -m "chore: add app dependencies and test harness"
```

## Task 2: shadcn/ui Foundation

**Files:**
- Create or modify: `components.json`
- Create or modify: `components/ui/button.tsx`
- Create or modify: `components/ui/input.tsx`
- Create or modify: `components/ui/textarea.tsx`
- Create or modify: `components/ui/select.tsx`
- Create or modify: `components/ui/avatar.tsx`
- Create or modify: `components/ui/badge.tsx`
- Create or modify: `components/ui/dropdown-menu.tsx`
- Create or modify: `components/ui/alert-dialog.tsx`
- Create or modify: `components/ui/separator.tsx`
- Create or modify: `components/ui/skeleton.tsx`
- Create or modify: `components/ui/tooltip.tsx`
- Create or modify: `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui**

Run:

```powershell
cmd.exe /c npx.cmd shadcn@latest init
```

Choose the existing Next.js project, Tailwind v4, and the `@/*` import alias if prompted.

Expected: `components.json` exists and `lib/utils.ts` exists.

- [ ] **Step 2: Add required shadcn/ui components**

Run:

```powershell
cmd.exe /c npx.cmd shadcn@latest add button input textarea select avatar badge dropdown-menu alert-dialog separator skeleton tooltip
```

Expected: component files exist under `components/ui/`.

- [ ] **Step 3: Ensure `lib/utils.ts` has `cn`**

If the CLI did not create this exact helper, write it:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run lint**

Run:

```powershell
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components.json components/ui lib/utils.ts package.json package-lock.json
git commit -m "chore: initialize shadcn ui"
```

## Task 3: Prisma Schema, Client, And Environment Docs

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma.config.ts`
- Create: `lib/prisma.ts`
- Create: `.env.example`
- Modify: `.gitignore`
- Create: `docs/setup.md`

- [ ] **Step 1: Create `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
  runtime  = "nodejs"
}

datasource db {
  provider = "postgresql"
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime? @map("email_verified")
  image          String?
  githubUsername String?   @map("github_username")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  accounts  Account[]
  sessions  Session[]
  snippets  Snippet[]
  likes     Like[]
  bookmarks Bookmark[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Snippet {
  id        String   @id @default(cuid())
  authorId  String   @map("author_id")
  title     String
  caption   String?
  language  String
  code      String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  author    User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  likes     Like[]
  bookmarks Bookmark[]

  @@index([authorId, createdAt])
  @@index([language])
  @@map("snippets")
}

model Like {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  snippetId String   @map("snippet_id")
  createdAt DateTime @default(now()) @map("created_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  snippet Snippet @relation(fields: [snippetId], references: [id], onDelete: Cascade)

  @@unique([userId, snippetId])
  @@index([snippetId])
  @@map("likes")
}

model Bookmark {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  snippetId String   @map("snippet_id")
  createdAt DateTime @default(now()) @map("created_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  snippet Snippet @relation(fields: [snippetId], references: [id], onDelete: Cascade)

  @@unique([userId, snippetId])
  @@index([snippetId])
  @@map("bookmarks")
}
```

- [ ] **Step 2: Create `prisma.config.ts`**

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

- [ ] **Step 3: Create `lib/prisma.ts`**

```ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

- [ ] **Step 4: Create `.env.example`**

```bash
DATABASE_URL="postgres://prisma.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-32-byte-secret"
GITHUB_ID="github-oauth-client-id"
GITHUB_SECRET="github-oauth-client-secret"
```

- [ ] **Step 5: Update `.gitignore`**

Add:

```gitignore
app/generated/prisma
.env
.env.local
```

- [ ] **Step 6: Create `docs/setup.md`**

```md
# DevSnip Setup

## Supabase Postgres

1. Create a Supabase project.
2. In Supabase SQL Editor, create a Prisma database role:

```sql
create user "prisma" with password 'replace_with_a_strong_password' bypassrls createdb;
grant "prisma" to "postgres";
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

3. Copy the Supavisor session pooler connection string into `DATABASE_URL`.
4. Run `npm run prisma:migrate -- --name init` to create tables.
5. Run `npm run prisma:generate` after schema changes.

## GitHub OAuth

1. Create a GitHub OAuth app.
2. Homepage URL: `http://localhost:3000`.
3. Callback URL: `http://localhost:3000/api/auth/callback/github`.
4. Copy the client ID to `GITHUB_ID`.
5. Copy the client secret to `GITHUB_SECRET`.

## Local Run

1. Copy `.env.example` to `.env.local`.
2. Fill all values.
3. Run `npm run prisma:migrate -- --name init`.
4. Run `npm run dev`.
```

- [ ] **Step 7: Format and generate Prisma**

Run:

```powershell
npm run prisma:generate
```

Expected: generated Prisma client files exist under `app/generated/prisma`.

- [ ] **Step 8: Commit**

```powershell
git add prisma/schema.prisma prisma.config.ts lib/prisma.ts .env.example .gitignore docs/setup.md
git commit -m "feat: add prisma schema and setup docs"
```

## Task 4: NextAuth GitHub Authentication

**Files:**
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `types/next-auth.d.ts`
- Create: `components/auth/auth-buttons.tsx`
- Create: `app/signin/page.tsx`

- [ ] **Step 1: Create `auth.ts`**

```ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
```

- [ ] **Step 2: Create `app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create `types/next-auth.d.ts`**

```ts
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
```

- [ ] **Step 4: Create `components/auth/auth-buttons.tsx`**

```tsx
import { Github, LogOut } from "lucide-react";
import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button type="submit" className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
        <Github className="size-4" />
        Sign in with GitHub
      </Button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="outline" className="gap-2">
        <LogOut className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Create `app/signin/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/auth-buttons";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <section className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">DevSnip</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Share code with developers.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Sign in with GitHub to publish snippets, like useful code, and save references.
        </p>
        <div className="mt-8">
          <SignInButton />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Run type and lint checks**

Run:

```powershell
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add auth.ts app/api/auth/[...nextauth]/route.ts types/next-auth.d.ts components/auth/auth-buttons.tsx app/signin/page.tsx
git commit -m "feat: add github authentication"
```

## Task 5: Snippet Validation, Data Access, And Server Actions

**Files:**
- Create: `lib/snippet-schema.ts`
- Create: `tests/snippet-schema.test.ts`
- Create: `lib/snippets.ts`
- Create: `app/actions/snippets.ts`
- Create: `app/actions/social.ts`

- [ ] **Step 1: Write failing validation tests in `tests/snippet-schema.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { parseSnippetFormData } from "@/lib/snippet-schema";

function formData(input: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(input)) {
    data.set(key, value);
  }
  return data;
}

describe("parseSnippetFormData", () => {
  it("accepts valid snippet input", () => {
    const result = parseSnippetFormData(
      formData({
        title: "Fetch typed data",
        caption: "A small helper for server components.",
        language: "TypeScript",
        code: "export async function getData() { return [] }",
      }),
    );

    expect(result.success).toBe(true);
  });

  it("rejects an empty code block", () => {
    const result = parseSnippetFormData(
      formData({
        title: "Fetch typed data",
        caption: "",
        language: "TypeScript",
        code: "",
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.code?.[0]).toContain("Code is required");
    }
  });
});
```

- [ ] **Step 2: Run validation tests and verify failure**

Run:

```powershell
npm run test -- tests/snippet-schema.test.ts
```

Expected: FAIL because `lib/snippet-schema.ts` does not exist.

- [ ] **Step 3: Create `lib/snippet-schema.ts`**

```ts
import { z } from "zod";

export const LANGUAGE_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "SQL",
  "Bash",
  "Other",
] as const;

export type SnippetLanguage = (typeof LANGUAGE_OPTIONS)[number];

export type SnippetFormState = {
  errors?: {
    title?: string[];
    caption?: string[];
    language?: string[];
    code?: string[];
  };
  message?: string;
  values?: {
    title?: string;
    caption?: string;
    language?: string;
    code?: string;
  };
};

const rawSnippetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be 80 characters or fewer"),
  caption: z.string().trim().max(280, "Caption must be 280 characters or fewer"),
  language: z.enum(LANGUAGE_OPTIONS, {
    error: "Choose a supported language",
  }),
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(12000, "Code must be 12,000 characters or fewer"),
});

export const snippetSchema = rawSnippetSchema.transform((value) => ({
  ...value,
  caption: value.caption.length > 0 ? value.caption : null,
}));

export type SnippetInput = z.infer<typeof snippetSchema>;

export function parseSnippetFormData(formData: FormData) {
  return snippetSchema.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption") ?? "",
    language: formData.get("language"),
    code: formData.get("code"),
  });
}

export function formStateFromValidation(
  result: ReturnType<typeof parseSnippetFormData>,
  formData: FormData,
): SnippetFormState {
  if (result.success) {
    return {};
  }

  return {
    errors: result.error.flatten().fieldErrors,
    message: "Please fix the highlighted fields.",
    values: {
      title: String(formData.get("title") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      language: String(formData.get("language") ?? "TypeScript"),
      code: String(formData.get("code") ?? ""),
    },
  };
}
```

- [ ] **Step 4: Run validation tests and verify pass**

Run:

```powershell
npm run test -- tests/snippet-schema.test.ts
```

Expected: PASS.

- [ ] **Step 5: Create `lib/snippets.ts`**

```ts
import "server-only";
import prisma from "@/lib/prisma";

export type SnippetFeedItem = Awaited<ReturnType<typeof getFeedSnippets>>[number];

function normalizeQuery(query?: string) {
  return query?.trim().slice(0, 80) ?? "";
}

export async function getFeedSnippets({
  query,
  viewerId,
}: {
  query?: string;
  viewerId?: string;
}) {
  const q = normalizeQuery(query);

  const snippets = await prisma.snippet.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { caption: { contains: q, mode: "insensitive" } },
            { language: { contains: q, mode: "insensitive" } },
            { author: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      author: {
        select: { id: true, name: true, image: true, email: true },
      },
      likes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
      bookmarks: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
      _count: {
        select: { likes: true, bookmarks: true },
      },
    },
  });

  return snippets.map((snippet) => ({
    ...snippet,
    likedByViewer: viewerId ? snippet.likes.length > 0 : false,
    bookmarkedByViewer: viewerId ? snippet.bookmarks.length > 0 : false,
  }));
}

export async function getSnippetForEdit(snippetId: string, userId: string) {
  return prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
  });
}

export async function getDashboardData(userId: string) {
  const [snippets, snippetCount, likesReceived, bookmarksReceived] = await Promise.all([
    prisma.snippet.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { likes: true, bookmarks: true } },
      },
    }),
    prisma.snippet.count({ where: { authorId: userId } }),
    prisma.like.count({ where: { snippet: { authorId: userId } } }),
    prisma.bookmark.count({ where: { snippet: { authorId: userId } } }),
  ]);

  return {
    snippets,
    stats: {
      snippetCount,
      likesReceived,
      bookmarksReceived,
    },
  };
}

export async function getBookmarkedSnippets(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      snippet: {
        include: {
          author: { select: { id: true, name: true, image: true, email: true } },
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
          _count: { select: { likes: true, bookmarks: true } },
        },
      },
    },
  });

  return bookmarks.map((bookmark) => ({
    ...bookmark.snippet,
    likedByViewer: bookmark.snippet.likes.length > 0,
    bookmarkedByViewer: bookmark.snippet.bookmarks.length > 0,
  }));
}
```

- [ ] **Step 6: Create `app/actions/snippets.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  formStateFromValidation,
  parseSnippetFormData,
  type SnippetFormState,
} from "@/lib/snippet-schema";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

export async function createSnippet(
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId();
  const parsed = parseSnippetFormData(formData);

  if (!parsed.success) {
    return formStateFromValidation(parsed, formData);
  }

  await prisma.snippet.create({
    data: {
      ...parsed.data,
      authorId: userId,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSnippet(
  snippetId: string,
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId();
  const parsed = parseSnippetFormData(formData);

  if (!parsed.success) {
    return formStateFromValidation(parsed, formData);
  }

  const existing = await prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
    select: { id: true },
  });

  if (!existing) {
    return { message: "You can only edit your own snippets." };
  }

  await prisma.snippet.update({
    where: { id: snippetId },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteSnippet(snippetId: string) {
  const userId = await requireUserId();

  const existing = await prisma.snippet.findFirst({
    where: { id: snippetId, authorId: userId },
    select: { id: true },
  });

  if (!existing) {
    return;
  }

  await prisma.snippet.delete({
    where: { id: snippetId },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}
```

- [ ] **Step 7: Create `app/actions/social.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

function revalidateSocialSurfaces() {
  revalidatePath("/");
  revalidatePath("/bookmarks");
  revalidatePath("/dashboard");
}

export async function toggleLike(snippetId: string) {
  const userId = await requireUserId();
  const existing = await prisma.like.findUnique({
    where: { userId_snippetId: { userId, snippetId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId, snippetId } });
  }

  revalidateSocialSurfaces();
}

export async function toggleBookmark(snippetId: string) {
  const userId = await requireUserId();
  const existing = await prisma.bookmark.findUnique({
    where: { userId_snippetId: { userId, snippetId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({ data: { userId, snippetId } });
  }

  revalidateSocialSurfaces();
}
```

- [ ] **Step 8: Run tests and lint**

Run:

```powershell
npm run test
npm run lint
```

Expected: PASS for both commands.

- [ ] **Step 9: Commit**

```powershell
git add lib/snippet-schema.ts tests/snippet-schema.test.ts lib/snippets.ts app/actions/snippets.ts app/actions/social.ts
git commit -m "feat: add snippet domain actions"
```

## Task 6: Monochrome App Shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/top-bar.tsx`
- Create: `components/layout/right-panel.tsx`
- Create: `components/layout/search-form.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Update `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevSnip",
  description: "A social code snippet feed for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-100 font-sans text-zinc-950 antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --background: #f4f4f5;
  --foreground: #09090b;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

* {
  box-sizing: border-box;
}

html {
  background: var(--background);
}

body {
  background: var(--background);
  color: var(--foreground);
}

pre,
code {
  font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
```

- [ ] **Step 3: Create `components/layout/search-form.tsx`**

```tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm({ query = "" }: { query?: string }) {
  return (
    <form action="/" className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        name="q"
        defaultValue={query}
        aria-label="Search snippets"
        className="h-12 rounded-full border-zinc-200 bg-zinc-100 pl-11 text-base shadow-none"
      />
    </form>
  );
}
```

- [ ] **Step 4: Create `components/layout/sidebar.tsx`**

```tsx
import Link from "next/link";
import { Bookmark, Home, LayoutDashboard, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/snippets/new", label: "New Snippet", icon: PlusCircle },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-zinc-700 transition hover:bg-white hover:text-zinc-950",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 5: Create `components/layout/top-bar.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { type Session } from "next-auth";
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchForm } from "@/components/layout/search-form";

function initials(name?: string | null) {
  return name?.slice(0, 2).toUpperCase() ?? "DS";
}

export function TopBar({ session, query }: { session: Session | null; query?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
          <span className="grid size-10 place-items-center rounded-full bg-zinc-950 text-white">
            <Code2 className="size-5" />
          </span>
          DevSnip
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <SearchForm query={query} />
        </div>
        <div className="ml-auto flex items-center gap-3">
          {session?.user ? (
            <>
              <Avatar>
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                <AvatarFallback>{initials(session.user.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 md:hidden">
        <SearchForm query={query} />
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Create `components/layout/right-panel.tsx`**

```tsx
import Link from "next/link";
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";

export function RightPanel({ session }: { session: Session | null }) {
  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-24 space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Workspace</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Developer snippets</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Browse reusable ideas, save references, and manage your public code posts.
          </p>
          <Button asChild className="mt-5 w-full bg-zinc-950 text-white hover:bg-zinc-800">
            <Link href={session?.user ? "/snippets/new" : "/signin"}>Create snippet</Link>
          </Button>
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">MVP Languages</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {["TypeScript", "JavaScript", "Python", "Go", "SQL", "Bash"].map((language) => (
              <span key={language} className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-700">
                {language}
              </span>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
```

- [ ] **Step 7: Create `components/layout/app-shell.tsx`**

```tsx
import { type Session } from "next-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { RightPanel } from "@/components/layout/right-panel";

export function AppShell({
  children,
  session,
  query,
}: {
  children: React.ReactNode;
  session: Session | null;
  query?: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <TopBar session={session} query={query} />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
        <RightPanel session={session} />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <section className="max-w-md text-center">
        <p className="text-sm font-medium text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Snippet not found</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The page you opened does not exist or is not available to your account.
        </p>
        <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/">Back to feed</Link>
        </Button>
      </section>
    </main>
  );
}
```

- [ ] **Step 9: Run lint**

Run:

```powershell
npm run lint
```

Expected: PASS.

- [ ] **Step 10: Commit**

```powershell
git add app/globals.css app/layout.tsx components/layout app/not-found.tsx
git commit -m "feat: add monochrome app shell"
```

## Task 7: Public Feed, Search, And Social Actions UI

**Files:**
- Modify: `app/page.tsx`
- Create: `components/snippets/snippet-card.tsx`
- Create: `components/snippets/social-actions.tsx`
- Create: `components/snippets/snippet-list-empty.tsx`

- [ ] **Step 1: Create `components/snippets/social-actions.tsx`**

```tsx
"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { toggleBookmark, toggleLike } from "@/app/actions/social";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SocialActions({
  snippetId,
  liked,
  bookmarked,
  likeCount,
  bookmarkCount,
}: {
  snippetId: string;
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  bookmarkCount: number;
}) {
  const [error, setError] = useState("");
  const [optimistic, updateOptimistic] = useOptimistic(
    { liked, bookmarked, likeCount, bookmarkCount },
    (
      state,
      action: "like" | "bookmark",
    ) => {
      if (action === "like") {
        return {
          ...state,
          liked: !state.liked,
          likeCount: state.likeCount + (state.liked ? -1 : 1),
        };
      }

      return {
        ...state,
        bookmarked: !state.bookmarked,
        bookmarkCount: state.bookmarkCount + (state.bookmarked ? -1 : 1),
      };
    },
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-2 rounded-full", optimistic.liked && "text-zinc-950")}
        onClick={() => {
          setError("");
          startTransition(async () => {
            updateOptimistic("like");
            try {
              await toggleLike(snippetId);
            } catch {
              setError("Sign in to like snippets.");
            }
          });
        }}
      >
        <Heart className={cn("size-4", optimistic.liked && "fill-zinc-950")} />
        {optimistic.likeCount}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-2 rounded-full", optimistic.bookmarked && "text-zinc-950")}
        onClick={() => {
          setError("");
          startTransition(async () => {
            updateOptimistic("bookmark");
            try {
              await toggleBookmark(snippetId);
            } catch {
              setError("Sign in to save snippets.");
            }
          });
        }}
      >
        <Bookmark className={cn("size-4", optimistic.bookmarked && "fill-zinc-950")} />
        {optimistic.bookmarkCount}
      </Button>
      {error ? <p className="text-xs text-zinc-500">{error}</p> : null}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/snippets/snippet-card.tsx`**

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SocialActions } from "@/components/snippets/social-actions";
import { type SnippetFeedItem } from "@/lib/snippets";

function displayName(snippet: SnippetFeedItem) {
  return snippet.author.name ?? snippet.author.email ?? "Developer";
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function SnippetCard({ snippet }: { snippet: SnippetFeedItem }) {
  const name = displayName(snippet);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={snippet.author.image ?? undefined} alt={name} />
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">{snippet.title}</h2>
            <Badge variant="outline" className="rounded-full border-zinc-300">
              {snippet.language}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500">by {name}</p>
        </div>
      </header>
      {snippet.caption ? <p className="mt-4 text-sm leading-6 text-zinc-700">{snippet.caption}</p> : null}
      <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm leading-6 text-zinc-50">
        <code>{snippet.code}</code>
      </pre>
      <footer className="mt-4 border-t border-zinc-100 pt-3">
        <SocialActions
          snippetId={snippet.id}
          liked={snippet.likedByViewer}
          bookmarked={snippet.bookmarkedByViewer}
          likeCount={snippet._count.likes}
          bookmarkCount={snippet._count.bookmarks}
        />
      </footer>
    </article>
  );
}
```

- [ ] **Step 3: Create `components/snippets/snippet-list-empty.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SnippetListEmpty({ query }: { query?: string }) {
  return (
    <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {query ? "No snippets match your search" : "No snippets yet"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
        {query
          ? "Try a different title, language, or author."
          : "Start the feed with a useful code snippet for other developers."}
      </p>
      <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
        <Link href="/snippets/new">Create snippet</Link>
      </Button>
    </section>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { SnippetListEmpty } from "@/components/snippets/snippet-list-empty";
import { getFeedSnippets } from "@/lib/snippets";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function readQuery(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = readQuery(params.q);
  const session = await auth();
  const snippets = await getFeedSnippets({
    query,
    viewerId: session?.user?.id,
  });

  return (
    <AppShell session={session} query={query}>
      <section className="mb-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Public feed</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
          Code snippets from developers
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Share concise snippets with a title, caption, language, and readable code block.
        </p>
      </section>
      <div className="space-y-5">
        {snippets.length > 0 ? (
          snippets.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} />)
        ) : (
          <SnippetListEmpty query={query} />
        )}
      </div>
    </AppShell>
  );
}
```

- [ ] **Step 5: Run tests and lint**

Run:

```powershell
npm run test
npm run lint
```

Expected: PASS for both commands.

- [ ] **Step 6: Commit**

```powershell
git add app/page.tsx components/snippets/snippet-card.tsx components/snippets/social-actions.tsx components/snippets/snippet-list-empty.tsx
git commit -m "feat: add public snippet feed"
```

## Task 8: Snippet Create And Edit Forms

**Files:**
- Create: `components/snippets/snippet-form.tsx`
- Create: `app/snippets/new/page.tsx`
- Create: `app/snippets/[id]/edit/page.tsx`

- [ ] **Step 1: Create `components/snippets/snippet-form.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { LANGUAGE_OPTIONS, type SnippetFormState } from "@/lib/snippet-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SnippetFormProps = {
  action: (state: SnippetFormState, formData: FormData) => Promise<SnippetFormState>;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    caption?: string | null;
    language?: string;
    code?: string;
  };
};

const initialState: SnippetFormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-zinc-500">{messages[0]}</p>;
}

export function SnippetForm({ action, submitLabel, defaultValues }: SnippetFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values ?? defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={values.title ?? ""} required minLength={3} maxLength={80} />
        <FieldError messages={state.errors?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea id="caption" name="caption" defaultValue={values.caption ?? ""} maxLength={280} rows={3} />
        <FieldError messages={state.errors?.caption} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select name="language" defaultValue={values.language ?? "TypeScript"}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError messages={state.errors?.language} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          name="code"
          defaultValue={values.code ?? ""}
          required
          rows={16}
          className="font-mono text-sm"
        />
        <FieldError messages={state.errors?.code} />
      </div>
      {state.message ? <p className="text-sm text-zinc-500">{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="bg-zinc-950 text-white hover:bg-zinc-800">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Add missing shadcn label if needed**

If `components/ui/label.tsx` does not exist, run:

```powershell
cmd.exe /c npx.cmd shadcn@latest add label
```

Expected: `components/ui/label.tsx` exists.

- [ ] **Step 3: Create `app/snippets/new/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createSnippet } from "@/app/actions/snippets";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetForm } from "@/components/snippets/snippet-form";

export const dynamic = "force-dynamic";

export default async function NewSnippetPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">New snippet</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Create a code post</h1>
      </div>
      <SnippetForm action={createSnippet} submitLabel="Publish snippet" />
    </AppShell>
  );
}
```

- [ ] **Step 4: Create `app/snippets/[id]/edit/page.tsx`**

```tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateSnippet } from "@/app/actions/snippets";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetForm } from "@/components/snippets/snippet-form";
import { getSnippetForEdit } from "@/lib/snippets";

export const dynamic = "force-dynamic";

type EditSnippetPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { id } = await params;
  const snippet = await getSnippetForEdit(id, session.user.id);

  if (!snippet) {
    notFound();
  }

  const action = updateSnippet.bind(null, snippet.id);

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">Edit snippet</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{snippet.title}</h1>
      </div>
      <SnippetForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          title: snippet.title,
          caption: snippet.caption,
          language: snippet.language,
          code: snippet.code,
        }}
      />
    </AppShell>
  );
}
```

- [ ] **Step 5: Run tests and lint**

Run:

```powershell
npm run test
npm run lint
```

Expected: PASS for both commands.

- [ ] **Step 6: Commit**

```powershell
git add components/snippets/snippet-form.tsx components/ui/label.tsx app/snippets
git commit -m "feat: add snippet create and edit forms"
```

## Task 9: Dashboard And Bookmarks

**Files:**
- Create: `components/dashboard/dashboard-stats.tsx`
- Create: `components/dashboard/snippet-management-list.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/bookmarks/page.tsx`

- [ ] **Step 1: Create `components/dashboard/dashboard-stats.tsx`**

```tsx
export function DashboardStats({
  stats,
}: {
  stats: {
    snippetCount: number;
    likesReceived: number;
    bookmarksReceived: number;
  };
}) {
  const items = [
    { label: "Snippets", value: stats.snippetCount },
    { label: "Likes", value: stats.likesReceived },
    { label: "Bookmarks", value: stats.bookmarksReceived },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Create `components/dashboard/snippet-management-list.tsx`**

```tsx
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteSnippet } from "@/app/actions/snippets";
import { Button } from "@/components/ui/button";

type DashboardSnippet = {
  id: string;
  title: string;
  language: string;
  createdAt: Date;
  _count: {
    likes: number;
    bookmarks: number;
  };
};

export function SnippetManagementList({ snippets }: { snippets: DashboardSnippet[] }) {
  if (snippets.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">No snippets yet</h2>
        <p className="mt-3 text-sm text-zinc-600">Create your first public code snippet.</p>
        <Button asChild className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/snippets/new">Create snippet</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {snippets.map((snippet) => (
        <div key={snippet.id} className="flex flex-col gap-4 border-b border-zinc-100 p-5 last:border-b-0 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-500">{snippet.language}</p>
            <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-950">{snippet.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {snippet._count.likes} likes / {snippet._count.bookmarks} bookmarks
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/snippets/${snippet.id}/edit`}>Edit</Link>
            </Button>
            <form action={deleteSnippet.bind(null, snippet.id)}>
              <Button type="submit" variant="outline" className="gap-2 text-zinc-700">
                <Trash2 className="size-4" />
                Delete
              </Button>
            </form>
          </div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Create `app/dashboard/page.tsx`**

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SnippetManagementList } from "@/components/dashboard/snippet-management-list";
import { getDashboardData } from "@/lib/snippets";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <AppShell session={session}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Your snippets</h1>
        </div>
        <Button asChild className="bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/snippets/new">New snippet</Link>
        </Button>
      </div>
      <div className="space-y-5">
        <DashboardStats stats={data.stats} />
        <SnippetManagementList snippets={data.snippets} />
      </div>
    </AppShell>
  );
}
```

- [ ] **Step 4: Create `app/bookmarks/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { SnippetListEmpty } from "@/components/snippets/snippet-list-empty";
import { getBookmarkedSnippets } from "@/lib/snippets";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const snippets = await getBookmarkedSnippets(session.user.id);

  return (
    <AppShell session={session}>
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500">Bookmarks</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Saved snippets</h1>
      </div>
      <div className="space-y-5">
        {snippets.length > 0 ? (
          snippets.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} />)
        ) : (
          <SnippetListEmpty />
        )}
      </div>
    </AppShell>
  );
}
```

- [ ] **Step 5: Run tests and lint**

Run:

```powershell
npm run test
npm run lint
```

Expected: PASS for both commands.

- [ ] **Step 6: Commit**

```powershell
git add components/dashboard app/dashboard app/bookmarks
git commit -m "feat: add dashboard and bookmarks"
```

## Task 10: Setup Docs, Build Verification, And Browser Smoke Test

**Files:**
- Modify: `README.md`
- Modify: any files required by lint, type, or build failures from the verification commands.

- [ ] **Step 1: Update `README.md`**

Use this content:

```md
# DevSnip

DevSnip is a small social web app for developers to share public code snippets. It uses Next.js, Tailwind CSS, shadcn/ui, NextAuth, Prisma, and Supabase Postgres.

## Features

- Public snippet feed
- GitHub OAuth sign-in
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
```

- [ ] **Step 2: Run full automated verification**

Run:

```powershell
npm run test
npm run lint
npm run build
```

Expected: PASS for all commands. If `npm run build` needs `DATABASE_URL`, use a real local `.env.local` value from Supabase and rerun. Do not commit `.env.local`.

- [ ] **Step 3: Start the dev server**

Run:

```powershell
Start-Process -WindowStyle Hidden -FilePath cmd.exe -ArgumentList '/c','npm.cmd run dev'
```

Expected: the app is available at `http://localhost:3000`.

- [ ] **Step 4: Browser smoke test**

Open `http://localhost:3000` and verify:

- Feed renders without the old Create Next App content.
- Header, sidebar, central feed, and right panel use the black-and-white theme.
- Search input is visible and keeps the query in the URL.
- Sign in button links into the GitHub OAuth flow.
- `/signin` renders the branded sign-in page.
- `/dashboard` redirects unauthenticated users to `/signin`.
- `/snippets/new` redirects unauthenticated users to `/signin`.
- At mobile width, the layout is single-column and code blocks scroll without breaking the page.

- [ ] **Step 5: Commit**

```powershell
git add README.md
git commit -m "docs: add devsnip setup instructions"
```

## Final Verification Checklist

- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes with environment variables configured.
- [ ] Browser smoke test passes at desktop width.
- [ ] Browser smoke test passes at mobile width.
- [ ] `git status --short` is clean except for user-owned local environment files.
