import nodemailer from 'nodemailer';
import { BookingLead } from '../src/types';
import {
  renderClientBookingEmail,
  renderStudioLeadEmail,
  renderClientContactEmail
} from './emailTemplates';

export interface ClientNotificationResult {
  sent: boolean;
  recipientEmail: string;
  subject: string;
  htmlBody: string;
  referenceNumber: string;
  timestamp: string;
}

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000
  });
}

/**
 * Sends a notification email to the studio owner (cesaresmero2@gmail.com)
 */
export async function sendLeadNotificationEmail(lead: BookingLead, refNum?: string): Promise<boolean> {
  const recipient = 'cesaresmero2@gmail.com';
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;
  const referenceNumber = refNum || `FALGUNI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });

  const { subject, html, text } = renderStudioLeadEmail(lead, referenceNumber, nowStr);

  console.log(`[STUDIO EMAIL DISPATCH] Lead: ${lead.fullName} (${lead.phone}, ${lead.email}) -> ${recipient}`);

  const transporter = getTransporter();
  if (!transporter) {
    console.log('[STUDIO EMAIL] SMTP_USER or SMTP_PASS not configured. Email logged to console.');
    return true;
  }

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: recipient,
      subject,
      html,
      text
    });
    console.log(`[STUDIO EMAIL] Successfully sent styled lead notification to ${recipient}`);
    return true;
  } catch (err) {
    console.error('[STUDIO EMAIL ERROR] Failed to send email to studio:', err);
    return false;
  }
}

/**
 * Sends a booking confirmation email to the CLIENT (lead.email)
 */
export async function sendClientConfirmationNotification(lead: BookingLead, refNum?: string): Promise<ClientNotificationResult> {
  const referenceNumber = refNum || `FALGUNI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

  const { subject, html, text } = renderClientBookingEmail(lead, referenceNumber, nowStr);

  console.log(`[CLIENT EMAIL DISPATCH] Recipient: ${lead.email} | Ref: ${referenceNumber}`);

  let sentStatus = false;
  const transporter = getTransporter();

  if (transporter && lead.email) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: lead.email,
        subject,
        html,
        text
      });
      sentStatus = true;
      console.log(`[CLIENT EMAIL] Successfully delivered styled confirmation email to ${lead.email}`);
    } catch (err) {
      console.error(`[CLIENT EMAIL ERROR] Failed delivering to ${lead.email}:`, err);
    }
  } else {
    sentStatus = !!lead.email;
  }

  return {
    sent: sentStatus,
    recipientEmail: lead.email,
    subject,
    htmlBody: html,
    referenceNumber,
    timestamp: nowStr
  };
}

/**
 * Sends a contact inquiry confirmation email to the CLIENT (lead.email)
 */
export async function sendClientContactNotification(lead: BookingLead, refNum?: string): Promise<ClientNotificationResult> {
  const referenceNumber = refNum || `FALGUNI-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

  const { subject, html, text } = renderClientContactEmail(lead, referenceNumber, nowStr);

  const transporter = getTransporter();
  let sentStatus = false;

  if (transporter && lead.email) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: lead.email,
        subject,
        html,
        text
      });
      sentStatus = true;
      console.log(`[CLIENT INQUIRY EMAIL] Successfully delivered to ${lead.email}`);
    } catch (err) {
      console.error(`[CLIENT INQUIRY EMAIL ERROR] Failed delivering to ${lead.email}:`, err);
    }
  } else {
    sentStatus = !!lead.email;
  }

  return {
    sent: sentStatus,
    recipientEmail: lead.email,
    subject,
    htmlBody: html,
    referenceNumber,
    timestamp: nowStr
  };
}


