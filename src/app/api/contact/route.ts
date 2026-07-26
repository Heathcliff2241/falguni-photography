import { NextResponse } from 'next/server';
import { saveLead } from '../../../../server/db';
import { sendLeadNotificationEmail } from '../../../../server/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, serviceRequested, notes } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead = saveLead({
      fullName,
      phone,
      email,
      serviceRequested: serviceRequested || 'general',
      notes,
      source: 'contact_page'
    });

    await sendLeadNotificationEmail(lead);

    return NextResponse.json({
      status: 'ok',
      message: "Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours.",
      leadId: lead.id
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 });
  }
}
