import fs from 'fs';
import path from 'path';
import { BookingLead } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'server', 'leads_db.json');

// Ensure directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

let inMemoryLeads: BookingLead[] = [];

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryLeads = JSON.parse(raw);
  } catch (err) {
    inMemoryLeads = [];
  }
}

export function saveLead(lead: Partial<BookingLead>): BookingLead {
  const fullLead: BookingLead = {
    id: lead.id || `lead-${Date.now()}`,
    timestamp: lead.timestamp || new Date().toISOString(),
    fullName: lead.fullName || '',
    phone: lead.phone || '',
    email: lead.email || '',
    serviceRequested: lead.serviceRequested || 'newborn',
    preferredDate: lead.preferredDate,
    babyDueDateOrBirthDate: lead.babyDueDateOrBirthDate,
    notes: lead.notes || '',
    source: lead.source || 'ai_poppy',
    transcript: lead.transcript || []
  };

  inMemoryLeads.unshift(fullLead);

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryLeads, null, 2));
  } catch (err) {
    console.error('Error persisting leads_db.json:', err);
  }

  return fullLead;
}

export function getAllLeads(): BookingLead[] {
  return inMemoryLeads;
}
