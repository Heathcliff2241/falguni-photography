import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  renderClientBookingEmail,
  renderStudioLeadEmail
} from './_emailTemplates';
import { extractConversationState, generateContextualResponse, ChatTurn } from './_poppyBrain';

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
      // Note: httpOptions is not supported in @google/genai v2.x constructor.
      // The SDK automatically picks up GEMINI_API_KEY from env, but we pass
      // it explicitly here so it works regardless of env var naming.
      aiClient = new GoogleGenAI({ apiKey: key });
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
  return generateContextualResponse([], message).text;
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

    // Analyze accumulated conversation history
    const chatTurns: ChatTurn[] = rawItems.map(item => ({
      sender: item.role === 'user' ? 'user' : 'poppy',
      text: item.parts[0]?.text || ''
    }));
    const convState = extractConversationState(chatTurns, message);

    // Calculate the precise, single goal for the current turn based on state
    let turnDirective = '';
    if (convState.missingFields.includes('service')) {
      turnDirective = `The client has not yet chosen a session type. Help them choose between Newborn, Maternity, Family, or Cake Smash with boutique warmth.`;
    } else if (convState.missingFields.includes('date')) {
      turnDirective = `The client selected ${convState.serviceLabel}, but has not specified a date. Acknowledge their choice warmly and ask for their preferred date or baby's due date.`;
    } else if (convState.missingFields.includes('name')) {
      turnDirective = `The client selected ${convState.serviceLabel} for ${convState.preferredDate}. Acknowledge this date with excitement for their milestone, and kindly ask for their Full Name to note on Falguni's studio calendar. DO NOT ask what session or date they want!`;
    } else if (convState.missingFields.includes('contact')) {
      turnDirective = `The client is ${convState.fullName} booking ${convState.serviceLabel} for ${convState.preferredDate}. Warmly address them by name and ask for their email address and phone number so Falguni can send the confirmation and styling guide. DO NOT ask for their name again!`;
    } else {
      turnDirective = `All booking details are already confirmed (Session: ${convState.serviceLabel}, Date: ${convState.preferredDate}, Name: ${convState.fullName}, Contact: ${convState.email || convState.phone}). The client is now asking a NEW follow-up question: "${message}". Answer this question directly and helpfully as a warm studio receptionist would. Do NOT re-introduce session types, re-confirm the booking, or repeat the booking summary. Simply answer their question and offer any additional help they may need.`;
    }

    const dynamicSystemInstruction = `${SYSTEM_INSTRUCTION}

CURRENT CONVERSATIONAL DOSSIER:
- Selected Session: ${convState.serviceLabel || '[Not yet chosen]'}
- Milestone / Preferred Date: ${convState.preferredDate || '[Not yet specified]'}
- Client Full Name: ${convState.fullName || '[Not yet provided]'}
- Phone: ${convState.phone || '[Not yet provided]'}
- Email: ${convState.email || '[Not yet provided]'}
- Missing Information to Finalize: ${convState.missingFields.join(', ') || 'All details collected!'}

CRITICAL TURN INSTRUCTIONS:
1. CLIENT'S LATEST MESSAGE: "${message}"
2. YOUR IMMEDIATE OBJECTIVE THIS TURN: ${turnDirective}
3. ONLY RESPOND TO THE LATEST MESSAGE: Do NOT re-answer questions or re-introduce session descriptions from earlier in the chat history. Never revert to generic intros.
4. ZERO EMOJIS, ZERO EM DASHES (use commas or standard periods instead).`;

    let rawReply = '';
    const ai = getAI();

    if (ai) {
      const candidateModels = ['gemini-2.0-flash-lite', 'gemini-2.0-flash'];
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: {
              systemInstruction: dynamicSystemInstruction,
              temperature: 0.7
            }
          });
          if (response && response.text) {
            rawReply = response.text;
            break;
          }
        } catch (geminiError) {
          console.warn(`Gemini model ${modelName} call unsuccessful:`, geminiError);
        }
      }
    }

    if (!rawReply) {
      const fallbackRes = generateContextualResponse(chatTurns, message);
      rawReply = fallbackRes.text;
    }

    // Strip thinking blocks
    let cleanReply = rawReply
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .trim();

    if (!cleanReply) {
      const fallbackRes = generateContextualResponse(chatTurns, message);
      cleanReply = fallbackRes.text;
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

    let bookingExtracted: any = null;
    let clientNotification: ClientNotificationResult | null = null;

    const hasContact = !!(emailMatch || phoneMatch || convState.email || convState.phone);

    // Only trigger booking confirmation on the FIRST turn all 4 fields become known.
    // Guard: if Poppy has already said "I have recorded your" in a previous model turn,
    // the booking was already confirmed and we must NOT re-fire save/email/card.
    const bookingAlreadyConfirmed = formattedContents.some(
      c => c.role === 'model' && c.parts[0]?.text?.toLowerCase().includes('i have recorded your')
    );

    if (!bookingAlreadyConfirmed && convState.fullName && hasContact && convState.service && convState.preferredDate) {
      const effectiveEmail = convState.email || (emailMatch ? emailMatch[0] : '');
      const effectivePhone = convState.phone || (phoneMatch ? phoneMatch[0] : (effectiveEmail ? 'Not provided (Email only)' : ''));
      const effectiveName = convState.fullName;
      const effectiveService = convState.serviceLabel || 'Studio Photography';
      const effectiveDate = convState.preferredDate || 'Upcoming Session';

      const transcriptFormatted = formattedContents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'poppy',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const leadRecord = saveLeadSafe({
        fullName: effectiveName,
        phone: effectivePhone,
        email: effectiveEmail,
        serviceRequested: effectiveService,
        preferredDate: effectiveDate,
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
