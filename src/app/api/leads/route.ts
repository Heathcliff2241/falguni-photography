import { NextResponse } from 'next/server';
import { getAllLeads } from '../../../../server/db';

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    console.error('Get Leads Error:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
