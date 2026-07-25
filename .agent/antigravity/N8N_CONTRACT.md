# LeadPilot AI - n8n Workflow Contract Specification

## Workflows Directory
Location: `n8n/workflows/`

### 1. `lead-intake.json`
- **Trigger**: Webhook node listening on `POST /webhook/lead-intake`.
- **Logic**:
  1. Signature Validation (X-Internal-Secret check).
  2. Normalize payload.
  3. Call `/api/internal/score-lead`.
  4. Evaluate category:
     - HOT / WARM / COLD: Call `/api/internal/generate-follow-up` -> Call `/api/internal/sync-crm` -> Send Notification.
     - REVIEW_REQUIRED: Send Review Notification -> Flag for human review queue.
  5. Record workflow run via `/api/internal/record-workflow-run`.
  6. Return response to webhook caller.

### 2. `daily-lead-digest.json`
- **Trigger**: Cron Schedule node (Daily at 08:00 AM).
- **Logic**:
  1. Fetch digest leads from `/api/internal/daily-digest`.
  2. Rank leads by score descending.
  3. Generate concise HTML digest email content.
  4. Deliver email via Mailpit / SMTP adapter.
  5. Record workflow run via `/api/internal/record-workflow-run`.

### 3. `failed-event-retry.json`
- **Trigger**: Cron Schedule node (Every 15 minutes).
- **Logic**:
  1. Fetch retryable events (`IntegrationEvent` where `status = FAILED` or `RETRYING` and `attempts < maxAttempts`).
  2. For each event:
     - Retry target action (CRM sync or Email send).
     - Update attempt count and status.
  3. If attempts >= maxAttempts, create Alert Notification.
  4. Record workflow run.

### 4. `review-completion.json`
- **Trigger**: Webhook node `POST /webhook/review-completion`.
- **Logic**:
  1. Receive approved lead payload.
  2. Execute CRM sync via `/api/internal/sync-crm`.
  3. Send approved follow-up email via Mailpit.
  4. Notify team via Slack / internal notification log.
  5. Record completion.
