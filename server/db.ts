import fs from 'fs';
import path from 'path';
import { BookingLead } from '../src/types';

// Helper to determine a writable file path (e.g. /tmp in AWS Lambda / Vercel)
function resolveDbPath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'leads_db.json');
  }
  return path.join(process.cwd(), 'server', 'leads_db.json');
}

let inMemoryLeads: BookingLead[] = [];

// Initialize database safely without breaking in read-only environments
try {
  const dbFile = resolveDbPath();
  if (fs.existsSync(dbFile)) {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    inMemoryLeads = JSON.parse(raw);
  }
} catch (err) {
  // Graceful fallback to memory array
  inMemoryLeads = [];
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
    const dbFile = resolveDbPath();
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(inMemoryLeads, null, 2));
  } catch (err) {
    // Non-fatal: in serverless, persistence to disk may be restricted
    console.warn('Note: Could not write leads_db.json to disk (safe in serverless runtime):', err);
  }

  return fullLead;
}

export function getAllLeads(): BookingLead[] {
  return inMemoryLeads;
}

