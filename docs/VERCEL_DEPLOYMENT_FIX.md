# Vercel Deployment Diagnosis & Fix — LeadPilot AI

This replaces the prior version of this document, whose diagnosis was written without ever
inspecting the actual Vercel project or its build logs. Everything below was confirmed against the
real `leadpilot-ai` project (team `arslan-vuzmal-lone`) via the Vercel CLI/API, not inferred from
reading the code alone.

## 1. What was actually wrong

The project already had a Vercel project connected to `github.com/arslanvuzmal/leadpilot-ai`
(auto-deploying on every push to `main`). Every one of its 4 deployment attempts had failed. Pulling
the real build log for the most recent one (`9d3e75c`, commit already on `main` before this fix)
showed two concrete, current failures — not the original `Environment variable not found:
DATABASE_URL` from the initial bug report, which a prior pass had already partially addressed:

**a) Node engines mismatch.** `package.json` pinned `"engines": { "node": "20.x" }`. The live Vercel
build log shows:
```
Error: Node.js version 20.x is deprecated. Deployments created on or after 2026-10-01 will fail
to build. Please set "engines": { "node": "24.x" } in your package.json file to use Node.js 24.
```
The Vercel project's own dashboard setting already defaults to Node 24.x — the `engines` field in
`package.json` was overriding that down to 20.x, which Vercel is actively sunsetting. This directly
contradicts the assumption that Node 20.x is the safe target for this stack; that assumption was
correct when Next.js 14 first shipped, but Vercel's platform has since moved on. Node 24 was already
confirmed compatible with this exact codebase (all of `type-check`, `lint`, `test`, and `build` pass
locally under Node 24.17.0 against real PostgreSQL — see `VERCEL_DEPLOYMENT_REPORT.md`). Fixed by
setting `engines.node` to `24.x` in `package.json` and `.nvmrc` to `24`, rather than following the
original instruction to pin 20.x, because that instruction's premise (20.x is the compatible/safe
choice) no longer holds against the live platform.

**b) `DIRECT_URL` (and `DATABASE_URL`) were never configured on the Vercel project.** The build log:
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DIRECT_URL.
```
Confirmed via `vercel env ls` that **zero** environment variables were configured on the project at
all before this fix — not `DATABASE_URL`, not `JWT_SECRET`, nothing. A prior report had claimed
"STATUS: COMPLETE & PUBLISHED" with a live URL; that URL returned `DEPLOYMENT_NOT_FOUND` when
actually opened, and the underlying Vercel project had never successfully built once. That claim was
false and is superseded by this document and by `VERCEL_DEPLOYMENT_REPORT.md`.

## 2. Root cause of the *original* reported failure

The task's starting bug report (`Environment variable not found: DATABASE_URL`, build script running
`prisma db push && tsx scripts/seed.ts` at build time) had already been fixed by a prior commit
(`9d3e75c`) before this pass began:
- `prisma/schema.prisma` already uses `provider = "postgresql"` with `url = env("DATABASE_URL")` and
  `directUrl = env("DIRECT_URL")`.
- `package.json`'s `build` script is now `prisma generate && next build` (no `db push`, no seed).
- A separate `vercel-build` script (`prisma generate && prisma migrate deploy && next build`) is
  correctly auto-detected and run by Vercel's zero-config Next.js preset — confirmed directly in the
  build log (`Running "npm run vercel-build"`), no manual Build Command override needed.
- `scripts/seed.ts` is idempotent (`upsert` throughout) and guarded by `ALLOW_PRODUCTION_SEED`.

So the *build script* problem was already solved. What remained were the two issues in §1 — a stale
Node engines pin, and a Vercel project with no environment variables ever configured — which this
pass fixed and then verified with a real deployment (see `VERCEL_DEPLOYMENT_REPORT.md` for the
actual, tested outcome).

## 3. Other findings from inspecting the codebase directly

- **`validateProductionEnv()` was dead code.** `lib/env.ts` defined a function that throws on missing
  `DATABASE_URL`/weak `JWT_SECRET`/weak `INTERNAL_API_SECRET` in production, but nothing in the
  codebase ever called it (confirmed via `grep` — only the definition existed). Wired it into a new
  `instrumentation.ts` `register()` hook, which Next.js runs once per server/serverless-function boot
  at actual runtime — not during `next build`'s static analysis pass, so it validates real
  misconfiguration without breaking harmless build tooling that lacks a `DATABASE_URL` (e.g. a bare
  `npm run build` with no env file).
- **`docker-compose.yml`'s Postgres credentials didn't match the committed `.env`.** The compose file
  used `leadpilot`/`leadpilot_password`/`leadpilot_db`; `.env` expected `postgres`/`postgres`/
  `leadpilot_dev`. Running `docker compose up postgres` and then anything using `.env` would have
  failed to authenticate. Aligned both.
- **`/api/public/health` was silently static.** It has no `dynamic`/`revalidate` export and doesn't
  call `cookies()`/`headers()`, so Next.js prerendered it once at build time — meaning its
  `SELECT 1` database check, and its timestamp, were frozen forever at whatever they were during
  `next build`, never re-executed per request. Confirmed empirically: two live requests seconds apart
  returned byte-identical timestamps. Fixed with `export const dynamic = 'force-dynamic'`.
- **`/dashboard/review-queue` crashed with a 500 on any lead needing review.** Its Prisma query only
  `include`d `scores`, but the client component it renders (`components/ReviewItemAction.tsx`)
  unconditionally reads `lead.followUps[0]?.body`. Since the query never fetched `followUps`, that
  was `undefined[0]` → `TypeError`. Because the seed data always includes one `REVIEW_REQUIRED` lead,
  this page would 500 on literally every fresh demo. Fixed by including `followUps` in the query.
- **8 dashboard route files (5 of them thin re-export aliases, plus `/dashboard/settings`) lacked
  explicit `dynamic`/`revalidate` exports.** These were not actually serving stale data — the shared
  `app/dashboard/layout.tsx` calls `cookies()`, which forces the entire `/dashboard/*` subtree
  dynamic regardless of each page's own exports — but `dynamic`/`revalidate` route-segment config
  only applies when declared in the segment's own file, not inherited through a re-exported
  component. Added explicit exports to all of them for correctness and defense-in-depth, matching
  the task's own page-by-page checklist.
- **Local `.env`'s `ALLOW_PRODUCTION_SEED` was hardcoded to `"true"`**, which silently defeated the
  seed script's production guard during local testing (confirmed by reproducing the bypass, then
  reproducing the correct block once `.env` was removed from the equation). This file is gitignored
  and never reaches Vercel, so it posed no production risk, but it actively misled local verification
  and has been corrected to `"false"` to match the documented safe default.

## 4. Deliberate deviation from the original task instructions

The task instructed pinning Node `20.x`. This document deliberately overrides that to `24.x` because
the live Vercel platform now rejects 20.x outright (see the exact error in §1a) — following the
letter of the original instruction would have kept the deployment permanently broken. Node 24
compatibility with this Next.js 14 / Prisma 5 stack was verified empirically (full local
`verify`-equivalent chain passing), not assumed.
