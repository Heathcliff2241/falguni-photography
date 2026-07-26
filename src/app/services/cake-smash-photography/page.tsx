import React from 'react';
import type { Metadata } from 'next';
import { SITE_PAGES, LOCAL_NAP } from '../../../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../../../components/BotanicalAccents';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { PhoneCall, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { BookSessionButton } from '../../components/BookSessionButton';

export const metadata: Metadata = {
  title: "Cake Smash Photography Northfield, Adelaide | Falguni's Photography",
  description: "Cake smash and first birthday photography in Northfield, Adelaide. Themed backdrops, cleanup included, sessions from $250. Book your date now.",
};

export default function CakeSmashPage() {
  const page = SITE_PAGES.cake_smash;
  const hero = page.sections[0];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <BotanicalRose color="sage" size={32} />
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-[#A7B596]">
                First Birthday Milestone • Northfield Studio
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl text-[#423341] font-medium leading-tight">
              {hero.headline}
            </h1>

            <p className="font-display text-xl text-[#423341]/90 italic">
              {hero.subheadline}
            </p>

            <p className="font-body text-base text-[#423341]/80 leading-relaxed">
              {hero.body_copy}
            </p>

            <div className="bg-white p-5 rounded-2xl border border-[#EFD4CE] space-y-3 font-body text-xs text-[#423341]">
              <h3 className="font-display text-lg font-medium text-[#423341] border-b border-[#EFD4CE]/60 pb-2">
                What's Included in Your $250+ Cake Smash Session
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Balloon arch & custom themed setup</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Clean outfit portraits before the mess</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Smash cake (optional studio order)</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Complete studio cleanup afterward</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Private online proofing gallery</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-body">
              <BookSessionButton service="cake-smash" label="Book Your Cake Smash Session" className="w-full sm:w-auto" />
              <a
                href={`tel:${LOCAL_NAP.phone_clean}`}
                className="w-full sm:w-auto bg-white border border-[#EFD4CE] text-[#423341] font-medium text-base px-6 py-4 rounded-full hover:bg-[#EFD4CE]/30 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall size={20} />
                Call {LOCAL_NAP.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-4 rounded-3xl shadow-[0_12px_40px_rgba(66,51,65,0.08)] border border-[#EFD4CE] transform rotate-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBF6EF]">
                <img
                  src={typeof hero.image_source === 'string' ? hero.image_source : hero.image_source?.src || hero.image_source}
                  alt={hero.image_alt_text}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-center text-lg text-[#423341] font-medium mt-3">
                First Birthday Balloon Arch Cake Smash
              </p>
            </div>
          </div>
        </div>

        <BotanicalVineDivider />

        {/* FAQs */}
        <FaqAccordion
          items={page.faq_block}
          title="Cake Smash Photography FAQs"
          subtitle="Everything about cake preparation and studio cleanup."
        />
      </div>
    </div>
  );
}
