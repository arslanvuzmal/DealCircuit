# LeadPilot AI - API Contract Specification

## Public Endpoints

### 1. Lead Submission
- **POST** `/api/leads`
- **Headers**: `Content-Type: application/json`, `X-Idempotency-Key: <string>` (optional)
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "workEmail": "jane@acmecorp.com",
  "phoneNumber": "+15550199",
  "companyName": "Acme Corp",
  "companyWebsite": "https://acmecorp.com",
  "industry": "Software / SaaS",
  "companySize": "51-200",
  "serviceRequired": "Custom AI Automation",
  "budgetRange": "$25k-$50k",
  "desiredTimeline": "1-3 Months",
  "decisionAuthority": "Final Decision Maker",
  "projectDescription": "We need custom AI lead scoring and CRM automation.",
  "leadSource": "Website Form",
  "consent": true,
  "websiteHoneypot": ""
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "leadId": "cld_123456789",
  "category": "HOT",
  "score": 85,
  "message": "Lead submitted and processed successfully."
}
```

### 2. Health Check
- **GET** `/api/public/health`
- **Response (200 OK)**:
```json
{
  "status": "healthy",
  "mode": "DEMO",
  "timestamp": "2026-07-25T11:52:24.000Z",
  "services": {
    "database": "UP",
    "mailpit": "UP",
    "crmAdapter": "UP"
  }
}
```

---

## Authenticated Endpoints (Admin / Reviewer / Viewer)

### 3. List Leads
- **GET** `/api/leads?status=ALL&category=HOT&page=1&limit=20`
- **Roles Required**: ADMIN, REVIEWER, VIEWER

### 4. Get Lead Details
- **GET** `/api/leads/:id`
- **Roles Required**: ADMIN, REVIEWER, VIEWER

### 5. Lead Review Actions
- **POST** `/api/leads/:id/approve`
- **POST** `/api/leads/:id/reject`
- **POST** `/api/leads/:id/reprocess`
- **POST** `/api/leads/:id/request-information`
- **Roles Required**: ADMIN, REVIEWER

### 6. Scoring Rules Management
- **GET** `/api/scoring-rules`
- **PATCH** `/api/scoring-rules`
- **Roles Required**: ADMIN

---

## Internal Endpoints (for n8n & Service Interop)

Protected via `X-Internal-Secret` header matching `INTERNAL_API_SECRET`.

### 7. Internal Score Lead
- **POST** `/api/internal/score-lead`
- **Body**: `{ "leadId": "cld_123456789" }`

### 8. Internal Generate Follow-up
- **POST** `/api/internal/generate-follow-up`
- **Body**: `{ "leadId": "cld_123456789" }`

### 9. Internal Sync CRM
- **POST** `/api/internal/sync-crm`
- **Body**: `{ "leadId": "cld_123456789" }`

### 10. Internal Send Notification
- **POST** `/api/internal/send-notification`
- **Body**: `{ "type": "SLACK_ALERT", "title": "Hot Lead Alert", "leadId": "cld_123456789" }`

### 11. Internal Record Workflow Run
- **POST** `/api/internal/record-workflow-run`
- **Body**: `{ "workflowName": "lead-intake", "status": "SUCCESS", "executionId": "n8n_exec_999", "details": {} }`

### 12. Internal Daily Digest Data
- **GET** `/api/internal/daily-digest`
