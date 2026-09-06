import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  renderClientBookingEmail,
  renderStudioLeadEmail
} from '../server/emailTemplates';

// --- Types ---
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
  babyDueDateOrBirthDate?: string;
  notes?: string;
  source?: string;
  transcript?: { sender: string; text: string; time: string }[];
}

interface ClientNotificationResult {
  sent: boolean;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  htmlBody: string;
  referenceNumber: string;
  timestamp: string;
}

// --- Lazy Gemini Client ---
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are Poppy, the warm, gentle, and highly reliable front-desk studio receptionist for Falguni's Photography, a premier portrait studio located at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia (Phone: +61 469 753 238).

RECEPTIONIST THINKING PROCESS REQUIREMENT:
Before writing your response to the client, you MUST perform a brief internal reasoning process enclosed inside <thinking> and </thinking> tags.

Inside <thinking>, explicitly analyze:
1. USER INTENT: What did the client ask or state in their latest message?
2. CONTEXT MEMORY: What details are ALREADY known from chat history? (Session Type, Preferred Date, Full Name, Email, Phone)
3. DIRECT ANSWER: What direct, helpful information answers their query?
4. RECEPTIONIST NEXT STEP: Which single missing detail should be gently asked for next?
5. SANITY CHECK: Verify ZERO emojis and ZERO em-dashes (— or – or --).

