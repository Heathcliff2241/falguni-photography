import { NextResponse } from 'next/server';
import { saveLead } from '../../../../server/db';
import { sendLeadNotificationEmail } from '../../../../server/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, serviceRequested, preferredDate, babyDueDateOrBirthDate, notes, source } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    return NextResponse.json({
      status: 'ok',
      message: "Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.",
      leadId: lead.id
    });
  } catch (err) {
    console.error('Booking API Error:', err);
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}
