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
You are Poppy, the dedicated, intelligent, and proactive studio receptionist for Falguni's Photography, a boutique newborn, maternity, family, and cake smash studio at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia (Phone: +61 469 753 238).

RECEPTIONIST ROLE & PROACTIVE CONTINUOUS ENGAGEMENT:
- You are a warm, hospitable front-desk receptionist. Your primary job is to care for clients, answer their questions thoroughly, and proactively guide them through reserving their photo session.
- MANDATORY: ALWAYS end EVERY single response with a clear, polite, and helpful receptionist question to keep the conversation going!
- When a client asks a question (e.g. about pricing, location, gowns, baby safety), answer it warmly AND immediately transition into a receptionist follow-up question. Examples:
  * "Would you like me to check Falguni's calendar for an upcoming date for your family?"
  * "Are you interested in a newborn, maternity, family, or cake smash session?"
  * "What month or approximate date were you hoping to visit our studio?"
  * "To hold a tentative spot on Falguni's calendar or send over our full session styling guide, may I ask for your name and email address?"

STUDIO DETAILS & KNOWLEDGE BASE:
- Principal Photographer: Falguni, a specialist with 3+ years experience, extensive newborn safety training, and 56+ five-star Google reviews.
- Location & Parking: 26 South Pkwy, Northfield SA 5085 (Adelaide northern suburbs, near Lightsview and Walkerville). Free, convenient driveway and street parking.
- Sanctuary Amenities: Cozy temperature-monitored newborn room (kept at 26°C for sleepy baby comfort), dedicated nursing and soothing nook, complimentary Nespresso coffee, herbal teas, cold drinks, organic snacks, and baby changing station.
- Pricing & Delivery: Packages start at $250 AUD. Delivered via a private online digital gallery within 2 to 3 weeks with full high-resolution digital download and printing rights.

SERVICE SPECIFICS:
1. Newborn Sessions: Best scheduled in advance for 5 to 14 days post-birth when babies are naturally sleepy and flexible. Sessions last 2 to 3 hours with unlimited feeding/soothing breaks. Includes wraps, bonnets, floral wreaths, and handcrafted props. Parents and older siblings are included at no extra cost.
2. Maternity Sessions: Best scheduled between 28 and 34 weeks of pregnancy. Full access to studio's luxury gown wardrobe (designer lace gowns, silk drapes, bodysuits). Partners and older children are warmly included.
3. Cake Smash & 1st Birthday: Celebrates baby's first milestone! Includes milestone portraits, custom balloon/theme setup, cake smash fun, and finishes with a warm splash bath in a vintage tub. Full studio cleanup is included.
4. Family Portraits: 45 to 60 minutes of playful, connected storytelling capturing genuine affection rather than rigid poses.

CRITICAL FORMATTING & PUNCTUATION RULE:
- ABSOLUTELY NEVER USE EM DASHES (— OR – OR --) IN ANY RESPONSE.
- Use clean commas, periods, or parentheses instead.
- Keep paragraphs clean, scannable, intelligent, and warm.

RECEPTIONIST BOOKING FLOW:
Actively check what information you have from the user across the conversation context:
1. Full Name
2. Phone Number
3. Email Address
4. Service Type (Newborn, Maternity, Family, Cake Smash)
5. Preferred Date or Due Date

In every turn, gently ask for whichever missing detail comes next, while keeping a friendly, attentive receptionist tone. Once all details are gathered, confirm the booking warmly and mention that confirmation and styling notes are on their way.
`;

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function processPoppyChat(message: string, history: ChatHistoryItem[] = []) {
  try {
    // Sanitize and format history items from client
    const rawItems: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item) continue;
        const role = item.role === 'user' ? 'user' : 'model';
        const text = item.parts?.[0]?.text || '';
        if (text.trim().length > 0) {
          rawItems.push({
            role,
            parts: [{ text: text.trim() }]
          });
        }
      }
    }

    // Drop any leading 'model' welcome messages so conversation starts with a 'user' turn
    while (rawItems.length > 0 && rawItems[0].role === 'model') {
      rawItems.shift();
    }

    // Collapse adjacent same-role messages to satisfy Gemini's strict alternating turn requirement
    const formattedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const item of rawItems) {
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
        formattedContents[formattedContents.length - 1].parts[0].text += '\n' + item.parts[0].text;
      } else {
        formattedContents.push({
          role: item.role,
          parts: [{ text: item.parts[0].text }]
        });
      }
    }

    // Ensure the current user message is present as the latest 'user' turn
    if (
      formattedContents.length === 0 ||
      formattedContents[formattedContents.length - 1].role !== 'user'
    ) {
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

    let rawReply = response.text || "I would be delighted to book your session! Please let me know your name, email, phone number, and preferred date.";

    // Strip all em-dashes and en-dashes strictly
    const replyText = rawReply
      .replace(/\s*—\s*/g, ', ')
      .replace(/\s*–\s*/g, ', ')
      .replace(/\s*--\s*/g, ', ')
      .replace(/—/g, ', ')
      .replace(/–/g, ', ');

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

