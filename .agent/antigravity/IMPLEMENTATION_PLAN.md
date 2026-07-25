# LeadPilot AI - Implementation Plan (V1)

Build a complete, functional, enterprise-ready lead qualification, CRM synchronisation, and follow-up automation platform operating in standalone demo mode and production-ready for n8n integration.

## Proposed Implementation Phases

### Phase 1 — Foundation & Infrastructure
- Initialize Next.js app with App Router, TypeScript, Tailwind CSS, Lucide Icons.
- Setup Prisma ORM with PostgreSQL database schema (`User`, `Lead`, `LeadScore`, `ScoringRule`, `FollowUp`, `Approval`, `IntegrationEvent`, `WorkflowRun`, `AuditLog`, `Notification`, `SystemSetting`).
- Set up Docker Compose configuration for local PostgreSQL, Mailpit, and n8n services.
- Implement Zod environment schema and session-based authentication/RBAC middleware (`ADMIN`, `REVIEWER`, `VIEWER`).
- Create comprehensive seed script with 8 fictional test scenarios (including high-budget lead, incomplete lead, prompt-injection attack lead, duplicate lead, CRM failure lead).

### Phase 2 — Public Lead Capture & Core API Layer
- Build accessible, high-converting public lead submission form at `/submit` and `/` with honeypot spam protection, rate limiting, and client/server-side validation.
- Implement data normalisation utilities (email, phone format, URL sanitization).
- Implement multi-factor duplicate lead detection (email, phone, company + contact, idempotency key).
- Build Lead intake REST API (`POST /api/leads`, `GET /api/public/health`).

### Phase 3 — Qualification Engine & AI Safety
- Implement 5-criteria scoring engine (Budget Fit 25pts, Service Fit 25pts, Urgency 20pts, Authority 15pts, Info Quality 15pts).
- Build AI Provider Abstraction (`DemoProvider`, `OpenAIProvider`, `AnthropicProvider`, `GeminiProvider`).
- Implement strict structured output validation via Zod, application-side score recalculation, and score clamps.
- Build anti-injection defense layer that detects prompt injection patterns in project descriptions and routes suspicious leads to `REVIEW_REQUIRED`.

### Phase 4 — n8n Automation & Integration Adapters
- Build importable n8n workflows (`n8n/workflows/lead-intake.json`, `daily-lead-digest.json`, `failed-event-retry.json`, `review-completion.json`).
- Implement internal secret-protected APIs for n8n interop (`/api/internal/*`).
- Create Demo CRM Adapter, Mailpit Email Adapter, and Notification adapters with retry logic and idempotency.

### Phase 5 — Administration Dashboard & Human-in-the-Loop Review
- Build enterprise dark mode UI (`#0D1117` Tokyo Night palette) for:
  - Overview Dashboard with real live metrics.
  - Lead Directory & Lead Detail view with score breakdown visualizers.
  - Dedicated Human Review Queue with score adjustment, draft editing, and decision logging.
  - Follow-up Editor & Mailpit preview link.
  - Scoring Rules Editor & Integration Health Monitor.
  - Audit Log viewer & Demo Control Panel (trigger seed leads, simulate CRM failure, retry events).

### Phase 6 — Verification, Portfolio & Handoff
- Unit & integration tests for normalisation, scoring, prompt injection, duplicate detection, and CRM sync.
- End-to-end browser verification of lead submission, review queue action, and demo control flow.
- Portfolio material generation (screenshots, video script, case study, Fiverr specifications).
- Comprehensive README.md, AGENTS.md, docs, and `HANDOFF_TO_CLAUDE.md`.

## User Review Required
> [!IMPORTANT]
> - All services operate locally in Demo Mode (`DEMO_MODE=true`) using Mailpit and a built-in Demo CRM adapter. No paid APIs or external services are required.
> - The application stack uses Next.js (App Router), Prisma ORM, PostgreSQL (with SQLite fallback for local convenience if needed), Tailwind CSS, and n8n.

## Verification Plan

### Automated Tests
- `npm run lint`: ESLint code formatting and rule checks.
- `npm run type-check`: TypeScript type compilation check (`tsc --noEmit`).
- `npm run test`: Vitest unit and integration tests covering scoring, injection defense, normalisation, and CRM adapters.
- `npm run build`: Production build compilation check.

### Manual Verification
- Browser end-to-end verification of public lead capture, review queue workflow, draft editing, scoring rule updates, and demo control trigger actions.
