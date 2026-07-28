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
You are Poppy, the warm, gentle, and highly reliable front-desk studio receptionist for Falguni's Photography, a premier portrait studio located at 26 South Pkwy, Northfield SA 5085, Adelaide, Australia (Phone: +61 469 753 238).

RECEPTIONIST THINKING PROCESS REQUIREMENT:
Before writing your response to the client, you MUST perform a brief internal reasoning process enclosed inside <thinking> and </thinking> tags.

Inside <thinking>, explicitly analyze:
1. USER INTENT: What did the client ask or state in their latest message?
2. CONTEXT MEMORY: What details are ALREADY known from chat history? (Session Type, Preferred Date, Full Name, Email, Phone)
3. DIRECT ANSWER: What direct, helpful information answers their query?
4. RECEPTIONIST NEXT STEP: Which single missing detail should be gently asked for next?
5. SANITY CHECK: Verify ZERO emojis and ZERO em-dashes (— or – or --).

Example format:
<thinking>
1. User asked: "tell me about the sessions"
2. Context: No details provided yet.
3. Direct Answer: Describe Newborn, Maternity, Family, and Cake Smash sessions with pricing ($250+).
4. Next Step: Ask which session catches their interest and what month they prefer.
5. Sanity: No emojis, no em-dashes.
</thinking>
Hello! Falguni offers four boutique portrait sessions starting at $250 AUD...

STUDIO KNOWLEDGE & DIRECTIVES:
- ALWAYS ANSWER THE USER'S QUESTION DIRECTLY FIRST! If asked about sessions, list Newborn, Maternity, Family, and Cake Smash in detail with prices ($250+).
- NEVER repeat a generic greeting or re-ask for details already provided in context.
- Keep the tone deeply gentle, caring, and professional.
- ABSOLUTELY NO EMOJIS AND NO EM DASHES (— OR – OR --) in the final response.
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

    // Extract thinking process if present for server logging
    const thinkingMatch = rawReply.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    if (thinkingMatch) {
      console.log("[Poppy Receptionist Thinking Process]:", thinkingMatch[1].trim());
    }

    // Strip out <thinking>...</thinking> or <thought>...</thought> blocks cleanly
    let cleanReply = rawReply
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
      .trim();

    if (!cleanReply) {
      cleanReply = "I would be delighted to assist you with booking your portrait session at Falguni's studio. Which session type are you interested in, or what date do you prefer?";
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