STUDIO KNOWLEDGE & DIRECTIVES:
- ALWAYS ANSWER THE USER'S QUESTION DIRECTLY FIRST!
- Falguni's Signature Expertise: Emphasize certified newborn handling safety, physiological soothing techniques, baby-led gentle posing, and sculptural fine-art maternity lighting.
- We offer four boutique portrait sessions: Newborn Photography (2-3 hour baby-led in warm 26°C studio, wraps/bonnets/props provided), Maternity Photography (28-34 weeks, luxury gowns/silk drapes included, partners welcome), Family Portraits (45-60 min relaxed play-led), and Cake Smash & 1st Birthday (themed decor, smash cake, and warm splash bath included).
- All sessions are complete boutique experiences with private proofing galleries and bespoke print/album/digital collections.
- We never rush sessions: newborn sessions are 2-3 unhurried hours in a warm 26°C sanctuary with unlimited nursing/feeding pauses.
- Maternity sessions use sculptural directional lighting to celebrate the maternal silhouette, paired with access to a couture gown and silk wardrobe.
- NEVER repeat a generic greeting or re-ask for details already provided in context.
- Keep the tone deeply gentle, caring, and professional.
- ABSOLUTELY NO EMOJIS AND NO EM DASHES (— OR – OR --) in the final response.
`;

function getSmartFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes('session') ||
    lower.includes('service') ||
    lower.includes('offer') ||
    lower.includes('choose') ||
    lower.includes('option') ||
    lower.includes('tell me') ||
    lower.includes('what do you') ||
    lower.includes('types')
  ) {
    return "We offer four boutique portrait sessions at Falguni's studio:\n\n1. Newborn Photography: Certified safe infant handling and gentle, baby-led posing in our warm 26°C sanctuary (best booked 5 to 14 days after birth). Includes organic wraps, bonnets, floral wreaths, and family connection portraits.\n2. Maternity Photography: Sculptural studio lighting and couture gowns celebrating your pregnancy journey between 28 and 34 weeks. Partners and siblings are warmly included.\n3. Family Portraits: Relaxed 45 to 60 minute play-focused sessions capturing natural laughter and authentic connection.\n4. Cake Smash & 1st Birthday: Custom themed decor, delicious smash cake, milestone portraits, and a warm splash bath with full studio cleanup included.\n\nWhich session type interests you, or would you like me to check Falguni's calendar for an upcoming date?";
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate') || lower.includes('package') || lower.includes('fee')) {
    return "Every session at Falguni's Photography is an unhurried, boutique experience focused on quality, safety, and artistry rather than rushed commercial time slots. Falguni is certified in newborn handling and specializes in gentle, baby-led posing and sculptural maternity lighting. Each session includes dedicated studio time, curated styling, and a private proofing gallery with bespoke archival print, album, and digital collection options. Which type of session are you planning?";
  }
  if (lower.includes('newborn') || lower.includes('baby') || lower.includes('infant')) {
    return "Our newborn sessions emphasize certified infant handling safety, gentle baby-led posing, and unhurried soothing care, lasting 2 to 3 hours in our heated 26°C sanctuary with unlimited nursing pauses. All organic wraps, bonnets, and floral wreaths are lovingly provided. What is your estimated due date or baby's birth date?";
  }
  if (lower.includes('maternity') || lower.includes('pregnant') || lower.includes('bump') || lower.includes('gown') || lower.includes('dress')) {
    return "Maternity sessions celebrate your pregnancy with Falguni's signature sculptural studio lighting, delicately flattering maternal contours, alongside access to our couture gown and silk wardrobe. Partners and siblings are always warmly included (best booked 28 to 34 weeks). What month or date range works best for you?";
  }
  if (lower.includes('family') || lower.includes('kids') || lower.includes('children') || lower.includes('parents')) {
    return "Our family sessions are relaxed and play-focused, lasting around 45 to 60 minutes. We create an encouraging, pressure-free atmosphere where children can laugh and be themselves, resulting in natural family portraits. Would you like to check Falguni's availability for an upcoming weekend or weekday session?";
  }
  if (lower.includes('cake') || lower.includes('smash') || lower.includes('birthday') || lower.includes('1st')) {
    return "Cake smash sessions are a joyful way to honor baby's first birthday! We provide a custom balloon backdrop, a delicious smash cake, milestone portraits beforehand, and a warm splash bath setup afterwards, along with complete studio cleanup. What date is your little one turning one?";
  }
  if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('studio') || lower.includes('park')) {
    return "Falguni's studio is located at 26 South Pkwy, Northfield SA 5085, Australia. It is a quiet, comfortable sanctuary with easy driveway parking and dedicated nursing nooks. May I ask your name and preferred session date so I can check our schedule for you?";
  }
  if (lower.includes('falguni') || lower.includes('photographer') || lower.includes('who') || lower.includes('experience')) {
    return "Falguni is a specialized portrait photographer with over 3 years of experience and 56 five-star Google reviews. She holds dedicated training in certified newborn handling, infant airway safety, gentle baby-led posing, and sculptural maternity lighting. Would you like to reserve a date on Falguni's calendar?";
  }
  if (lower.includes('book') || lower.includes('reserve') || lower.includes('schedule') || lower.includes('date') || lower.includes('time')) {
    return "I would be delighted to help reserve your date right here. To hold your spot on Falguni's calendar, could you share your Full Name, Phone Number, Email Address, and your preferred session date or due date?";
  }
  return "Thank you for reaching out to Falguni's Photography in Northfield. We specialize in calm, patient sessions tailored to your family's rhythm. Which photography session are you interested in, and what date or month works best for you?";
}

// --- In-Memory Lead Store (Serverless Safe) ---
const inMemoryLeads: BookingLead[] = [];

function saveLeadSafe(lead: Partial<BookingLead>): BookingLead {
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

  // Safely attempt disk persistence in writable directory
  try {
    const dbFile = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? path.join('/tmp', 'leads_db.json')
      : path.join(process.cwd(), 'server', 'leads_db.json');
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(inMemoryLeads, null, 2));
  } catch {
    // Non-fatal in serverless environments
  }

  return fullLead;
}

// --- Safe Styled Email Dispatch ---
async function dispatchLeadNotification(lead: BookingLead, refNum: string, nowStr: string): Promise<void> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.log('[LEAD CAPTURED] Notification logged (SMTP_USER/PASS not set):', lead.fullName, lead.phone, lead.email);
    return;
  }

  const studioEmail = renderStudioLeadEmail(lead, refNum, nowStr);
  const clientEmail = renderClientBookingEmail(lead, refNum, nowStr);
  const smtpFrom = process.env.SMTP_FROM || `"Falguni's Photography" <noreply@falgunisphotography.com.au>`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 8000,
      greetingTimeout: 8000
    });

    const sendPromises: Promise<any>[] = [
      // 1. Studio notification to Falguni / owner
      transporter.sendMail({
        from: smtpFrom,
        to: 'cesaresmero2@gmail.com',
        subject: studioEmail.subject,
        html: studioEmail.html,
        text: studioEmail.text
      }).then(() => console.log('[EMAIL] Successfully sent styled lead notification to studio (cesaresmero2@gmail.com)'))
        .catch(err => console.error('[EMAIL ERROR] Failed sending to studio:', err))
    ];

    // 2. Client confirmation email sent directly to client
    if (lead.email && lead.email.includes('@')) {
      sendPromises.push(
        transporter.sendMail({
          from: smtpFrom,
          to: lead.email,
          subject: clientEmail.subject,
          html: clientEmail.html,
          text: clientEmail.text
        }).then(() => console.log(`[EMAIL] Successfully sent styled confirmation email to client (${lead.email})`))
          .catch(err => console.error(`[EMAIL ERROR] Failed sending to client (${lead.email}):`, err))
      );
    }

    await Promise.allSettled(sendPromises);
  } catch (err) {
    console.warn('[EMAIL NOTIFICATION SKIPPED/ERROR]:', err);
  }
}

// --- Main Chat Processing Engine ---
async function processPoppy(message: string, history: ChatHistoryItem[] = []) {
  try {
    const rawItems: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item) continue;
        const role = item.role === 'user' ? 'user' : 'model';
        const text = item.parts?.[0]?.text || '';
        if (text.trim().length > 0) {
          rawItems.push({ role, parts: [{ text: text.trim() }] });
        }
      }
    }

    while (rawItems.length > 0 && rawItems[0].role === 'model') {
      rawItems.shift();
    }

    const formattedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const item of rawItems) {
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
        formattedContents[formattedContents.length - 1].parts[0].text += '\n' + item.parts[0].text;
      } else {
        formattedContents.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
      }
    }

    if (
      formattedContents.length === 0 ||
      formattedContents[formattedContents.length - 1].role !== 'user'
    ) {
      formattedContents.push({ role: 'user', parts: [{ text: message }] });
    }

    let rawReply = '';
    const ai = getAI();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7
          }
        });
        rawReply = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call unsuccessful, using intelligent fallback:', geminiError);
        rawReply = getSmartFallbackReply(message);
      }
    } else {
      rawReply = getSmartFallbackReply(message);
    }

    if (!rawReply) {
      rawReply = getSmartFallbackReply(message);
    }

    // Strip thinking blocks
    let cleanReply = rawReply
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .trim();

    if (!cleanReply) {
      cleanReply = "I would be delighted to assist you with booking your portrait session at Falguni's studio in Northfield. Which session type are you interested in, or what date do you prefer?";
    }

    // Strip all emojis, em-dashes, and en-dashes strictly
    const replyText = cleanReply
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s*—\s*/g, ', ')
      .replace(/\s*–\s*/g, ', ')
      .replace(/\s*--\s*/g, ', ')
      .replace(/—/g, ', ')
      .replace(/–/g, ', ')
      .trim();

    // Extract details from full accumulated transcript
    const fullTranscriptText = formattedContents.map(c => `${c.role}: ${c.parts[0]?.text}`).join('\n') + `\nmodel: ${replyText}`;
    const emailMatch = fullTranscriptText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = fullTranscriptText.match(/(?:\+?61|0)4\d{8}|0[2-9]\d{8}|\+?\d{10,12}/);
    const dateMatch = fullTranscriptText.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|mon|tue|wed|thu|fri|sat|sun|today|tomorrow|next|202\d|\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);

    let serviceRequested = 'Newborn Photography';
    const lowerTranscript = fullTranscriptText.toLowerCase();
    if (lowerTranscript.includes('maternity') || lowerTranscript.includes('bump')) {
      serviceRequested = 'Maternity Photography';
    } else if (lowerTranscript.includes('family') || lowerTranscript.includes('portrait')) {
      serviceRequested = 'Family Photography';
    } else if (lowerTranscript.includes('cake') || lowerTranscript.includes('smash') || lowerTranscript.includes('birthday')) {
      serviceRequested = 'Cake Smash Photography';
    } else if (lowerTranscript.includes('newborn') || lowerTranscript.includes('baby')) {
      serviceRequested = 'Newborn Photography';
    }

    let fullName = 'Valued Client';
    const namePatterns = [
      /my name is ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /i'm ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /name:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /this is ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
    ];
    for (const pat of namePatterns) {
      const match = fullTranscriptText.match(pat);
      if (match && match[1]) {
        fullName = match[1].trim();
        break;
      }
    }

    let bookingExtracted: any = null;
    let clientNotification: ClientNotificationResult | null = null;

    if (emailMatch || phoneMatch) {
      const preferredDate = dateMatch ? dateMatch[0] : 'Upcoming Session';

      const transcriptFormatted = formattedContents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'poppy',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const leadRecord = saveLeadSafe({
        fullName,
        phone: phoneMatch ? phoneMatch[0] : '',
        email: emailMatch ? emailMatch[0] : '',
        serviceRequested,
        preferredDate,
        notes: message,
        source: 'ai_poppy',
        transcript: transcriptFormatted
      });

      const refNum = `FALGUNI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Adelaide', dateStyle: 'full', timeStyle: 'short' });
      const clientEmailData = renderClientBookingEmail(leadRecord, refNum, nowStr);

      // Non-blocking styled email dispatch to BOTH studio and client
      dispatchLeadNotification(leadRecord, refNum, nowStr).catch(err => {
        console.warn('Background email dispatch error:', err);
      });

      clientNotification = {
        sent: true,
        recipientEmail: leadRecord.email,
        recipientPhone: leadRecord.phone,
        subject: clientEmailData.subject,
        htmlBody: clientEmailData.html,
        referenceNumber: refNum,
        timestamp: nowStr
      };

      bookingExtracted = {
        id: leadRecord.id,
        fullName: leadRecord.fullName,
        phone: leadRecord.phone,
        email: leadRecord.email,
        serviceRequested: leadRecord.serviceRequested,
        preferredDate: leadRecord.preferredDate,
        timestamp: leadRecord.timestamp,
        notification: clientNotification
      };
    }

    return {
      text: replyText,
      extracted: bookingExtracted,
      clientNotification
    };
  } catch (err) {
    console.error('Poppy processing error:', err);
    return {
      text: "I would be delighted to assist you with booking your session! You can also click 'Book Session' above or call Falguni directly at +61 469 753 238.",
      extracted: null,
      clientNotification: null
    };
  }
}

// --- Vercel Serverless Handler ---
export default async function handler(req: any, res: any) {
  // Always set CORS headers
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

    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await processPoppy(message, history || []);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Unhandled Vercel API chat error:', error);
    // NEVER throw 500: Always return a helpful 200 fallback response for Poppy
    return res.status(200).json({
      text: "Thank you for reaching out to Falguni's Photography in Northfield. We offer peaceful Newborn, Maternity, Family, and Cake Smash sessions with all styling and props provided. Which session type would you like to explore?",
      extracted: null,
      clientNotification: null
    });
  }
}
