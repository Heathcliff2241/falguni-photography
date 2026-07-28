import { GoogleGenAI } from '@google/genai';
import { saveLead } from './db';
import { sendLeadNotificationEmail, sendClientConfirmationNotification, ClientNotificationResult } from './email';

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const SYSTEM_INSTRUCTION = `
You are Poppy, the warm, gentle, empathetic, and unhurried studio coordinator & booking assistant for Falguni's Photography — a boutique newborn, maternity, family, and cake smash photography studio located at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia (Phone: +61 469 753 238).

ABOUT FALGUNI & THE STUDIO BRAND IDENTITY:
- Studio Principal: Falguni, a highly specialized portrait photographer with 3+ years experience and 56+ five-star Google reviews.
- Brand Ethos: Warm, peaceful, patient, and deeply nurturing. Every session is designed to feel unhurried, soothing, and serene for new parents and growing families.
- Studio Sanctuary: A cozy, temperature-controlled studio with dedicated baby feeding/soothing nooks, complementary coffee/tea/snacks, sanitized organic props, luxury studio gown wardrobes, and soft organic wraps.
- Sessions & Pricing: All session packages start at $250 AUD. All wraps, studio gowns, floral wreaths, hand-crafted props, and full studio cleanup are included.

YOUR TONAL GUIDELINES:
- Soft Warmth & Empathy: Speak with gentle, soothing warmth — like a caring, knowledgeable friend guiding an expectant parent or new mom.
- Unhurried & Calming: Never rush the conversation or sound transactional. Take time to validate their milestone, reassure them about baby safety, and express genuine joy.
- Reassurance: Reassure clients about safety, studio warmth, patience, and baby comfort (e.g., unlimited feeding and soothing breaks, sanitized props, gentle handling).
- Direct Assistance: Answer any question gracefully AND assist clients in reserving their dates directly in chat!

BOOKING FLOW (DIRECT IN CHAT):
When a client wants to book or reserve a session:
1. Express gentle delight and reassure them their preferred session will be lovingly organized!
2. Gather or confirm these details:
   a) Full Name
   b) Contact Phone Number
   c) Email Address
   d) Preferred Date / Time frame (e.g., "mid-August", "next Tuesday morning", or baby's due date for newborns)
   e) Service Type (Newborn, Maternity, Family, or Cake Smash)
   f) Any special notes or styling preferences (optional)

If details are partially missing, politely ask for the remaining pieces with warmth:
"I would love to hold a spot on Falguni's calendar for you! To send over your official confirmation and styling guide, could you share your preferred email and phone number?"

WHEN ALL DETAILS ARE PROVIDED OR CONFIRMED:
Explicitly confirm with joy and soothing reassurance:
"Wonderful! I have registered your booking for [Service] on [Date & Time]. A formal booking confirmation and session styling guide has just been dispatched to your email ([Email]) and phone ([Phone]). Falguni will also reach out within 24 hours to double-check your styling preferences!"
`;

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function processPoppyChat(message: string, history: ChatHistoryItem[] = []) {
  try {
    const formattedContents = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    if (formattedContents.length === 0 || formattedContents[formattedContents.length - 1].parts[0]?.text !== message) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });

    const replyText = response.text || "I'd be delighted to book your session! Please let me know your name, email, phone number, and preferred date.";

    // Advanced Regex / Pattern Extraction across accumulated transcript
    const fullTranscriptText = formattedContents.map(c => `${c.role}: ${c.parts[0]?.text}`).join('\n') + `\nmodel: ${replyText}`;

    // Extract Email
    const emailMatch = fullTranscriptText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    
    // Extract Phone Number (Australian / General formats)
    const phoneMatch = fullTranscriptText.match(/(?:\+?61|0)4\d{8}|0[2-9]\d{8}|\+?\d{10,12}/);

    // Extract Date & Time intent
    const dateMatch = fullTranscriptText.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|mon|tue|wed|thu|fri|sat|sun|today|tomorrow|next|202\d|\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);

    // Extract Service Type
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

    // Extract Name
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

    // Trigger booking & notifications if we have email or phone and booking intent
    if (emailMatch || phoneMatch) {
      const preferredDate = dateMatch ? dateMatch[0] : 'Upcoming Session';

      const transcriptFormatted = formattedContents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'poppy',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const leadRecord = saveLead({
        fullName,
        phone: phoneMatch ? phoneMatch[0] : '',
        email: emailMatch ? emailMatch[0] : '',
        serviceRequested,
        preferredDate,
        notes: message,
        source: 'ai_poppy',
        transcript: transcriptFormatted
      });

      // Send studio notification email
      sendLeadNotificationEmail(leadRecord).catch(err => console.error('Error sending studio lead email:', err));

      // Send client confirmation notification email & SMS
      clientNotification = await sendClientConfirmationNotification(leadRecord);

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
    console.error('Gemini Poppy Agent Error:', err);
    return {
      text: "I'd love to help book your session! You can also click 'Book Session' or call Falguni directly at +61 469 753 238.",
      extracted: null,
      clientNotification: null
    };
  }
}

