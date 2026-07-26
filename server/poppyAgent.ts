import { GoogleGenAI } from '@google/genai';
import { saveLead } from './db';
import { sendLeadNotificationEmail } from './email';

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
You are Poppy, the warm and gentle AI booking assistant for Falguni's Photography, a boutique newborn, maternity, and family photography studio located at 26 South Pkwy, Northfield SA 5085, Australia (Phone: +61 469 753 238).

ABOUT THE STUDIO:
- Owned and operated by Falguni, a specialist photographer with 3+ years experience.
- 56 five-star Google reviews praising their unhurried patience with newborns, babies, and toddlers.
- Located in Northfield, serving Adelaide's northern suburbs (Lightsview, Klemzig, Walkerville, etc.).

SESSION TYPES & DETAILS:
1. Newborn Photography:
   - Best booked while pregnant for the 5-14 day window after birth.
   - Paced around the baby, running 2-3 hours with unlimited feeding/settling breaks.
   - All wraps, headbands, baskets, and eucalyptus wreath backdrops included. Starts at $250.
2. Maternity Photography:
   - Best booked between 28-34 weeks pregnant.
   - Includes studio wardrobe of flowing gowns and draped fabrics. Partners and older siblings welcome. Starts at $250.
3. Family Photography:
   - 45-60 minute relaxed sessions. Games and breaks keep kids engaged naturally. Starts at $250.
4. Cake Smash Photography:
   - First birthday milestone. Includes themed balloon backdrop, smash cake, portraits, and full studio cleanup. Starts at $250.

YOUR PERSONA & TONE:
- Speak gently, concisely, and reassuringly, like a thoughtful friend who happens to work at the studio.
- Use short, clear sentences. Never salesy, aggressive, or corporate. No em dashes, no star/sparkle emojis.
- Sleep-deprived parents and expecting mothers appreciate clear, simple answers.

PRIMARY FUNCTION:
1. Answer questions about sessions, timing, pricing ($250+), props, and studio location.
2. When the visitor indicates intent to book or ask about availability, gently collect their details one by one or in a friendly conversational flow:
   - Full Name
   - Phone Number
   - Email Address
   - Service Requested
   - Preferred Session Date
   - Baby's Due Date or Birth Date (if newborn/maternity)

Extraction Rule:
If the user provides booking information (such as their name, phone, email, date, or due date), conclude your message with a confirmation like:
"Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them."
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

    // Append the latest message if not already present
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

    const replyText = response.text || "I'd be happy to help you with that! You can also call Falguni directly at +61 469 753 238.";

    // Attempt simple extraction of contact fields from history + reply
    const fullTranscriptText = formattedContents.map(c => `${c.role}: ${c.parts[0]?.text}`).join('\n');
    
    // Check if phone or email was provided in the chat
    const emailMatch = fullTranscriptText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = fullTranscriptText.match(/(?:\+?61|0)[2-9]\d{8}|04\d{8}|\d{10}/);

    let extracted: any = null;

    if (emailMatch || phoneMatch) {
      extracted = {
        fullName: 'Poppy Lead',
        phone: phoneMatch ? phoneMatch[0] : '',
        email: emailMatch ? emailMatch[0] : '',
        serviceRequested: 'Newborn / Studio Session',
        notes: message
      };

      // Save lead & send email notification
      const transcriptFormatted = formattedContents.map(c => ({
        sender: c.role === 'user' ? 'user' : 'poppy',
        text: c.parts[0]?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const leadRecord = saveLead({
        fullName: extracted.fullName,
        phone: extracted.phone,
        email: extracted.email,
        serviceRequested: extracted.serviceRequested,
        notes: extracted.notes,
        source: 'ai_poppy',
        transcript: transcriptFormatted
      });

      sendLeadNotificationEmail(leadRecord).catch(err => console.error('Error sending email:', err));
    }

    return {
      text: replyText,
      extracted
    };
  } catch (err) {
    console.error('Gemini Poppy Agent Error:', err);
    return {
      text: "Thank you for reaching out! You can book directly using the 'Book Session' button or call Falguni at +61 469 753 238.",
      extracted: null
    };
  }
}
