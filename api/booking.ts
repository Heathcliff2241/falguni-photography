import { saveLead } from '../server/db';
import { sendLeadNotificationEmail } from '../server/email';

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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { fullName, phone, email, serviceRequested, preferredDate, babyDueDateOrBirthDate, notes, source } = body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const lead = saveLead({
      fullName,
      phone,
      email,
      serviceRequested: serviceRequested || 'newborn',
      preferredDate,
      babyDueDateOrBirthDate,
      notes,
      source: source || 'direct_form'
    });

    await sendLeadNotificationEmail(lead);

    return res.status(200).json({
      status: 'ok',
      message: "Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.",
      leadId: lead.id
    });
  } catch (err) {
    console.error('Booking submission error:', err);
    return res.status(500).json({ error: 'Failed to process booking' });
  }
}
