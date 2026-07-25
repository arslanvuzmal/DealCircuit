# LeadPilot AI - Enterprise Case Study & Architecture Brief

## Executive Summary
LeadPilot AI solves a major operational bottleneck for B2B sales organizations: manual lead sorting, inconsistent qualification, spam submissions, and delayed response times.

By combining deterministic business rules, AI-powered structured evaluation, prompt-injection defense, and n8n workflow automation, LeadPilot AI achieves:
- **Instant Response Time**: High-fit HOT leads receive personalized follow-up drafts and CRM deals within seconds.
- **Zero Hallucinated Scores**: Application-side recalculation enforces strict 100-point boundaries across 5 customizable criteria.
- **100% Data Protection**: Prompts and lead inputs are isolated, ensuring prompt injection attempts are safely neutralized and flagged for human review.
- **Robust Integration Recovery**: Automated retry processor ensures failed CRM API syncs recover without manual intervention.

## System Architecture Highlights
- Next.js 14 App Router + Tailwind CSS Dark Enterprise UI
- Prisma ORM + PostgreSQL / SQLite
- n8n Background Workflows (Lead Intake, Digest, Retries, Approvals)
- Mailpit Local SMTP & Demo CRM Adapters
