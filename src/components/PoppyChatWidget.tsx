import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ChatTeardropText, X, PaperPlaneRight, Spinner, CalendarCheck } from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';

interface PoppyChatWidgetProps {
  onOpenBooking: (service?: string) => void;
}

export const PoppyChatWidget: React.FC<PoppyChatWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'poppy',
      text: "Hello! I'm Poppy, the booking assistant for Falguni's Photography here in Northfield. How can I help you plan your newborn, maternity, or family session today?",
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
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: 'Package Pricing ($250+)', prompt: 'How much do photography packages cost?' },
    { label: 'Newborn Session Info', prompt: 'What is included in a newborn shoot?' },
    { label: 'Maternity Booking Window', prompt: 'When should I book my maternity session?' },
    { label: 'Studio Address & Location', prompt: 'Where is your studio located?' },
    { label: 'How to Reserve a Date', prompt: 'How do I book or reserve a session date?' }
  ];

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

    try {
      let replyText = '';
      let extracted: any = null;

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
        }
      } catch (e) {
        console.warn('Backend chat API request failed, using intelligent local Poppy response mode.');
      }

      if (!replyText) {
        // Smart client-side fallback responses for Poppy
        const lower = userText.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate') || lower.includes('package')) {
          replyText = "All of our sessions—newborn, maternity, family, and cake smash—start at $250. This includes studio time, full access to our styling wraps and props, and a private online gallery of beautifully edited photos.";
        } else if (lower.includes('newborn') || lower.includes('baby') || lower.includes('infant')) {
          replyText = "Our newborn sessions are completely unhurried (lasting 2 to 3 hours with unlimited feeding and settling breaks). We recommend booking while pregnant for the 5–14 day post-birth window. All wraps, floral wreaths, and backdrops are provided!";
        } else if (lower.includes('maternity') || lower.includes('pregnant') || lower.includes('bump')) {
          replyText = "Maternity sessions are best booked between 28–34 weeks when your bump is beautifully rounded. We provide studio wardrobe gowns and drapes, and partners and big brothers/sisters are always welcome to join!";
        } else if (lower.includes('family')) {
          replyText = "Our family sessions last 45-60 minutes in a relaxed, play-based environment where kids can be themselves. We focus on capturing genuine smiles rather than forced posing.";
        } else if (lower.includes('cake') || lower.includes('smash') || lower.includes('birthday') || lower.includes('1st')) {
          replyText = "Cake smash sessions celebrate baby's first birthday! They include themed balloon backdrops, a smash cake, portraits before the mess, and full studio cleanup afterwards.";
        } else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('studio')) {
          replyText = "Falguni's Photography is located at 26 South Pkwy, Northfield SA 5085, Australia. We welcome families from Northfield, Lightsview, Klemzig, Walkerville, and across northern Adelaide.";
        } else if (lower.includes('book') || lower.includes('reserve') || lower.includes('contact') || lower.includes('phone') || lower.includes('available')) {
          replyText = "I'd love to help you reserve your shoot! You can click the 'Book Session' button above or call Falguni directly at +61 469 753 238. If you leave your name and phone number here, Falguni will get in touch within 24 hours.";
        } else {
          replyText = "Thank you for reaching out! Falguni specializes in gentle, patient newborn, maternity, family, and cake smash sessions starting at $250. How can I help you plan your session today?";
        }
      }

      const poppyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'poppy',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bookingExtracted: extracted
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
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(input);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#423341] text-[#FBF6EF] p-4 rounded-full shadow-2xl hover:bg-[#A7B596] hover:text-[#423341] transition-all flex items-center gap-3 border-2 border-[#EFD4CE]"
          aria-label="Chat with Poppy"
        >
          <div className="relative">
            <BotanicalRose color="blush" size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A7B596] rounded-full border-2 border-[#423341]" />
          </div>
          <span className="font-body text-sm font-semibold pr-1">Chat with Poppy</span>
        </button>
      )}

      {/* Chat Drawer Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[400px] h-[540px] max-h-[85vh] bg-[#FBF6EF] rounded-3xl shadow-2xl border border-[#EFD4CE] flex flex-col overflow-hidden animate-fade-in font-body">
          {/* Header */}
          <div className="bg-[#423341] text-[#FBF6EF] p-4 flex items-center justify-between border-b border-[#EFD4CE]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFD4CE]/30 flex items-center justify-center text-[#EFD4CE]">
                <BotanicalRose color="blush" size={26} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-[#EFD4CE] leading-none">
                  Poppy
                </h3>
                <span className="text-[11px] text-[#FBF6EF]/70">
                  Studio Assistant • Falguni's Photography
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 text-[#FBF6EF] flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick links header banner */}
          <div className="bg-[#EFD4CE]/30 px-4 py-2 flex items-center justify-between text-xs text-[#423341] border-b border-[#EFD4CE]/50">
            <span>Ask about pricing ($250+), props, or dates!</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="text-xs font-semibold text-[#423341] underline hover:text-[#A7B596]"
            >
              Direct Form →
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FBF6EF]">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#423341] text-[#FBF6EF] rounded-tr-none'
                      : 'bg-white text-[#423341] border border-[#EFD4CE] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-[#423341]/50 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#423341]/60 italic p-2">
                <Spinner size={16} className="animate-spin text-[#A7B596]" />
                <span>Poppy is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guides & FAQs */}
          <div className="px-3 py-2 bg-[#EFD4CE]/20 border-t border-[#EFD4CE]/40">
            <p className="text-[11px] font-semibold text-[#423341]/70 mb-1.5 px-1 flex items-center gap-1">
              <BotanicalRose color="sage" size={14} />
              <span>Tap a quick guide to ask Poppy:</span>
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessageText(q.prompt)}
                  className="bg-white hover:bg-[#A7B596] hover:text-[#423341] text-[#423341] border border-[#EFD4CE] text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EFD4CE] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Poppy a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-[#FBF6EF] border border-[#EFD4CE] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#A7B596]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-[#A7B596] text-[#423341] flex items-center justify-center disabled:opacity-40 hover:bg-[#96a585] transition-colors shrink-0"
              aria-label="Send message"
            >
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
