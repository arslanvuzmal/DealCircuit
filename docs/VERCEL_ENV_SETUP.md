# Vercel Environment Configuration Guide - LeadPilot AI

This document details how to configure Vercel for production deployment.

## 1. Vercel Project Settings

1. Open the Vercel Dashboard at [https://vercel.com](https://vercel.com).
2. Select your project **`leadpilot-ai`**.
3. Go to **Settings** -> **General**.
4. Set **Node.js Version** to **`20.x`**.
5. Set **Build Command** to:
   ```bash
   npm run vercel-build
   ```
6. Set **Install Command** to:
   ```bash
   npm ci
   ```

---

## 2. Environment Variables Configuration

In Vercel **Settings** -> **Environment Variables**, configure the following variables for **Production** and **Preview**:

| Variable Name | Environment | Example / Value Description |
|---|---|---|
| `DATABASE_URL` | Production, Preview | Supabase Transaction Pooler URL (`postgresql://...:6543/postgres?pgbouncer=true`) |
| `DIRECT_URL` | Production, Preview | Supabase Direct Connection URL (`postgresql://...:5432/postgres`) |
| `DEMO_MODE` | Production, Preview | `true` |
| `NEXT_PUBLIC_DEMO_MODE` | Production, Preview | `true` |
| `JWT_SECRET` | Production, Preview | Strong random secret string (min 16 chars) |
| `INTERNAL_API_SECRET` | Production, Preview | Strong random secret string (min 16 chars) |
| `APP_URL` | Production, Preview | `https://leadpilot-ai-avuzmal.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Production, Preview | `https://leadpilot-ai-avuzmal.vercel.app` |
| `DEMO_CRM_ENABLED` | Production, Preview | `true` |
| `ALLOW_PRODUCTION_SEED` | Production, Preview | `false` (Set `true` once for initial demo seed) |

> ⚠️ **SECURITY WARNING**: Never commit actual database passwords, JWT secrets, or API keys to GitHub.
