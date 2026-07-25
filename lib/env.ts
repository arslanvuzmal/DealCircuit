import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  DEMO_MODE: z.string().optional().default('true'),
  NEXT_PUBLIC_DEMO_MODE: z.string().optional().default('true'),
  JWT_SECRET: z.string().optional().default('default_jwt_secret_dev_mode_only_12345'),
  INTERNAL_API_SECRET: z.string().optional().default('default_internal_secret_dev_mode_only_12345'),
  APP_URL: z.string().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_URL: z.string().optional().default('http://localhost:3000'),
  ALLOW_PRODUCTION_SEED: z.string().optional().default('false'),
  DEMO_CRM_ENABLED: z.string().optional().default('true'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  MAILPIT_SMTP_HOST: z.string().optional().default('localhost'),
  MAILPIT_SMTP_PORT: z.string().optional().default('1025'),
  MAILPIT_UI_URL: z.string().optional().default('http://localhost:8025'),
  N8N_WEBHOOK_URL: z.string().optional(),
  N8N_WEBHOOK_SECRET: z.string().optional(),
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  DEMO_MODE: process.env.DEMO_MODE,
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
  APP_URL: process.env.APP_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ALLOW_PRODUCTION_SEED: process.env.ALLOW_PRODUCTION_SEED,
  DEMO_CRM_ENABLED: process.env.DEMO_CRM_ENABLED,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  MAILPIT_SMTP_HOST: process.env.MAILPIT_SMTP_HOST,
  MAILPIT_SMTP_PORT: process.env.MAILPIT_SMTP_PORT,
  MAILPIT_UI_URL: process.env.MAILPIT_UI_URL,
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
};

export const env = envSchema.parse(rawEnv);

// The Vercel Marketplace Supabase integration injects connection strings under its own
// variable names (POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING) rather than
// DATABASE_URL / DIRECT_URL, which prisma/schema.prisma reads. These resolvers let both
// the Prisma Client singleton (lib/db.ts) and production env validation fall back to the
// integration's names at runtime, without requiring DATABASE_URL/DIRECT_URL to be
// manually duplicated as separate Vercel env var entries.
export function resolveDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
}

export function resolveDirectUrl(): string | undefined {
  return process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING;
}

export function validateProductionEnv() {
  if (process.env.NODE_ENV === 'production') {
    if (!resolveDatabaseUrl()) {
      throw new Error('❌ [CRITICAL ENV ERROR] DATABASE_URL is required in production.');
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
      throw new Error('❌ [CRITICAL ENV ERROR] JWT_SECRET must be at least 16 characters in production.');
    }
    if (!process.env.INTERNAL_API_SECRET || process.env.INTERNAL_API_SECRET.length < 16) {
      throw new Error('❌ [CRITICAL ENV ERROR] INTERNAL_API_SECRET must be at least 16 characters in production.');
    }
  }
}

export const isDemoMode =
  process.env.DEMO_MODE !== 'false' && process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
