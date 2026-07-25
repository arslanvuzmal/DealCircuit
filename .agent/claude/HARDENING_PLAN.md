# LeadPilot AI — Hardening Plan

Derived from `BASELINE_AUDIT.md` and `DEFECT_REGISTER.md`. This plan sequences remediation so
critical/high defects close first, per the task brief's explicit rule ("Fix critical and high
defects before cosmetic improvements"). Each phase lists the defect IDs it closes, the files it
touches, and how it will be verified (never "looks right" — an executed check).

This plan intentionally stops short of touching the remaining audit sections (business-logic
invariant tests, full AI-safety hardening, full n8n contract rewrite, dashboard/UX pass, portfolio
materials, etc.) — those are Sections 4–16 of the task brief and come **after** this plan is
reviewed, per the brief's own gate: *"Do not make broad changes until the baseline audit and
hardening plan are complete."*

---

## Phase 1 — Stop the bleeding (CRITICAL, do first, small blast radius)

**C1 — Fail-closed environment validation.**
`lib/env.ts`: remove the `.default(...)` fallback for `JWT_SECRET` and `INTERNAL_API_SECRET`.
In non-demo mode, require both, with a minimum length, and `process.exit(1)` with a clear error at
boot if missing — never fall back to a value that also lives in a public `.env.example`. In demo
mode, still require *some* value from `.env`, just document clearly that the shipped demo value is
for local demo use only and must be rotated before any non-local deployment.
*Verify*: unset `JWT_SECRET` in a throwaway `.env`, confirm the app refuses to start with a clear
error rather than booting silently; restore `.env`, confirm normal boot + login still work.

**C2 — Fix the malformed n8n JSON.**
`n8n/workflows/lead-intake.json`: replace the raw newline in the `functionCode` string with an
escaped `\n`. Whole-file re-validate with `JSON.parse`.
*Verify*: `node -e "require('./n8n/workflows/lead-intake.json')"` succeeds; diff against the other
three workflow files to confirm no other raw control characters exist.

**C3 — Fix (or remove) the internal-secret check in `lead-intake.json`.**
Replace the broken string-literal comparison inside the Function node with either (a) an `IF` node
using a correctly-scoped `={{ }}` expression comparing the header to `$env.INTERNAL_API_SECRET`,
routed to an error-response branch on mismatch, or (b) drop the redundant client-side check
entirely and rely on the Next.js internal routes' own `X-Internal-Secret` validation (already
correct — confirmed in baseline) as the sole enforcement point, documenting that decision.
*Verify*: send a webhook payload with a wrong secret; confirm the workflow either rejects it
(option a) or that downstream `/api/internal/*` calls reject it with 401/403 (option b) — test with
n8n's built-in "execute workflow" test runner once C2 makes the file importable.

**C4 — Be honest about AI provider status.**
Either (preferred, matches "OpenAI-ready provider" language in the brief) implement a real,
timeout-bounded OpenAI call with Zod-validated structured output and server-side score
recalculation/clamping identical to the deterministic path — falling back safely to
`DemoAIProvider` on error/timeout/malformed response, exactly as the missing-key branch already
does. Add a stubbed `AnthropicProvider` that explicitly throws `NotImplementedError` or falls back
to demo rather than silently mislabeling. Update `ARCHITECTURE.md`/`DECISIONS.md`/`README.md` to
match exactly what exists once done.
*Verify*: with a (test/mock) API key set, confirm the response's `provider`/`model`/`isDemoMode`
fields reflect what actually executed; add a unit test that asserts `OpenAIProvider` without a key
falls back to demo, and one confirming a malformed/schema-invalid mock response also falls back
safely rather than propagating garbage into `LeadScore`.

---

## Phase 2 — Correctness under retry and partial failure (HIGH)

**H1 — Idempotent replay.**
`app/api/leads/route.ts`: before `prisma.lead.create()`, check `detectDuplicateLead`'s
idempotency-key match; if found, return the *original* lead's success response (same shape, same
status 201) instead of attempting a second create.
*Verify*: re-run the exact empirical test from the baseline audit (submit, then replay with the
same `X-Idempotency-Key`) and confirm the second call returns 201 with the original `leadId`, not a
500. Add this as an automated integration test per Section 8's requirement.

**H3 — Transaction boundaries.**
Wrap the DB-only sequence in `app/api/leads/route.ts` (Lead create → LeadScore create → FollowUp
create → Lead status update) in `prisma.$transaction`. Do the same for
`app/api/leads/[id]/approve/route.ts` (Approval create → Lead update → FollowUp update). Keep CRM
sync and email dispatch outside the transaction (external calls shouldn't hold a DB transaction
open) but ensure their failure paths write to `IntegrationEvent` so `failed-event-retry.json` has
something to act on.
*Verify*: add a test that forces the second write in the sequence to throw (e.g., mock
`prisma.leadScore.create` to reject) and assert the `Lead` row from the first write was rolled back,
not left orphaned.

**H4 — Rate limiting on `POST /api/leads`.**
Add a lightweight limiter (in-memory sliding window keyed by IP is sufficient for this scope;
document the production upgrade path — Redis/Upstash — as a known limitation) ahead of the honeypot
check.
*Verify*: script N+1 rapid requests from the same source, confirm the (N+1)th is rejected with 429
while requests within the window succeed.

