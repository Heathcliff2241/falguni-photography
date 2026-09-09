import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  renderClientBookingEmail,
  renderStudioLeadEmail
} from './_emailTemplates.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const { fullName, phone, email, serviceRequested, preferredDate, babyDueDateOrBirthDate, notes, source } = body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const leadId = `lead-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Log to console for serverless visibility
    console.log(`[BOOKING RECEIVED] ${fullName} (${phone}, ${email}) - ${serviceRequested} for ${preferredDate}`);

    // Safe disk write if supported
    try {
      const dbFile = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
        ? path.join('/tmp', 'leads_db.json')
        : path.join(process.cwd(), 'server', 'leads_db.json');
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const record = { id: leadId, timestamp, fullName, phone, email, serviceRequested, preferredDate, babyDueDateOrBirthDate, notes, source: source || 'direct_form' };
      let list = [];
      if (fs.existsSync(dbFile)) {
        try { list = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch { list = []; }
      }
      list.unshift(record);
      fs.writeFileSync(dbFile, JSON.stringify(list, null, 2));
    } catch {
      // Non-fatal
    }

    const refNum = `FALGUNI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });

    const leadData: any = {
      id: leadId,
      timestamp,
      fullName,
      phone,
      email,
      serviceRequested: serviceRequested || 'newborn',
      preferredDate,
      babyDueDateOrBirthDate,
      notes,
      source: source || 'direct_form'
    };

    // Attempt email dispatch if credentials exist
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user: smtpUser, pass: smtpPass },
          connectionTimeout: 8000,
          greetingTimeout: 8000
        });

        const studioEmail = renderStudioLeadEmail(leadData, refNum, nowStr);
        const clientEmail = renderClientBookingEmail(leadData, refNum, nowStr);
        const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

        const sendTasks: Promise<any>[] = [
          // 1. Studio notification
          transporter.sendMail({
            from: smtpFrom,
            to: 'cesaresmero2@gmail.com',
            subject: studioEmail.subject,
            html: studioEmail.html,
            text: studioEmail.text
          }).then(() => console.log('[BOOKING API] Delivered styled lead notification to studio (cesaresmero2@gmail.com)'))
            .catch(e => console.error('[BOOKING API] Failed studio email:', e))
        ];

        // 2. Client confirmation email
        if (email && email.includes('@')) {
          sendTasks.push(
            transporter.sendMail({
              from: smtpFrom,
              to: email,
              subject: clientEmail.subject,
              html: clientEmail.html,
              text: clientEmail.text
            }).then(() => console.log(`[BOOKING API] Delivered styled booking confirmation to client (${email})`))
              .catch(e => console.error(`[BOOKING API] Failed client email to ${email}:`, e))
          );
        }

        await Promise.allSettled(sendTasks);
      } catch (emailErr) {
        console.warn('Booking email notification error:', emailErr);
      }
    }

    return res.status(200).json({
      status: 'ok',
      message: "Got it, thank you! I've passed your details along to Falguni. A styled booking confirmation has been sent to your email, and Falguni will confirm your session within 24 hours.",
      leadId,
      referenceNumber: refNum
    });
  } catch (err) {
    console.error('Booking submission error:', err);
    return res.status(500).json({ error: 'Failed to process booking' });
  }
}
