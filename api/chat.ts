import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { renderClientBookingEmail, renderStudioLeadEmail } from './_emailTemplates.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface BookingLead {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  serviceRequested: string;
  preferredDate?: string;
  notes?: string;
  source?: string;
  transcript?: { sender: string; text: string; time: string }[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `
You are Aria, the warm, professional AI studio receptionist for Falguni's Photography — a premier boutique portrait studio at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia. Studio phone: +61 469 753 238.

PERSONA
- Speak with warmth, elegance, and genuine care. You are a trusted concierge, not a chatbot.
- Never use emojis. Never use em-dashes (— or –). Use commas or periods instead.
- Never repeat information you have already shared in this conversation.
- Always answer the client's question directly before asking for anything.
- Address clients by their first name once you learn it.

STUDIO KNOWLEDGE
Sessions offered:
1. Newborn Photography — 2 to 3 hour baby-led session in a warm 26-degree sanctuary. Ideal at 5 to 14 days old. Wraps, bonnets, organic props, and parent poses all included.
2. Maternity Photography — Best between 28 and 34 weeks. Luxury gown and silk drape wardrobe included. Partners and siblings welcome. Sculptural directional lighting.
3. Family Portraits — 45 to 60 minute relaxed play-led session. Designed around genuine connection.
4. Cake Smash and First Birthday — Themed balloon backdrop, custom smash cake, milestone portraits, and a warm vintage splash bath. Full studio cleanup included.

All sessions include private proofing gallery, bespoke print, album, and digital collection options.
A 100-dollar deposit secures the studio date on Falguni's calendar.
Studio is 15 minutes from Adelaide CBD with free private driveway parking.
Falguni has 3+ years of experience, 56 five-star reviews, and holds certifications in newborn handling and airway safety.

BOOKING FLOW
Guide clients naturally through booking. Collect these four details in a conversational way:
1. Session type (Newborn, Maternity, Family, or Cake Smash)
2. Preferred date or baby's due date / first birthday
3. Client's full name
4. Email address and phone number

Once all four are known, warmly confirm the reservation. Tell the client that Falguni will personally review the calendar and confirm within 24 hours, and that a styled confirmation email is on its way.

RULES
- Do not re-ask for information already provided.
- Do not repeat session descriptions you have already given.
- If asked about pricing, mention the 100-dollar deposit and note that full collection pricing is shared after the session during the private gallery viewing.
- If asked something outside studio scope, politely redirect to Falguni's contact number: +61 469 753 238.
`;

// ---------------------------------------------------------------------------
// Zero-dependency, pure fetch Gemini caller (serverless safe, no child_process)
// ---------------------------------------------------------------------------
async function callGeminiApi(contents: ChatHistoryItem[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return '';

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            temperature: 0.65
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errBody = await res.text();
        console.warn(`[Gemini API] ${model} responded with HTTP ${res.status}:`, errBody);
      }
    } catch (err) {
      console.warn(`[Gemini API] ${model} fetch failed:`, err);
    }
  }
  return '';
}

// ---------------------------------------------------------------------------
// Lightweight booking state extraction
// ---------------------------------------------------------------------------
type Service = 'newborn' | 'maternity' | 'family' | 'cake_smash';

interface BookingState {
  service: Service | null;
  serviceLabel: string | null;
  preferredDate: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
}

