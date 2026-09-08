export interface ChatTurn {
  sender: 'user' | 'poppy' | 'model';
  text: string;
}

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

export function extractConversationState(history: ChatTurn[], currentMessage: string = ''): ConversationState {
  const allTurns: ChatTurn[] = currentMessage ? [...history, { sender: 'user', text: currentMessage }] : [...history];
  const userTexts = allTurns.filter(t => t.sender === 'user').map(t => t.text);
  const userFullText = userTexts.join(' \n ');
  const poppyTexts = allTurns.filter(t => t.sender !== 'user').map(t => t.text);
  const lastPoppyText = poppyTexts[poppyTexts.length - 1] || '';

  let lastPoppyQuestion: 'service' | 'date' | 'name' | 'contact' | 'general' | null = null;
  const lowerPoppy = lastPoppyText.toLowerCase();
  if (lowerPoppy.includes('full name') || lowerPoppy.includes('your name') || lowerPoppy.includes('who am i speaking')) {
    lastPoppyQuestion = 'name';
  } else if (lowerPoppy.includes('phone') || lowerPoppy.includes('email') || lowerPoppy.includes('contact')) {
    lastPoppyQuestion = 'contact';
  } else if (lowerPoppy.includes('date') || lowerPoppy.includes('month') || lowerPoppy.includes('due') || lowerPoppy.includes('turning one')) {
    lastPoppyQuestion = 'date';
  } else if (lowerPoppy.includes('which photography session') || lowerPoppy.includes('which session') || lowerPoppy.includes('what session')) {
    lastPoppyQuestion = 'service';
  } else if (lastPoppyText) {
    lastPoppyQuestion = 'general';
  }

  let service: 'newborn' | 'maternity' | 'family' | 'cake_smash' | null = null;
  let serviceLabel: string | null = null;
  const lowerAll = userFullText.toLowerCase();

  if (lowerAll.includes('cake') || lowerAll.includes('smash') || lowerAll.includes('first birthday') || lowerAll.includes('1st birthday') || lowerAll.includes('turning one') || lowerAll.includes('turning 1')) {
    service = 'cake_smash';
    serviceLabel = 'Cake Smash & 1st Birthday';
  } else if (lowerAll.includes('newborn') || lowerAll.includes('baby') || lowerAll.includes('infant') || lowerAll.includes('due date')) {
    service = 'newborn';
    serviceLabel = 'Newborn Photography';
  } else if (lowerAll.includes('maternity') || lowerAll.includes('pregnant') || lowerAll.includes('pregnancy') || lowerAll.includes('gown')) {
    service = 'maternity';
    serviceLabel = 'Maternity Photography';
  } else if (lowerAll.includes('family') || lowerAll.includes('toddler') || lowerAll.includes('kids') || lowerAll.includes('children')) {
    service = 'family';
    serviceLabel = 'Family Portraits';
  }

  let preferredDate: string | null = null;
  const dateRegexes = [
    /\b(?:on\s+)?((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s*,?\s*\d{4})?)\b/i,
    /\b(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/,
    /\b(next\s+week|next\s+month|this\s+weekend|next\s+weekend|early\s+next\s+month|end\s+of\s+the\s+month|mid\s+[a-z]+)\b/i,
    /\b(tomorrow|this\s+friday|this\s+saturday|this\s+sunday|next\s+saturday|next\s+sunday)\b/i,
    /\b(in\s+\w+\s+weeks?|in\s+\w+\s+months?)\b/i
  ];
  for (const regex of dateRegexes) {
    const match = userFullText.match(regex);
    if (match && match[1]) {
      preferredDate = match[1].trim();
      preferredDate = preferredDate.charAt(0).toUpperCase() + preferredDate.slice(1);
      break;
    }
  }

  let email: string | null = null;
  const emailMatch = userFullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    email = emailMatch[0].trim();
  }

  let phone: string | null = null;
  const phoneMatch = userFullText.match(/(?:\+?61\s?4\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|04\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|\b0[2-9]\d{8}\b|\b\d{10,11}\b)/);
  if (phoneMatch) {
    phone = phoneMatch[0].trim();
  }

  let fullName: string | null = null;
  const nameExplicitPatterns = [
    /(?:my\s+name\s+is|i(?:'m| am)|this\s+is|name:\s*)\s+([A-Z][a-zA-Z'\-.]+(?:\s+[A-Z0-9a-zA-Z'\-.]+){0,4})/i,
    /(?:call\s+me)\s+([A-Z][a-zA-Z'\-.]+)/i
  ];
  for (const pat of nameExplicitPatterns) {
    const match = userFullText.match(pat);
    if (match && match[1]) {
      fullName = match[1].trim();
      break;
    }
  }

  if (!fullName) {
    for (const pText of poppyTexts) {
      const ackMatch = pText.match(/(?:wonderful|thank you(?: so much)?|welcome|noted),\s+([A-Z][a-zA-Z'\-.]+(?:\s+[A-Z0-9a-zA-Z'\-.]+){0,3})[!,\.]/i);
      if (ackMatch && ackMatch[1]) {
        const candidate = ackMatch[1].trim();
        if (
          candidate.length > 2 &&
          candidate.length < 45 &&
          !candidate.toLowerCase().includes('client') &&
          !candidate.toLowerCase().includes('there') &&
          !candidate.toLowerCase().includes('reaching out')
        ) {
          fullName = candidate;
          break;
        }
      }
    }
  }

  if (!fullName) {
    for (let i = 0; i < allTurns.length - 1; i++) {
      const turn = allTurns[i];
      const nextTurn = allTurns[i + 1];
      if (turn.sender !== 'user' && nextTurn.sender === 'user') {
        const lowerTurn = turn.text.toLowerCase();
        const isAskingName =
          lowerTurn.includes('your full name') ||
          lowerTurn.includes('may i please have your name') ||
          lowerTurn.includes('may i have your full name') ||
          lowerTurn.includes('may i have your name') ||
          lowerTurn.includes('who am i speaking with') ||
          lowerTurn.includes('note this on falguni') ||
          lowerTurn.includes('reserving your spot in falguni');

        if (isAskingName) {
          const rawUserAns = nextTurn.text.trim();
          if (
            rawUserAns.length > 1 &&
            rawUserAns.length < 45 &&
            !rawUserAns.includes('@') &&
            !rawUserAns.includes('http') &&
            !rawUserAns.toLowerCase().includes('smash') &&
            !rawUserAns.toLowerCase().includes('newborn') &&
            !rawUserAns.toLowerCase().includes('maternity') &&
            !rawUserAns.toLowerCase().includes('family') &&
            !rawUserAns.toLowerCase().includes('session')
          ) {
            const cleaned = rawUserAns.replace(/^(?:it's|it is|i'm|im|my name is)\s+/i, '').trim();
            if (cleaned.length > 1) {
              fullName = cleaned;
              break;
            }
          }
        }
      }
    }
  }

  if (!fullName && lastPoppyQuestion === 'name') {
    const cleanCurrent = currentMessage.trim();
    if (
      cleanCurrent.length > 1 &&
      cleanCurrent.length < 45 &&
      !cleanCurrent.includes('@') &&
      !cleanCurrent.includes('http') &&
      !cleanCurrent.toLowerCase().includes('smash') &&
      !cleanCurrent.toLowerCase().includes('newborn') &&
      !cleanCurrent.toLowerCase().includes('maternity') &&
      !cleanCurrent.toLowerCase().includes('family') &&
      !cleanCurrent.toLowerCase().includes('session')
    ) {
      const cleaned = cleanCurrent.replace(/^(?:it's|it is|i'm|im|my name is)\s+/i, '').trim();
      fullName = cleaned;
    }
  }

  const missingFields: ('service' | 'date' | 'name' | 'contact')[] = [];
  if (!service) missingFields.push('service');
  if (!preferredDate) missingFields.push('date');
  if (!fullName) missingFields.push('name');
  if (!phone && !email) missingFields.push('contact');

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

export function generateContextualResponse(
  history: ChatTurn[],
  currentMessage: string
): { text: string; extractedBooking: any } {
  const state = extractConversationState(history, currentMessage);
  const currentLower = currentMessage.toLowerCase();

  const isAskingWhatDetailsNeeded =
    currentLower.includes('what detail') ||
    currentLower.includes('what do you need') ||
    currentLower.includes('what is needed') ||
    currentLower.includes('how to reserve') ||
    currentLower.includes('how do i reserve') ||
    currentLower.includes('how do i book') ||
    currentLower.includes('what info');

  const isAskingLocation =
    currentLower.includes('where are you located') ||
    currentLower.includes('address') ||
    currentLower.includes('location') ||
    currentLower.includes('where is the studio') ||
    currentLower.includes('where is your studio') ||
    currentLower.includes('parking');

  const isAskingPricing =
    currentLower.includes('price') ||
    currentLower.includes('cost') ||
    currentLower.includes('how much') ||
    currentLower.includes('packages') ||
    currentLower.includes('rates') ||
    currentLower.includes('deposit');

  const isAskingGowns =
    currentLower.includes('gown') ||
    currentLower.includes('dress') ||
    currentLower.includes('wardrobe') ||
    currentLower.includes('outfit') ||
    currentLower.includes('what should we wear') ||
    currentLower.includes('what do we wear') ||
    currentLower.includes('props');

  const isAskingPhotographer =
    currentLower.includes('who is falguni') ||
    currentLower.includes('about falguni') ||
    currentLower.includes('experience') ||
    currentLower.includes('certified') ||
    currentLower.includes('safety') ||
    currentLower.includes('vaccin');

  if (isAskingWhatDetailsNeeded) {
    let response = "To reserve a portrait session on Falguni's studio calendar, we just need four simple details:\n\n1. Session Type: Newborn, Maternity, Family, or Cake Smash\n2. Preferred Date or Baby's Due Date / 1st Birthday\n3. Your Full Name\n4. Your Contact Phone and Email for confirmation and session styling guide";
    if (state.service) {
      response += `\n\nI see you are interested in our ${state.serviceLabel}! What date or month works best for your family?`;
    } else {
      response += "\n\nWhich of our portrait sessions would you love to explore today?";
    }
    return { text: response, extractedBooking: null };
  }

  if (isAskingLocation) {
    return {
      text: "Our warm, peaceful photography sanctuary is located at 26 South Pkwy, Northfield SA 5085, just a short 15-minute drive from Adelaide CBD. We offer convenient, free private driveway parking right at our studio doors, complete with a cozy nursing nook and heated temperature control.\n\nWould you like to reserve a session date with us?",
      extractedBooking: null
    };
  }

  if (isAskingPricing) {
    return {
      text: "Every boutique session with Falguni includes full studio access, certified infant and family posing, complementary wardrobe styling (couture gowns, silk drapes, organic baby wraps, and props), plus an unhurried, private experience. A modest $100 deposit secures your date on Falguni's calendar.\n\nWhich session type would you like to explore for your family?",
      extractedBooking: null
    };
  }

  if (isAskingGowns) {
    return {
      text: "You do not need to worry about bringing anything! For newborn sessions, all organic wraps, bonnets, handcrafted headbands, and floral props are lovingly provided. For maternity sessions, clients have complimentary access to our luxury couture gown collection, silk drapes, and bodysuits. For cake smash sessions, custom balloon styling, smash cake, and warm vintage tub bath setups are fully arranged.\n\nWhich session can I help you prepare for?",
      extractedBooking: null
    };
  }

  if (isAskingPhotographer) {
    return {
      text: "Falguni is a specialized portrait photographer with over three years of studio experience and 56 five-star client reviews. She holds dedicated certifications in newborn handling and airway safety, using patient, baby-led soothing techniques so parents can sit back and relax in our warm studio.\n\nWould you like to reserve an upcoming date on Falguni's calendar?",
      extractedBooking: null
    };
  }

  if (state.service && state.preferredDate && state.fullName && (state.phone || state.email)) {
    const bookingData = {
      fullName: state.fullName,
      phone: state.phone || (state.email ? 'Not provided (Email only)' : ''),
      email: state.email || '',
      serviceRequested: state.serviceLabel || 'Studio Photography',
      preferredDate: state.preferredDate,
      notes: currentMessage
    };

    let contactNotice = state.email || state.phone;
    let reply = `Thank you so much, ${state.fullName}! I have recorded your ${state.serviceLabel} reservation request for ${state.preferredDate}.\n\nA boutique confirmation copy and session styling preparation guide will be sent directly to ${contactNotice}. Falguni will personally review her studio calendar and confirm your booking within 24 hours. We cannot wait to welcome you to our Northfield studio!`;

    if (!state.phone && state.email) {
      reply += `\n\nIf you have a mobile phone number where Falguni can reach you on the day of the shoot, feel free to reply with it here anytime!`;
    }

    return { text: reply, extractedBooking: bookingData };
  }

  if (state.service && state.preferredDate && state.fullName && !state.phone && !state.email) {
    return {
      text: `Wonderful, ${state.fullName}! I have penciled in your ${state.serviceLabel} for ${state.preferredDate}. What is the best phone number and email address to send your booking confirmation and preparation guide?`,
      extractedBooking: null
    };
  }

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

  if (state.service && !state.preferredDate) {
    if (state.service === 'cake_smash') {
      return {
        text: "Cake smash sessions are such a joyful way to honor baby's first birthday! We provide a custom balloon backdrop, a delicious smash cake, milestone portraits beforehand, and a warm splash bath setup afterwards, along with complete studio cleanup! What date is your little one turning one?",
        extractedBooking: null
      };
    }
    if (state.service === 'newborn') {
      return {
        text: "Newborn sessions are held in our cozy 26°C studio sanctuary with organic wraps, bonnets, floral props, and peaceful baby-led posing. They are ideally scheduled when baby is between 5 and 14 days old. What is your estimated due date or baby's birth date?",
        extractedBooking: null
      };
    }
    if (state.service === 'maternity') {
      return {
        text: "Maternity sessions are best captured between 28 and 34 weeks, and include full access to our luxury gowns, silk drapes, and partner styling. What is your estimated due date or preferred month?",
        extractedBooking: null
      };
    }
    if (state.service === 'family') {
      return {
        text: "Family portrait sessions celebrate genuine connection, hugs, and laughter in an unhurried, peaceful atmosphere. What date or month works best for your family?",
        extractedBooking: null
      };
    }
  }

  return {
    text: "Hello! I am Poppy, Falguni's studio coordinator. We offer boutique Newborn, Maternity, Family, and Cake Smash portrait sessions in our warm Northfield studio, complete with luxury wardrobe styling and handcrafted props. Which session would you love to explore today?",
    extractedBooking: null
  };
}
