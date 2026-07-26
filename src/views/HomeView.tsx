import React from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FloatingFilmstripGallery } from '../components/FloatingFilmstripGallery';
import { TestimonialSection } from '../components/TestimonialSection';
import { TapeStrip } from '../components/TapeStrip';
import { CalendarCheck, PhoneCall, CheckCircle, BookOpen, Sparkle, ChatTeardropText } from '@phosphor-icons/react';

interface HomeViewProps {
  onOpenBooking: (service?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenBooking }) => {
  const page = SITE_PAGES.home;
  const hero = page.sections[0];
  const servicesSec = page.sections[1];
  const ctaSec = page.sections[3];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="pt-2 sm:pt-4 pb-6 sm:pb-8 bg-[#FBF6EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Keyword-First Title & Positioning */}
            <div className="lg:col-span-7 space-y-4">
              {/* Keyword-first h1 headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1C121B] font-bold leading-[1.15] tracking-tight">
                {hero.headline}
              </h1>

              <p className="font-display text-lg sm:text-xl text-[#2D1D2C] font-semibold italic">
                {hero.subheadline}
              </p>

              <p className="font-body text-base sm:text-lg text-[#1C121B] font-medium leading-relaxed max-w-2xl">
                {hero.body_copy}
              </p>

              {/* Hero CTAs - Placed high up to be immediately visible above the fold */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-body">
                <button
                  onClick={() => onOpenBooking()}
                  className="bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] font-bold text-base px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck size={20} weight="bold" />
                  Book Your Session ($250+)
                </button>
                <a
                  href={`tel:${LOCAL_NAP.phone_clean}`}
                  className="bg-white border-2 border-[#1C121B] text-[#1C121B] font-bold text-base px-6 py-3.5 rounded-full hover:bg-[#EFD4CE]/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall size={20} weight="bold" />
                  Call Falguni Directly
                </a>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 font-body text-xs text-[#1C121B] font-bold">
                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#D8C2B8] shadow-sm flex items-center gap-2">
                  <CheckCircle size={17} className="text-[#2E4323] shrink-0" weight="fill" />
                  <span>5-14 Day Newborn Window</span>
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#D8C2B8] shadow-sm flex items-center gap-2">
                  <CheckCircle size={17} className="text-[#2E4323] shrink-0" weight="fill" />
                  <span>Wardrobe & Props Included</span>
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#D8C2B8] shadow-sm flex items-center gap-2">
                  <CheckCircle size={17} className="text-[#2E4323] shrink-0" weight="fill" />
                  <span>Unrushed 2-3 Hr Pacing</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Photo Card (Flat-edged Taped Polaroid Style) */}
            <div className="lg:col-span-5 relative pt-4">
              <div className="relative bg-white p-3.5 pt-4 pb-7 rounded-none shadow-[0_12px_36px_rgba(33,20,32,0.14)] border border-neutral-300 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Washi / Textured Masking Tape held on wall */}
                <TapeStrip variant="classic" />

                <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-300">
                  <img
                    src={hero.image_source}
                    alt={hero.image_alt_text}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 text-center font-body">
                  <p className="font-display text-base text-[#1C121B] font-bold">
                    Newborn Floral Wreath Session
                  </p>
                  <p className="text-xs text-[#3B2B3A] font-semibold mt-0.5">
                    Shot at 26 South Pkwy, Northfield SA studio
                  </p>
                </div>
              </div>

              {/* Floating review badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#2D1D2C] text-[#FBF6EF] p-4 rounded-2xl shadow-xl border-2 border-[#D8C2B8] font-body text-xs max-w-xs hidden sm:block">
                <div className="flex items-center gap-1 text-[#EFD4CE] mb-1 font-bold">
                  <span>★ 5.0 Google Rating</span>
                </div>
                <p className="text-[#FBF6EF] font-medium italic">"The most patient photographer in Adelaide. Falguni never rushed our fussy baby!"</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Clickable Guides Banner with Poppy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-body">
        <div className="bg-[#2D1D2C] text-[#FBF6EF] rounded-3xl p-6 sm:p-8 border-2 border-[#D8C2B8] shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#E1E7D8] text-[#1C121B] text-xs font-bold px-3 py-1 rounded-full">
                <Sparkle size={14} weight="fill" className="text-[#2E4323]" />
                <span>Interactive Customer Guides</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FBF6EF]">
                Need Help Preparing for Your Shoot?
              </h2>
              <p className="text-sm sm:text-base text-[#FBF6EF] font-medium leading-relaxed">
                Click any guide below to open Poppy, our assistant, for instant prep tips, studio wardrobe advice, and cake smash planning!
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <button
                onClick={() => {
                  // Trigger Poppy chat open
                  const poppyBtn = document.querySelector('button[aria-label="Chat with Poppy"]') as HTMLButtonElement;
                  if (poppyBtn) poppyBtn.click();
                }}
                className="bg-[#FBF6EF] hover:bg-[#EFD4CE] text-[#1C121B] font-bold text-sm px-6 py-3.5 rounded-full transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <BookOpen size={20} weight="bold" className="text-[#2E4323]" />
                Explore Clickable Guides
              </button>
            </div>
          </div>

          {/* Quick Guide Chips Preview */}
          <div className="mt-6 pt-6 border-t border-[#D8C2B8]/30 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-body">
            {[
              { icon: '👶', title: 'Newborn Prep', desc: '5-14 Day Tips' },
              { icon: '👗', title: 'Maternity Wardrobe', desc: 'Studio Gowns' },
              { icon: '🍰', title: 'Cake Smash Planner', desc: '1st Birthday' },
              { icon: '👨‍👩‍👧', title: 'Family Outfit Guide', desc: 'Color Matching' },
              { icon: '📍', title: 'Northfield Studio', desc: 'Parking & Arrival' }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const poppyBtn = document.querySelector('button[aria-label="Chat with Poppy"]') as HTMLButtonElement;
                  if (poppyBtn) poppyBtn.click();
                }}
                className="bg-white/10 hover:bg-white/20 border border-[#D8C2B8]/40 p-3 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <span className="text-xl block mb-1">{item.icon}</span>
                <span className="font-bold text-xs text-[#FBF6EF] block group-hover:text-[#EFD4CE] transition-colors">{item.title}</span>
                <span className="text-[10px] text-[#D8C2B8] font-medium block">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <BotanicalVineDivider />

      {/* Four Sessions Overview */}
      <section className="py-12 bg-[#FBF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C121B] font-bold tracking-tight">
              {servicesSec.headline}
            </h2>
            <p className="font-body text-[#2D1D2C] text-base font-semibold mt-2">
              {servicesSec.body_copy}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
            {[
              {
                title: 'Newborn Photography',
                path: '/services/newborn-photography',
                desc: 'Best booked for 5-14 days after birth. Unhurried sessions with soft organic wraps, baskets, and floral wreaths.',
                price: 'From $250',
                tag: '5-14 Days'
              },
              {
                title: 'Maternity Photography',
                path: '/services/maternity-photography',
                desc: 'Best booked 28-34 weeks. Flowing studio gowns and flattering lighting designed to celebrate your bump.',
                price: 'From $250',
                tag: '28-34 Weeks'
              },
              {
                title: 'Family Photography',
                path: '/services/family-photography',
                desc: 'Relaxed 45-60 minute sessions where kids play naturally instead of forcing stiff poses.',
                price: 'From $250',
                tag: 'All Ages'
              },
              {
                title: 'Cake Smash Photography',
                path: '/services/cake-smash-photography',
                desc: 'Celebrate your baby\'s first birthday with themed backdrops, smash cake, and full cleanup included.',
                price: 'From $250',
                tag: '1st Birthday'
              }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border-2 border-[#D8C2B8] shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block bg-[#2D1D2C] text-[#FBF6EF] text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-xl text-[#1C121B] font-bold mb-2 group-hover:text-[#2E4323] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#231522] font-medium leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8C2B8] flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1C121B]">{s.price}</span>
                  <a
                    href={s.path}
                    className="text-xs font-bold text-[#1C121B] underline hover:text-[#2E4323] transition-colors"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Gallery Section */}
      <FloatingFilmstripGallery onOpenBooking={onOpenBooking} />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Closing CTA */}
      <section className="py-16 bg-[#1C121B] text-[#FBF6EF] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <BotanicalRose color="blush" size={40} className="mx-auto" />
          <h2 className="font-display text-3xl sm:text-4xl text-[#EFD4CE] font-bold tracking-tight">
            {ctaSec.headline}
          </h2>
          <p className="font-body text-base text-[#FBF6EF] font-medium max-w-xl mx-auto leading-relaxed">
            {ctaSec.body_copy}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-body">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto bg-[#EFD4CE] text-[#1C121B] font-bold text-base px-8 py-3.5 rounded-full hover:bg-[#E2BEB5] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <CalendarCheck size={20} weight="bold" />
              Reserve Your Date Online
            </button>
            <a
              href={`tel:${LOCAL_NAP.phone_clean}`}
              className="w-full sm:w-auto bg-transparent text-[#FBF6EF] border-2 border-[#EFD4CE] font-bold text-base px-6 py-3.5 rounded-full hover:bg-[#EFD4CE]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall size={20} weight="bold" />
              Call {LOCAL_NAP.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
