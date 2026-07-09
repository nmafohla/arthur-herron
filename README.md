# Arthur Herron Butchery

A full-stack e-commerce storefront for a premium butchery in Harare, Zimbabwe.
Customers browse products, build a cart, check out and pay via Pesepay, and can
create an account to view their purchase history and earn loyalty points
(10 points per $1 spent on confirmed orders). Includes an admin dashboard for
managing products and orders.

## Tech stack

- **Monorepo:** pnpm workspaces + TypeScript project references
- **Web app:** React + Vite + Tailwind CSS v4 + wouter (routing) + TanStack Query
- **API server:** Express 5 + Pino logging
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** Clerk (email/password + Google)
- **Payments:** Pesepay
- **API contract:** OpenAPI spec → generated typed client + Zod validators

## Repository layout

```
artifacts/
  arthur-herron/     # Customer-facing web app (React + Vite)
  api-server/        # Express REST API
  mockup-sandbox/    # Component preview sandbox (dev only)
lib/
  db/                # Drizzle schema + migrations
  api-spec/          # OpenAPI spec (source of truth)
  api-client-react/  # Generated typed API client + React Query hooks
  api-zod/           # Generated Zod request/response validators
```

## Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- A PostgreSQL database
- A [Clerk](https://dashboard.clerk.com) application (free tier is fine)
- A Pesepay merchant account (only needed to test real checkout)

## Getting started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env` and fill in the values (database URL, Clerk
   keys, admin password, Pesepay keys). See the comments in that file.

3. **Set up the database schema**
   ```bash
   pnpm --filter @workspace/db run push
   ```

4. **Run the apps** (in separate terminals)
   ```bash
   # API server
   pnpm --filter @workspace/api-server run dev

   # Web app
   pnpm --filter @workspace/arthur-herron run dev
   ```

   The web app calls the API using **relative `/api` URLs** (same origin), which
   keeps login cookies first-party. When the web app and API run as separate
   services (locally or in production), put them behind a shared origin so `/api`
   resolves to the API server — e.g. a dev proxy, or the `vercel.json` rewrite
   described in the migration section below. Do **not** expect a "web API base
   URL" env var — there isn't one by design.

## Regenerating the API client

The typed client and Zod validators are generated from `lib/api-spec/openapi.yaml`.
After editing the spec, regenerate them:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Migrating off Replit → Antigravity → Vercel

This project was built on Replit, which bundled several services together
(database, auth, object storage, hosting). When you move it elsewhere you have
to recreate those services yourself. This section explains **exactly what you
need to provision** and how to deploy.

### Step 1 — Get the code into your editor (Antigravity, VS Code, etc.)

```bash
git clone https://github.com/nmafohla/arthur-herron.git
cd arthur-herron
pnpm install
cp .env.example .env      # then fill in the values (see Step 2)
```

Run it locally to confirm everything works before deploying:

```bash
pnpm --filter @workspace/db run push          # create the DB schema
pnpm --filter @workspace/api-server run dev    # API  → http://localhost:8080
pnpm --filter @workspace/arthur-herron run dev # web  → http://localhost:5173
```

### Step 2 — Cloud services you need to create

On Replit these were provided for you. Off Replit you create your own:

