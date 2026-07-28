import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import {
  ChatTeardropText, X, PaperPlaneRight, Spinner, CalendarCheck,
  EnvelopeSimple, CheckCircle, DeviceMobile, Calendar, Sparkle, Eye
} from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';

interface PoppyChatWidgetProps {
  onOpenBooking: (service?: string) => void;
}

export const PoppyChatWidget: React.FC<PoppyChatWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState<string>('Poppy is typing...');
  const [activeNotificationModal, setActiveNotificationModal] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'poppy',
      text: "Hello! I'm Poppy, Falguni's studio coordinator & booking assistant in Northfield. I can answer your questions about session styling, wardrobe, and reserve your session date directly right here! How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

    showToast('📅 iCal Calendar File Downloaded!');
  };

  // Dynamic context-aware suggestion generator
  const getDynamicSuggestions = () => {
    if (messages.length <= 1) {
      return [
        { label: '✨ Reserve Session in Chat', prompt: 'I would like to book a session. My name is Sarah, phone 0412345678, email sarah@example.com for Aug 20th 10am for Newborn Photography' },
        { label: 'Package Rates ($250+)', prompt: 'How much do photography packages cost?' },
        { label: 'Newborn Session Info', prompt: 'What is included in a newborn shoot?' },
        { label: 'Maternity Gowns Provided?', prompt: 'What gowns and styling wardrobe do you provide for maternity?' },
        { label: 'Studio Location in Northfield', prompt: 'Where is your studio located and is parking available?' }
      ];
    }

    const lastMsg = messages[messages.length - 1];
    const textLower = (lastMsg?.text || '').toLowerCase();

    if (lastMsg?.bookingExtracted) {
      return [
        { label: '📅 Download iCal Event', isAction: true, action: () => downloadIcsCalendarEvent(lastMsg.bookingExtracted) },
        { label: 'What should we bring?', prompt: 'What should we bring with us to the studio session?' },
        { label: 'Where is the studio?', prompt: 'Where is your studio located in Northfield?' },
        { label: 'Book another session', prompt: 'I would also like to book another session for my family.' }
      ];
    }

    if (textLower.includes('newborn') || textLower.includes('baby') || textLower.includes('infant')) {
      return [
        { label: 'Book Newborn Shoot', prompt: 'I would like to book a newborn photography session for my baby.' },
        { label: 'When is best time for newborn shoot?', prompt: 'When is the ideal age to photograph a newborn baby?' },
        { label: 'Are parent & sibling photos included?', prompt: 'Can parents and big brothers or sisters be included in newborn photos?' },
        { label: 'What wraps and props are provided?', prompt: 'What wraps, bonnets, and props do you provide at the studio?' }
      ];
    }

    if (textLower.includes('maternity') || textLower.includes('pregnant') || textLower.includes('bump')) {
      return [
        { label: 'Book Maternity Shoot', prompt: 'I would like to book a maternity photo session.' },
        { label: 'Which week is best for photos?', prompt: 'Which week of pregnancy is best to schedule maternity photos?' },
        { label: 'Do I need to bring my own gowns?', prompt: 'Do you provide studio dresses and drapes for maternity sessions?' },
        { label: 'Partner & kids included?', prompt: 'Can my partner and older children join the maternity shoot?' }
      ];
    }

    if (textLower.includes('cake') || textLower.includes('smash') || textLower.includes('birthday') || textLower.includes('1st')) {
      return [
        { label: 'Book Cake Smash', prompt: 'I would like to book a 1st birthday cake smash session.' },
        { label: 'Is the cake included?', prompt: 'Do you provide the smash cake or do we bring one?' },
        { label: 'Is splash bath setup included?', prompt: 'Is the warm bath / splash bath included after the smash?' },
        { label: 'Theme options available?', prompt: 'What backdrop themes and balloon colors do you offer?' }
      ];
    }

    if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('rate') || textLower.includes('$250')) {
      return [
        { label: 'Book Session starting $250', prompt: 'I would like to reserve a session date. What details do you need?' },
        { label: 'What is included in $250 rate?', prompt: 'What is included in the $250 base package?' },
        { label: 'Gallery delivery turnaround time?', prompt: 'How long does it take to get our edited photo gallery?' },
        { label: 'Do you offer gift vouchers?', prompt: 'Can I purchase a photography gift voucher for an expecting mom?' }
      ];
    }

    return [
      { label: '✨ Reserve Session in Chat', prompt: 'I would like to book a session with Falguni.' },
      { label: 'Studio Address & Directions', prompt: 'Where is Falguni\'s studio located in Northfield?' },
      { label: 'Ask about session packages', prompt: 'What photography packages do you offer?' },
      { label: 'Speak with Falguni directly', prompt: 'Can Falguni call or message me back?' }
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
    setThinkingStage('Poppy is reflecting...');

    const startTime = Date.now();

    // Stage updates for realistic thinking feel
    const stageTimer1 = setTimeout(() => {
      setThinkingStage('Checking studio schedule & styling options...');
    }, 550);

    const stageTimer2 = setTimeout(() => {
      setThinkingStage('Preparing response & session details...');
    }, 1100);

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
            history: updatedMessages.map(m => ({
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
        console.warn('Backend chat API request failed, using local Poppy fallback response.');
      }

      if (!replyText) {
        // Smart client-side fallback responses for Poppy
        const lower = userText.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate') || lower.includes('package')) {
          replyText = "All of our sessions—newborn, maternity, family, and cake smash—start at $250 AUD. This includes dedicated studio time, full access to our hand-selected wraps, bonnets, props, and maternity gowns, plus a private online gallery of high-resolution edited portraits.";
        } else if (lower.includes('newborn') || lower.includes('baby') || lower.includes('infant')) {
          replyText = "Our newborn sessions are completely unhurried (lasting 2 to 3 hours with unlimited feeding and soothing breaks in our warm studio). We recommend reserving your spot while pregnant for the 5–14 day post-birth window. All wraps, floral wreaths, and backdrops are provided!";
        } else if (lower.includes('maternity') || lower.includes('pregnant') || lower.includes('bump')) {
          replyText = "Maternity sessions are best scheduled between 28–34 weeks when your bump is beautifully rounded and comfortable. We provide a luxury studio wardrobe of lace gowns and silk drapes. Partners and older siblings are always welcome to join!";
        } else if (lower.includes('family')) {
          replyText = "Our family sessions last 45–60 minutes in a relaxed, play-based environment where kids can be themselves. We focus on capturing genuine love and natural smiles rather than rigid posing.";
        } else if (lower.includes('cake') || lower.includes('smash') || lower.includes('birthday') || lower.includes('1st')) {
          replyText = "Cake smash sessions celebrate baby's first milestone! They include customized balloon backdrop themes, a delicious smash cake, portraits before the mess, and a warm splash bath setup followed by complete studio cleanup!";
        } else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('studio')) {
          replyText = "Falguni's Photography is located at 26 South Pkwy, Northfield SA 5085, Australia. We welcome families from Northfield, Lightsview, Klemzig, Walkerville, and across northern Adelaide.";
        } else {
          replyText = "Thank you for reaching out! Falguni specializes in gentle, patient newborn, maternity, family, and cake smash sessions starting at $250. Share your Name, Phone, Email, and Preferred Date/Time to reserve your spot directly right here!";
        }
      }

      // Enforce artificial delay for realistic conversational pacing (minimum 1.2s total)
      const elapsed = Date.now() - startTime;
      const minDelay = 1300;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }

      if (extracted && extracted.email) {
        showToast(`🔔 Booking Confirmed! Confirmation email dispatched to ${extracted.email}`);
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
        text: "I'm here to help! You can call Falguni directly at +61 469 753 238 or click 'Book Session' to reserve your spot!",
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

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-[#423341] text-[#FBF6EF] p-3.5 sm:p-4 rounded-full shadow-2xl hover:bg-[#A7B596] hover:text-[#423341] transition-all flex items-center gap-2.5 sm:gap-3 border-2 border-[#EFD4CE] cursor-pointer group active:scale-95"
          aria-label="Chat with Poppy"
        >
          <div className="relative">
            <BotanicalRose color="blush" size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A7B596] rounded-full border-2 border-[#423341] animate-pulse" />
          </div>
          <span className="font-body text-xs sm:text-sm font-semibold pr-1">Chat & Book with Poppy</span>
        </button>
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
        <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[430px] h-[88vh] sm:h-[600px] bg-[#FBF6EF] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFD4CE] flex flex-col overflow-hidden animate-fade-in font-body transition-all">
          
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
            <span className="font-medium flex items-center gap-1">
              ✨ Ask Poppy questions or reserve your date directly!
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="text-xs font-semibold text-[#423341] underline hover:text-[#A7B596] cursor-pointer"
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
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#423341] text-[#FBF6EF] rounded-tr-none'
                      : 'bg-white text-[#423341] border border-[#EFD4CE] rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Booking Confirmation Receipt Card when booking is created */}
                {m.bookingExtracted && (
                  <div className="mt-2.5 max-w-[92%] bg-white p-4 rounded-2xl border-2 border-[#A7B596] shadow-md space-y-3 font-body">
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
                      <p><strong>Phone:</strong> {m.bookingExtracted.phone || 'Recorded'}</p>
                      <p><strong>Email:</strong> {m.bookingExtracted.email || 'Recorded'}</p>
                      <p><strong>Service:</strong> {m.bookingExtracted.serviceRequested || 'Photography Session'}</p>
                      <p><strong>Date & Time:</strong> {m.bookingExtracted.preferredDate || 'Upcoming Session'}</p>
                    </div>

                    <div className="bg-[#FBF6EF] p-2.5 rounded-xl border border-[#EFD4CE] text-[11px] text-[#423341]/80 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#A7B596]">
                        <EnvelopeSimple size={14} /> Notifications Dispatched!
                      </div>
                      <p>Formal booking receipt & session styling guide sent to <strong>{m.bookingExtracted.email || 'client email'}</strong> and phone SMS notification.</p>
                    </div>

                    <div className="pt-1 flex flex-col gap-1.5 text-xs">
                      {m.bookingExtracted.notification && (
                        <button
                          onClick={() => setActiveNotificationModal(m.bookingExtracted.notification)}
                          className="w-full bg-[#EFD4CE] hover:bg-[#ebd0ca] text-[#423341] font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                        >
                          <Eye size={16} /> View Email & SMS Notification Sent
                        </button>
                      )}

                      <button
                        onClick={() => downloadIcsCalendarEvent(m.bookingExtracted)}
                        className="w-full bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
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

            {/* Realistic Thinking & Reflection Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-[#423341] bg-white border border-[#EFD4CE] px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-xs w-fit animate-pulse">
                <div className="flex items-center gap-1 text-[#A7B596]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A7B596] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-medium text-[#423341]/80">{thinkingStage}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#EFD4CE]/20 border-t border-[#EFD4CE]/40 shrink-0">
            <p className="text-[11px] font-semibold text-[#423341]/70 mb-1.5 px-1 flex items-center gap-1">
              <BotanicalRose color="sage" size={14} />
              <span>Suggested quick responses & topics:</span>
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                  className="bg-white hover:bg-[#A7B596] hover:text-[#423341] text-[#423341] border border-[#EFD4CE] text-xs font-medium px-3 py-2 rounded-full whitespace-nowrap shadow-2xs transition-all shrink-0 disabled:opacity-50 cursor-pointer active:scale-95 min-h-[36px] flex items-center"
                >
                  {q.label}
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
              className="flex-1 bg-[#FBF6EF] border border-[#EFD4CE] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#A7B596] min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-full bg-[#A7B596] text-[#423341] flex items-center justify-center disabled:opacity-40 hover:bg-[#96a585] transition-colors shrink-0 cursor-pointer min-h-[44px] min-w-[44px]"
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
              <div className="flex items-center justify-between text-xs font-semibold text-[#423341]/80">
                <span>📧 Email Notification Sent To:</span>
                <span className="text-[#A7B596] font-mono">{activeNotificationModal.recipientEmail}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#EFD4CE] text-xs text-[#423341] shadow-inner space-y-2">
                <p className="font-bold border-b border-neutral-100 pb-2 text-sm text-[#423341]">
                  Subject: {activeNotificationModal.subject}
                </p>
                <div
                  className="prose prose-sm max-w-none text-xs"
                  dangerouslySetInnerHTML={{ __html: activeNotificationModal.htmlBody }}
                />
              </div>
            </div>

            {/* SMS Preview Section */}
            <div className="space-y-2 pt-2 border-t border-[#EFD4CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#423341]/80">
                <span>📱 SMS Notification Text Sent To:</span>
                <span className="text-[#A7B596] font-mono">{activeNotificationModal.recipientPhone}</span>
              </div>
              <div className="bg-[#423341] text-[#FBF6EF] p-3.5 rounded-2xl text-xs font-mono leading-relaxed shadow-xs">
                {activeNotificationModal.smsBody}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveNotificationModal(null)}
                className="bg-[#A7B596] text-[#423341] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#96a585] transition-colors cursor-pointer min-h-[44px]"
              >
                Close Notification Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
