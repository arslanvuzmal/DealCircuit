# Complex Automation Templates

These three workflows are **not** part of the 4 core application-contract workflows in
`n8n/workflows/` (`lead-intake.json`, `daily-lead-digest.json`, `failed-event-retry.json`,
`review-completion.json`, all documented in `../../../docs/AUTOMATION.md` and
`../../../.agent/antigravity/N8N_CONTRACT.md`). Those four are what the running application
actually calls in production.

This directory is a portfolio showcase: longer, more elaborate automation patterns built on the
same API surface, demonstrating what's possible on top of LeadPilot AI's internal endpoints —
multi-week nurture cadences, resilient error-classified retry chains, and true parallel scoring
orchestration with reconciliation. They're linked from `/dashboard/workflow-runs` in the live app.

All three are valid, importable n8n workflow JSON (verified: valid JSON, every connection resolves
to a real node name, no dangling references):

| File | Nodes | Pattern |
|---|---|---|
| `advanced-lead-nurture-sequence.json` | 27 | Time-delayed multi-touch cadence, engagement-based Switch routing |
| `multi-stage-crm-escalation.json` | 23 | Error-type-aware retry with exponential backoff and human escalation |
| `enterprise-lead-scoring-orchestration.json` | 26 | True parallel branches, score reconciliation, category fan-out/fan-in |
