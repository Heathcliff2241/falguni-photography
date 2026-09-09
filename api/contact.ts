import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  renderClientContactEmail,
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

    const { fullName, phone, email, serviceRequested, notes } = body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const leadId = `lead-${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log(`[CONTACT RECEIVED] ${fullName} (${phone}, ${email})`);

    try {
      const dbFile = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
        ? path.join('/tmp', 'leads_db.json')
        : path.join(process.cwd(), 'server', 'leads_db.json');
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const record = { id: leadId, timestamp, fullName, phone, email, serviceRequested: serviceRequested || 'general', notes, source: 'contact_page' };
      let list = [];
      if (fs.existsSync(dbFile)) {
        try { list = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch { list = []; }
      }
      list.unshift(record);
      fs.writeFileSync(dbFile, JSON.stringify(list, null, 2));
    } catch {
      // Non-fatal
    }

    const refNum = `FALGUNI-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });

    const leadData: any = {
      id: leadId,
      timestamp,
      fullName,
      phone,
      email,
      serviceRequested: serviceRequested || 'general',
      notes,
      source: 'contact_page'
    };

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
        const clientEmail = renderClientContactEmail(leadData, refNum, nowStr);
        const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

        const sendTasks: Promise<any>[] = [
          // 1. Studio notification
          transporter.sendMail({
            from: smtpFrom,
            to: 'cesaresmero2@gmail.com',
            subject: `Contact Inquiry: ${fullName} - Falguni's Photography`,
            html: studioEmail.html,
            text: studioEmail.text
          }).then(() => console.log('[CONTACT API] Delivered styled inquiry notification to studio (cesaresmero2@gmail.com)'))
            .catch(e => console.error('[CONTACT API] Failed studio email:', e))
        ];

        // 2. Client confirmation copy
        if (email && email.includes('@')) {
          sendTasks.push(
            transporter.sendMail({
              from: smtpFrom,
              to: email,
              subject: clientEmail.subject,
              html: clientEmail.html,
              text: clientEmail.text
            }).then(() => console.log(`[CONTACT API] Delivered styled confirmation to client (${email})`))
              .catch(e => console.error(`[CONTACT API] Failed client email to ${email}:`, e))
          );
        }

        await Promise.allSettled(sendTasks);
      } catch (emailErr) {
        console.warn('Contact email notification error:', emailErr);
      }
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Thank you for reaching out! A confirmation copy has been sent to your email, and Falguni will respond within 24 hours.',
      leadId,
      referenceNumber: refNum
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to process contact inquiry' });
  }
}
