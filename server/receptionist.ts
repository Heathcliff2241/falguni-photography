import { GoogleGenAI } from '@google/genai';
import { saveLead } from './db';
import { sendLeadNotificationEmail, sendClientConfirmationNotification, ClientNotificationResult } from './email';
import { BookingLead } from '../src/types';

// ---------------------------------------------------------------------------
// Lazy Gemini client
// ---------------------------------------------------------------------------
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!_ai) {
    try {
      _ai = new GoogleGenAI({ apiKey: key });
    } catch {
      return null;
    }
  }
  return _ai;
}

// ---------------------------------------------------------------------------
// System prompt — clean, no legacy brain references
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
// Lightweight booking state extractor
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
  const lower = transcript.toLowerCase();

  // Service
  let service: Service | null = null;
  let serviceLabel: string | null = null;
  if (/cake.smash|first birthday|1st birthday|turning one|turning 1/i.test(transcript)) {
    service = 'cake_smash'; serviceLabel = 'Cake Smash & 1st Birthday';
  } else if (/newborn|baby|infant|due date|5.?14 days/i.test(lower)) {
    service = 'newborn'; serviceLabel = 'Newborn Photography';
  } else if (/maternit|pregnan|gown|28.34 weeks/i.test(lower)) {
    service = 'maternity'; serviceLabel = 'Maternity Photography';
  } else if (/family|toddler|\bkids\b|children/i.test(lower)) {
    service = 'family'; serviceLabel = 'Family Portraits';
  }

  // Date
  const datePatterns = [
    /\b((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})\b/,
    /\b(next\s+(?:week|month|saturday|sunday)|this\s+(?:weekend|saturday|sunday|friday))\b/i,
    /\b(tomorrow)\b/i,
  ];
  let preferredDate: string | null = null;
  for (const re of datePatterns) {
    const m = transcript.match(re);
    if (m?.[1]) { preferredDate = m[1].charAt(0).toUpperCase() + m[1].slice(1); break; }
  }

  // Email
  const emailMatch = transcript.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // Phone (Australian formats)
  const phoneMatch = transcript.match(/(?:\+?61\s?4\d{2}[\s.\-]?\d{3}[\s.\-]?\d{3}|04\d{2}[\s.\-]?\d{3}[\s.\-]?\d{3}|\b0[2-9]\d{8}\b|\b\d{10,11}\b)/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  // Name — look for explicit "my name is X" patterns, or the answer after Aria asked for a name
  let fullName: string | null = null;
  const nameMatch = transcript.match(/(?:my name is|i(?:'m| am)|this is|name:\s*)\s*([A-Z][a-zA-Z'.\-]+(?:\s+[A-Za-z'.\-]+){0,3})/i);
  if (nameMatch?.[1]) fullName = nameMatch[1].trim();

  return { service, serviceLabel, preferredDate, fullName, email, phone };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ReceptionistResult {
  text: string;
  extracted: (Partial<BookingLead> & { notification?: ClientNotificationResult | null }) | null;
  clientNotification: ClientNotificationResult | null;
}

// ---------------------------------------------------------------------------
// Main chat processor
// ---------------------------------------------------------------------------
export async function processReceptionistChat(
  message: string,
  history: ChatHistoryItem[] = []
): Promise<ReceptionistResult> {
  try {
    // Build clean alternating turn list
    const rawItems: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item) continue;
        const text = item.parts?.[0]?.text?.trim() || '';
        if (text.length > 0) rawItems.push({ role: item.role === 'user' ? 'user' : 'model', parts: [{ text }] });
      }
    }
    while (rawItems.length > 0 && rawItems[0].role === 'model') rawItems.shift();

    // Collapse adjacent same-role turns
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
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

    // Call Gemini
    let replyText = '';
    const ai = getAI();
    if (ai) {
      for (const modelId of ['gemini-2.0-flash', 'gemini-2.0-flash-lite']) {
        try {
          const resp = await ai.models.generateContent({
            model: modelId,
            contents,
            config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.65 }
          });
          if (resp?.text) { replyText = resp.text; break; }
        } catch (err) {
          console.warn(`[Receptionist] Model ${modelId} failed:`, err);
        }
      }
    }

    if (!replyText) {
      replyText = "Thank you for reaching out to Falguni's Photography! We'd love to help you book a newborn, maternity, family, or cake smash session. Which session interests you?";
    }

    // Strip thinking blocks and forbidden characters
    replyText = replyText
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .replace(/\s*[—–]\s*/g, ', ')
      .replace(/[—–]/g, ', ')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .trim();

    // Extract booking state from full conversation
    const fullTranscript = [
      ...contents.map(c => `${c.role}: ${c.parts[0]?.text}`),
      `model: ${replyText}`
    ].join('\n');

    const state = extractBookingState(fullTranscript);

    // Guard: only fire booking once — check if a previous model turn already confirmed it
    const alreadyConfirmed = contents.some(
      c => c.role === 'model' && /i have recorded|your reservation|confirmation.*(sent|dispatched|on its way)/i.test(c.parts[0]?.text || '')
    );

    let bookingExtracted: ReceptionistResult['extracted'] = null;
    let clientNotification: ClientNotificationResult | null = null;

    const hasContact = !!(state.email || state.phone);
    if (!alreadyConfirmed && state.fullName && hasContact && state.service && state.preferredDate) {
      const refNum = `FP-${Math.floor(1000 + Math.random() * 9000)}`;
      const transcriptFormatted = contents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'aria',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const lead = saveLead({
        fullName: state.fullName,
        phone: state.phone || 'Not provided',
        email: state.email || '',
        serviceRequested: state.serviceLabel || state.service,
        preferredDate: state.preferredDate,
        notes: message,
        source: 'ai_poppy',
        transcript: transcriptFormatted
      });

      sendLeadNotificationEmail(lead, refNum).catch(err =>
        console.warn('[Receptionist] Studio email error:', err)
      );

      clientNotification = await sendClientConfirmationNotification(lead, refNum).catch(err => {
        console.warn('[Receptionist] Client email error:', err);
        return null;
      });

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

    return { text: replyText, extracted: bookingExtracted, clientNotification };
  } catch (err) {
    console.error('[Receptionist] Fatal error:', err);
    return {
      text: "I'd be happy to help you book a session with Falguni! Please call us at +61 469 753 238 or try again in a moment.",
      extracted: null,
      clientNotification: null
    };
  }
}
