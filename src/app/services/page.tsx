import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_PAGES } from '../../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../../components/BotanicalAccents';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BookSessionButton } from '../components/BookSessionButton';

export const metadata: Metadata = {
  title: "Photography Services in Northfield | Falguni's Photography",
  description: "Newborn, maternity, family, and cake smash photography in Northfield, Adelaide. Sessions from $250, styling and props included. See all sessions.",
};

export default function ServicesPage() {
  const page = SITE_PAGES.services;
  const hero = page.sections[0];

  const servicesList = [
    {
      id: 'newborn',
      title: 'Newborn Photography',
      url: '/services/newborn-photography',
      sub: '5-14 Days After Birth • 2-3 Hours',
      desc: 'Gentle, unhurried sessions with full access to Falguni\'s Northfield studio wraps, headbands, baskets, and eucalyptus wreath backdrops.',
      price: 'From $250'
    },
    {
      id: 'maternity',
      title: 'Maternity Photography',
      url: '/services/maternity-photography',
      sub: '28-34 Weeks Pregnant • 60 Minutes',
      desc: 'Flowing gowns and draped fabrics designed to make a third-trimester body feel celebrated. Partners and older siblings welcome.',
      price: 'From $250'
    },
    {
      id: 'family',
      title: 'Family Photography',
      url: '/services/family-photography',
      sub: '45-60 Minutes • All Ages',
      desc: 'Relaxed sessions with games and short breaks so kids smile naturally without forced poses or tight studio clocks.',
      price: 'From $250'
    },
    {
      id: 'cake-smash',
      title: 'Cake Smash Photography',
      url: '/services/cake-smash-photography',
      sub: 'First Birthday Milestone • 45 Minutes',
      desc: 'Celebratory first birthday sessions with themed backdrop, smash cake, portrait setups, and full studio cleanup included.',
      price: 'From $250'
    }
  ];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BotanicalRose color="sage" size={32} />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-[#A7B596]">
              Northfield Studio Packages
            </span>
            <BotanicalRose color="blush" size={32} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-[#423341] font-medium tracking-tight">
            {hero.headline}
          </h1>

          <p className="font-display text-xl text-[#423341]/90 italic">
            {hero.subheadline}
          </p>

          <p className="font-body text-base text-[#423341]/80 leading-relaxed">
            {hero.body_copy}
          </p>
        </div>

        <BotanicalVineDivider />

        {/* Silo Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {servicesList.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFD4CE] shadow-[0_10px_35px_rgba(66,51,65,0.06)] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3 font-body">
                <span className="text-xs font-semibold text-[#A7B596] uppercase tracking-wider block">
                  {s.sub}
                </span>
                <h2 className="font-display text-2xl font-medium text-[#423341]">
                  {s.title}
                </h2>
                <p className="text-sm text-[#423341]/80 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EFD4CE]/60 flex items-center justify-between font-body">
                <span className="font-semibold text-base text-[#423341]">{s.price}</span>
                <div className="flex items-center gap-3">
                  <BookSessionButton service={s.id} label="Book" className="px-4 py-2 text-xs" />
                  <Link
                    href={s.url}
                    className="text-xs font-semibold text-[#423341] hover:text-[#A7B596] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
