import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDemoMode, env } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkN8nHealth(): Promise<{ status: string; details?: string }> {
  const n8nWebhookUrl = env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl || isDemoMode) {
    return { 
      status: isDemoMode ? 'NOT_CONFIGURED' : 'NOT_CONFIGURED',
      details: isDemoMode ? 'Demo mode - n8n not required' : 'N8N_WEBHOOK_URL not configured'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${n8nWebhookUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return { status: 'UP' };
    } else {
      return { 
        status: 'DEGRADED', 
        details: `n8n responded with ${response.status}` 
      };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'DOWN', details: 'n8n health check timeout' };
    }
    return { 
      status: 'DOWN', 
      details: error instanceof Error ? error.message : 'n8n unreachable' 
    };
  }
}

export async function GET() {
  let dbStatus = 'UP';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'DOWN';
  }

  const n8nHealth = await checkN8nHealth();
  
  const mailpitStatus = isDemoMode ? 'UP' : 'NOT_CONFIGURED';
  const crmStatus = isDemoMode ? 'DEMO' : 'NOT_CONFIGURED';

  const overallStatus = dbStatus === 'DOWN' || n8nHealth.status === 'DOWN' ? 'degraded' : 'healthy';

  return NextResponse.json(
    {
      status: overallStatus,
      mode: isDemoMode ? 'DEMO' : 'PRODUCTION',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        n8n: n8nHealth.status,
        mailpit: mailpitStatus,
        demoCrmAdapter: crmStatus,
      },
      serviceDetails: {
        n8n: n8nHealth.details,
      },
    },
    { status: overallStatus === 'healthy' ? 200 : 503 }
  );
}