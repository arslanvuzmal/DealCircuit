# Vercel Deployment Diagnosis & Fix Strategy - LeadPilot AI

## 1. Problem Statement & Observed Failure
During production deployment on Vercel, the build failed during `npm run build` with:
```
Environment variable not found: DATABASE_URL
```

### Key Contributing Factors
1. **Flawed Build Script Strategy**:
   The `build` script in `package.json` was executing `prisma db push` and `tsx scripts/seed.ts` during Next.js static compilation. On Vercel, `DATABASE_URL` was not present at import/tooling stage, causing build crashes.
2. **SQLite Provider Incompatibility**:
   The Prisma schema used `provider = "sqlite"`, which is unsuitable for Vercel's ephemeral serverless runtime. Production deployments require PostgreSQL (Supabase) with transaction pooler (`DATABASE_URL`) and direct migration connection (`DIRECT_URL`).
3. **Unguarded Seed Execution**:
   Seeding ran on every build execution without environment guards, risking production database pollution.

---

## 2. Technical Solution Architecture

### A. PostgreSQL Migration Baseline
- Update `prisma/schema.prisma` to use `provider = "postgresql"`, `url = env("DATABASE_URL")`, and `directUrl = env("DIRECT_URL")`.
- Add explicit indexes to `Lead`, `IntegrationEvent`, `WorkflowRun`, `AuditLog`, and `Notification`.
- Create a clean PostgreSQL migration baseline: `prisma/migrations/`.

### B. Package Script Refactoring
- Replace `build` script with clean Next.js compilation: `"build": "prisma generate && next build"`.
- Add `"vercel-build": "prisma generate && prisma migrate deploy && next build"`.
- Add `"postinstall": "prisma generate"`.

### C. Environment Validation & Production Seeding Safeguard
- Refactor `lib/env.ts` Zod validation: lazily evaluate production database URLs so build tools run cleanly without premature runtime crashes.
- Guard `scripts/seed.ts` with `ALLOW_PRODUCTION_SEED="true"`.

### D. Node 20.x Specification & CI Fixes
- Set `"engines": { "node": "20.x" }` in `package.json` and `.nvmrc`.
- Update GitHub Actions CI (`.github/workflows/ci.yml`) to run a PostgreSQL service container (`postgres:16`) and test with real PostgreSQL migrations.
