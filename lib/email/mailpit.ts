import { env } from '../env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  leadId?: string;
}

export async function sendEmailViaMailpit(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Mailpit Adapter] Dispatching email to ${options.to} (Host: ${env.MAILPIT_SMTP_HOST}:${env.MAILPIT_SMTP_PORT})`);
  console.log(`[Mailpit Subject] ${options.subject}`);
  console.log(`[Mailpit Body]\n${options.body}\n---`);

  // In local demo mode, simulate clean dispatch to Mailpit
  return {
    success: true,
    messageId: `mailpit_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
}
