import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ChatTeardropText, X, PaperPlaneRight, Spinner, CalendarCheck, BookOpen, Sparkle, ArrowRight, CheckCircle, MapPin } from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';

interface PoppyChatWidgetProps {
  onOpenBooking: (service?: string) => void;
}

interface InteractiveGuide {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  prompt: string;
  details: {
    heading: string;
    tips: string[];
    recommendation: string;
    ctaService?: string;
  };
}

const POPPY_GUIDES: InteractiveGuide[] = [
  {
    id: 'newborn-prep',
    title: 'Newborn Session Prep Guide',
    category: 'Newborns (5-14 Days)',
    icon: '👶',
    summary: 'Everything you need to know before bringing your 5–14 day old baby to the studio.',
    prompt: 'Show me the Newborn Session Prep Guide',
    details: {
      heading: 'Pre-Session Tips for a Dreamy Newborn Shoot',
      tips: [
        'Feed baby right before leaving home or upon arriving at our warm Northfield studio.',
        'Dress baby in a simple button-down or zippered onesie so we don\'t startle them taking clothes off.',
        'Studio is kept warm (25°C+) for unclothed poses — dress comfortably in layers!',
        'We provide ALL wraps, bonnets, tie-backs, and eucalyptus props, so you only need baby & milk.'
      ],
      recommendation: 'Best booked while pregnant for 5–14 days after your estimated due date.',
      ctaService: 'newborn'
    }
  },
  {
    id: 'maternity-style',
    title: 'Maternity Wardrobe & Styling',
    category: 'Maternity (28-34 Weeks)',
    icon: '👗',
    summary: 'Explore studio gowns, silk drapes, and outfit pairing for parents and siblings.',
    prompt: 'Show me the Maternity Wardrobe Guide',
    details: {
      heading: 'How to Style Your Maternity Session',
      tips: [
        'Enjoy full access to Falguni\'s boutique studio wardrobe of lace gowns & flowing silk drapes.',
        'Schedule your shoot between 28–34 weeks when your bump is beautifully defined and comfortable.',
        'Partners look best in fitted neutrals (cream, beige, navy, or soft sage) without logos.',
        'Neutral seamless underwear (nude or white) works seamlessly under sheer studio gowns.'
      ],
      recommendation: 'Partners & older big brothers/sisters are warmly included at no extra cost.',
      ctaService: 'maternity'
    }
  },
  {
    id: 'cake-smash-planner',
    title: '1st Birthday Cake Smash Planner',
    category: 'Milestones (12 Months)',
    icon: '🍰',
    summary: 'Backdrop choices, cake selection tips, and post-smash bath cleanup details.',
    prompt: 'Show me the Cake Smash Planner Guide',
    details: {
      heading: 'Planning the Ultimate 1st Birthday Celebration',
      tips: [
        'We start with 15 minutes of clean milestone portraits before bringing out the cake.',
        'Choose soft pastel frosting (light pink, mint, or cream) — dark dye can stain skin temporarily!',
        'Let baby play with cake at home once or twice so frosting textures aren\'t a surprise.',
        'Full studio cleanup is completely handled by Falguni after the smash.'
      ],
      recommendation: 'Includes customized balloon styling & wooden ONE prop setup.',
      ctaService: 'cake-smash'
    }
  },
  {
    id: 'family-guide',
    title: 'Family Session Outfit & Posing Guide',
    category: 'Families (All Ages)',
    icon: '👨‍👩‍👧',
    summary: 'Coordinating family colors and keeping toddlers relaxed during studio time.',
    prompt: 'Show me the Family Outfit Guide',
    details: {
      heading: 'Coordinating Without Matching Identically',
      tips: [
        'Pick 2-3 complimentary muted tones (e.g., sage green, cream, and warm taupe).',
        'Avoid stark black/white or heavy neon patterns that distract from natural facial expressions.',
        'Sessions are play-based — we play short games and take breaks so kids stay happy.',
        'Feel free to bring a favorite non-messy snack or comforting toy for toddlers.'
      ],
      recommendation: '45-60 minutes of unhurried fun capturing real smiles.',
      ctaService: 'family'
    }
  },
  {
    id: 'studio-location',
    title: 'Studio Location & Arrival Info',
    category: 'Northfield SA Studio',
    icon: '📍',
    summary: 'Address, parking, stroller access, and studio amenities in Northfield.',
    prompt: 'Where is the studio and what are the amenities?',
    details: {
      heading: 'Visiting Falguni\'s Northfield Studio',
      tips: [
        'Address: 26 South Pkwy, Northfield SA 5085 (5 mins from Lightsview & Klemzig).',
        'Private off-street parking directly in front of the studio entrance.',
        'Ground floor access with zero stairs for easy stroller or car seat entry.',
        'Equipped with bottle warmers, changing table, coffee & tea lounge for parents.'
      ],
      recommendation: 'Private 1-on-1 studio environment with no other clients present.',
      ctaService: 'contact'
    }
  }
];