| What | On Replit (now) | What to create off Replit | Env var(s) to set |
| --- | --- | --- | --- |
| **Database** | Replit-managed PostgreSQL | A new PostgreSQL DB — **[Neon](https://neon.tech)**, **[Supabase](https://supabase.com)**, or **[Vercel Postgres](https://vercel.com/storage/postgres)** (all have free tiers). Then run `pnpm --filter @workspace/db run push` to create the tables. | `DATABASE_URL` |
| **Auth (Clerk)** | Replit-managed Clerk (via a proxy) | Your **own free Clerk app** at [dashboard.clerk.com](https://dashboard.clerk.com). Enable Email + Google sign-in there. Leave the proxy var empty. | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` (same as publishable), `VITE_CLERK_PROXY_URL=` (empty) |
| **Object storage** (product/category images) | Replit App Storage | Only needed for **uploading new images** in the admin dashboard. Replace `artifacts/api-server/src/lib/objectStorage.ts` with a provider like **AWS S3**, **Cloudflare R2**, or **Vercel Blob**. The storefront works fine without it. | provider-specific |
| **Payments (Pesepay)** | Pesepay keys stored as Secrets | Same Pesepay merchant account — just set the keys as env vars. | `PESEPAY_INTEGRATION_KEY`, `PESEPAY_ENCRYPTION_KEY`, `PESEPAY_MODE` |
| **Admin login** | `ADMIN_PASSWORD` secret | Pick a password and set it as an env var. | `ADMIN_PASSWORD` |

### Step 3 — Understand the hosting shape

There are **two apps**: a static web app (Vite) and a long-running API server
(Express). Vercel is great for the static web app, but its serverless model is
not a natural fit for a long-running Express server. The simplest reliable setup:

- **Web app → Vercel** (static site)
- **API server → a Node host**: [Railway](https://railway.app),
  [Render](https://render.com), or [Fly.io](https://fly.io) (all have free/cheap tiers)

The web app calls the API using **relative `/api` URLs** (so login cookies stay
on the same origin). On Vercel we keep that working by **rewriting** `/api` to
your API host — that's already wired in `vercel.json`.

### Step 4 — Deploy the API server (do this first)

1. Create a new service on Railway/Render pointing at this GitHub repo.
2. Set the build command: `pnpm install && pnpm --filter @workspace/api-server run build`
3. Set the start command: `pnpm --filter @workspace/api-server run start`
4. Add the env vars: `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   `ADMIN_PASSWORD`, `PESEPAY_INTEGRATION_KEY`, `PESEPAY_ENCRYPTION_KEY`,
   `PESEPAY_MODE`.
5. Deploy, then copy the public URL (e.g. `https://arthur-herron-api.up.railway.app`).

### Step 5 — Deploy the web app to Vercel

1. Import this GitHub repo into Vercel.
2. Open **`vercel.json`** and replace `https://YOUR-API-HOST.example.com` with
   the API URL from Step 4.
3. In Vercel → **Settings → Environment Variables**, add:
   - `VITE_CLERK_PUBLISHABLE_KEY` — your Clerk publishable key
   - `BASE_PATH` — `/`
4. Deploy. Vercel runs the build command and rewrites in `vercel.json`
   automatically.
5. Finally, in the **Clerk dashboard** add your Vercel domain to the allowed
   origins so login works from the live site.

> **Tip:** keep the API host and the Vercel site on the same custom domain
> (e.g. `app.yourdomain.com` for the site, proxied `/api` to the API) so the
> Clerk session cookie is always first-party.

## Replit-specific parts (read before running elsewhere)

This project was built on Replit. Two things depend on Replit infrastructure and
need attention when moving to another environment:

1. **Clerk proxy** — On Replit, Clerk runs through a managed proxy
   (`VITE_CLERK_PROXY_URL`). Off Replit, leave `VITE_CLERK_PROXY_URL` **empty**
   and simply set `VITE_CLERK_PUBLISHABLE_KEY` / `CLERK_PUBLISHABLE_KEY` /
   `CLERK_SECRET_KEY` to your own Clerk app's keys — the app then talks to Clerk
   directly.

2. **Object storage** — Product-image uploads use Replit App Storage via
   `artifacts/api-server/src/lib/objectStorage.ts` and the
   `PRIVATE_OBJECT_DIR` / `PUBLIC_OBJECT_SEARCH_PATHS` variables. Off Replit you
   must swap that module for another provider (e.g. AWS S3, Cloudflare R2, or
   local disk). The rest of the app works without it — only image uploads in the
   admin dashboard are affected.

The `PORT`, `BASE_PATH`, and `REPL_ID` variables are Replit routing conveniences;
the servers fall back to sensible defaults when they are unset.

## Admin dashboard

Visit `/admin/login` and sign in with the value of `ADMIN_PASSWORD` to manage
products and orders.
