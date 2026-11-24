// Brevo transactional email via HTTP API — nodemailer SMTP relay ki jagah.
// Same Brevo account, same sender addresses; sirf transport badla hai (bundle slim).
export async function sendBrevoEmail(opts: {
  fromName: string;
  fromEmail: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is missing');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: opts.fromName, email: opts.fromEmail },
      to: [{ email: opts.to }],
      ...(opts.replyTo ? { replyTo: { email: opts.replyTo } } : {}),
      subject: opts.subject,
      htmlContent: opts.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo API ${res.status}: ${text.slice(0, 300)}`);
  }
}
