# DevSnip MVP Design

## Summary

DevSnip is a small social web app for developers to share public code snippets. The MVP uses a black-and-white social feed layout inspired by the provided reference: a left navigation rail, central snippet feed, and right-side context panel on desktop, with a simplified single-column experience on mobile.

The first release is a full working MVP, not a mock-only prototype. It includes GitHub login through NextAuth, Supabase Postgres persistence, snippet CRUD in a user dashboard, and lightweight social actions through likes and bookmarks.

## Goals

- Let visitors browse a public feed of developer snippets.
- Let authenticated users create, edit, and delete their own snippets.
- Let authenticated users like and bookmark snippets.
- Let users find snippets with a basic feed search.
- Provide a useful dashboard for managing personal snippets.
- Keep the UI restrained, readable, and developer-focused with a monochrome visual system.

## Non-Goals

- Private snippets, drafts, or unlisted sharing.
- Comments or threaded discussions.
- Realtime feed updates.
- Advanced search, tags, rich syntax highlighting themes, or collaborative editing.
- Multi-provider authentication beyond GitHub OAuth.

## Architecture

The app will use Next.js App Router as a full-stack application. Server components will render the primary feed and dashboard data. Client components will handle interactive controls such as forms, like buttons, bookmark buttons, and destructive-action confirmations.

Server actions will own mutations:

- Create, update, and delete snippets.
- Toggle likes.
- Toggle bookmarks.

NextAuth will provide GitHub OAuth login and session handling. Supabase Postgres will be the source of truth for users, snippets, likes, and bookmarks. The MVP will not use Supabase realtime; the schema should still be straightforward to extend later.

Core routes:

- `/` for the public snippet feed.
- `/bookmarks` for the authenticated user's bookmarked snippets.
- `/dashboard` for the authenticated user's snippets and management actions.
- `/snippets/new` for creating a snippet.
- `/snippets/[id]/edit` for editing a snippet owned by the current user.
- NextAuth API route for GitHub login, callback, and logout.

## UI Design

The visual language is black-and-white, calm, and app-like. The layout should feel like a developer social workspace rather than a marketing landing page.

Desktop layout:

- Top bar with the DevSnip brand, search field, and account controls.
- Left sidebar with Feed, Dashboard, New Snippet, and Bookmarks navigation.
- Main column with a compact composer entry point and snippet cards.
- Right panel with user summary, bookmarked snippets, and recent language activity.

Mobile layout:

- Header with brand and account control.
- Single-column feed optimized for code readability.
- Compact navigation access for feed, dashboard, and new snippet.
- Right-panel information moves below the feed or is hidden when it would crowd the code.

Snippet cards show:

- Author identity from GitHub profile data.
- Title.
- Caption.
- Language label.
- Code block.
- Like and bookmark actions with counts or active state.

Code blocks use a readable monospace presentation in the MVP. Full syntax highlighting can be added later, but the first pass should prioritize spacing, wrapping, overflow behavior, and contrast.

Dashboard surfaces:

- Total snippets.
- Total likes received.
- Total bookmarks received.
- Snippet list with edit and delete actions.
- Clear entry point to create a new snippet.

Search behavior:

- The top search field filters the feed with a basic query against snippet title, caption, language, and author name.
- Search is expressed in the URL query string so results can be refreshed and shared.
- Empty search returns the latest public snippets.

## Data Model

The MVP stores all application data in Supabase Postgres.

`users`

- `id`
- `name`
- `email`
- `image`
- `github_username`
- `created_at`
- `updated_at`

NextAuth tables:

- `accounts`
- `sessions`
- `verification_tokens`

`snippets`

- `id`
- `author_id`
- `title`
- `caption`
- `language`
- `code`
- `created_at`
- `updated_at`

`likes`

- `id`
- `user_id`
- `snippet_id`
- `created_at`
- Unique constraint on `user_id` and `snippet_id`.

`bookmarks`

- `id`
- `user_id`
- `snippet_id`
- `created_at`
- Unique constraint on `user_id` and `snippet_id`.

All snippets are public in the MVP. Authorization is enforced in server actions, not only in the UI.

## Authentication And Authorization

GitHub OAuth is the only authentication provider in the MVP. A visitor can view the public feed without logging in. Creating snippets, liking, bookmarking, and accessing the dashboard require an authenticated session.

Authorization rules:

- Only the snippet author can edit a snippet.
- Only the snippet author can delete a snippet.
- Any authenticated user can like or bookmark any public snippet.
- Duplicate likes and bookmarks are prevented by database constraints and toggle logic.

Unauthenticated attempts to perform protected actions redirect to sign in.

## Validation

Snippet input validation:

- `title` is required and should be 3 to 80 characters.
- `caption` is optional and should stay short enough for feed display.
- `language` is required and chosen from a fixed MVP list: TypeScript, JavaScript, Python, Go, SQL, Bash, and Other.
- `code` is required and size-limited to keep feed rendering responsive.

All validation runs on the server. Client-side validation may improve feedback, but it is not trusted as the security boundary.

## Error Handling

Expected error states should be clear and close to the action that caused them.

- Invalid form input returns field-level messages.
- Missing snippets render a not-found state.
- Unauthorized edits and deletes are blocked server-side and render a forbidden or not-found response.
- Failed social actions keep the current UI stable and show a small error message or toast.
- Database constraint conflicts are handled as idempotent toggle outcomes where possible.

## Testing And Verification

The implementation should be verified with:

- `npm run lint`
- `npm run build`
- Browser smoke checks for the feed, dashboard, create form, edit form, and responsive layout.

When the app needs a dev server for browser verification, start the local dev server and provide the local URL.

## Environment Setup

The repo should include `.env.example` with:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

The implementation should include short setup notes for creating a Supabase database and GitHub OAuth app.

## Delivery Scope

The first implementation pass should deliver a complete local MVP that can build successfully, connect to Supabase when environment variables are configured, and show a polished monochrome interface. It should avoid realtime, comments, and advanced discovery features until the core feed and dashboard are stable.
