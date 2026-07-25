# n8n Workflow Automation Specification - LeadPilot AI

Four production-ready JSON workflow definitions are available in `n8n/workflows/`:

1. **`lead-intake.json`**:
   - Webhook trigger -> Signature verification -> Qualification engine -> CRM sync -> Follow-up email -> Log execution.
2. **`daily-lead-digest.json`**:
   - Schedule trigger (08:00 AM) -> Retrieve daily leads -> Rank by score -> Generate HTML digest -> Email via Mailpit.
3. **`failed-event-retry.json`**:
   - Schedule trigger (Every 15m) -> Fetch retryable failed events -> Re-attempt CRM sync -> Alert after 3 attempts.
4. **`review-completion.json`**:
   - Webhook trigger -> Process reviewer-approved lead -> Sync CRM -> Send final follow-up email.
