# LeadPilot AI - n8n Workflows

This directory contains 4 production-grade n8n workflow JSON definitions for LeadPilot AI automation.

## Workflows

### 1. Lead Intake Workflow (`lead-intake.json`)
**Trigger**: HTTP Webhook (`POST /webhook/lead-intake`)

**Flow**:
1. **Lead Intake Webhook** - Receives lead submission from LeadPilot API
2. **Validate & Normalize Event** - Extracts and normalizes payload
3. **Call Lead Qualification Engine** - Calls `POST /api/internal/score-lead`
4. **Filter Category (HOT/WARM)** - Routes HOT/WARM leads to CRM sync
5. **Sync Lead to CRM** - Calls `POST /api/internal/sync-crm` (HOT/WARM only)
6. **Record Execution Log** - Logs success/failure to `POST /api/internal/record-workflow-run`

**Error Handling**:
- Qualification engine failure → Records failure log
- CRM sync failure → Records failure log
- All errors captured with node identification

**Required Environment Variables**:
- `APPLICATION_URL` - LeadPilot API base URL
- `INTERNAL_API_SECRET` - Shared secret for internal API auth

---

### 2. Daily Lead Digest Workflow (`daily-lead-digest.json`)
**Trigger**: Cron Schedule (Daily 08:00 AM)

**Flow**:
1. **Schedule Trigger** - Runs daily at 8:00 AM
2. **Fetch Digest Data** - Calls `GET /api/internal/daily-digest`
3. **Generate HTML Digest** - Formats leads into HTML email
4. **Send Digest Email via Mailpit** - Calls `POST /api/internal/send-notification`
5. **Record Execution Log** - Logs success/failure

**Error Handling**:
- Fetch failure → Records failure log
- Send failure → Records failure log

**Required Environment Variables**:
- `APPLICATION_URL`
- `INTERNAL_API_SECRET`

---

### 3. Failed Event Retry Workflow (`failed-event-retry.json`)
**Trigger**: Cron Schedule (Every 15 minutes)

**Flow**:
1. **Schedule Trigger** - Runs every 15 minutes
2. **Trigger Application Event Retry Handler** - Calls `POST /api/internal/retry-failed-events`
3. **Format Retry Success** - Structures success response
4. **Record Retry Success Log** - Logs retry results

**Error Handling**:
- Retry handler failure → Records failure log

**Required Environment Variables**:
- `APPLICATION_URL`
- `INTERNAL_API_SECRET`

---

### 4. Review Completion Workflow (`review-completion.json`)
**Trigger**: HTTP Webhook (`POST /webhook/review-completion`)

**Flow**:
1. **Approval Webhook Trigger** - Receives approval notification from LeadPilot
2. **Sync Approved Lead to CRM** - Calls `POST /api/internal/sync-crm`
3. **Send Approved Follow-up Email** - Calls `POST /api/internal/generate-follow-up`
4. **Format Review Success** - Structures success response
5. **Record Review Success Log** - Logs completion

**Error Handling**:
- CRM sync failure → Records failure log
- Follow-up email failure → Records failure log

**Required Environment Variables**:
- `APPLICATION_URL`
- `INTERNAL_API_SECRET`

---

## Deployment Instructions

### 1. Import Workflows in n8n
```bash
# In n8n UI: Workflows → Import → Select JSON file
# Repeat for all 4 workflow files
```

### 2. Configure Environment Variables
In n8n (Settings → Environment Variables):
```
APPLICATION_URL=https://your-leadpilot-domain.vercel.app
INTERNAL_API_SECRET=your-internal-api-secret
```

### 3. Activate Workflows
- Open each workflow
- Click "Activate" toggle
- Verify webhook URLs are registered

### 4. Test Webhooks
```bash
# Test lead intake webhook
curl -X POST https://your-n8n-domain/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d '{"leadData": {"fullName": "Test", "workEmail": "test@example.com", ...}}'

# Test review completion webhook
curl -X POST https://your-n8n-domain/webhook/review-completion \
  -H "Content-Type: application/json" \
  -d '{"leadId": "lead-id-from-leadpilot"}'
```

---

## Security Notes

- All internal API calls use `X-Internal-Secret` header authentication
- Webhooks should be protected by n8n's built-in authentication or IP allowlisting
- `INTERNAL_API_SECRET` must match LeadPilot's `INTERNAL_API_SECRET` env var
- Never expose webhook URLs publicly without authentication

---

## Monitoring

Each workflow logs execution results to LeadPilot via `POST /api/internal/record-workflow-run`:
- Status: `SUCCESS` or `FAILED`
- Details include node name and error message for failures
- Viewable in LeadPilot dashboard → Workflow Runs

---

## Customization

To modify workflows:
1. Edit JSON files in this directory
2. Re-import in n8n (deactivate old, import new, activate)
3. Update environment variables if needed

For production, consider:
- Adding Slack/Teams notifications for failures
- Implementing dead letter queue for repeated failures
- Adding metrics export (Prometheus/Datadog)