# Architecture Overview - LeadPilot AI

LeadPilot AI is engineered with a hybrid architecture combining a high-performance Next.js full-stack web application (App Router, Prisma ORM, PostgreSQL/SQLite) with n8n workflow automation for background tasks, CRM synchronisation, email dispatch, and retry orchestration.

## Data Flow Pipeline

1. **Intake & Normalisation**:
   - Public form or n8n webhook captures submission.
   - Zod validates structure.
   - Emails, phone numbers, and URLs are normalized.
   - Honeypot and basic rate limiting drop malicious automated submissions.

2. **Qualification Engine**:
   - Scores lead across 5 customizable criteria: Budget Fit (25%), Service Fit (25%), Urgency (20%), Decision Authority (15%), Information Quality (15%).
   - Combined deterministic scoring + AI provider abstraction (`DemoProvider`, `OpenAIProvider`, `AnthropicProvider`).
   - App-side score recalculation enforces maximum clamps.

3. **AI Safety & Review Queue Routing**:
   - `detectPromptInjection()` scans text for system prompt override attempts.
   - `detectDuplicateLead()` checks exact email, phone, company/name, and idempotency key.
   - Flagged or low-confidence leads are placed in `REVIEW_REQUIRED` status.

4. **Automation & Integrations**:
   - Qualified HOT/WARM leads trigger CRM sync via Demo CRM adapter and email dispatch via Mailpit SMTP.
   - Reviewer approval in dashboard dispatches pending sync and approved follow-up email.
