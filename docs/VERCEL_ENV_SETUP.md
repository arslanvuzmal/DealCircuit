# Vercel Environment Configuration Guide — LeadPilot AI

This document reflects the actual configuration of the live `leadpilot-ai` project (team
`arslan-vuzmal-lone`) as of the PostgreSQL migration fix. Node version and URLs below were corrected
after inspecting the real Vercel build logs — see `VERCEL_DEPLOYMENT_FIX.md` for why.

## 1. Vercel Project Settings

1. Open the Vercel Dashboard at [https://vercel.com](https://vercel.com).
2. Select the project **`leadpilot-ai`** under team **`arslan-vuzmal-lone`**.
3. **Settings → General → Node.js Version**: `24.x`. (Not 20.x — Vercel's platform now rejects
   20.x with "deployments created on or after 2026-10-01 will fail to build." Also ensure
   `package.json`'s `engines.node` is `"24.x"`, since that field overrides the dashboard setting.)
4. **Build Command**: leave on the default / zero-config. Vercel auto-detects and runs the
   `vercel-build` npm script (`prisma generate && prisma migrate deploy && next build`) because a
   script with that exact name exists in `package.json` — no manual override needed. Confirmed
   directly in a real build log (`Running "npm run vercel-build"`).
5. **Install Command**: `npm ci` (uses the committed lockfile; default for a project with
   `package-lock.json`, no override needed).

## 2. Environment Variables

Configure these for **Production**, **Preview**, and **Development** (all three — the app is meant
to run in demo mode everywhere until real AI/CRM credentials are added):

| Variable | Status | Value |
|---|---|---|
| `DATABASE_URL` | **Still required — not yet set** | Supabase Transaction Pooler URL (port `6543`, `?pgbouncer=true`) |
| `DIRECT_URL` | **Still required — not yet set** | Supabase Direct Connection URL (port `5432`) |
| `JWT_SECRET` | Set (32-byte random hex, generated for this deployment) | — |
| `INTERNAL_API_SECRET` | Set (32-byte random hex, generated for this deployment) | — |
| `DEMO_MODE` | Set | `true` |
| `NEXT_PUBLIC_DEMO_MODE` | Set | `true` |
| `DEMO_CRM_ENABLED` | Set | `true` |
| `ALLOW_PRODUCTION_SEED` | Set | `false` (flip to `true` only for a one-off manual seed run, then back to `false`) |
| `APP_URL` | Set | `https://leadpilot-ai-arslan-vuzmal-lone.vercel.app` (Production/Preview), `http://localhost:3000` (Development) |
| `NEXT_PUBLIC_APP_URL` | Set | same as `APP_URL` per environment |

`DATABASE_URL` and `DIRECT_URL` are the only two variables left to configure — see
`SUPABASE_SETUP.md` for exactly where to find them once a Supabase project exists.

> ⚠️ Never commit actual database passwords, JWT secrets, or API keys to GitHub. The values above
> were set directly via the Vercel CLI/dashboard, never written to a file in this repository.
