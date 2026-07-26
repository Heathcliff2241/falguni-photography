import React from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FaqAccordion } from '../components/FaqAccordion';
import { TapeStrip } from '../components/TapeStrip';
import { CalendarCheck, PhoneCall, CheckCircle } from '@phosphor-icons/react';

interface CakeSmashViewProps {
  onOpenBooking: (service?: string) => void;
}

export const CakeSmashView: React.FC<CakeSmashViewProps> = ({ onOpenBooking }) => {
  const page = SITE_PAGES.cake_smash;
  const hero = page.sections[0];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl text-[#1C121B] font-bold leading-tight">
              {hero.headline}
            </h1>

            <p className="font-display text-xl text-[#2D1D2C] font-semibold italic">
              {hero.subheadline}
            </p>

            <p className="font-body text-base sm:text-lg text-[#1C121B] font-medium leading-relaxed">
              {hero.body_copy}
            </p>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#D8C2B8] shadow-md space-y-3 font-body text-sm text-[#1C121B]">
              <h3 className="font-display text-lg font-bold text-[#1C121B] border-b border-[#D8C2B8] pb-2">
                Included in Your $250+ Cake Smash Session
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-semibold text-xs sm:text-sm">
                <p className="flex items-center gap-2"><CheckCircle size={18} className="text-[#2E4323]" weight="fill" /> Custom balloon arch & themed studio backdrop</p>
                <p className="flex items-center gap-2"><CheckCircle size={18} className="text-[#2E4323]" weight="fill" /> Clean outfit portraits before the cake portion</p>
                <p className="flex items-center gap-2"><CheckCircle size={18} className="text-[#2E4323]" weight="fill" /> Cake smash setup & fun messy shooting</p>
                <p className="flex items-center gap-2"><CheckCircle size={18} className="text-[#2E4323]" weight="fill" /> Full studio cleanup included afterward</p>
                <p className="flex items-center gap-2"><CheckCircle size={18} className="text-[#2E4323]" weight="fill" /> Private online proofing gallery</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-body">
              <button
                onClick={() => onOpenBooking('cake-smash')}
                className="w-full sm:w-auto bg-[#2D1D2C] hover:bg-[#1E121D] text-[#FBF6EF] font-bold text-base px-8 py-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarCheck size={20} weight="bold" />
                Book Your Cake Smash Session
              </button>
              <a
                href={`tel:${LOCAL_NAP.phone_clean}`}
                className="w-full sm:w-auto bg-white border-2 border-[#1C121B] text-[#1C121B] font-bold text-base px-6 py-4 rounded-full hover:bg-[#EFD4CE]/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall size={20} weight="bold" />
                Call {LOCAL_NAP.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative pt-4">
            <div className="relative bg-white p-3.5 pt-4 pb-7 rounded-none shadow-[0_12px_36px_rgba(33,20,32,0.14)] border border-neutral-300 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Washi / Textured Masking Tape held on wall */}
              <TapeStrip variant="blush" />

              <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-300">
                <img
                  src={hero.image_source}
                  alt={hero.image_alt_text}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-center text-base text-[#1C121B] font-bold mt-3">
                First Birthday Cake Smash Setup
              </p>
            </div>
          </div>
        </div>

        <BotanicalVineDivider />

        {/* FAQs */}
        <FaqAccordion
          items={page.faq_block}
          title="Cake Smash Photography FAQs"
          subtitle="How cake options and studio cleanups work for first birthday sessions."
        />
      </div>
    </div>
  );
};
