import React from 'react';
import { SITE_PAGES } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { CalendarCheck, ArrowRight } from '@phosphor-icons/react';

interface ServicesOverviewViewProps {
  onOpenBooking: (service?: string) => void;
}

export const ServicesOverviewView: React.FC<ServicesOverviewViewProps> = ({ onOpenBooking }) => {
  const page = SITE_PAGES.services;
  const hero = page.sections[0];

  const servicesList = [
    {
      id: 'newborn',
      title: 'Newborn Photography',
      url: '/services/newborn-photography',
      sub: '5-14 Days After Birth • 2-3 Hours',
      desc: 'Gentle, unhurried sessions with full access to Falguni\'s Northfield studio wraps, headbands, baskets, and eucalyptus wreath backdrops.',
      price: 'From $250',
      image: page.sections[0].image_source
    },
    {
      id: 'maternity',
      title: 'Maternity Photography',
      url: '/services/maternity-photography',
      sub: '28-34 Weeks Pregnant • 60 Minutes',
      desc: 'Flowing gowns and draped fabrics designed to make a third-trimester body feel celebrated. Partners and older siblings welcome.',
      price: 'From $250',
      image: hero.image_source
    },
    {
      id: 'family',
      title: 'Family Photography',
      url: '/services/family-photography',
      sub: '45-60 Minutes • All Ages',
      desc: 'Relaxed sessions with games and short breaks so kids smile naturally without forced poses or tight studio clocks.',
      price: 'From $250',
      image: hero.image_source
    },
    {
      id: 'cake-smash',
      title: 'Cake Smash Photography',
      url: '/services/cake-smash-photography',
      sub: 'First Birthday Milestone • 45 Minutes',
      desc: 'Celebratory first birthday sessions with themed backdrop, smash cake, portrait setups, and full studio cleanup included.',
      price: 'From $250',
      image: hero.image_source
    }
  ];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C121B] font-bold tracking-tight">
            {hero.headline}
          </h1>

          <p className="font-display text-xl text-[#2D1D2C] font-semibold italic">
            {hero.subheadline}
          </p>

          <p className="font-body text-base sm:text-lg text-[#1C121B] font-medium leading-relaxed">
            {hero.body_copy}
          </p>
        </div>

        <BotanicalVineDivider />

        {/* Silo Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {servicesList.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D8C2B8] shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3 font-body">
                <span className="text-xs font-bold text-[#2E4323] bg-[#E1E7D8] px-3 py-1 rounded-md inline-block uppercase tracking-wider">
                  {s.sub}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C121B]">
                  {s.title}
                </h2>
                <p className="text-sm sm:text-base text-[#231522] font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#D8C2B8] flex items-center justify-between font-body">
                <span className="font-bold text-lg text-[#1C121B]">{s.price}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(s.id)}
                    className="bg-[#2D1D2C] text-[#FBF6EF] text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#1E121D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CalendarCheck size={16} weight="bold" /> Book
                  </button>
                  <a
                    href={s.url}
                    className="text-xs font-bold text-[#1C121B] underline hover:text-[#2E4323] transition-colors flex items-center gap-1"
                  >
                    Details <ArrowRight size={14} weight="bold" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
