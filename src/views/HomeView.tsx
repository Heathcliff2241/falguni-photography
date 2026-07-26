import React from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FloatingFilmstripGallery } from '../components/FloatingFilmstripGallery';
import { TestimonialSection } from '../components/TestimonialSection';
import { CalendarCheck, PhoneCall, Heart, MapPin, CheckCircle } from '@phosphor-icons/react';

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
      <section className="pt-8 pb-16 bg-[#FBF6EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Keyword-First Title & Positioning */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 mb-1">
                <BotanicalRose color="sage" size={38} />
              </div>

              {/* Keyword-first h1 headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#423341] font-medium leading-[1.15] tracking-tight">
                {hero.headline}
              </h1>

              <p className="font-display text-xl sm:text-2xl text-[#423341]/90 italic font-normal">
                {hero.subheadline}
              </p>

              <p className="font-body text-base text-[#423341]/80 leading-relaxed max-w-2xl">
                {hero.body_copy}
              </p>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-body text-xs text-[#423341] font-medium">
                <div className="bg-[#EFD4CE]/30 p-3 rounded-2xl border border-[#EFD4CE] flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#A7B596] shrink-0" />
                  <span>5-14 Day Newborn Window</span>
                </div>
                <div className="bg-[#EFD4CE]/30 p-3 rounded-2xl border border-[#EFD4CE] flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#A7B596] shrink-0" />
                  <span>Wardrobe & Props Included</span>
                </div>
                <div className="bg-[#EFD4CE]/30 p-3 rounded-2xl border border-[#EFD4CE] flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#A7B596] shrink-0" />
                  <span>Unrushed 2-3 Hr Pacing</span>
                </div>
              </div>

              {/* Hero CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-body">
                <button
                  onClick={() => onOpenBooking()}
                  className="bg-[#A7B596] hover:bg-[#95a384] text-[#423341] font-semibold text-base px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CalendarCheck size={20} />
                  Book Your Session ($250+)
                </button>
                <a
                  href={`tel:${LOCAL_NAP.phone_clean}`}
                  className="bg-white border border-[#EFD4CE] text-[#423341] font-medium text-base px-6 py-4 rounded-full hover:bg-[#EFD4CE]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall size={20} />
                  Call Falguni Directly
                </a>
              </div>
            </div>

            {/* Right Column: Hero Photo Card (Floating Filmstrip Style) */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(66,51,65,0.12)] border border-[#EFD4CE] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBF6EF]">
                  <img
                    src={hero.image_source}
                    alt={hero.image_alt_text}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 text-center font-body">
                  <p className="font-display text-lg text-[#423341] font-medium">
                    Newborn Floral Wreath Session
                  </p>
                  <p className="text-xs text-[#423341]/70">
                    Shot at 26 South Pkwy, Northfield SA studio
                  </p>
                </div>
              </div>

              {/* Floating review badge */}
              <div className="absolute -bottom-6 -left-6 bg-[#423341] text-[#FBF6EF] p-4 rounded-2xl shadow-xl border border-[#EFD4CE] font-body text-xs max-w-xs hidden sm:block">
                <p className="font-semibold text-[#EFD4CE] mb-1">★★★★★ 5.0 Google Rating</p>
                <p className="text-[#FBF6EF]/90 italic">"The most patient photographer in Adelaide. Falguni never rushed our fussy baby!"</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <BotanicalVineDivider />

      {/* Four Sessions Overview */}
      <section className="py-12 bg-[#FBF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-[#423341] tracking-tight">
              {servicesSec.headline}
            </h2>
            <p className="font-body text-[#423341]/80 text-base mt-2">
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
                className="bg-white p-6 rounded-3xl border border-[#EFD4CE] shadow-[0_8px_30px_rgba(66,51,65,0.06)] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block bg-[#EFD4CE]/50 text-[#423341] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-xl text-[#423341] font-medium mb-2 group-hover:text-[#A7B596] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#423341]/80 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFD4CE]/50 flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#423341]">{s.price}</span>
                  <a
                    href={s.path}
                    className="text-xs font-semibold text-[#423341] hover:text-[#A7B596] transition-colors"
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
      <section className="py-16 bg-[#423341] text-[#FBF6EF] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <BotanicalRose color="blush" size={40} className="mx-auto" />
          <h2 className="font-display text-3xl sm:text-4xl text-[#EFD4CE] tracking-tight">
            {ctaSec.headline}
          </h2>
          <p className="font-body text-base text-[#FBF6EF]/90 max-w-xl mx-auto leading-relaxed">
            {ctaSec.body_copy}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-body">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto bg-[#A7B596] text-[#423341] font-semibold text-base px-8 py-3.5 rounded-full hover:bg-[#96a585] transition-colors flex items-center justify-center gap-2"
            >
              <CalendarCheck size={20} />
              Reserve Your Date Online
            </button>
            <a
              href={`tel:${LOCAL_NAP.phone_clean}`}
              className="w-full sm:w-auto bg-white/10 text-[#FBF6EF] border border-[#EFD4CE]/40 font-medium text-base px-6 py-3.5 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall size={20} />
              Call {LOCAL_NAP.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
