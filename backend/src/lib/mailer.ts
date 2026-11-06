import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'ANIKA TRADING & CO. <no-reply@anikatrading.com>';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let initialized = false;

function getTransporter() {
  if (initialized) return transporter;
  initialized = true;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      '[Mailer] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing in .env) — emails will be logged to the console instead of sent.'
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Sends an email if SMTP is configured; otherwise logs it to the console so
// local development and not-yet-configured deployments don't hard-fail.
// Never throws — callers (registration, password reset) must succeed even
// if the email can't be delivered.
export async function sendMail({ to, subject, html, text }: SendMailOptions): Promise<void> {
  const client = getTransporter();

  if (!client) {
    console.log(`[Mailer] (SMTP not configured) Would send to ${to}: "${subject}"\n${text || html}`);
    return;
  }

  try {
    await client.sendMail({ from: SMTP_FROM, to, subject, html, text });
  } catch (err: any) {
    console.error(`[Mailer] Failed to send email to ${to}:`, err.message);
  }
}
