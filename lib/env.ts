import { z } from 'zod';

const envSchema = z.object({
  DEMO_MODE: z.string().optional().default('true'),
  DATABASE_URL: z.string().optional().default('file:./dev.db'),
  JWT_SECRET: z.string().optional().default('leadpilot_super_secret_jwt_key_2026'),
  INTERNAL_API_SECRET: z.string().optional().default('leadpilot_internal_secret_9988'),
  OPENAI_API_KEY: z.string().optional().default(''),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  MAILPIT_SMTP_HOST: z.string().optional().default('localhost'),
  MAILPIT_SMTP_PORT: z.string().optional().default('1025'),
  MAILPIT_UI_URL: z.string().optional().default('http://localhost:8025'),
  N8N_WEBHOOK_URL: z.string().optional().default('http://localhost:5678/webhook'),
  DEMO_CRM_ENABLED: z.string().optional().default('true'),
});

export const env = envSchema.parse(process.env);
export const isDemoMode = env.DEMO_MODE === 'true';
