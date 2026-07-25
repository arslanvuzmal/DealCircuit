# LeadPilot AI - Project Brief

## Overview
LeadPilot AI is an enterprise-grade intelligent lead qualification, CRM synchronisation, and follow-up automation platform. It captures leads via webhooks/forms, validates and normalises incoming data, detects duplicates and prompt injection attempts, scores leads using deterministic business criteria combined with structured AI reasoning, generates tailored follow-up drafts, manages a human review queue, and triggers automated downstream integrations (CRM sync, notifications, digests, retries) via n8n.

## Target Audience
- Agencies, SaaS Companies, Real Estate, Professional Services, Recruitment, Sales Operations Teams.

## Core Objectives
1. **Public Lead Capture**: Responsive form with honeypot spam protection, rate limiting, Zod validation, and input normalisation.
2. **AI & Deterministic Scoring**: 5 editable criteria (Budget, Service Fit, Urgency, Authority, Info Quality) out of 100 points, categorized into HOT, WARM, COLD, and REVIEW_REQUIRED.
3. **AI Safety & Defense**: Protection against prompt injections (e.g., instructions embedded in project descriptions), schema validation, and fallback mechanisms.
4. **Duplicate Detection**: Smart matching via email, phone, company, and idempotency key without silent deletion.
5. **Human-in-the-Loop Review Queue**: Full review interface with score adjustment, draft editing, decision logging, and re-processing capability.
6. **Follow-Up Automation**: Auto-generated personalized drafts based on category, integrated with Mailpit (demo mode) and approval rules.
7. **n8n Workflow Integration**: Importable JSON workflows for Lead Intake, Daily Digest, Failed Event Retry, and Review Completion.
8. **Demo Mode (Zero Paid APIs)**: Complete standalone operation (`DEMO_MODE=true`) using deterministic AI mock, local PostgreSQL, Mailpit, local demo CRM, and seeded test data.
