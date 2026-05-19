# DevSnip MVP Product Requirements Document

## Overview

DevSnip is a small social web app for developers to share useful public code snippets. The MVP gives visitors a readable public feed and gives signed-in developers the ability to publish, manage, like, and bookmark snippets.

The product should feel like a focused developer workspace rather than a marketing site. The first release prioritizes a complete, reliable core loop over broad discovery features.

## Problem Statement

Developers often save or share small code examples across notes, chats, gists, and bookmarks. These snippets are useful, but they become hard to browse, search, and revisit in one shared place.

DevSnip solves the first version of that problem by creating a lightweight public snippet feed with authenticated posting and personal management tools.

## Target Users

### Primary Users

- Developers who want to share short, reusable code examples.
- Developers who want to browse practical snippets from others.
- Developers who want to bookmark useful snippets for later reference.

### Secondary Users

- Learners looking for concise examples in common languages.
- Small teams or communities that want a simple shared snippet board.

## Goals

- Let visitors browse a public feed of developer snippets.
- Let authenticated users create, edit, and delete their own snippets.
- Let authenticated users like and bookmark snippets.
- Let authenticated users view and manage their own snippets from a dashboard.
- Let users search the public feed by title, caption, language, or author name.
- Deliver a polished monochrome, responsive UI suitable for code reading.

## Non-Goals

- Private snippets, drafts, or unlisted snippets.
- Comments, replies, or discussion threads.
- Realtime feed updates.
- Advanced search, ranking, recommendations, or tag-based discovery.
- Rich syntax highlighting themes.
- Collaborative editing.
- Authentication providers beyond GitHub.
- Paid plans, billing, organizations, or team permissions.

## MVP Scope

The MVP includes:

- Public snippet feed at `/`.
- GitHub OAuth sign-in.
- Sign-in page at `/signin`.
- Snippet creation at `/snippets/new`.
- Snippet editing at `/snippets/[id]/edit`.
- Authenticated dashboard at `/dashboard`.
- Authenticated bookmarks page at `/bookmarks`.
- Like and bookmark toggles for authenticated users.
- Basic URL-backed feed search through the `q` query parameter.
- Responsive app shell with top bar, sidebar, central content, and right panel on desktop.
- Single-column responsive experience on smaller screens.

## User Stories

- As a visitor, I want to browse recent public snippets so I can find useful code without signing in.
- As a visitor, I want to search snippets so I can narrow the feed by topic, language, author, or description.
- As a visitor, I want to sign in with GitHub so I can publish and save snippets without creating a separate account.
- As an authenticated user, I want to create a snippet with a title, caption, language, and code block so I can share a reusable example.
- As an authenticated user, I want to edit my own snippets so I can correct or improve them after publishing.
- As an authenticated user, I want to delete my own snippets so I can remove outdated or unwanted content.
- As an authenticated user, I want to like snippets so I can signal that a snippet is useful.
- As an authenticated user, I want to bookmark snippets so I can find them later.
- As an authenticated user, I want a dashboard so I can manage my snippets and see basic engagement counts.

## Functional Requirements

### Public Feed

- The home page must show the latest public snippets.
- Feed results must be ordered newest first.
- Feed results must include the snippet title, optional caption, language, code block, author identity, like count, bookmark count, and viewer social state when available.
- The feed must support a basic text search.
- Empty feed and empty search states must be clear and actionable.

### Search

- Search must read from and write to the `q` URL query parameter.
- Search must match snippet title, caption, language, and author name.
- Empty search must return the latest public snippets.
- Search input should remain visible in the main app chrome.

### Authentication

- GitHub OAuth is the only supported sign-in method for the MVP.
- Visitors may browse the public feed without signing in.
- Creating snippets, editing snippets, deleting snippets, liking, bookmarking, viewing bookmarks, and viewing the dashboard require authentication.
- Unauthenticated users who try protected actions must be redirected to sign in.

### Snippet Creation

- Authenticated users must be able to create a public snippet.
- Required fields: title, language, code.
- Optional field: caption.
- Successful creation must persist the snippet and redirect the user to the dashboard.
- Invalid input must return clear validation feedback without creating a snippet.

### Snippet Editing

- Authenticated users must be able to edit only snippets they authored.
- Edit forms must load the current snippet values.
- Successful updates must persist changes and return the user to the dashboard.
- Unauthorized edit attempts must not expose or mutate another user's snippet.

### Snippet Deletion

