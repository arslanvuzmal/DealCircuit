# API Specification - LeadPilot AI

## Public Endpoints

### `POST /api/leads`
- **Description**: Submit a new lead for qualification.
- **Header**: `Content-Type: application/json`, `X-Idempotency-Key` (optional)
- **Response**: `{ "success": true, "leadId": "cld_...", "category": "HOT", "score": 85 }`

### `GET /api/public/health`
- **Description**: Returns database, Mailpit, and CRM adapter health status.

---

## Internal Interop Endpoints (n8n & Background Processing)
Requires `X-Internal-Secret` matching `INTERNAL_API_SECRET`.

- `POST /api/internal/score-lead`
- `POST /api/internal/sync-crm`
- `POST /api/internal/generate-follow-up`
- `POST /api/internal/send-notification`
- `POST /api/internal/record-workflow-run`
- `GET /api/internal/daily-digest`
- `POST /api/internal/retry-failed-events`
