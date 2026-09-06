import { getResendClient, getFromAddress } from './resend';
import { buildWelcomeEmail, buildPasswordResetEmail } from './templates';

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('RESEND_API_KEY not configured — skipping welcome email');
    return;
  }
  const { subject, html } = buildWelcomeEmail(name);
  try {
    await resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string, appUrl?: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('RESEND_API_KEY not configured — skipping password reset email');
    return;
  }
  const { subject, html } = buildPasswordResetEmail(name, resetUrl, appUrl);
  try {
    await resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}

const BATCH_SIZE = 100;

export interface MassEmailResult {
  totalRecipients: number;
  sent: number;
  failed: number;
  errors: string[];
}

export async function sendMassEmail(opts: {
  recipients: string[];
  subject: string;
  html: string;
}): Promise<MassEmailResult> {
  const resend = getResendClient();
  const result: MassEmailResult = {
    totalRecipients: opts.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  if (!resend) {
    result.failed = opts.recipients.length;
    result.errors.push('RESEND_API_KEY is not configured on the server');
    return result;
  }

  const from = getFromAddress();
  const chunks: string[][] = [];
  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    chunks.push(opts.recipients.slice(i, i + BATCH_SIZE));
  }

  for (const chunk of chunks) {
    try {
      const { error } = await resend.batch.send(
        chunk.map((to) => ({
          from,
          to,
          subject: opts.subject,
          html: opts.html,
        }))
      );
      if (error) {
        result.failed += chunk.length;
        result.errors.push(error.message);
      } else {
        result.sent += chunk.length;
      }
    } catch (error) {
      result.failed += chunk.length;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error sending batch');
    }
  }

  return result;
}
