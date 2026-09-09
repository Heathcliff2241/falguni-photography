import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import {
  X, PaperPlaneRight, EnvelopeSimple, CheckCircle,
  Calendar, Eye, Sparkle, ArrowRight,
  Camera, Leaf, Star, Phone
} from '@phosphor-icons/react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PoppyChatWidgetProps {
  onOpenBooking: (service?: string) => void;
}

// ---------------------------------------------------------------------------
// Booking progress helper
// ---------------------------------------------------------------------------
type BookingStep = 'service' | 'date' | 'name' | 'contact';

interface ProgressState {
  service: boolean;
  date: boolean;
  name: boolean;
  contact: boolean;
}

function deriveProgress(messages: ChatMessage[]): ProgressState {
  const userText = messages.filter(m => m.sender === 'user').map(m => m.text).join(' \n ');
  const allText = messages.map(m => m.text).join(' \n ');

  const service = !!(
    /newborn|maternity|family|cake.smash|first birthday|birthday session/i.test(userText)
  );
  const dateRe = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|next\s+(?:week|month|saturday|sunday)|this\s+(?:weekend|friday|saturday|sunday)|tomorrow)/i;
  const date = dateRe.test(userText);
  const nameRe = /(?:my name is|i(?:'m| am)|this is|name:\s*)\s*[A-Z][a-z]+/i;
  const name = nameRe.test(allText) || messages.some(m => m.bookingExtracted?.fullName);
  const contact = !!(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(userText) ||
    /(?:\+?61\s?4\d{2}|04\d{2})[\s.\-]?\d{3}[\s.\-]?\d{3}/.test(userText) ||
    messages.some(m => m.bookingExtracted?.email || m.bookingExtracted?.phone)
  );

  return { service, date, name, contact };
}

// ---------------------------------------------------------------------------
// Context-aware quick suggestions
// ---------------------------------------------------------------------------
interface Suggestion {
  label: string;
  icon: React.ReactNode;
  prompt?: string;
  isAction?: boolean;
  action?: () => void;
}

// ---------------------------------------------------------------------------
// ICS calendar download
// ---------------------------------------------------------------------------
function downloadIcs(booking: any) {
  const title = `Falguni's Photography — ${booking.serviceRequested || 'Studio Session'}`;
  const desc = `Session at Falguni's Photography\\nClient: ${booking.fullName}\\nPhone: ${booking.phone}\\nEmail: ${booking.email}\\nAddress: 26 South Pkwy, Northfield SA 5085\\nPhone: +61 469 753 238`;
  const start = new Date(); start.setDate(start.getDate() + 3); start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Falgunis Photography//Booking//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`, `DESCRIPTION:${desc}`, 'LOCATION:26 South Pkwy, Northfield SA 5085',
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`, 'STATUS:CONFIRMED',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url; a.download = `Falguni-${booking.fullName?.replace(/\s+/g, '_') || 'Session'}.ics`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------
function useTypewriter(text: string, speed = 16, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || prefersReduced) { setDisplayed(text); setDone(true); return; }
    setDisplayed(''); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, enabled]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Single message bubble with typewriter for last Aria message
// ---------------------------------------------------------------------------
interface BubbleProps {
  m: ChatMessage;
  isLatestAria: boolean;
  onViewNotification: (n: any) => void;
  onDownloadIcs: (b: any) => void;
}

const MessageBubble: React.FC<BubbleProps> = ({ m, isLatestAria, onViewNotification, onDownloadIcs }) => {
  const { displayed, done } = useTypewriter(m.text, 14, isLatestAria && m.sender === 'aria');
  const content = isLatestAria && m.sender === 'aria' ? displayed : m.text;
  const isUser = m.sender === 'user';

  return (
    <div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} msg-entrance`}
      style={{ animationFillMode: 'both' }}
    >
      {/* Bubble */}
      <div className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed shadow-sm relative ${
        isUser
          ? 'bg-[#423341] text-[#FBF6EF] rounded-3xl rounded-tr-sm'
          : 'bg-white text-[#423341] border border-[#EFD4CE] rounded-3xl rounded-tl-sm'
      }`}>
        <p className="whitespace-pre-line">{content}</p>
        {/* Cursor blink on last Aria message while typing */}
        {isLatestAria && m.sender === 'aria' && !done && (
          <span className="inline-block w-0.5 h-4 bg-[#A7B596] ml-0.5 align-middle animate-pulse" />
        )}
      </div>

      {/* Booking Confirmation Card */}
      {m.bookingExtracted && (
        <div className="mt-3 max-w-[96%] w-full bg-white rounded-3xl border-2 border-[#A7B596] shadow-lg overflow-hidden booking-card-entrance">
          {/* Success header */}
          <div className="bg-gradient-to-r from-[#A7B596] to-[#8fa27a] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-7 h-7 checkmark-draw">
                <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="2.5" className="checkmark-circle" />
                <path d="M10 18 L16 24 L26 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark-path" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Session Reserved</p>
              <p className="text-white/80 text-xs">{m.bookingExtracted.id || 'Booking confirmed'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-xs text-[#423341]">
              <div>
                <p className="text-[#A7B596] font-semibold uppercase tracking-wider text-[10px] mb-0.5">Client</p>
                <p className="font-medium">{m.bookingExtracted.fullName || 'Valued Client'}</p>
              </div>
              <div>
                <p className="text-[#A7B596] font-semibold uppercase tracking-wider text-[10px] mb-0.5">Session</p>
                <p className="font-medium">{m.bookingExtracted.serviceRequested || 'Photography Session'}</p>
              </div>
              <div>
                <p className="text-[#A7B596] font-semibold uppercase tracking-wider text-[10px] mb-0.5">Preferred Date</p>
                <p className="font-medium">{m.bookingExtracted.preferredDate || 'To be confirmed'}</p>
              </div>
              <div>
                <p className="text-[#A7B596] font-semibold uppercase tracking-wider text-[10px] mb-0.5">Contact</p>
                <p className="font-medium truncate">{m.bookingExtracted.email || m.bookingExtracted.phone || 'On file'}</p>
              </div>
            </div>

            {/* Email notice */}
            {m.bookingExtracted.email && (
              <div className="flex items-start gap-2 bg-[#A7B596]/10 rounded-2xl p-2.5 text-[11px] text-[#423341]/80 border border-[#A7B596]/20">
                <EnvelopeSimple size={15} className="text-[#A7B596] shrink-0 mt-0.5" />
                <span>Styled confirmation sent to <strong>{m.bookingExtracted.email}</strong>. Falguni will confirm within 24 hours.</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-1">
              {m.bookingExtracted.notification && (
                <button
                  onClick={() => onViewNotification(m.bookingExtracted!.notification)}
                  className="w-full flex items-center justify-center gap-2 bg-[#EFD4CE] hover:bg-[#e5c9c2] text-[#423341] text-xs font-semibold py-2.5 px-4 rounded-2xl transition-all cursor-pointer border border-[#dbb9b1]"
                >
                  <Eye size={15} /> View Confirmation Email
                </button>
              )}
              <button
                onClick={() => onDownloadIcs(m.bookingExtracted)}
                className="w-full flex items-center justify-center gap-2 bg-[#A7B596] hover:bg-[#96a585] text-[#423341] text-xs font-semibold py-2.5 px-4 rounded-2xl transition-all cursor-pointer border border-[#8fa27a]"
              >
                <Calendar size={15} /> Save to Calendar (.ics)
              </button>
            </div>
          </div>
        </div>
      )}

      <span className="text-[10px] text-[#423341]/40 mt-1.5 px-1">{m.timestamp}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------
export const PoppyChatWidget: React.FC<PoppyChatWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState('Aria is thinking...');
  const [activeModal, setActiveModal] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showLauncher, setShowLauncher] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('aria_chat_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [{
      id: 'init-1',
      sender: 'aria',
      text: "Good day! I'm Aria, the studio receptionist for Falguni's Photography. I'm here to answer your questions or help you reserve a session date. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });

  // Persist chat
  useEffect(() => {
    try { sessionStorage.setItem('aria_chat_v2', JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  // Launcher entrance
  useEffect(() => {
    const t = setTimeout(() => setShowLauncher(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Body scroll lock on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  // Suggestions
  const progress = deriveProgress(messages);
  const getSuggestions = useCallback((): Suggestion[] => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.bookingExtracted) {
      return [
        { label: 'Download Calendar Event', icon: <Calendar size={13} />, isAction: true, action: () => downloadIcs(lastMsg.bookingExtracted) },
        { label: 'What to bring?', icon: <Sparkle size={13} />, prompt: 'What should I bring to the studio session?' },
        { label: 'Studio address', icon: <ArrowRight size={13} />, prompt: 'Where is Falguni\'s studio located?' },
        { label: 'Book another session', icon: <Camera size={13} />, prompt: 'I\'d like to book another session.' },
      ];
    }
    if (!progress.service) {
      return [
        { label: 'Newborn session', icon: <Leaf size={13} />, prompt: 'Tell me about your newborn photography session.' },
        { label: 'Maternity session', icon: <Sparkle size={13} />, prompt: 'I\'m pregnant and interested in a maternity session.' },
        { label: 'Family portraits', icon: <Camera size={13} />, prompt: 'Tell me about family portrait sessions.' },
        { label: 'Cake Smash', icon: <Star size={13} />, prompt: 'My baby is turning one. Tell me about cake smash sessions.' },
      ];
    }
    if (!progress.date) {
      return [
        { label: 'Next available weekend', icon: <Calendar size={13} />, prompt: 'Do you have any available weekend slots coming up?' },
        { label: 'Flexible on dates', icon: <ArrowRight size={13} />, prompt: 'I\'m flexible on dates. What works for the studio?' },
        { label: 'What\'s included?', icon: <Sparkle size={13} />, prompt: 'What is included in the session?' },
        { label: 'Gowns and props?', icon: <Leaf size={13} />, prompt: 'What styling items and props are provided?' },
      ];
    }
    if (!progress.contact) {
      return [
        { label: 'What details are needed?', icon: <ArrowRight size={13} />, prompt: 'What contact details do you need to confirm my booking?' },
        { label: 'Studio location', icon: <Camera size={13} />, prompt: 'Where exactly is the studio located and is parking available?' },
        { label: 'How long are sessions?', icon: <Sparkle size={13} />, prompt: 'How long do sessions typically run?' },
        { label: 'Call Falguni directly', icon: <Phone size={13} />, prompt: 'Can I have Falguni\'s direct phone number?' },
      ];
    }
    return [
      { label: 'Reserve a session', icon: <Calendar size={13} />, prompt: 'I\'d like to reserve a portrait session with Falguni.' },
      { label: 'Session pricing', icon: <Sparkle size={13} />, prompt: 'What is the pricing for your sessions?' },
      { label: 'Studio address', icon: <ArrowRight size={13} />, prompt: 'Where is the studio located in Northfield?' },
      { label: 'About Falguni', icon: <Camera size={13} />, prompt: 'Tell me about Falguni and her experience.' },
    ];
  }, [messages, progress]);

  // Send message
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    const userText = textToSend.trim();
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    const stages = [
      'Aria is reviewing your message...',
      'Checking Falguni\'s studio calendar...',
      'Preparing a thoughtful response...',
    ];
    setThinkingStage(stages[0]);
    const t1 = setTimeout(() => setThinkingStage(stages[1]), 1100);
    const t2 = setTimeout(() => setThinkingStage(stages[2]), 2200);
    const startTime = Date.now();

    try {
      let replyText = '';
      let extracted: any = null;
      let notification: any = null;

      try {
        const resp = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: updated.slice(0, -1).map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            }))
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          replyText = data.text;
          extracted = data.extracted;
          notification = data.clientNotification;
        }
      } catch { /* backend unreachable — use graceful fallback below */ }

      if (!replyText) {
        replyText = "Thank you for getting in touch! Falguni's Photography offers newborn, maternity, family, and cake smash portrait sessions in our warm Northfield studio. Which session can I tell you more about?";
      }

      // Minimum perceived thinking time of 2.2s for a premium, unhurried feel
      const elapsed = Date.now() - startTime;
      if (elapsed < 2200) await new Promise(r => setTimeout(r, 2200 - elapsed));

      if (extracted?.email) showToast(`Booking confirmed! Confirmation sent to ${extracted.email}`);

      const ariaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aria',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bookingExtracted: extracted ? { ...extracted, notification } : undefined
      };
      setMessages(prev => [...prev, ariaMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'aria',
        text: "I apologise for the interruption. Please call Falguni directly at +61 469 753 238 or click \"Book Session\" above.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      clearTimeout(t1); clearTimeout(t2);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  // Which message is the latest Aria message (for typewriter)
  const latestAriaId = [...messages].reverse().find(m => m.sender === 'aria')?.id;

  const progress2 = deriveProgress(messages);
  const steps: { key: BookingStep; label: string }[] = [
    { key: 'service', label: 'Session' },
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Name' },
    { key: 'contact', label: 'Contact' },
  ];
  const bookingComplete = messages.some(m => m.bookingExtracted);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Global CSS injected via style tag                                 */}
      {/* ---------------------------------------------------------------- */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.35); opacity: 0; }
        }
        @keyframes glow-ring-2 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%       { transform: scale(1.6); opacity: 0; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stepFill {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes bookingIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes checkCircle {
          from { stroke-dashoffset: 110; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes checkPath {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .launcher-enter { animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .glow-ring-1 { animation: glow-ring 2.2s ease-out infinite; }
        .glow-ring-2 { animation: glow-ring-2 2.2s ease-out infinite 0.4s; }
        .msg-entrance { animation: msgIn 0.3s ease both; }
        .panel-enter { animation: panelIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both; }
        .booking-card-entrance { animation: bookingIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both 0.15s; }
        .checkmark-circle {
          stroke-dasharray: 110;
          stroke-dashoffset: 110;
          animation: checkCircle 0.6s ease-out 0.3s forwards;
        }
        .checkmark-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: checkPath 0.4s ease-out 0.8s forwards;
        }
        .toast-enter { animation: toastIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .launcher-enter, .glow-ring-1, .glow-ring-2, .msg-entrance,
          .panel-enter, .booking-card-entrance, .checkmark-circle,
          .checkmark-path, .toast-enter { animation: none !important; }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Toast                                                             */}
      {/* ---------------------------------------------------------------- */}
      {toast && (
        <div className="fixed top-5 right-5 z-[60] bg-[#423341] text-[#FBF6EF] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#A7B596] flex items-center gap-3 font-body text-sm font-semibold toast-enter">
          <CheckCircle size={20} className="text-[#A7B596] shrink-0" weight="fill" />
          <span>{toast}</span>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Launcher Bubble                                                   */}
      {/* ---------------------------------------------------------------- */}
      {!isOpen && showLauncher && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 launcher-enter">
          {/* Peek message */}
          <div className="bg-white text-[#423341] text-xs font-body font-medium px-3.5 py-2 rounded-2xl rounded-br-sm shadow-lg border border-[#EFD4CE] max-w-[180px] text-right leading-snug">
            Need help booking? I'm here.
            <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white border-r border-b border-[#EFD4CE] rotate-45" />
          </div>

          {/* Button with glow rings */}
          <div className="relative flex items-center justify-center">
            {/* Glow ring 1 */}
            <span className="absolute inset-0 rounded-full bg-[#EFD4CE] glow-ring-1" />
            {/* Glow ring 2 */}
            <span className="absolute inset-0 rounded-full bg-[#EFD4CE] glow-ring-2" />

            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open studio receptionist chat"
              className="relative w-16 h-16 rounded-full bg-[#423341] shadow-2xl flex items-center justify-center border-2 border-[#EFD4CE] hover:scale-105 active:scale-95 transition-transform cursor-pointer group"
            >
              {/* Avatar initials on a blush circle */}
              <div className="w-11 h-11 rounded-full bg-[#EFD4CE]/20 border border-[#EFD4CE]/40 flex items-center justify-center">
                <span className="font-display text-lg font-semibold text-[#EFD4CE] leading-none select-none">A</span>
              </div>
              {/* Online dot */}
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#A7B596] rounded-full border-2 border-[#423341] animate-pulse" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Mobile Backdrop                                                   */}
      {/* ---------------------------------------------------------------- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#423341]/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Chat Panel                                                        */}
      {/* ---------------------------------------------------------------- */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[460px] h-[92vh] sm:h-[660px] bg-[#FBF6EF] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden font-body panel-enter">

          {/* Drag handle (mobile only) */}
          <div className="w-10 h-1 bg-[#D4C3C0] rounded-full mx-auto mt-2 mb-0.5 sm:hidden shrink-0" />

          {/* ---- Header ---- */}
          <div className="bg-gradient-to-br from-[#3a2d39] to-[#4e3e4d] text-[#FBF6EF] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-[#EFD4CE]/15 border border-[#EFD4CE]/30 flex items-center justify-center shrink-0">
                  <span className="font-display text-xl font-semibold text-[#EFD4CE] leading-none">A</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#A7B596] rounded-full border-2 border-[#3a2d39]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-[#EFD4CE] leading-tight">Aria</h3>
                  <span className="text-[10px] bg-[#EFD4CE]/10 border border-[#EFD4CE]/20 text-[#EFD4CE]/70 px-2 py-0.5 rounded-full font-mono">
                    AI Receptionist
                  </span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5 flex items-center gap-1.5">
                  <Sparkle size={10} className="text-[#A7B596]" />
                  Powered by Gemini · Falguni's Photography
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsOpen(false); onOpenBooking(); }}
                className="hidden sm:flex items-center gap-1.5 text-[11px] bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Book form <ArrowRight size={11} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ---- Booking Progress Stepper ---- */}
          {!bookingComplete && (
            <div className="bg-[#3a2d39]/95 px-4 py-2.5 flex items-center gap-0 shrink-0">
              {steps.map((step, idx) => {
                const done = progress2[step.key];
                const isLast = idx === steps.length - 1;
                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center gap-1 min-w-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-500 ${
                        done ? 'bg-[#A7B596] text-[#423341]' : 'bg-white/10 text-white/40'
                      }`}>
                        {done ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[9px] font-medium transition-colors duration-500 ${done ? 'text-[#A7B596]' : 'text-white/30'}`}>
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="flex-1 h-px mx-1.5 bg-white/10 relative overflow-hidden">
                        {done && <div className="absolute inset-y-0 left-0 bg-[#A7B596] transition-all duration-700" style={{ width: '100%' }} />}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ---- Messages ---- */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#FBF6EF]">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                m={m}
                isLatestAria={m.id === latestAriaId}
                onViewNotification={setActiveModal}
                onDownloadIcs={downloadIcs}
              />
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex items-center gap-3 bg-white border border-[#EFD4CE] px-4 py-3 rounded-3xl rounded-tl-sm shadow-sm w-fit msg-entrance">
                <div className="flex items-center gap-1">
                  {[0, 160, 320].map(delay => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full bg-[#A7B596] animate-bounce"
                      style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#423341]/70 italic font-medium">{thinkingStage}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ---- Quick Suggestions ---- */}
          <div className="px-3 pt-2 pb-1.5 bg-[#FBF6EF] border-t border-[#EFD4CE]/40 shrink-0">
            <p className="text-[10px] text-[#423341]/50 font-semibold uppercase tracking-wider px-1 mb-1.5">Quick replies</p>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {getSuggestions().map((s, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (s.isAction && s.action) s.action();
                    else if (s.prompt) sendMessage(s.prompt);
                  }}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#A7B596] hover:text-white text-[#423341] border border-[#EFD4CE] text-[11px] font-medium px-3 py-2 rounded-2xl whitespace-nowrap shrink-0 transition-all disabled:opacity-40 cursor-pointer active:scale-95 msg-entrance"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-[#A7B596] group-hover:text-white">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Input ---- */}
          <form
            onSubmit={handleSubmit}
            className="px-3 pb-3 pt-2 bg-white border-t border-[#EFD4CE] flex items-end gap-2 shrink-0"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or share your details..."
              className="flex-1 bg-[#FBF6EF] border border-[#EFD4CE] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A7B596] resize-none overflow-hidden leading-relaxed min-h-[44px]"
              style={{ maxHeight: '96px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-11 h-11 rounded-2xl bg-[#A7B596] text-[#423341] flex items-center justify-center disabled:opacity-40 hover:bg-[#8fa27a] transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </form>

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-[#423341]/30 pb-2 bg-white shrink-0">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Email Preview Modal                                               */}
      {/* ---------------------------------------------------------------- */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#423341]/80 backdrop-blur-md"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#FBF6EF] max-w-xl w-full rounded-3xl shadow-2xl relative border border-[#EFD4CE] max-h-[88vh] overflow-y-auto panel-enter"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EFD4CE] text-[#423341] flex items-center justify-center hover:bg-[#e0beba] transition-colors cursor-pointer"
              aria-label="Close email preview"
            >
              <X size={18} />
            </button>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EFD4CE] pb-4">
                <div className="p-2.5 rounded-2xl bg-[#A7B596] text-[#423341]">
                  <EnvelopeSimple size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#423341]">Confirmation Email Preview</h3>
                  <p className="text-xs text-[#423341]/60">Ref #{activeModal.referenceNumber} · {activeModal.timestamp}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-[#423341]/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Sent to client:
                  </span>
                  <span className="font-mono bg-[#A7B596]/15 text-[#423341] px-2 py-0.5 rounded-full">{activeModal.recipientEmail}</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#EFD4CE] overflow-hidden shadow-sm">
                  <div className="bg-[#423341] text-[#FBF6EF] px-4 py-3 space-y-0.5">
                    <p className="text-[10px] text-[#EFD4CE]/60">From: Falguni's Photography &lt;noreply@falgunisphotography.com.au&gt;</p>
                    <p className="font-semibold text-sm text-[#FBF6EF]">{activeModal.subject}</p>
                  </div>
                  <div className="p-4 max-h-[40vh] overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-xs" dangerouslySetInnerHTML={{ __html: activeModal.htmlBody }} />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-[#A7B596]/10 rounded-2xl border border-[#A7B596]/20 text-[11px] text-[#423341]/70">
                <EnvelopeSimple size={16} className="text-[#A7B596] shrink-0 mt-0.5" />
                <p><strong className="text-[#423341]">Email-only policy:</strong> Booking confirmations are sent exclusively via email. No marketing SMS is sent.</p>
              </div>

              <div className="pt-1 text-center">
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-[#A7B596] hover:bg-[#8fa27a] text-[#423341] font-semibold text-sm px-8 py-2.5 rounded-full transition-colors cursor-pointer min-h-[44px]"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
