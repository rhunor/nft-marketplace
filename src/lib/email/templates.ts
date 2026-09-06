const COLORS = {
  bg: '#0a0a0b',
  card: '#1c1c1f',
  border: '#27272a',
  text: '#fafafa',
  muted: '#a1a1aa',
  primary: '#8b5cf6',
  secondary: '#a78bfa',
};

export function buildEmailLayout(opts: {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}): string {
  const { preheader, heading, bodyHtml, ctaLabel, ctaUrl } = opts;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foundationexclusive.app';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Foundation Exclusive</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <img src="${appUrl}/images/logo-email.png" alt="Foundation Exclusive" width="140" style="display:block;margin:0 auto;height:auto;max-width:140px;" />
            </td>
          </tr>
          <tr>
            <td style="background-color:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;padding:36px 32px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${COLORS.text};font-weight:700;">${heading}</h1>
              <div style="font-size:15px;line-height:1.7;color:${COLORS.muted};">${bodyHtml}</div>
              ${
                ctaLabel && ctaUrl
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                      <tr>
                        <td style="border-radius:10px;background-color:${COLORS.primary};">
                          <a href="${ctaUrl}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${ctaLabel}</a>
                        </td>
                      </tr>
                    </table>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;text-align:center;font-size:12px;color:${COLORS.muted};">
              <p style="margin:0 0 4px;">An extension of Foundation &mdash; the premier destination for exclusive NFT collectors.</p>
              <p style="margin:0;"><a href="${appUrl}" style="color:${COLORS.secondary};text-decoration:none;">${appUrl.replace(/^https?:\/\//, '')}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail(name: string): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foundationexclusive.app';
  const subject = `Welcome to Foundation Exclusive, ${name}`;
  const html = buildEmailLayout({
    preheader: 'Your Foundation Exclusive account is ready.',
    heading: `Welcome aboard, ${name} 👋`,
    bodyHtml: `
      <p style="margin:0 0 14px;">Your account has been created and you're officially part of Foundation Exclusive &mdash; a curated community for serious NFT collectors.</p>
      <p style="margin:0 0 14px;">Here's what you can do next:</p>
      <ul style="margin:0 0 14px;padding-left:20px;">
        <li style="margin-bottom:6px;">Browse hand-picked collections from elite artists</li>
        <li style="margin-bottom:6px;">Fund your wallet to start collecting</li>
        <li style="margin-bottom:6px;">List and showcase your own work to a curated audience</li>
      </ul>
      <p style="margin:0;">If you have any questions, contact our support on <a href="https://t.me/foundationexclusive" style="color:${COLORS.secondary};text-decoration:none;">Telegram</a> or <a href="mailto:foundationexclusivenft@gmail.com" style="color:${COLORS.secondary};text-decoration:none;">Email</a>.</p>
    `,
    ctaLabel: 'Explore Collections',
    ctaUrl: `${appUrl}/explore`,
  });
  return { subject, html };
}

export function buildPasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  const subject = 'Reset your Foundation Exclusive password';
  const html = buildEmailLayout({
    preheader: 'Use this link to reset your password. It expires in 1 hour.',
    heading: `Reset your password, ${name}`,
    bodyHtml: `
      <p style="margin:0 0 14px;">We received a request to reset the password for your Foundation Exclusive account.</p>
      <p style="margin:0 0 14px;">Click the button below to choose a new password. This link will expire in 1 hour.</p>
      <p style="margin:0;">If you didn't request this, you can safely ignore this email &mdash; your password will remain unchanged.</p>
    `,
    ctaLabel: 'Reset Password',
    ctaUrl: resetUrl,
  });
  return { subject, html };
}
