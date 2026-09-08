import { GoogleGenAI } from '@google/genai';
import { saveLead } from './db';
import { sendLeadNotificationEmail, sendClientConfirmationNotification, ClientNotificationResult } from './email';
import { extractConversationState, generateContextualResponse, ChatTurn } from '../src/data/poppyBrain';

// Lazy client initialization to prevent serverless startup crashes when key is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
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

Example format:
<thinking>
1. User asked: "tell me about the sessions"
2. Context: No details provided yet.
3. Direct Answer: Describe Newborn, Maternity, Family, and Cake Smash boutique sessions.
4. Next Step: Ask which session catches their interest and what month they prefer.
5. Sanity: No emojis, no em-dashes.
</thinking>
Hello! Falguni offers four boutique portrait sessions: Newborn, Maternity, Family, and Cake Smash...

STUDIO KNOWLEDGE & DIRECTIVES:
- ALWAYS ANSWER THE USER'S QUESTION DIRECTLY FIRST! If asked about sessions, list Newborn, Maternity, Family, and Cake Smash in detail.
- Falguni's Signature Expertise: Emphasize certified newborn handling safety, physiological soothing techniques, baby-led gentle posing, and sculptural fine-art maternity lighting.
- All sessions are complete boutique experiences with private proofing galleries and bespoke print, album, and digital collections.
- We never rush sessions: newborn sessions are 2-3 unhurried hours in a warm 26°C sanctuary with unlimited nursing/feeding pauses.
- Maternity sessions use sculptural directional lighting to celebrate the maternal silhouette, paired with access to a couture gown and silk wardrobe.
- NEVER repeat a generic greeting or re-ask for details already provided in context.
- Keep the tone deeply gentle, caring, and professional.
- ABSOLUTELY NO EMOJIS AND NO EM DASHES (— OR – OR --) in the final response.
`;

function getSmartFallbackReply(message: string): string {
  return generateContextualResponse([], message).text;
}


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

    // Analyze full conversational history to mind state and user intent
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
      turnDirective = `All key details (Session: ${convState.serviceLabel}, Date: ${convState.preferredDate}, Name: ${convState.fullName}, Contact: ${convState.email || convState.phone}) are collected! Celebrate their reservation warmly and let them know Falguni will confirm within 24 hours.`;
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
      // Cascade: try gemini-3.1-flash-lite, fallback to gemini-flash-latest, then contextual fallback
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
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

    if (!rawReply) {
      const fallbackRes = generateContextualResponse(chatTurns, message);
      rawReply = fallbackRes.text;
    }

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

    // Advanced Regex / Pattern Extraction across accumulated transcript
    const fullTranscriptText = formattedContents.map(c => `${c.role}: ${c.parts[0]?.text}`).join('\n') + `\nmodel: ${replyText}`;

    // Extract Email
    const emailMatch = fullTranscriptText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    
    // Extract Phone Number (Australian / General formats)
    const phoneMatch = fullTranscriptText.match(/(?:\+?61|0)4\d{8}|0[2-9]\d{8}|\+?\d{10,12}/);

    let bookingExtracted: any = null;
    let clientNotification: ClientNotificationResult | null = null;

    // Trigger booking & notifications if we have name, and at least email or phone
    const hasContact = !!(emailMatch || phoneMatch || convState.email || convState.phone);
    if (convState.fullName && hasContact && convState.service && convState.preferredDate) {
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

      const leadRecord = saveLead({
        fullName: effectiveName,
        phone: effectivePhone,
        email: effectiveEmail,
        serviceRequested: effectiveService,
        preferredDate: effectiveDate,
        notes: message,
        source: 'ai_poppy',
        transcript: transcriptFormatted
      });

      // Send studio notification email
      sendLeadNotificationEmail(leadRecord).catch(err => console.error('Error sending studio lead email:', err));

      // Send client confirmation notification email (styled boutique HTML)
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

