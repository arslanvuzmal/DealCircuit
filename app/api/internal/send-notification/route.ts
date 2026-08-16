import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createInAppNotification } from '@/lib/observability/logger';
import { sendEmailViaMailpit } from '@/lib/email/mailpit';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-internal-secret');
    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized internal request' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, subject, htmlBody, type } = body;

    await createInAppNotification({
      title: title || subject || 'DealCircuit Notification',
      message: message || 'System digest update',
      type: type || 'SYSTEM',
    });

    if (subject && htmlBody) {
      await sendEmailViaMailpit({
        to: 'digest-recipient@leadpilot.ai',
        subject,
        body: htmlBody,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