export const PoppyChatWidget: React.FC<PoppyChatWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeGuideModal, setActiveGuideModal] = useState<InteractiveGuide | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'poppy',
      text: "Hello! I'm Poppy, your interactive booking guide for Falguni's Photography in Northfield. Explore our interactive guides below or ask me any question!",
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

  const sendMessageText = async (textToSend: string, guideDetails?: InteractiveGuide) => {
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

      if (guideDetails) {
        replyText = `Here is our ${guideDetails.title}:\n\n` +
          `• ${guideDetails.details.tips.join('\n• ')}\n\n` +
          `💡 Recommendation: ${guideDetails.details.recommendation}\n` +
          `All packages start at $250!`;
      } else {
        // Search matching guide
        const matchedGuide = POPPY_GUIDES.find(g =>
          userText.toLowerCase().includes(g.id) ||
          userText.toLowerCase().includes(g.title.toLowerCase()) ||
          userText.toLowerCase().includes(g.category.toLowerCase())
        );

        if (matchedGuide) {
          replyText = `Here is our ${matchedGuide.title}:\n\n` +
            `• ${matchedGuide.details.tips.join('\n• ')}\n\n` +
            `💡 Note: ${matchedGuide.details.recommendation}`;
        } else {
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
        }
      }

      if (!replyText) {
        const lower = userText.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate') || lower.includes('package')) {
          replyText = "All of our boutique sessions—newborn, maternity, family, and cake smash—start at $250. This includes studio time, full access to our styling wraps and props, and a private online gallery of beautifully edited photos.";
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
          replyText = "Thank you for reaching out! Falguni specializes in gentle, patient newborn, maternity, family, and cake smash sessions starting at $250. Check out our interactive guides below or let me know what questions you have!";
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
          className="fixed bottom-6 right-6 z-40 bg-[#1C121B] text-[#FBF6EF] p-4 rounded-full shadow-2xl hover:bg-[#2D1D2C] transition-all flex items-center gap-3 border-2 border-[#D8C2B8] cursor-pointer group"
          aria-label="Chat with Poppy"
        >
          <div className="relative">
            <BotanicalRose color="blush" size={26} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2E4323] rounded-full border-2 border-[#1C121B]" />
          </div>
          <div className="text-left font-body">
            <span className="block text-sm font-bold leading-tight group-hover:text-[#EFD4CE] transition-colors">Chat & Clickable Guides</span>
            <span className="block text-[10px] text-[#D8C2B8] font-semibold">Poppy AI Assistant</span>
          </div>
        </button>
      )}

      {/* Guide Detail Popup Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-body animate-fade-in">
          <div className="bg-[#FBF6EF] max-w-lg w-full rounded-3xl p-6 sm:p-8 border-2 border-[#D8C2B8] shadow-2xl relative space-y-5">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1C121B] text-[#FBF6EF] flex items-center justify-center hover:bg-[#2D1D2C] transition-colors cursor-pointer"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-2xl border border-[#D8C2B8] shadow-sm">{activeGuideModal.icon}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E4323] bg-[#E1E7D8] px-2.5 py-0.5 rounded-md">
                  {activeGuideModal.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#1C121B] mt-1">
                  {activeGuideModal.title}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D8C2B8] space-y-3 text-sm text-[#1C121B]">
              <h4 className="font-display font-bold text-base border-b border-[#D8C2B8] pb-2 text-[#1C121B]">
                {activeGuideModal.details.heading}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-medium">
                {activeGuideModal.details.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#2E4323] shrink-0 mt-0.5" weight="fill" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#E1E7D8]/80 p-3.5 rounded-xl border border-[#A7B596] text-xs font-semibold text-[#1C121B]">
              💡 <strong>Studio Note:</strong> {activeGuideModal.details.recommendation}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const service = activeGuideModal.details.ctaService;
                  setActiveGuideModal(null);
                  setIsOpen(false);
                  onOpenBooking(service === 'contact' ? undefined : service);
                }}
                className="flex-1 bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] font-bold text-sm py-3 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CalendarCheck size={18} weight="bold" />
                Book Session ($250+)
              </button>
              <button
                onClick={() => {
                  const guidePrompt = activeGuideModal.prompt;
                  setActiveGuideModal(null);
                  sendMessageText(guidePrompt, activeGuideModal);
                }}
                className="bg-white border-2 border-[#1C121B] text-[#1C121B] hover:bg-[#EFD4CE]/50 font-bold text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                Ask Poppy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Drawer Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-full sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FBF6EF] rounded-3xl shadow-2xl border-2 border-[#D8C2B8] flex flex-col overflow-hidden animate-fade-in font-body">
          {/* Header */}
          <div className="bg-[#1C121B] text-[#FBF6EF] p-4 flex items-center justify-between border-b-2 border-[#D8C2B8]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2D1D2C] border border-[#D8C2B8]/40 flex items-center justify-center text-[#EFD4CE]">
                <BotanicalRose color="blush" size={26} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#FBF6EF] leading-none flex items-center gap-1.5">
                  Poppy
                  <span className="w-2 h-2 rounded-full bg-[#2E4323]" />
                </h3>
                <span className="text-[11px] text-[#D8C2B8] font-semibold">
                  Interactive Guide & Assistant • Northfield Studio
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 text-[#FBF6EF] flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Direct Form Quick Link Banner */}
          <div className="bg-[#E1E7D8] px-4 py-2 flex items-center justify-between text-xs text-[#1C121B] font-bold border-b border-[#A7B596]">
            <span className="flex items-center gap-1">
              <Sparkle size={14} weight="fill" className="text-[#2E4323]" />
              Clickable Studio Guides Available Below!
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="text-xs font-bold text-[#1C121B] underline hover:text-[#2E4323] cursor-pointer"
            >
              Book Direct →
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
                  className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                    m.sender === 'user'
                      ? 'bg-[#2D1D2C] text-[#FBF6EF] rounded-tr-none font-semibold shadow-xs'
                      : 'bg-white text-[#1C121B] border-2 border-[#D8C2B8] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-[#1C121B]/60 font-semibold mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#1C121B] font-bold italic p-2">
                <Spinner size={18} className="animate-spin text-[#2D1D2C]" weight="bold" />
                <span>Poppy is preparing guide info...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Clickable Guides Carousel */}
          <div className="px-3.5 py-3 bg-white border-t-2 border-[#D8C2B8] space-y-2">
            <p className="text-[11px] font-bold text-[#1C121B] px-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#1C121B]">
                <BookOpen size={16} weight="bold" className="text-[#2E4323]" />
                Clickable Session Guides & Planners:
              </span>
              <span className="text-[10px] text-[#2E4323] font-bold bg-[#E1E7D8] px-1.5 py-0.5 rounded">
                Tap to open
              </span>
            </p>
            
            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
              {POPPY_GUIDES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGuideModal(g)}
                  className="bg-[#FBF6EF] hover:bg-[#2D1D2C] text-[#1C121B] hover:text-[#FBF6EF] border-2 border-[#D8C2B8] p-2.5 rounded-2xl text-left w-48 shrink-0 transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl p-1 bg-white rounded-xl border border-[#D8C2B8] group-hover:bg-[#1C121B] transition-colors">{g.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2E4323] bg-[#E1E7D8] group-hover:bg-[#2E4323] group-hover:text-[#FBF6EF] px-1.5 py-0.5 rounded">
                      {g.category.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs leading-snug group-hover:text-[#EFD4CE] transition-colors line-clamp-1">
                      {g.title}
                    </h4>
                    <p className="text-[10px] font-medium text-[#231522]/80 group-hover:text-[#FBF6EF]/90 line-clamp-2 mt-0.5">
                      {g.summary}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#FBF6EF] border-t border-[#D8C2B8] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Poppy a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-white border-2 border-[#D8C2B8] text-[#1C121B] font-semibold rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D1D2C]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] flex items-center justify-center disabled:opacity-40 transition-colors shrink-0 cursor-pointer shadow-md"
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
