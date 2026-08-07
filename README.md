# LeadPilot AI

> AI Lead Operations & n8n Automation

LeadPilot AI is an end-to-end B2B lead capture, qualification scoring, AI safety defense, and workflow automation system built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, and n8n.

---

## Key Features

- **Public Lead Capture Form**: Responsive, accessible lead intake form with honeypot spam protection, client/server Zod validation, and input normalisation.
- **5-Criteria Hybrid Scoring Engine**: Evaluates Budget Fit (25%), Service Fit (25%), Urgency (20%), Decision Authority (15%), and Info Quality (15%) out of 100 max points.
- **AI Safety & Prompt Injection Defense**: Sanitizes lead text, detects malicious system prompt overrides, and automatically routes edge cases to a human review queue.
- **Multi-Factor Duplicate Detection**: Identifies duplicates by normalized email, phone, company + contact name, and idempotency key.
- **Human-in-the-Loop Review Queue**: Full administrator interface for adjusting scores, changing categories, editing follow-up drafts, and logging decision audit trails.
- **n8n Workflow Automation**: 4 production-grade importable workflows in `n8n/workflows/` (Lead Intake, Daily Digest, Failed Event Retry, Review Completion).
- **100% Offline Demo Mode (`DEMO_MODE=true`)**: Operates without external paid API keys using Mailpit SMTP, a built-in Demo CRM adapter, and PostgreSQL.

---

## Quick Start

### Prerequisites
- Node.js 24.x / npm 10+
- PostgreSQL database (or Docker Compose)

### 1. Installation
```bash
git clone https://github.com/arslanvuzmal/leadpilot-ai.git
cd leadpilot-ai
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
Populate `DATABASE_URL` and `DIRECT_URL` with your PostgreSQL database credentials.

### 3. Database Migration & Seeding
```bash
npx prisma migrate deploy
ALLOW_PRODUCTION_SEED="true" npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

- **Public Form**: `http://localhost:3000/submit`
- **Admin Console**: `http://localhost:3000/login`
- **Demo Credentials**:
  - Admin: `admin@leadpilot.ai` / `admin123`
  - Reviewer: `reviewer@leadpilot.ai` / `admin123`

---

## Project Structure

```
leadpilot-ai/
├── app/                  # Next.js 14 App Router (Pages & APIs)
│   ├── api/              # Public, Authenticated, and Internal n8n APIs
│   ├── dashboard/        # Administration Console (Professional Light Theme)
│   ├── submit/           # Public Lead Capture Form Page
│   └── login/            # Admin Authentication Page
├── components/           # Reusable UI & Action Components
├── lib/                  # Business Logic Modules
│   ├── ai/               # AI Provider Abstraction (Demo, OpenAI, Anthropic)
│   ├── crm/              # Demo CRM Adapter
│   ├── email/            # Mailpit SMTP & Follow-up Draft Generator
│   ├── scoring/          # Deterministic Scorer & Injection Defense
│   ├── validation/       # Zod Schemas & Normalisation
│   └── observability/    # Audit Logger & Workflow Execution Recorder
├── n8n/
│   └── workflows/        # 4 Production-grade Importable JSON Workflows
├── prisma/               # Database Schema (11 Entities) & Migrations
├── scripts/              # Seed Script (8 Test Scenarios)
├── tests/                # Vitest Unit & Integration Test Suite
└── docs/                 # Complete Architecture & Deployment Documentation
```

---

## Running Verification & Tests

```bash
# Full Verification Suite
npm run verify
```

---

## License

MIT License.