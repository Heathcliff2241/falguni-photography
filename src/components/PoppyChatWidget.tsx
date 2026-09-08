import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import {
  ChatTeardropText, X, PaperPlaneRight, EnvelopeSimple, CheckCircle,
  Calendar, Eye, ChatCircleText, Heart
} from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';
import { extractConversationState, generateContextualResponse, ChatTurn } from '../data/poppyBrain';

interface PoppyChatWidgetProps {
  onOpenBooking: (service?: string) => void;
}

export const PoppyChatWidget: React.FC<PoppyChatWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState<string>('Poppy is thinking...');
  const [activeNotificationModal, setActiveNotificationModal] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('poppy_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore chat history from sessionStorage:', e);
    }
    return [
      {
        id: 'init-1',
        sender: 'poppy',
        text: "Hello! I'm Poppy, Falguni's studio coordinator. I am here to gently guide you through our newborn, maternity, family, and cake smash sessions, answer any questions about our warm studio and luxury wardrobe, or lovingly reserve your date directly right here in chat. How may I care for you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('poppy_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history to sessionStorage:', e);
    }
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Lock scroll on body for mobile screens when chat is open
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [messages, isOpen, loading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const downloadIcsCalendarEvent = (booking: any) => {
    const title = `Falguni's Photography Session - ${booking.serviceRequested || 'Studio Session'}`;
    const desc = `Photography session at Falguni's Photography Studio.\\nClient: ${booking.fullName}\\nPhone: ${booking.phone}\\nEmail: ${booking.email}\\nAddress: 26 South Pkwy, Northfield SA 5085\\nStudio Phone: +61 469 753 238`;
    const loc = `26 South Pkwy, Northfield SA 5085, Australia`;
    
    // Default to a 10:00 AM session 3 days from now if fuzzy date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    startDate.setHours(10, 0, 0, 0);

    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatDateToIcs = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Falgunis Photography//Booking Assistant//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      `DTSTART:${formatDateToIcs(startDate)}`,
      `DTEND:${formatDateToIcs(endDate)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Falguni-Photography-Booking-${booking.fullName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('iCal Calendar File Downloaded!');
  };

  // Dynamic context-aware suggestion generator formatted as message speech bubbles
  const getDynamicSuggestions = () => {
    if (messages.length <= 1) {
      return [
        { label: 'How do I reserve a date?', prompt: 'I would like to reserve a session date with Falguni. What details do you need?' },
        { label: 'What is included in sessions?', prompt: 'What styling and props are included in the studio sessions?' },
        { label: 'Newborn Session Info', prompt: 'What is included in a newborn shoot?' },
        { label: 'Maternity Gowns Provided?', prompt: 'What gowns and styling wardrobe do you provide for maternity?' },
        { label: 'Studio Location in Northfield', prompt: 'Where is your studio located and is parking available?' }
      ];
    }

    const chatTurns: ChatTurn[] = messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));
    const convState = extractConversationState(chatTurns);
    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.bookingExtracted || convState.isBookingComplete) {
      return [
        { label: 'Download iCal Event', isAction: true, action: () => downloadIcsCalendarEvent(lastMsg?.bookingExtracted || convState) },
        { label: 'What should we bring?', prompt: 'What should we bring with us to the studio session?' },
        { label: 'Where is the studio located?', prompt: 'Where is your studio located in Northfield?' },
        { label: 'Book another portrait session', prompt: 'I would also like to explore booking another session for my family.' }
      ];
    }

    // If session chosen and date is missing, offer quick date options
    if (convState.service && !convState.preferredDate) {
      if (convState.service === 'cake_smash') {
        return [
          { label: 'Around baby\'s 1st birthday', prompt: 'Our preferred date is around our baby\'s 1st birthday next month.' },
          { label: 'Weekend morning slot', prompt: 'Do you have weekend morning availability?' },
          { label: 'Is the smash cake provided?', prompt: 'Do you provide the smash cake or do we bring one?' },
          { label: 'Studio address & parking', prompt: 'Where is your studio located in Northfield?' }
        ];
      }
      if (convState.service === 'newborn') {
        return [
          { label: 'Due in upcoming weeks', prompt: 'My baby is due in the coming weeks and I would like to reserve a tentative date.' },
          { label: 'Baby is 1 week old', prompt: 'Baby is already here and 1 week old.' },
          { label: 'Are parent photos included?', prompt: 'Can parents and siblings be included in newborn portraits?' },
          { label: 'What wraps and props provided?', prompt: 'What wraps, bonnets, and props do you provide?' }
        ];
      }
      if (convState.service === 'maternity') {
        return [
          { label: 'Between 28 and 34 weeks', prompt: 'I am looking to book around week 30 of my pregnancy.' },
          { label: 'Upcoming weekend date', prompt: 'Do you have availability for an upcoming Saturday or Sunday?' },
          { label: 'Studio gowns provided?', prompt: 'Do you provide studio dresses and drapes for maternity sessions?' },
          { label: 'Can partner and kids join?', prompt: 'Can my partner and older children join the session?' }
        ];
      }
      if (convState.service === 'family') {
        return [
          { label: 'Upcoming Saturday morning', prompt: 'We are hoping for an upcoming Saturday morning.' },
          { label: 'Weekday late afternoon', prompt: 'Do you have weekday late afternoon availability?' },
          { label: 'What styling do you recommend?', prompt: 'What clothing colors do you recommend for family portraits?' },
          { label: 'Where is the studio?', prompt: 'Where is your studio located in Northfield?' }
        ];
      }
    }

    // If date is provided but name is missing
    if (convState.preferredDate && !convState.fullName) {
      return [
        { label: 'Share my contact details', prompt: 'I would like to share my details to finalize this booking.' },
        { label: 'What is included in this session?', prompt: 'What is included in this session package?' },
        { label: 'Studio location & parking', prompt: 'Where is Falguni\'s studio located?' },
        { label: 'How long until photos are ready?', prompt: 'How long does gallery delivery take after the session?' }
      ];
    }

    // Default suggestions
    return [
      { label: 'Reserve Session in Chat', prompt: 'I would like to reserve a session with Falguni.' },
      { label: 'What details do you need to book?', prompt: 'What details do you need to reserve a date?' },
      { label: 'Explore Session Packages', prompt: 'What photography sessions and packages do you offer?' },
      { label: 'Studio Address & Directions', prompt: 'Where is Falguni\'s studio located in Northfield?' }
    ];
  };

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);
    setThinkingStage('Poppy is carefully reviewing our conversation...');

    const startTime = Date.now();

    // Multi-stage receptionist thinking updates for a thoughtful, reliable feel
    const stageTimer1 = setTimeout(() => {
      setThinkingStage('Poppy is checking Falguni\'s studio calendar and details...');
    }, 900);

    const stageTimer2 = setTimeout(() => {
      setThinkingStage('Poppy is preparing a thoughtful response...');
    }, 1900);

    try {
      let replyText = '';
      let extracted: any = null;
      let notification: any = null;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: updatedMessages.slice(0, -1).map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.text;
          extracted = data.extracted;
          notification = data.clientNotification;
        }
      } catch (e) {
        console.warn('Backend chat API request failed, using local Poppy brain fallback response.');
      }

      // If backend was unreachable or returned empty, use state-aware Poppy brain
      if (!replyText) {
        const chatHistoryTurns: ChatTurn[] = updatedMessages.slice(0, -1).map(m => ({
          sender: m.sender,
          text: m.text
        }));
        const contextualRes = generateContextualResponse(chatHistoryTurns, userText);
        replyText = contextualRes.text;

        if (contextualRes.extractedBooking) {
          extracted = contextualRes.extractedBooking;
          // Synchronize lead with backend database
          fetch('/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...contextualRes.extractedBooking,
              source: 'ai_poppy'
            })
          }).catch(err => console.warn('Could not sync booking lead in fallback mode:', err));
        }
      }

      // Strip any remaining emojis, em-dashes or en-dashes from replyText
      replyText = replyText
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s*—\s*/g, ', ')
        .replace(/\s*–\s*/g, ', ')
        .replace(/\s*--\s*/g, ', ')
        .replace(/—/g, ', ')
        .replace(/–/g, ', ');

      // Enforce an unhurried, peaceful simulated delay (minimum 2200ms)
      const elapsed = Date.now() - startTime;
      const minDelay = 2200;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }

      if (extracted && extracted.email) {
        showToast(`Booking Confirmed! Confirmation email dispatched to ${extracted.email}`);
      }

      const poppyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'poppy',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bookingExtracted: extracted ? { ...extracted, notification } : undefined
      };
      setMessages(prev => [...prev, poppyMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'poppy',
        text: "I am always here to assist you! You can also call Falguni directly at +61 469 753 238 or click 'Book Session' to reserve your spot.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(input);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#423341] text-[#FBF6EF] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#A7B596] flex items-center gap-3 animate-fade-in font-body text-sm font-semibold">
          <CheckCircle size={22} className="text-[#A7B596] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Toggle Launcher Styled as a Message Speech Bubble */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end group">
          {/* Outer Speech Tail Indicator */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#423341] text-[#FBF6EF] pl-4 pr-5 py-3 sm:py-3.5 rounded-3xl rounded-br-xs shadow-2xl hover:bg-[#A7B596] hover:text-[#423341] transition-all flex items-center gap-3 border-2 border-[#EFD4CE] cursor-pointer active:scale-95 group"
              aria-label="Chat with Poppy"
            >
              <div className="relative w-9 h-9 rounded-full bg-[#EFD4CE]/30 flex items-center justify-center text-[#EFD4CE] group-hover:text-[#423341] shrink-0">
                <ChatTeardropText size={22} weight="fill" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#A7B596] rounded-full border-2 border-[#423341] animate-pulse" />
              </div>
              <div className="text-left leading-tight">
                <span className="font-display text-sm font-medium block">Chat with Poppy</span>
                <span className="text-[10px] opacity-80 font-body block">Ask questions or reserve a date</span>
              </div>
            </button>
            {/* Speech Bubble Tail Notch */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#423341] border-r-2 border-b-2 border-[#EFD4CE] rotate-45 group-hover:bg-[#A7B596] transition-colors" />
          </div>
        </div>
      )}

      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#423341]/60 backdrop-blur-xs z-40 sm:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Drawer / Bottom Sheet Widget */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[88vh] sm:h-[620px] bg-[#FBF6EF] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFD4CE] flex flex-col overflow-hidden animate-fade-in font-body transition-all">
          
          {/* Mobile Handle Drag Bar */}
          <div className="w-12 h-1.5 bg-[#EFD4CE] rounded-full mx-auto my-2 sm:hidden shrink-0" />

          {/* Header */}
          <div className="bg-[#423341] text-[#FBF6EF] p-3.5 sm:p-4 flex items-center justify-between border-b border-[#EFD4CE]/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/30 flex items-center justify-center text-[#EFD4CE]">
                <BotanicalRose color="blush" size={26} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-[#EFD4CE] leading-none flex items-center gap-1.5">
                  Poppy
                  <span className="text-[10px] bg-[#A7B596]/30 text-[#A7B596] border border-[#A7B596]/50 px-2 py-0.5 rounded-full font-mono font-normal">
                    AI Studio Coordinator
                  </span>
                </h3>
                <span className="text-[11px] text-[#FBF6EF]/70 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#A7B596] animate-pulse" />
                  Online • Falguni's Photography
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 text-[#FBF6EF] flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick links header banner */}
          <div className="bg-[#EFD4CE]/30 px-4 py-2 flex items-center justify-between text-xs text-[#423341] border-b border-[#EFD4CE]/50 shrink-0">
            <span className="font-medium flex items-center gap-1.5">
              <ChatCircleText size={15} className="text-[#A7B596]" />
              Ask questions or reserve your date gently in chat
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="bg-white/80 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#423341] border border-[#EFD4CE] hover:bg-[#A7B596] transition-colors cursor-pointer"
            >
              Direct Form →
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 bg-[#FBF6EF]">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Speech Message Bubble styling */}
                <div
                  className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed shadow-xs relative ${
                    m.sender === 'user'
                      ? 'bg-[#423341] text-[#FBF6EF] rounded-3xl rounded-tr-xs'
                      : 'bg-white text-[#423341] border border-[#EFD4CE] rounded-3xl rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Booking Confirmation Receipt Card when booking is created */}
                {m.bookingExtracted && (
                  <div className="mt-2.5 max-w-[92%] bg-white p-4 rounded-3xl border-2 border-[#A7B596] shadow-md space-y-3 font-body">
                    <div className="flex items-center justify-between border-b border-[#EFD4CE]/60 pb-2">
                      <span className="text-xs font-bold text-[#A7B596] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle size={16} weight="fill" /> Session Reserved!
                      </span>
                      <span className="text-[10px] bg-[#EFD4CE]/40 text-[#423341] px-2 py-0.5 rounded-full font-mono">
                        {m.bookingExtracted.id || 'BOOKING-OK'}
                      </span>
                    </div>

                    <div className="text-xs text-[#423341] space-y-1.5">
                      <p><strong>Client:</strong> {m.bookingExtracted.fullName || 'Valued Client'}</p>
                      <p><strong>Phone:</strong> {m.bookingExtracted.phone && m.bookingExtracted.phone !== 'Not provided (Email only)' ? m.bookingExtracted.phone : 'Not provided (Email only)'}</p>
                      <p><strong>Email:</strong> {m.bookingExtracted.email || 'Recorded'}</p>
                      <p><strong>Service:</strong> {m.bookingExtracted.serviceRequested || 'Photography Session'}</p>
                      <p><strong>Date & Time:</strong> {m.bookingExtracted.preferredDate || 'Upcoming Session'}</p>
                    </div>

                    <div className="bg-[#FBF6EF] p-2.5 rounded-2xl border border-[#EFD4CE] text-[11px] text-[#423341]/80 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#52796F]">
                        <EnvelopeSimple size={14} /> Email Confirmation Dispatched!
                      </div>
                      <p>Boutique booking confirmation & session styling guide sent directly to <strong>{m.bookingExtracted.email || 'your email'}</strong> (Email notification only).</p>
                    </div>

                    <div className="pt-1 flex flex-col gap-2 text-xs">
                      {m.bookingExtracted.notification && (
                        <button
                          onClick={() => setActiveNotificationModal(m.bookingExtracted.notification)}
                          className="w-full bg-[#EFD4CE] hover:bg-[#ebd0ca] text-[#423341] font-semibold py-2.5 px-4 rounded-2xl rounded-bl-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs border border-[#e0beba]"
                        >
                          <Eye size={16} /> View Styled Confirmation Email Sent
                        </button>
                      )}

                      <button
                        onClick={() => downloadIcsCalendarEvent(m.bookingExtracted)}
                        className="w-full bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold py-2.5 px-4 rounded-2xl rounded-bl-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs border border-[#8f9f7e]"
                      >
                        <Calendar size={16} /> Save Session to Calendar (.ics)
                      </button>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-[#423341]/50 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {/* Subtle, Gentle 'Poppy is thinking...' Animation & Dot Indicator */}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-[#423341] bg-white border border-[#EFD4CE] px-4 py-3 rounded-3xl rounded-tl-xs shadow-xs w-fit animate-fade-in">
                {/* Gentle Pulsing & Bouncing Dot Indicator */}
                <div className="flex items-center gap-1.5 text-[#A7B596]">
                  <span className="w-2 h-2 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                  <span className="w-2 h-2 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                  <span className="w-2 h-2 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <BotanicalRose color="sage" size={15} className="animate-spin text-[#A7B596]" style={{ animationDuration: '8s' }} />
                  <span className="font-medium text-[#423341]/90 italic">{thinkingStage}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Options Formatted as Message Speech Bubbles */}
          <div className="px-3 py-2.5 bg-[#EFD4CE]/20 border-t border-[#EFD4CE]/40 shrink-0">
            <p className="text-[11px] font-semibold text-[#423341]/70 mb-1.5 px-1 flex items-center gap-1">
              <ChatCircleText size={14} className="text-[#A7B596]" />
              <span>Tap a message bubble to ask Poppy:</span>
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              {getDynamicSuggestions().map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if ('isAction' in q && q.isAction) {
                      q.action();
                    } else if (q.prompt) {
                      sendMessageText(q.prompt);
                    }
                  }}
                  className="bg-white hover:bg-[#A7B596] hover:text-[#423341] text-[#423341] border border-[#EFD4CE] text-xs font-medium px-3.5 py-2 rounded-2xl rounded-bl-xs whitespace-nowrap shadow-2xs transition-all shrink-0 disabled:opacity-50 cursor-pointer active:scale-95 min-h-[36px] flex items-center gap-1.5 group"
                >
                  <ChatTeardropText size={14} className="text-[#A7B596] group-hover:text-[#423341] shrink-0" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EFD4CE] flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask Poppy a question or share booking details..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-[#FBF6EF] border border-[#EFD4CE] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A7B596] min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-2xl bg-[#A7B596] text-[#423341] flex items-center justify-center disabled:opacity-40 hover:bg-[#96a585] transition-colors shrink-0 cursor-pointer min-h-[44px] min-w-[44px] shadow-2xs"
              aria-label="Send message"
            >
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </form>
        </div>
      )}

      {/* Client Notification Preview Modal */}
      {activeNotificationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#423341]/80 backdrop-blur-md animate-fade-in font-body"
          onClick={() => setActiveNotificationModal(null)}
        >
          <div
            className="bg-[#FBF6EF] max-w-xl w-full rounded-3xl p-6 shadow-2xl relative border border-[#EFD4CE] max-h-[85vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveNotificationModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EFD4CE] text-[#423341] flex items-center justify-center hover:bg-[#e0beba] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-[#EFD4CE] pb-3">
              <div className="p-2.5 rounded-2xl bg-[#A7B596] text-[#423341]">
                <EnvelopeSimple size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-[#423341]">
                  Client Notification Dispatch Log
                </h3>
                <p className="text-xs text-[#423341]/70">
                  Ref #{activeNotificationModal.referenceNumber} • Sent at {activeNotificationModal.timestamp}
                </p>
              </div>
            </div>

            {/* Email Preview Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-semibold text-[#423341]/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  Email Dispatched Directly To Client:
                </span>
                <span className="text-[#52796F] font-mono bg-[#A7B596]/20 px-2 py-0.5 rounded-full">{activeNotificationModal.recipientEmail}</span>
              </div>

              {/* Styled Email Client Frame */}
              <div className="bg-white rounded-2xl border border-[#EFD4CE] text-xs text-[#423341] shadow-md overflow-hidden">
                <div className="bg-[#423341] text-[#FBF6EF] px-4 py-3 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-[#EFD4CE]/80">
                    <span>From: Falguni's Photography &lt;noreply@falgunisphotography.com.au&gt;</span>
                    <span>Ref #{activeNotificationModal.referenceNumber}</span>
                  </div>
                  <p className="font-semibold text-sm text-[#FBF6EF] pt-0.5">
                    {activeNotificationModal.subject}
                  </p>
                </div>
                <div className="p-4 max-h-[45vh] overflow-y-auto bg-neutral-50/50">
                  <div
                    className="prose prose-sm max-w-none text-xs"
                    dangerouslySetInnerHTML={{ __html: activeNotificationModal.htmlBody }}
                  />
                </div>
              </div>
            </div>

            {/* Email Only Policy Banner (No SMS) */}
            <div className="p-3 bg-[#A7B596]/15 rounded-2xl border border-[#A7B596]/40 flex items-start gap-2.5 text-[11px] text-[#423341]/80 leading-relaxed">
              <EnvelopeSimple size={18} className="text-[#52796F] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#423341] block">Email-Only Notification Policy</strong>
                Falguni's Photography sends booking confirmations, styling preparations, and proofing portals exclusively via email. No marketing SMS or automated text messages are sent to your phone.
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveNotificationModal(null)}
                className="bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold text-sm px-6 py-2.5 rounded-full transition-colors cursor-pointer min-h-[44px] shadow-sm"
              >
                Close Email Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
