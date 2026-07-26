import React from 'react';
import type { Metadata } from 'next';
import { SITE_PAGES, LOCAL_NAP } from '../../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../../components/BotanicalAccents';
import { FaqAccordion } from '../../components/FaqAccordion';
import { PhoneCall, Star } from '@phosphor-icons/react/dist/ssr';
import { BookSessionButton } from '../components/BookSessionButton';

export const metadata: Metadata = {
  title: "About Falguni's Photography | Northfield, Adelaide",
  description: "Meet the husband-and-wife team behind Falguni's Photography in Northfield, Adelaide. 3+ years, 56 five-star reviews, newborn and maternity specialists.",
};

export default function AboutPage() {
  const page = SITE_PAGES.about;
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
                Husband-and-Wife Team • 3+ Years in Northfield
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

            <div className="bg-white p-6 rounded-3xl border border-[#EFD4CE] space-y-3 font-body text-sm text-[#423341]">
              <div className="flex items-center gap-1.5 text-[#A7B596]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} weight="fill" />
                ))}
                <span className="font-semibold text-xs text-[#423341] ml-2">
                  56 Five-Star Google Reviews
                </span>
              </div>
              <p className="text-xs text-[#423341]/80 leading-relaxed">
                Rather than rotating staff or rushing through back-to-back studio slots, Falguni personally shoots every session alongside her husband. They take pride in giving new parents a peaceful, warm environment where feeding breaks are welcomed and no baby is ever pressured to pose.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-body">
              <BookSessionButton label="Book Your Session ($250+)" className="w-full sm:w-auto" />
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
                Falguni & Her Husband at Northfield Studio
              </p>
            </div>
          </div>
        </div>

        <BotanicalVineDivider />

        {/* FAQs */}
        <FaqAccordion
          items={page.faq_block}
          title="Studio & Location Questions"
          subtitle="Learn more about our studio setup at 26 South Pkwy, Northfield SA."
        />
      </div>
    </div>
  );
}
