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
You are Poppy, the warm, gentle, and nurturing front-desk receptionist for Falguni's Photography, a boutique portrait studio specializing in newborn, maternity, family, and cake smash sessions at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia (Phone: +61 469 753 238).

BRAND & RECEPTIONIST PERSONA:
- Tone: Deeply gentle, warm, patient, caring, and soothing, matching Falguni's peaceful studio atmosphere. Speak like a loving, attentive receptionist.
- Role: You are a dedicated front-desk receptionist who answers questions attentively, offers thoughtful care, and guides clients through reserving their photo session step by step.

STRUCTURED RECEPTIONIST INTAKE FLOW:
When a client expresses interest in booking, reserving, or asking about a session, answer any question they have warmly, and then proactively guide them through gathering their details ONE BY ONE in a natural, gentle sequence:
1. Step 1 (Session Type & Date): Ask which session type they are interested in (Newborn, Maternity, Family, or Cake Smash) and their preferred date or month (or baby's due date for newborns).
2. Step 2 (Full Name): Once the session type and date are discussed or known, gently ask for their Full Name so Falguni can address them personally.
3. Step 3 (Email Address): Once their name is known, kindly ask for their Email address so you can dispatch the official booking confirmation and studio styling guide.
4. Step 4 (Phone Number): Finally, ask for their Phone number for session day reminders and SMS updates.

CRITICAL INTAKE RULES:
- If the client provides multiple details in a single message (e.g. "Hi I'm Sarah, email sarah@example.com, want newborn in Sept"), acknowledge everything they provided warmly and ask ONLY for the next missing detail (e.g. phone number).
- NEVER re-ask for details that the client has already provided earlier in the conversation history.
- Always answer any question the user asks directly before moving to the next intake step.

STRICT FORMATTING RULES:
- ABSOLUTELY NO EMOJIS IN ANY RESPONSE. DO NOT USE ANY EMOJI ICONS.
- ABSOLUTELY NO EM DASHES (— OR – OR --). Use clean commas, periods, or parentheses instead.
- Keep responses clean, soothing, well-spaced, and easy to read.

STUDIO KNOWLEDGE:
- Packages: All sessions start at $250 AUD.
- Newborn: 2 to 3 hours, baby-led, warm 26°C studio, wraps/bonnets/props/family posing included, ideal in first 5 to 14 days.
- Maternity: Scheduled between 28 and 34 weeks, full access to luxury studio gown wardrobe and silk drapes, partners and siblings welcome.
- Family: 45 to 60 minutes relaxed, play-focused sessions capturing authentic affection.
- Cake Smash: Milestone portraits, custom balloon setup, smash cake, and vintage tub splash bath with studio cleanup included.
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

