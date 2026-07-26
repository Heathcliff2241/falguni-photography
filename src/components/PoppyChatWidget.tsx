'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { X, PaperPlaneRight, Spinner } from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';
import { useBooking } from '../context/BookingContext';

export const PoppyChatWidget: React.FC = () => {
  const { openBookingModal } = useBooking();
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
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

      const data = await response.json();

      if (data.text) {
        const poppyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'poppy',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bookingExtracted: data.extracted
        };
        setMessages(prev => [...prev, poppyMsg]);
      } else {
        throw new Error('No response text');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'poppy',
        text: "I'm having a little trouble connecting right now, but you can call Falguni directly at +61 469 753 238 or click 'Book Session' to reserve your spot!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#423341] text-[#FBF6EF] p-4 rounded-full shadow-2xl hover:bg-[#A7B596] hover:text-[#423341] transition-all flex items-center gap-3 border-2 border-[#EFD4CE] cursor-pointer"
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
              className="w-8 h-8 rounded-full bg-white/10 text-[#FBF6EF] flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
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
                openBookingModal();
              }}
              className="text-xs font-semibold text-[#423341] underline hover:text-[#A7B596] cursor-pointer"
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
              className="w-10 h-10 rounded-full bg-[#A7B596] text-[#423341] flex items-center justify-center disabled:opacity-40 hover:bg-[#96a585] transition-colors shrink-0 cursor-pointer"
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
