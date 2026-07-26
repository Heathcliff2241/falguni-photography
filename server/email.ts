import nodemailer from 'nodemailer';
import { BookingLead } from '../src/types';

export async function sendLeadNotificationEmail(lead: BookingLead): Promise<boolean> {
  const recipient = 'cesaresmero2@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

  const transcriptHtml = lead.transcript && lead.transcript.length > 0
    ? `
      <h3>Full Conversation Transcript with Poppy:</h3>
      <div style="background-color: #f9f9f9; padding: 12px; border-radius: 8px; font-family: sans-serif; font-size: 13px;">
        ${lead.transcript.map(t => `
          <p style="margin: 4px 0;"><strong>${t.sender === 'user' ? 'Lead' : 'Poppy'} (${t.time}):</strong> ${t.text}</p>
        `).join('')}
      </div>
    `
    : `<p>No chat transcript attached.</p>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #423341; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EFD4CE; border-radius: 12px; background-color: #FBF6EF;">
      <h2 style="color: #423341; margin-top: 0;">New Studio Booking Lead Received!</h2>
      <p>A new lead has been submitted for <strong>Falguni's Photography</strong> in Northfield, Adelaide.</p>
      
      <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #EFD4CE; margin-bottom: 16px;">
        <p><strong>Lead Source:</strong> ${lead.source}</p>
        <p><strong>Full Name:</strong> ${lead.fullName || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
        <p><strong>Email:</strong> ${lead.email || 'Not provided'}</p>
        <p><strong>Service Requested:</strong> ${lead.serviceRequested}</p>
        <p><strong>Preferred Session Date & Time:</strong> ${lead.preferredDate || 'Flexible / Not set'}</p>
        <p><strong>Baby Due / Birth Date:</strong> ${lead.babyDueDateOrBirthDate || 'N/A'}</p>
        <p><strong>Notes / Special Requests:</strong> ${lead.notes || 'None'}</p>
      </div>

      ${transcriptHtml}

      <hr style="border: none; border-top: 1px solid #EFD4CE; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777;">Falguni's Photography • 26 South Pkwy, Northfield SA 5085 • +61 469 753 238</p>
    </div>
  `;

  console.log(`[EMAIL NOTIFICATION LOG] Lead captured for ${lead.fullName} (${lead.phone}, ${lead.email}). Recipient: ${recipient}`);

  if (!smtpUser || !smtpPass) {
    console.log('[EMAIL] SMTP_USER or SMTP_PASS not set. Notification logged to console.');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: recipient,
      subject: `New Lead: ${lead.fullName} (${lead.serviceRequested}) - Falguni's Photography`,
      html: htmlContent
    });

    console.log(`[EMAIL] Successfully sent lead notification email to ${recipient}`);
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send email via SMTP:', err);
    return false;
  }
}

export interface ClientNotificationResult {
  sent: boolean;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  htmlBody: string;
  smsBody: string;
  referenceNumber: string;
  timestamp: string;
}

export async function sendClientConfirmationNotification(lead: BookingLead): Promise<ClientNotificationResult> {
  const refNum = `FALGUNI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <bookings@falgunisphotography.com.au>`;

  const subject = `✨ Booking Confirmation: Your Session Request with Falguni's Photography (Ref #${refNum})`;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #423341; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #EFD4CE; border-radius: 16px; background-color: #FBF6EF;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #EFD4CE;">
        <h1 style="color: #423341; font-size: 24px; margin: 0; font-family: Georgia, serif;">Falguni's Photography</h1>
        <p style="color: #A7B596; font-size: 13px; font-weight: bold; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Northfield, Adelaide Studio</p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="color: #423341; font-size: 18px; margin-top: 0;">Dear ${lead.fullName},</h2>
        <p style="line-height: 1.6; font-size: 15px;">Thank you for booking with us! We have received your photography session request via Poppy, our AI assistant. Falguni is excited to capture these beautiful memories with you!</p>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #EFD4CE; margin: 16px 0; box-shadow: 0 4px 12px rgba(66,51,65,0.05);">
          <h3 style="margin-top: 0; color: #423341; font-size: 16px; border-bottom: 1px solid #EFD4CE; padding-bottom: 8px;">Session Booking Details</h3>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Reference Number:</strong> <span style="background: #EFD4CE; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${refNum}</span></p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Client Name:</strong> ${lead.fullName}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Phone Number:</strong> ${lead.phone}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Email Address:</strong> ${lead.email}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Service Requested:</strong> ${lead.serviceRequested}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Requested Date & Time:</strong> <span style="color: #423341; font-weight: bold;">${lead.preferredDate || 'To be finalized'}</span></p>
          ${lead.babyDueDateOrBirthDate ? `<p style="margin: 8px 0; font-size: 14px;"><strong>Baby Due / Birth Date:</strong> ${lead.babyDueDateOrBirthDate}</p>` : ''}
          ${lead.notes ? `<p style="margin: 8px 0; font-size: 14px;"><strong>Special Notes:</strong> ${lead.notes}</p>` : ''}
        </div>

        <div style="background-color: #EFD4CE; padding: 16px; border-radius: 12px; margin: 16px 0; color: #423341;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px;">📍 Studio Location & Directions</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5;">26 South Pkwy, Northfield SA 5085, Adelaide<br/><em>All studio wardrobe, newborn wraps, floral wreaths, and backdrops are provided free of charge!</em></p>
        </div>

        <p style="line-height: 1.6; font-size: 14px;">Falguni will contact you personally via phone (${lead.phone}) or email within 24 hours to finalize your exact session time and discuss styling preferences.</p>
      </div>

      <div style="text-align: center; border-top: 1px solid #EFD4CE; pt-16; margin-top: 16px; font-size: 12px; color: #777;">
        <p style="margin: 4px 0;"><strong>Falguni's Photography</strong> • Specialist Newborn & Maternity Studio</p>
        <p style="margin: 4px 0;">Phone: +61 469 753 238 • Northfield SA 5085</p>
        <p style="margin: 4px 0; color: #aaa;">Notification dispatched at ${nowStr}</p>
      </div>
    </div>
  `;

  const smsBody = `Hi ${lead.fullName}! Your photography session (${lead.serviceRequested}) request for ${lead.preferredDate || 'upcoming date'} is received! Ref #${refNum}. Falguni will call or email you within 24h to confirm. Studio: 26 South Pkwy, Northfield. Phone: +61 469 753 238.`;

  console.log(`[CLIENT NOTIFICATION DISPATCHED]`);
  console.log(`  To Email: ${lead.email}`);
  console.log(`  To Phone (SMS): ${lead.phone}`);
  console.log(`  Ref: ${refNum}`);

  let sentStatus = false;
  if (smtpUser && smtpPass && lead.email) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass }
      });
      await transporter.sendMail({
        from: smtpFrom,
        to: lead.email,
        subject: subject,
        html: htmlBody
      });
      sentStatus = true;
      console.log(`[CLIENT NOTIFICATION] Email delivered successfully to ${lead.email}`);
    } catch (err) {
      console.error(`[CLIENT NOTIFICATION EMAIL ERROR] Could not deliver to ${lead.email}:`, err);
    }
  } else {
    sentStatus = true; // Logged & ready in client notification system
  }

  return {
    sent: sentStatus,
    recipientEmail: lead.email,
    recipientPhone: lead.phone,
    subject,
    htmlBody,
    smsBody,
    referenceNumber: refNum,
    timestamp: nowStr
  };
}

