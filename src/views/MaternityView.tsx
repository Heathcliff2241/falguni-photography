import React from 'react';
import { SITE_PAGES, LOCAL_NAP } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FaqAccordion } from '../components/FaqAccordion';
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
            <div className="flex items-center gap-3 mb-1">
              <BotanicalRose color="sage" size={38} />
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

          <div className="lg:col-span-5">
            <div className="bg-white p-4 rounded-3xl shadow-[0_12px_40px_rgba(66,51,65,0.08)] border border-[#EFD4CE] transform rotate-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FBF6EF]">
                <img
                  src={hero.image_source}
                  alt={hero.image_alt_text}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-center text-lg text-[#423341] font-medium mt-3">
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