- Authenticated users must be able to delete only snippets they authored.
- Deleting a snippet must remove associated likes and bookmarks through relational cleanup.
- Unauthorized delete attempts must not mutate data.

### Likes

- Authenticated users must be able to toggle a like on a public snippet.
- A user may have at most one like per snippet.
- Like counts must update after the mutation completes.

### Bookmarks

- Authenticated users must be able to toggle a bookmark on a public snippet.
- A user may have at most one bookmark per snippet.
- The bookmarks page must show snippets bookmarked by the current user.

### Dashboard

- The dashboard must show the current user's snippets.
- The dashboard must show total snippets, likes received, and bookmarks received.
- Each snippet in the dashboard must provide edit and delete actions.
- Empty dashboard state must provide a clear path to create a snippet.

## UX Requirements

- The UI must be calm, monochrome, and developer-focused.
- Code blocks must be readable and horizontally scrollable when needed.
- Navigation must make Feed, Dashboard, New Snippet, and Bookmarks easy to access.
- Desktop layout should use a three-column app shell when space allows.
- Mobile layout should prioritize the feed and forms in a single column.
- Cards and panels should use restrained styling with compact spacing.
- Loading, empty, invalid, unauthorized, and missing-content states should avoid dead ends.

## Data And Content Requirements

### User

Users are created through GitHub OAuth and store:

- ID.
- Name.
- Email.
- Image.
- GitHub username when available.
- Created and updated timestamps.

### Snippet

Snippets store:

- ID.
- Author ID.
- Title.
- Optional caption.
- Language.
- Code.
- Created and updated timestamps.

### Like

Likes store:

- ID.
- User ID.
- Snippet ID.
- Created timestamp.

Each user and snippet pair must be unique.

### Bookmark

Bookmarks store:

- ID.
- User ID.
- Snippet ID.
- Created timestamp.

Each user and snippet pair must be unique.

## Validation Requirements

- Title is required and must be 3 to 80 characters.
- Caption is optional and must be 280 characters or fewer.
- Language is required and must be one of: TypeScript, JavaScript, Python, Go, SQL, Bash, Other.
- Code is required and must be 12,000 characters or fewer.
- Server-side validation is required for every create and update mutation.
- Client-side validation may improve feedback but must not be the security boundary.

## Authorization Requirements

- Only snippet authors can edit their snippets.
- Only snippet authors can delete their snippets.
- Any authenticated user can like or bookmark any public snippet.
- Database uniqueness constraints must prevent duplicate likes and bookmarks.
- Server actions must enforce authorization independently of UI state.

## Success Metrics

The MVP is successful when:

- A new visitor can understand the product from the public feed without onboarding.
- A signed-in user can create, edit, delete, like, and bookmark snippets without errors.
- Feed search returns relevant results and preserves the query in the URL.
- The dashboard accurately reflects a user's snippets and engagement counts.
- The app passes automated verification for tests, linting, and production build.
- The core pages render acceptably on desktop and mobile.

Suggested product metrics after launch:

- Number of published snippets.
- Percentage of signed-in users who publish at least one snippet.
- Average bookmarks per snippet.
- Search usage rate.
- Return visits to bookmarked snippets.

## Risks And Constraints

- GitHub OAuth setup is required before a full local authentication flow can be tested.
- Supabase Postgres environment variables are required for persistence and production builds.
- The MVP has no moderation tools, so all snippets are public and trusted by default.
- Basic search may become insufficient as content grows.
- Lack of syntax highlighting keeps the MVP simpler but may reduce perceived polish for code-heavy users.

## Release Criteria

The MVP is ready to release when:

- Public feed renders real snippet data.
- GitHub sign-in works with configured OAuth credentials.
- Authenticated users can create, edit, and delete their own snippets.
- Like and bookmark toggles work and prevent duplicates.
- Dashboard and bookmarks pages are protected and functional.
- Search works through the URL query string.
- Empty and unauthenticated states are handled clearly.
- `npm run test` passes.
- `npm run lint` passes.
- `npm run build` passes with required environment variables configured.
- A desktop and mobile smoke test confirms the main flows render correctly.

## Open Product Decisions For Later

- Whether snippets should support tags.
- Whether snippets should support comments or reactions beyond likes.
- Whether snippets should support private or unlisted visibility.
- Whether search should become full-text search with ranking.
- Whether code blocks should use syntax highlighting.
- Whether users should have public profile pages.
