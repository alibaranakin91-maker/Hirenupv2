# AGENTS.md

## Cursor Cloud specific instructions

### Overview
Hirenup is a single Next.js 14 application (App Router) with Prisma ORM and PostgreSQL. There is no separate backend service — API routes serve as the backend. All standard dev commands are in `package.json` scripts.

### Running the application
- **Dev server**: `npm run dev` (port 3000)
- **Lint**: `npm run lint`
- **Build**: `npm run build` (runs `prisma generate` first via script)
- **DB schema sync**: `npm run db:push`
- **DB visual browser**: `npm run db:studio` (port 5555)

### PostgreSQL
PostgreSQL must be running before starting the dev server. Start it with:
```
sudo pg_ctlcluster 16 main start
```
The local database is `hirenup` on `localhost:5432` with user `postgres` / password `postgres`. The `.env` file has `DATABASE_URL` pointing to this local instance.

### Environment variables
The `.env` file must contain at minimum:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — any base64 secret for NextAuth session encryption
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

Google/Facebook OAuth credentials are optional; the app runs without them but OAuth login buttons won't work.

### ESLint
The `.eslintrc.json` uses `next/core-web-vitals`. Pre-existing lint errors exist (unescaped entities in JSX) — these are not regressions.

### Authentication
The app uses NextAuth.js with database sessions. Sign-in/sign-up pages only show OAuth buttons (Google/Facebook). A `CredentialsProvider` exists in `lib/auth.ts` for email/password login but has no dedicated UI form. To test authenticated flows without OAuth, create a user directly via Prisma and use the credentials API endpoint.

### Session strategy caveat
The auth config uses `strategy: "database"` which has a known limitation with `CredentialsProvider` — sessions may not auto-persist. For full end-to-end auth testing, OAuth credentials are recommended.
