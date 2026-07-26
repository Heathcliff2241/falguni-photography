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
        <p><strong>Preferred Session Date:</strong> ${lead.preferredDate || 'Flexible / Not set'}</p>
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
