import React from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FaqAccordion } from '../components/FaqAccordion';
import { MaskingTape } from '../components/MaskingTape';
import { CalendarCheck, PhoneCall, CheckCircle } from '@phosphor-icons/react';

interface MaternityViewProps {
  onOpenBooking: (service?: string) => void;
}

export const MaternityView: React.FC<MaternityViewProps> = ({ onOpenBooking }) => {
  const page = SITE_PAGES.maternity;
  const hero = page.sections[0];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
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
                Included in Your $250+ Maternity Session
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Full studio wardrobe of flowing gowns & silks</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Choice of solid or draped studio backdrops</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Partner & older siblings included at no extra cost</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Professional body-flattering lighting techniques</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-[#A7B596]" /> Private online proofing gallery</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-body">
              <button
                onClick={() => onOpenBooking('maternity')}
                className="w-full sm:w-auto bg-[#A7B596] hover:bg-[#96a585] text-[#423341] font-semibold text-base px-8 py-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck size={20} />
                Book Your Maternity Session
              </button>
              <a
                href={`tel:${LOCAL_NAP.phone_clean}`}
                className="w-full sm:w-auto bg-white border border-[#EFD4CE] text-[#423341] font-medium text-base px-6 py-4 rounded-full hover:bg-[#EFD4CE]/30 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall size={20} />
                Call {LOCAL_NAP.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative pt-4">
            <div className="relative bg-white p-3.5 pt-4 pb-7 rounded-none shadow-[0_12px_36px_rgba(66,51,65,0.12)] border border-neutral-200 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Textured Washi / Masking Tape held on wall */}
              <MaskingTape variant="blush" rotation="-rotate-1" width="w-24" />

              <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-200/60">
                <img
                  src={hero.image_source}
                  alt={hero.image_alt_text}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-center text-base text-[#423341] font-medium mt-3">
                Flowing Purple Gown Maternity Session
              </p>
            </div>
          </div>
        </div>

        <BotanicalVineDivider />

        {/* FAQs */}
        <FaqAccordion
          items={page.faq_block}
          title="Maternity Photography FAQs"
          subtitle="Everything expecting mothers need to know about preparing for their session."
        />
      </div>
    </div>
  );
};
