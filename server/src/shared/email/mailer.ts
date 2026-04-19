import nodemailer from 'nodemailer';
import { env } from '@configs/env';
import type { SendMailOptions } from 'nodemailer';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!env.BREVO_SMTP_USER || !env.BREVO_SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.BREVO_SMTP_HOST,
    port: env.BREVO_SMTP_PORT,
    secure: env.BREVO_SMTP_SECURE === 'true',
    auth: {
      user: env.BREVO_SMTP_USER,
      pass: env.BREVO_SMTP_PASS
    }
  });

  return transporter;
}

export function getFromAddress() {
  const fromEmail = env.MAIL_FROM_EMAIL || env.BREVO_SMTP_USER || 'no-reply@example.com';
  const fromName = env.MAIL_FROM_NAME || 'Admin Panel';
  return `"${fromName}" <${fromEmail}>`;
}

export async function sendEmail(options: Omit<SendMailOptions, 'from'>) {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.warn('[mail] SMTP is not configured. Skipping email send.');
    return { skipped: true as const };
  }

  return await mailTransporter.sendMail({
    from: getFromAddress(),
    ...options
  });
}
