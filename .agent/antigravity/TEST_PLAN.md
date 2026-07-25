# LeadPilot AI - Test Plan & Verification Matrix

## Overview
LeadPilot AI requires multi-layer automated unit, integration, end-to-end browser testing, and static analysis verification.

## 1. Unit Tests
- **Lead Normalisation**: Verify lowercase email, phone standardisation, whitespace trimming, URL formatting.
- **Scoring Engine**: Test boundary scores (0, 59, 60, 79, 80, 100), weight calculations, max score clamps.
- **Category Assignment**: Ensure correct mapping for HOT, WARM, COLD, and forced REVIEW_REQUIRED.
- **Duplicate Matching**: Test exact email match, phone match, company+contact match, and non-duplicates.
- **Prompt Injection Defense**: Test string sanitizer and refusal logic when lead content contains system prompt overrides.

## 2. Integration Tests
- **Lead Intake API**: Test `POST /api/leads` payload validation, honeypot detection, rate limit behavior.
- **Database Operations**: Test Prisma model CRUD for Leads, Scores, FollowUps, Approvals, AuditLogs.
- **Demo CRM Adapter**: Verify contact, company, and opportunity creation, error simulation, and status updates.
- **Internal APIs**: Test header authentication with `INTERNAL_API_SECRET`.

## 3. End-to-End & Browser Tests (Playwright / Vitest E2E)
- **Scenario 1**: Submit Hot Lead -> Verify Score (>=80) -> Verify Follow-Up Draft -> Verify CRM Sync -> Verify Notification.
- **Scenario 2**: Submit Incomplete / Injection Lead -> Verify REVIEW_REQUIRED placement -> Reviewer Approval -> CRM Sync.
- **Scenario 3**: Submit Duplicate Lead -> Verify Flagged as Duplicate.
- **Scenario 4**: Simulate CRM Failure -> Check Integration Event -> Trigger Retry -> Verify Recovery.

## 4. Verification Commands
- `npm run lint`
- `npm run type-check`
- `npm run test`
- `npm run build`
