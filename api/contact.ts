import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user: smtpUser, pass: smtpPass },
          connectionTimeout: 5000,
          greetingTimeout: 5000
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`,
          to: 'cesaresmero2@gmail.com',
          subject: `Contact Inquiry: ${fullName} - Falguni's Photography`,
          text: `Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nService: ${serviceRequested || 'General'}\nNotes: ${notes || 'None'}`
        });
      } catch (emailErr) {
        console.warn('Contact email notification error:', emailErr);
      }
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Thank you for reaching out. Falguni will respond within 24 hours.',
      leadId
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to process contact inquiry' });
  }
}
