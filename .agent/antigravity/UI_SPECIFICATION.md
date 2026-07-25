# LeadPilot AI - UI & UX Design Specification

## Design Theme & Palette
- **Style**: Premium Enterprise Dark Mode (Tokyo Night / Deep Charcoal).
- **Background Color**: `#0D1117` (Deep Obsidian Charcoal) & `#161B22` (Card surface).
- **Primary Accent**: `#38BDF8` (Cyan Blue) & `#818CF8` (Muted Indigo/Violet).
- **Status Colors**:
  - HOT: `#10B981` (Emerald Green)
  - WARM: `#F59E0B` (Amber Gold)
  - COLD: `#64748B` (Muted Slate)
  - REVIEW_REQUIRED: `#EF4444` (Coral Red)
- **Typography**: Inter / Outfit sans-serif stack.
- **Rules**: High contrast, crisp status badges, zero robot/artificial brain clutter, responsive table views, glassmorphic card overlays, accessible focus rings.

## Page Map

### Public Pages
1. `/` or `/submit`: Polished Public Lead Capture Form (Honeypot, floating labels, real-time Zod validation, submission status indicator).
2. `/success`: Lead Submission Confirmation with tracking reference and expected response timeline.
3. `/api/public/health`: Clean JSON status page.

### Administration Pages
1. `/login`: Secure Administrator & Reviewer Login page.
2. `/dashboard`: Overview metrics (Total Leads, Hot/Warm/Cold, Review Required, Avg Score, Qualification Rate, CRM Sync status, Integration failure alerts).
3. `/dashboard/leads`: Lead table with status/category filtering, search, sorting, and pagination.
4. `/dashboard/leads/[id]`: Detailed view showing full submission, score breakdown radial/bar indicators, AI explanation, missing fields, risk list, CRM sync status, and audit log.
5. `/dashboard/review-queue`: Dedicated human review queue with inline score adjustment, follow-up draft editing, decision buttons (Approve, Reject, Request Info, Reprocess).
6. `/dashboard/follow-ups`: Draft & sent follow-up mail manager with email preview and Mailpit view link.
7. `/dashboard/scoring-rules`: Admin editor for 5 criteria weights, maximum points, and category threshold sliders.
8. `/dashboard/integrations`: CRM & Mailpit status monitor, webhook endpoints, and manual retry trigger button.
9. `/dashboard/workflow-runs`: Execution log view for n8n workflows.
10. `/dashboard/audit-logs`: System and reviewer audit trail log table.
11. `/dashboard/demo-controls`: Demo mode management panel (Trigger seeded leads, test prompt injection, simulate CRM failure, trigger retry, reset demo database).
