import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { recordWorkflowExecution } from '@/lib/observability/logger';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const body = await request.json();
    const { workflowName, executionId, status, details } = body;

    const record = await recordWorkflowExecution({
      workflowName: workflowName || 'n8n-workflow',
      executionId,
      status: status || 'SUCCESS',
      details,
    });

    return NextResponse.json({ success: true, runId: record.id });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
