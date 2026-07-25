# Contributing to LeadPilot AI

Thank you for considering contributing to LeadPilot AI!

## Development Workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Install dependencies: `npm install`
3. Run database migrations and seeding: `npx prisma db push && npm run db:seed`
4. Run verification suite before opening a pull request:
   ```bash
   npm run type-check
   npm run test
   npm run build
   ```
5. Commit clean, structured commits following Conventional Commits format (`feat: ...`, `fix: ...`, `docs: ...`).
6. Open a Pull Request targeting the `main` branch.

## Coding Standards
- Maintain strict TypeScript type safety (`noImplicitAny`, zero type errors).
- All API route handlers must validate inputs using Zod schemas.
- Dark enterprise aesthetic tokens must be preserved in Tailwind CSS.