function extractBookingState(transcript: string): BookingState {
  let service: Service | null = null;
  let serviceLabel: string | null = null;

  if (/cake.smash|first birthday|1st birthday|turning one|turning 1/i.test(transcript)) {
    service = 'cake_smash'; serviceLabel = 'Cake Smash & 1st Birthday';
  } else if (/newborn|infant|due date|5.?14 days/i.test(transcript)) {
    service = 'newborn'; serviceLabel = 'Newborn Photography';
  } else if (/maternit|pregnan|gown|28.34 weeks/i.test(transcript)) {
    service = 'maternity'; serviceLabel = 'Maternity Photography';
  } else if (/\bfamily\b|toddler|\bkids\b|children/i.test(transcript)) {
    service = 'family'; serviceLabel = 'Family Portraits';
  }

  const datePatterns = [
    /\b((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4})\b/,
    /\b(next\s+(?:week|month|saturday|sunday)|this\s+(?:weekend|saturday|sunday|friday))\b/i,
    /\b(tomorrow)\b/i,
  ];
  let preferredDate: string | null = null;
  for (const re of datePatterns) {
    const m = transcript.match(re);
    if (m?.[1]) { preferredDate = m[1].charAt(0).toUpperCase() + m[1].slice(1); break; }
  }

  const emailMatch = transcript.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = transcript.match(/(?:\+?61\s?4\d{2}[\s.\-]?\d{3}[\s.\-]?\d{3}|04\d{2}[\s.\-]?\d{3}[\s.\-]?\d{3}|\b0[2-9]\d{8}\b|\b\d{10,11}\b)/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  let fullName: string | null = null;
  const nameMatch = transcript.match(/(?:my name is|i(?:'m| am)|this is|name:\s*)\s*([A-Z][a-zA-Z'.\-]+(?:\s+[A-Za-z'.\-]+){0,3})/i);
  if (nameMatch?.[1]) fullName = nameMatch[1].trim();

  return { service, serviceLabel, preferredDate, fullName, email, phone };
}

// ---------------------------------------------------------------------------
// Lead persistence (serverless safe)
// ---------------------------------------------------------------------------
const _inMemoryLeads: BookingLead[] = [];

function saveLeadSafe(lead: Partial<BookingLead>): BookingLead {
  const full: BookingLead = {
    id: `lead-${Date.now()}`,
    timestamp: new Date().toISOString(),
    fullName: lead.fullName || '',
    phone: lead.phone || '',
    email: lead.email || '',
    serviceRequested: lead.serviceRequested || 'studio session',
    preferredDate: lead.preferredDate,
    notes: lead.notes || '',
    source: lead.source || 'ai_receptionist',
    transcript: lead.transcript || []
  };
  _inMemoryLeads.unshift(full);
  try {
    const dbFile = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? path.join('/tmp', 'leads_db.json')
      : path.join(process.cwd(), 'server', 'leads_db.json');
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(_inMemoryLeads, null, 2));
  } catch { /* non-fatal */ }
  return full;
}

// ---------------------------------------------------------------------------
// Email dispatch (serverless safe)
// ---------------------------------------------------------------------------
async function dispatchEmails(lead: BookingLead, refNum: string, nowStr: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.log('[RECEPTIONIST EMAIL] SMTP not configured — lead logged:', lead.fullName, lead.email);
    return;
  }
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;
  const studioEmail = renderStudioLeadEmail(lead, refNum, nowStr);
  const clientEmail = renderClientBookingEmail(lead, refNum, nowStr);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587, secure: false,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 8000, greetingTimeout: 8000
    });
    await Promise.allSettled([
      transporter.sendMail({ from: smtpFrom, to: 'cesaresmero2@gmail.com', subject: studioEmail.subject, html: studioEmail.html, text: studioEmail.text })
        .then(() => console.log('[EMAIL] Studio notification sent'))
        .catch(e => console.error('[EMAIL] Studio send failed:', e)),
      lead.email && lead.email.includes('@')
        ? transporter.sendMail({ from: smtpFrom, to: lead.email, subject: clientEmail.subject, html: clientEmail.html, text: clientEmail.text })
            .then(() => console.log(`[EMAIL] Client confirmation sent to ${lead.email}`))
            .catch(e => console.error(`[EMAIL] Client send failed:`, e))
        : Promise.resolve()
    ]);
  } catch (e) {
    console.warn('[EMAIL] Dispatch error:', e);
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    } else if (Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString('utf-8')); } catch { body = {}; }
    }
    body = body || {};

    const { message, history } = body;
    if (!message || typeof message !== 'string') {
      return res.status(200).json({
        text: "Good day! I am Aria, the studio receptionist for Falguni's Photography. How can I assist you with your booking or inquiries today?",
        extracted: null,
        clientNotification: null
      });
    }

    // Build clean turn list
    const rawItems: ChatHistoryItem[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item) continue;
        const text = item.parts?.[0]?.text?.trim() || '';
        if (text) rawItems.push({ role: item.role === 'user' ? 'user' : 'model', parts: [{ text }] });
      }
    }
    while (rawItems.length > 0 && rawItems[0].role === 'model') rawItems.shift();

    const contents: ChatHistoryItem[] = [];
    for (const item of rawItems) {
      if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
        contents[contents.length - 1].parts[0].text += '\n' + item.parts[0].text;
      } else {
        contents.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
      }
    }
    if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    // Call Gemini with pure fetch
    let replyText = await callGeminiApi(contents);

    if (!replyText) {
      replyText = "Welcome to Falguni's Photography! We specialize in gentle newborn, fine-art maternity, family, and cake smash sessions. How can I help you today?";
    }

    // Clean output
    replyText = replyText
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .replace(/\s*[—–]\s*/g, ', ')
      .replace(/[—–]/g, ', ')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .trim();

    // Extract booking state
    const fullTranscript = [
      ...contents.map(c => `${c.role}: ${c.parts[0]?.text}`),
      `model: ${replyText}`
    ].join('\n');
    const state = extractBookingState(fullTranscript);

    const alreadyConfirmed = contents.some(
      c => c.role === 'model' && /i have recorded|your reservation|confirmation.*(sent|dispatched|on its way)/i.test(c.parts[0]?.text || '')
    );

    let bookingExtracted: any = null;
    let clientNotification: any = null;

    const hasContact = !!(state.email || state.phone);
    if (!alreadyConfirmed && state.fullName && hasContact && state.service && state.preferredDate) {
      const refNum = `FP-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });
      const transcript = contents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'aria',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const lead = saveLeadSafe({
        fullName: state.fullName,
        phone: state.phone || 'Not provided',
        email: state.email || '',
        serviceRequested: state.serviceLabel || state.service,
        preferredDate: state.preferredDate,
        notes: message,
        source: 'ai_receptionist',
        transcript
      });

      dispatchEmails(lead, refNum, nowStr).catch(e => console.warn('[API/chat] Email error:', e));

      const clientEmailData = renderClientBookingEmail(lead, refNum, nowStr);
      clientNotification = {
        sent: true,
        recipientEmail: lead.email,
        subject: clientEmailData.subject,
        htmlBody: clientEmailData.html,
        referenceNumber: refNum,
        timestamp: nowStr
      };

      bookingExtracted = {
        id: lead.id,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        serviceRequested: lead.serviceRequested,
        preferredDate: lead.preferredDate,
        timestamp: lead.timestamp,
        notification: clientNotification
      };
    }

    return res.status(200).json({ text: replyText, extracted: bookingExtracted, clientNotification });
  } catch (err) {
    console.error('[API/chat] Unhandled error caught gracefully:', err);
    return res.status(200).json({
      text: "Thank you for getting in touch with Falguni's Photography! We would love to assist you with booking a newborn, maternity, family, or cake smash session. Please call us at +61 469 753 238 or click 'Book Your Session'.",
      extracted: null,
      clientNotification: null
    });
  }
}
