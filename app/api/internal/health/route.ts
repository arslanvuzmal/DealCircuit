import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDemoMode, env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkService(name: string, check: () => Promise<{ status: string; details?: string }>): Promise<Record<string, { status: string; details?: string }>> {
  try {
    const result = await check();
    return { [name]: result };
  } catch (error) {
    return { 
      [name]: { 
        status: 'DOWN', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      } 
    };
  }
}

async function checkDatabase() {
  await prisma.$queryRaw`SELECT 1`;
  return { status: 'UP' };
}

async function checkN8n() {
  const n8nWebhookUrl = env.N8N_WEBHOOK_URL;
  const n8nSecret = env.N8N_WEBHOOK_SECRET;
  
  if (!n8nWebhookUrl) {
    return { status: 'NOT_CONFIGURED', details: 'N8N_WEBHOOK_URL not set' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${n8nWebhookUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(n8nSecret && { 'X-N8N-Secret': n8nSecret }),
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return { status: 'UP', details: `Version: ${data.version || 'unknown'}` };
    } else {
      return { status: 'DEGRADED', details: `HTTP ${response.status}` };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'DOWN', details: 'Timeout after 5s' };
    }
    return { status: 'DOWN', details: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function checkCRM() {
  if (isDemoMode) {
    return { status: 'DEMO', details: 'Demo CRM adapter active' };
  }
  return { status: 'NOT_CONFIGURED', details: 'No production CRM adapter configured' };
}

async function checkEmail() {
  if (isDemoMode) {
    return { status: 'DEMO', details: 'Mailpit SMTP (localhost:1025)' };
  }
  const smtpHost = env.MAILPIT_SMTP_HOST || process.env.SMTP_HOST;
  if (!smtpHost) {
    return { status: 'NOT_CONFIGURED', details: 'No SMTP host configured' };
  }
  return { status: 'CONFIGURED', details: `SMTP: ${smtpHost}` };
}

async function checkAI() {
  if (isDemoMode) {
    return { status: 'DEMO', details: 'Deterministic DemoAIProvider' };
  }
  const openaiKey = env.OPENAI_API_KEY;
  if (!openaiKey) {
    return { status: 'NOT_CONFIGURED', details: 'No OPENAI_API_KEY set' };
  }
  return { status: 'CONFIGURED', details: 'OpenAI provider available' };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = env.INTERNAL_API_SECRET;
  
  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  const [
    dbResult,
    n8nResult,
    crmResult,
    emailResult,
    aiResult,
  ] = await Promise.all([
    checkService('database', checkDatabase),
    checkService('n8n', checkN8n),
    checkService('crm', checkCRM),
    checkService('email', checkEmail),
    checkService('ai', checkAI),
  ]);

  const services = {
    ...dbResult,
    ...n8nResult,
    ...crmResult,
    ...emailResult,
    ...aiResult,
  };

  const hasDown = Object.values(services).some(s => s.status === 'DOWN');
  const hasDegraded = Object.values(services).some(s => s.status === 'DEGRADED');
  const overallStatus = hasDown ? 'DOWN' : hasDegraded ? 'DEGRADED' : 'UP';

  return NextResponse.json(
    {
      status: overallStatus,
      mode: isDemoMode ? 'DEMO' : 'PRODUCTION',
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      services,
    },
    { status: overallStatus === 'UP' ? 200 : 503 }
  );
}