// Vercel's Supabase Marketplace integration injects connection strings under its own
// variable names (POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING) rather than the
// DATABASE_URL / DIRECT_URL names prisma/schema.prisma reads. Bridge that gap here so
// no secret value ever has to be manually copied between Vercel env var entries.
import { execSync } from 'node:child_process';

if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
}
if (!process.env.DIRECT_URL && process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const steps = ['prisma generate', 'prisma migrate deploy', 'next build'];

for (const step of steps) {
  execSync(step, { stdio: 'inherit', env: process.env });
}