**H6 — Real health checks.**
`app/api/public/health/route.ts`: replace the hardcoded `mailpit`/`demoCrmAdapter` literals with
bounded-timeout real checks (SMTP `NOOP`/socket connect for Mailpit; whatever the demo CRM
adapter's own health surface is).
*Verify*: run the health check with Mailpit stopped vs. started and confirm the reported status
actually changes.

**H2 — Broaden prompt-injection coverage + document the real backstop.**
Add patterns/heuristics covering the four phrases the baseline audit found bypassing the detector
(reveal/disclose/tell-me verbs; "call/fetch/visit this URL" patterns; cross-entity data-mutation
requests). Add the five task-brief phrases as a permanent automated test (Section 5 requires this
regardless). Update `docs/SECURITY.md` (once created — see Phase 3) to state plainly that the regex
list is a review-routing heuristic and the actual security boundary is server-side score
recalculation + schema validation, so the doc doesn't overclaim.
*Verify*: the five-phrase test suite passes; existing 4 unit tests still pass.

**H5 — Correct the false verification claims, don't just add tests.**
Once Phase 3's test-coverage work (integration + E2E) lands, update `TASK_TRACKER.md` /
`HANDOFF_TO_CLAUDE.md` language or supersede them with this audit's own status docs so nothing in
the repo claims "VERIFIED" for work that wasn't actually verified at the time it was marked.

---

## Phase 3 — Medium-priority correctness & documentation (MEDIUM)

Sequenced after Phase 1–2 land and re-verify clean, batched together since each is small:

- **M1**: add `@@index([normalizedEmail])` and `@@index([normalizedPhone])` to `Lead` in
  `prisma/schema.prisma`; re-run `prisma db push` and confirm duplicate-detection queries still
  return correct results (add a regression test for each duplicate-matching branch while touching
  this file, closing part of Section 8's "Same email different casing / phone different formats"
  requirement at the same time).
- **M2**: add nullable `leadId` FK to `WorkflowRun` and `Notification`; thread it through
  `recordWorkflowExecution()` and `createInAppNotification()` call sites that have a lead in scope.
- **M3**: write `docs/SECURITY.md` (honest known-limitations + production-hardening checklist, per
  the task's Section 6 closing instruction) and `docs/TESTING.md` once Phase 3/Section 13 test work
  is real.
- **M4**: add the missing `package.json` scripts (`format:check`, `test:unit`, `test:integration`,
  `test:e2e`, `db:migrate` — or document plainly that `db:push` is the supported command for the
  SQLite demo path and `migrate deploy` is the Postgres production path, `demo:reset` wrapping the
  existing `/api/demo/reset` logic as a CLI script, `verify` chaining type-check + lint + test +
  build).
- **M5**: either implement `POST /api/leads/:id/request-information` for real (wired to the
  `REQUEST_INFO` approval action and the review-queue UI) or remove it from `API_CONTRACT.md` — the
  task brief explicitly prefers "implement correctly" over leaving a doc/code mismatch.
- **M6**: evaluate a deliberate Next.js upgrade path (14 → latest 14.2.x is already applied; a major
  bump to 15/16 is a breaking-change project of its own, out of scope for this hardening pass —
  document as an accepted/known limitation with the specific advisories listed, per Section 6's
  "known limitations" requirement, rather than silently deferring it).
- **M7**: commit a real `.eslintrc.json` (Next.js "Strict" preset, matching what the interactive
  wizard would have generated) so `npm run lint` works non-interactively in CI and on a clean
  checkout.
- **M8**: thread `ipAddress` from the request object into the existing `logAuditEvent()` call sites.
- **M9**: accepted as-is (SQLite constraint) — document the mismatch in `DATABASE_CONTRACT.md`
  rather than changing the schema.

---

## Phase 4 — Everything downstream of a clean Phase 1–3

Only after Phase 1–3 are verified does it make sense to proceed into the rest of the task brief:
Section 4 (business-logic invariant tests), Section 5's remaining AI-safety items (schema
validation for the real OpenAI path once C4 lands), Section 9's full `N8N_CONTRACT_AUDIT.md`,
Section 10's full API audit, Section 11 (follow-up/email audit), Section 12 (dashboard/UX pass in
the browser), Section 13 (the real integration/E2E suite — H5's prerequisite), Section 16
(portfolio quality), and finally Sections 17–20 (required commands, clean-room verification,
release gate, final report).

---

## Explicit Non-Goals For This Pass

- No dependency major-version upgrades (Next 14→16) without a dedicated, reviewed plan — too large
  a blast radius to bundle into hardening.
- No architecture rewrite. The Next.js + n8n hybrid design (ADR-001) is sound; the defects found are
  implementation bugs and honesty gaps, not evidence the architecture itself needs to change.
- No new external services, no real email sends, no real CRM calls, no paid API usage — all
  remediation stays inside `DEMO_MODE=true` boundaries per the task's hard constraints.

---

## Sequencing Rationale (why this order)

C1 first because it's the single highest-severity, lowest-effort fix (one file, ~10 lines) and
closes the most dangerous "silent fail-open" scenario. C2/C3 next because they're both isolated to
one JSON file and unblock all subsequent n8n verification work (Section 9 can't proceed
meaningfully against a workflow that doesn't parse). C4 is the largest Phase 1 item — deliberately
placed last within the phase so it doesn't block the smaller, faster wins. Phase 2 items are ordered
by how directly they map to a task-brief-mandated test scenario (H1 and H2 both have literal test
phrases specified in the brief; doing the fix and the test together is more efficient than
separating them). Phase 3 is intentionally batched last and lowest-risk since none of it is
security-critical.
