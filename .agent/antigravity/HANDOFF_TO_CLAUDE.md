# Handoff to Claude Code - LeadPilot AI V1

## Executive Summary
This document serves as the master technical handoff from Google Antigravity to Claude Code. It details the initial architecture, planning artifacts, and verification status for LeadPilot AI.

## Project Location & Workspace
- **Root Path**: `C:\Users\laptopzone\.gemini\antigravity\scratch\leadpilot-ai`
- **Git Branch**: `antigravity/leadpilot-v1`

## Key Architecture & Data Flow
1. **Next.js 14 App Router + Tailwind CSS**: Enterprise Dark Mode dashboard & public capture form.
2. **Prisma ORM + PostgreSQL**: 11 normalized database entities storing leads, scores, follow-ups, approvals, events, and logs.
3. **Qualification Engine**: Hybrid deterministic & AI scoring based on 5 customizable business criteria.
4. **n8n Automation**: 4 production-grade JSON workflows in `n8n/workflows/`.
5. **Demo Mode Stack**: Full offline execution with `DEMO_MODE=true`, SQLite/PostgreSQL fallback, Mailpit SMTP, and Demo CRM.

## Initial Status & Next Steps
- Planning artifacts initialized in `.agent/antigravity/`.
- Full project implementation in progress across 8 phased tasks.
