# DevSnip Setup

## Supabase Postgres

1. Create a Supabase project.
2. In Supabase SQL Editor, create a privileged Prisma migration role and a less privileged app runtime role:

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

create user "devsnip_app" with password 'replace_with_a_runtime_password';
grant usage on schema public to devsnip_app;
grant select, insert, update, delete on all tables in schema public to devsnip_app;
grant usage, select on all sequences in schema public to devsnip_app;
alter default privileges for role prisma in schema public grant select, insert, update, delete on tables to devsnip_app;
alter default privileges for role prisma in schema public grant usage, select on sequences to devsnip_app;
```

3. Copy the Supavisor pooler connection string for `devsnip_app` into `DATABASE_URL`. For Vercel/serverless production, prefer the transaction pooler URL when Supabase provides it.
4. Copy the Supavisor session pooler connection string for `prisma` into `MIGRATE_DATABASE_URL`.
5. Run `npm run prisma:migrate -- --name init` to create tables.
6. Run `npm run prisma:generate` after schema changes.

For quick local MVP work, `DATABASE_URL` and `MIGRATE_DATABASE_URL` can point to the same Prisma role. For production, keep them separate so the app runtime does not use a `createdb`/`bypassrls` migration role.

## Production on Vercel

Set `DATABASE_POOL_MAX=1` in Vercel to keep each serverless runtime from opening too many Supabase connections. This is especially important if `DATABASE_URL` uses Supavisor session mode, where Supabase can reject requests with `EMAXCONNSESSION max clients reached`.

After adding a new migration, deploy it to the production database before or during the Vercel rollout:

```bash
npm run prisma:migrate:deploy
```

For email/password sign-in, confirm the production database has the latest migration that adds `User.password_hash`. For GitHub OAuth, also confirm the production app has `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, and a GitHub callback URL matching `https://your-domain/api/auth/callback/github`.

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

Prisma commands load both `.env` and `.env.local`; `.env.local` wins when both files define the same variable. `npm run build` also runs `prisma generate` first so a clean checkout has the generated client before Next.js compiles.
