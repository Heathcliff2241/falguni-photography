// Shared Conversational Intelligence Engine for Poppy (Falguni's Photography)
// Tracks conversation state, extracts booking entities, and generates contextual responses.

export interface ConversationState {
  service: 'newborn' | 'maternity' | 'family' | 'cake_smash' | null;
  serviceLabel: string | null;
  preferredDate: string | null;
  babyDueDateOrBirthDate: string | null;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  lastPoppyQuestion: 'service' | 'date' | 'name' | 'contact' | 'general' | null;
  missingFields: ('service' | 'date' | 'name' | 'contact')[];
  isBookingComplete: boolean;
}

export interface ChatTurn {
  sender: 'user' | 'poppy' | 'model';
  text: string;
}

// Month dictionary for date detection
const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'
];

/**
 * Extracts and synthesizes conversation state across the entire message history.
 */
export function extractConversationState(history: ChatTurn[], currentMessage: string = ''): ConversationState {
  const allTurns: ChatTurn[] = currentMessage ? [...history, { sender: 'user', text: currentMessage }] : [...history];
  const userTexts = allTurns.filter(t => t.sender === 'user').map(t => t.text);
  const userFullText = userTexts.join(' \n ');
  const poppyTexts = allTurns.filter(t => t.sender !== 'user').map(t => t.text);
  const lastPoppyText = poppyTexts.length > 0 ? poppyTexts[poppyTexts.length - 1].toLowerCase() : '';

  // 1. Detect Last Poppy Question
  let lastPoppyQuestion: ConversationState['lastPoppyQuestion'] = null;
  if (
    lastPoppyText.includes('name') ||
    lastPoppyText.includes('who am i speaking with') ||
    lastPoppyText.includes('may i have your name') ||
    lastPoppyText.includes('your full name')
  ) {
    lastPoppyQuestion = 'name';
  } else if (
    lastPoppyText.includes('phone') ||
    lastPoppyText.includes('email') ||
    lastPoppyText.includes('reach you') ||
    lastPoppyText.includes('contact details')
  ) {
    lastPoppyQuestion = 'contact';
  } else if (
    lastPoppyText.includes('date') ||
    lastPoppyText.includes('when') ||
    lastPoppyText.includes('turning one') ||
    lastPoppyText.includes('due date') ||
    lastPoppyText.includes('month') ||
    lastPoppyText.includes('calendar')
  ) {
    lastPoppyQuestion = 'date';
  } else if (
    lastPoppyText.includes('which session') ||
    lastPoppyText.includes('session type') ||
    lastPoppyText.includes('which of these') ||
    lastPoppyText.includes('four boutique portrait')
  ) {
    lastPoppyQuestion = 'service';
  }

  // 2. Extract Service Type
  let service: ConversationState['service'] = null;
  let serviceLabel: string | null = null;
  const lowerAll = userFullText.toLowerCase();

  if (
    lowerAll.includes('cake') ||
    lowerAll.includes('smash') ||
    lowerAll.includes('1st birthday') ||
    lowerAll.includes('first birthday') ||
    lowerAll.includes('turning one')
  ) {
    service = 'cake_smash';
    serviceLabel = 'Cake Smash & 1st Birthday';
  } else if (
    lowerAll.includes('newborn') ||
    lowerAll.includes('infant') ||
    lowerAll.includes('due date') ||
    lowerAll.includes('baby photo') ||
    lowerAll.includes('5 to 14 days')
  ) {
    service = 'newborn';
    serviceLabel = 'Newborn Photography';
  } else if (
    lowerAll.includes('maternity') ||
    lowerAll.includes('pregnant') ||
    lowerAll.includes('pregnancy') ||
    lowerAll.includes('bump') ||
    lowerAll.includes('gown wardrobe')
  ) {
    service = 'maternity';
    serviceLabel = 'Maternity Photography';
  } else if (
    lowerAll.includes('family') ||
    lowerAll.includes('siblings') ||
    lowerAll.includes('toddler') ||
    lowerAll.includes('children')
  ) {
    service = 'family';
    serviceLabel = 'Family Portraits';
  }

  // 3. Extract Preferred Date
  let preferredDate: string | null = null;
  // Match patterns like "September 11", "11th of Sept", "11 September", "next week", "mid October"
  const dateRegexes = [
    /\b(?:on\s+)?((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s*,?\s*\d{4})?)\b/i,
    /\b((?:early|mid|late)?\s*(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{4})?)\b/i,
    /\b(next\s+(?:week|month|weekend|friday|saturday|sunday|monday|tuesday|wednesday|thursday))\b/i,
    /\b(this\s+(?:weekend|friday|saturday|sunday))\b/i,
    /\b(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\b/
  ];

  for (const regex of dateRegexes) {
    const match = userFullText.match(regex);
    if (match && match[1]) {
      preferredDate = match[1].trim();
      // Capitalize nicely if needed
      preferredDate = preferredDate.charAt(0).toUpperCase() + preferredDate.slice(1);
      break;
    }
  }

  // Also, if the user's latest message is just a date like "september 11" or "11/9"
  if (!preferredDate) {
    const trimmed = currentMessage.trim().toLowerCase();
    const hasMonth = MONTHS.some(m => trimmed.includes(m));
    if (hasMonth || /\b\d{1,2}\b/.test(trimmed)) {
      if (trimmed.length < 35 && !trimmed.includes('book') && !trimmed.includes('session')) {
        preferredDate = currentMessage.trim();
      }
    }
  }

  // 4. Extract Email
  let email: string | null = null;
  const emailMatch = userFullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    email = emailMatch[0].trim();
  }

  // 5. Extract Phone
  let phone: string | null = null;
  const phoneMatch = userFullText.match(/(?:\+?61\s?4\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|04\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|\b0[2-9]\d{8}\b|\b\d{10,11}\b)/);
  if (phoneMatch) {
    phone = phoneMatch[0].trim();
  }

  // 6. Extract Full Name
  let fullName: string | null = null;
  const nameExplicitPatterns = [
    /(?:my\s+name\s+is|i(?:'m| am)|this\s+is|name:\s*)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:call\s+me)\s+([A-Z][a-z]+)/i
  ];
  for (const pat of nameExplicitPatterns) {
    const match = userFullText.match(pat);
    if (match && match[1]) {
      fullName = match[1].trim();
      break;
    }
  }

  // If last question was asking for name, and user provided 1-3 words
  if (!fullName && lastPoppyQuestion === 'name') {
    const cleanCurrent = currentMessage.trim();
    if (
      cleanCurrent.length > 1 &&
      cleanCurrent.length < 40 &&
      !cleanCurrent.includes('@') &&
      !cleanCurrent.includes('http') &&
      !/\d/.test(cleanCurrent)
    ) {
      // Clean up common prefixes like "it's Sarah"
      const cleaned = cleanCurrent.replace(/^(?:it's|it is|i'm|im|my name is)\s+/i, '').trim();
      fullName = cleaned;
    }
  }

  // Determine Missing Fields
  const missingFields: ('service' | 'date' | 'name' | 'contact')[] = [];
  if (!service) missingFields.push('service');
  if (!preferredDate) missingFields.push('date');
  if (!fullName) missingFields.push('name');
  if (!phone || !email) missingFields.push('contact');

  return {
    service,
    serviceLabel,
    preferredDate,
    babyDueDateOrBirthDate: preferredDate,
    fullName,
    phone,
    email,
    notes: null,
    lastPoppyQuestion,
    missingFields,
    isBookingComplete: missingFields.length === 0 || !!(fullName && (email || phone))
  };
}

/**
 * Generates an intelligent, conversational response that strictly minds the conversation context.
 * Used whenever the local coordinator or server fallback needs to maintain seamless dialog.
 */
export function generateContextualResponse(
  history: ChatTurn[],
  currentMessage: string
): { text: string; extractedBooking: any | null } {
  const state = extractConversationState(history, currentMessage);
  const currentLower = currentMessage.toLowerCase().trim();

  // Check for direct questions first
  const isAskingWhatDetailsNeeded =
    currentLower.includes('what detail') ||
    currentLower.includes('what do you need') ||
    currentLower.includes('what is needed') ||
    currentLower.includes('how to reserve') ||
    currentLower.includes('how do i reserve') ||
    currentLower.includes('how do i book') ||
    currentLower.includes('what info');

  const isAskingPricing =
    currentLower.includes('price') ||
    currentLower.includes('cost') ||
    currentLower.includes('rate') ||
    currentLower.includes('how much') ||
    currentLower.includes('fee') ||
    currentLower.includes('package');

  const isAskingLocation =
    currentLower.includes('where') ||
    currentLower.includes('address') ||
    currentLower.includes('location') ||
    currentLower.includes('suburb') ||
    currentLower.includes('parking');

  const isAskingPhotographer =
    currentLower.includes('who is falguni') ||
    currentLower.includes('about falguni') ||
    currentLower.includes('experience') ||
    currentLower.includes('review') ||
    currentLower.includes('safety');

  const isAskingGowns =
    currentLower.includes('gown') ||
    currentLower.includes('dress') ||
    currentLower.includes('outfit') ||
    currentLower.includes('wardrobe') ||
    currentLower.includes('what to wear');

  // Direct Answer 1: What details do you need to reserve?
  if (isAskingWhatDetailsNeeded) {
    let reply = "I would be thrilled to help you reserve your date with Falguni! To hold a session on our studio calendar, we just need four simple details:\n\n1. Your preferred session type (Newborn, Maternity, Family, or Cake Smash)\n2. Your preferred date or baby's due date\n3. Your full name\n4. Your phone number and email address for session confirmation and preparation guides\n\n";
    if (state.serviceLabel) {
      reply += `I see you are interested in our ${state.serviceLabel}! What date or month works best for you?`;
    } else {
      reply += "Which portrait session are you planning to celebrate?";
    }
    return { text: reply, extractedBooking: null };
  }

  // Direct Answer 2: Studio Location
  if (isAskingLocation) {
    let reply = "Falguni's studio is nestled at 26 South Pkwy, Northfield SA 5085, Adelaide. It is a peaceful, temperature-controlled sanctuary with convenient private driveway parking, dedicated nursing spaces, and complimentary refreshments.";
    if (state.serviceLabel && state.preferredDate) {
      reply += ` We have noted your ${state.serviceLabel} for around ${state.preferredDate}. May I please have your name and contact details to finalize your booking?`;
    } else if (state.serviceLabel) {
      reply += ` Would you like to check Falguni's availability for a ${state.serviceLabel}?`;
    } else {
      reply += " May I help you reserve a session date or explore our studio services?";
    }
    return { text: reply, extractedBooking: null };
  }

  // Direct Answer 3: Pricing & Packages
  if (isAskingPricing) {
    return {
      text: "Every portrait session at Falguni's Photography is an unhurried, boutique experience focused on quality, safety, and artistry. Each booking includes dedicated studio time (2 to 3 hours for newborn sessions), full access to our curated props, floral wreaths, and luxury maternity wardrobe, followed by a private proofing gallery with bespoke heirloom prints, wall art, and high-resolution digital collections.\n\nWhich session would you like to plan, or what date do you have in mind?",
      extractedBooking: null
    };
  }

  // Direct Answer 4: Wardrobe & Outfits
  if (isAskingGowns) {
    return {
      text: "You do not need to worry about bringing anything! For newborn sessions, all organic wraps, bonnets, handcrafted headbands, and floral props are lovingly provided. For maternity sessions, clients have complimentary access to our luxury couture gown collection, silk drapes, and bodysuits. For cake smash sessions, custom balloon styling, smash cake, and warm vintage tub bath setups are fully arranged.\n\nWhich session can I help you prepare for?",
      extractedBooking: null
    };
  }

  // Direct Answer 5: About Falguni & Safety
  if (isAskingPhotographer) {
    return {
      text: "Falguni is a specialized portrait photographer with over three years of studio experience and 56 five-star client reviews. She holds dedicated certifications in newborn handling and airway safety, using patient, baby-led soothing techniques so parents can sit back and relax in our warm studio.\n\nWould you like to reserve an upcoming date on Falguni's calendar?",
      extractedBooking: null
    };
  }

  // --- STATEFUL BOOKING PROGRESSION ---
  // If we have ALL details (Service, Date, Name, and Phone/Email), confirm the booking!
  if (state.service && state.preferredDate && state.fullName && (state.phone || state.email)) {
    const bookingData = {
      fullName: state.fullName,
      phone: state.phone || '0412 345 678',
      email: state.email || '',
      serviceRequested: state.serviceLabel || 'Studio Photography',
      preferredDate: state.preferredDate,
      notes: currentMessage
    };

    const reply = `Thank you so much, ${state.fullName}! I have recorded your ${state.serviceLabel} reservation request for ${state.preferredDate}.\n\nA boutique confirmation copy and session styling preparation guide will be sent directly to ${state.email || state.phone}. Falguni will personally review her studio calendar and confirm your booking by phone or email within 24 hours. We cannot wait to welcome you to our Northfield studio!`;

    return { text: reply, extractedBooking: bookingData };
  }

  // If we have Service, Date, and Name, but need Contact (Phone / Email)
  if (state.service && state.preferredDate && state.fullName && !state.phone && !state.email) {
    return {
      text: `Wonderful, ${state.fullName}! I have penciled in your ${state.serviceLabel} for ${state.preferredDate}. What is the best phone number and email address to send your booking confirmation and preparation guide?`,
      extractedBooking: null
    };
  }

  // If we have Service and Date, but need Name
  if (state.service && state.preferredDate && !state.fullName) {
    if (state.service === 'cake_smash') {
      return {
        text: `${state.preferredDate} is such a wonderful milestone to celebrate your little one turning one! We will have the custom balloon backdrop, smash cake, and warm splash tub ready. May I please have your full name so I can note this on Falguni's studio calendar?`,
        extractedBooking: null
      };
    }
    if (state.service === 'newborn') {
      return {
        text: `I have noted ${state.preferredDate} for your newborn session in our cozy 26°C sanctuary. May I please have your full name so I can begin reserving your spot in Falguni's diary?`,
        extractedBooking: null
      };
    }
    if (state.service === 'maternity') {
      return {
        text: `I have noted ${state.preferredDate} for your maternity session. We will have our couture gown wardrobe and sculptural studio lighting prepared for you. May I please have your full name so I can note this on Falguni's calendar?`,
        extractedBooking: null
      };
    }
    return {
      text: `I have noted ${state.preferredDate} for your ${state.serviceLabel}. May I please have your full name so I can begin reserving your session in our studio diary?`,
      extractedBooking: null
    };
  }

  // If we have Service, but need Date
  if (state.service && !state.preferredDate) {
    if (state.service === 'cake_smash') {
      return {
        text: "Cake smash sessions are such a joyful milestone celebration! We include custom balloon styling, a delicious smash cake, milestone portraits, and a warm splash bath with full studio cleanup. What date is your little one turning one, or what month works best for you?",
        extractedBooking: null
      };
    }
    if (state.service === 'newborn') {
      return {
        text: "Our newborn sessions are peaceful, baby-led experiences in our heated 26°C sanctuary, ideally held in the first 5 to 14 days after birth. What is your estimated due date or baby's birth date?",
        extractedBooking: null
      };
    }
    if (state.service === 'maternity') {
      return {
        text: "Maternity portraits are best scheduled between 28 and 34 weeks, when your bump is beautifully rounded. What month or date range works best for your schedule?",
        extractedBooking: null
      };
    }
    return {
      text: `Our ${state.serviceLabel} are relaxed and play-focused. What date or day of the week would you prefer to visit our Northfield studio?`,
      extractedBooking: null
    };
  }

  // If we have Date, but need Service
  if (!state.service && state.preferredDate) {
    return {
      text: `Thank you for letting me know your preferred date of ${state.preferredDate}. Which portrait session are you planning to book? Falguni offers Newborn Photography (5 to 14 days), Maternity (28 to 34 weeks), Family Portraits, and 1st Birthday Cake Smash.`,
      extractedBooking: null
    };
  }

  // General or Greeting: Introduce the 4 sessions warmly and ask which they prefer
  if (currentLower === 'hi' || currentLower === 'hello' || currentLower === 'hey') {
    return {
      text: "Hello! Welcome to Falguni's Photography. We specialize in calm, gentle portrait sessions tailored to your family's pace. Are you interested in a Newborn, Maternity, Family, or 1st Birthday Cake Smash session?",
      extractedBooking: null
    };
  }

  // Default contextual fallback
  return {
    text: "Falguni offers four boutique portrait sessions: Newborn Photography in our warm 26°C studio, Maternity with luxury gown styling, relaxed Family portraits, and Cake Smash & 1st Birthday celebrations. Which session would you like to plan, or what date can I check for you?",
    extractedBooking: null
  };
}
