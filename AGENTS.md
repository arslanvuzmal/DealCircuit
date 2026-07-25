# AGENTS.md - Antigravity & AI Agent Guidelines for LeadPilot AI

## Project Ownership & Architecture Boundaries

This repository is designed for collaborative AI agent maintenance (Google Antigravity & Claude Code).

### Codebase Ownership Guidelines
1. **Next.js Backend & API Contracts**: All route handlers under `app/api/` must strictly enforce validation via Zod schemas in `lib/validation/`. Internal interop endpoints (`/api/internal/*`) must validate `X-Internal-Secret`.
2. **Database Layer**: Modifications to entities must be reflected in `prisma/schema.prisma` and seeded via `scripts/seed.ts`.
3. **AI Safety**: Never bypass `detectPromptInjection()` in `lib/scoring/injection.ts`. Lead inputs are untrusted string data.
4. **n8n Workflow Compatibility**: JSON files in `n8n/workflows/` must use environment placeholders (`{{ $env.APPLICATION_URL }}`) and include error branches.
5. **Demo Mode Integrity**: The system MUST function fully when `DEMO_MODE=true` without failing due to missing external API keys.

---

## Agent Verification Protocol
Before submitting code changes, agents MUST run:
```bash
npm run type-check
npm run test
npm run build
```
