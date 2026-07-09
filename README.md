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

   The web app calls the API at `/api`. When running the two servers separately
   off Replit, point the web app's API base at the API server's URL (or run them
   behind a shared reverse proxy so `/api` resolves to the API server).

## Regenerating the API client

The typed client and Zod validators are generated from `lib/api-spec/openapi.yaml`.
After editing the spec, regenerate them:

```bash
pnpm --filter @workspace/api-spec run codegen
```

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
