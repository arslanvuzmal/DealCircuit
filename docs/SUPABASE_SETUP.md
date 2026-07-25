# Supabase PostgreSQL Setup Guide - LeadPilot AI

This guide walks through configuring a production Supabase PostgreSQL database for LeadPilot AI.

## Step-by-Step Setup

1. **Create Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com) and create a new project named `leadpilot-ai`.
   - Record the strong database password.

2. **Retrieve Connection Strings**:
   - Navigate to **Project Settings** -> **Database**.
   - Under **Connection String**, select **URI**.

3. **Configure Connection Modes**:
   - **Pooled Transaction Connection String (`DATABASE_URL`)**:
     Use port `6543` with `pgbouncer=true`:
     ```
     postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Direct Migration Connection String (`DIRECT_URL`)**:
     Use port `5432` without pooler:
     ```
     postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
     ```

4. **Deploy Schema Migrations**:
   Run the following command locally or via CI/CD to apply all PostgreSQL baseline migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. **Initial Controlled Seeding (Optional)**:
   To populate initial demo users and scoring rules on Supabase:
   ```bash
   ALLOW_PRODUCTION_SEED="true" npm run db:seed
   ```

6. **Verify Tables**:
   In Supabase **Table Editor**, confirm all 11 tables (`User`, `Lead`, `LeadScore`, `ScoringRule`, `FollowUp`, `Approval`, `IntegrationEvent`, `WorkflowRun`, `AuditLog`, `Notification`, `SystemSetting`) are present.
