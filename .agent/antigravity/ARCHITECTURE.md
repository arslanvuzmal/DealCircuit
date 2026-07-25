# LeadPilot AI - System Architecture Document

## System Overview
LeadPilot AI operates on a hybrid architecture combining a high-performance Next.js full-stack web application (App Router, Prisma ORM, PostgreSQL) with n8n workflow automation for background tasks, CRM synchronisation, email sending, and retry orchestration.

```
                  +-----------------------------------+
                  |        Public Lead Capture        |
                  |     (Next.js Form / Webhook API)  |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------------------------+
                  |  Normalisation & Spam/Dup Check   |
                  |    (Zod, Phone/Email Standard)   |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------------------------+
                  |    Lead Qualification Engine      |
                  |  (Deterministic + AI Provider Abs)|
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|  HOT / WARM / COLD    |                       |    REVIEW_REQUIRED    |
| (Auto-Draft FollowUp) |                       | (Low Conf/Dup/Inject) |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|   n8n Intake Trigger  |                       | Admin Review Queue    |
| (Sync CRM, Mailpit)   |                       | (Manual Approve/Edit) |
+-----------------------+                       +-----------------------+
```

## System Responsibilities

### Next.js Application (Core Platform)
- **Public Endpoints**: `/api/leads` (Lead submission), `/api/public/health`.
- **Authentication & RBAC**: NextAuth / Cookie Session auth with ADMIN, REVIEWER, and VIEWER roles.
- **Lead Qualification & Scoring**: Evaluates rules against 5 database-stored criteria (Budget, Service Fit, Urgency, Authority, Information Quality).
- **AI Abstraction Layer**: Interface supporting `DemoProvider` (deterministic), `OpenAIProvider`, `AnthropicProvider`, and `GeminiProvider`.
- **Database & Persistence**: PostgreSQL + Prisma ORM for entities (User, Lead, LeadScore, ScoringRule, FollowUp, Approval, IntegrationEvent, WorkflowRun, AuditLog, Notification, SystemSetting).
- **Administration Dashboard**: Deep charcoal / Tokyo Night enterprise UI showing metrics, lead details, scoring config, review queue, follow-up editor, and demo controls.

### n8n Workflows
- `n8n/workflows/lead-intake.json`: Orchestrates intake webhook, scoring check, category routing, CRM sync, email notification via Mailpit, and logging.
- `n8n/workflows/daily-lead-digest.json`: Scheduled cron to aggregate daily leads, rank by score, generate HTML digest email.
- `n8n/workflows/failed-event-retry.json`: Retries failed CRM/email sync events with exponential backoff.
- `n8n/workflows/review-completion.json`: Webhook triggered when reviewer approves lead to dispatch CRM sync and final follow-up email.
