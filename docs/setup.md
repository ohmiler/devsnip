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
alter default privileges for role postgres in schema public grant all on all routines to prisma;
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
