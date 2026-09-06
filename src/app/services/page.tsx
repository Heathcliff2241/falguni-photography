import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_PAGES } from '../../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../../components/BotanicalAccents';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BookSessionButton } from '../components/BookSessionButton';

export const metadata: Metadata = {
  title: "Photography Services in Northfield | Falguni's Photography",
  description: "Newborn, maternity, family, and cake smash photography in Northfield, Adelaide. Comprehensive boutique packages with styling and props included.",
};

export default function ServicesPage() {
  const page = SITE_PAGES.services;
  const hero = page.sections[0];

  const servicesList = [
    {
      id: 'newborn',
      title: 'Newborn Photography',
      url: '/services/newborn-photography',
      sub: '5-14 Days After Birth • 2-3 Hours • 26°C Sanctuary',
      desc: 'Certified infant handling safety, deep soothing rhythms, and baby-led gentle posing with full access to organic wraps, bonnets, and floral wreaths.',
      feature: 'Certified Infant Handling & Baby-Led Posing'
    },
    {
      id: 'maternity',
      title: 'Maternity Photography',
      url: '/services/maternity-photography',
      sub: '28-34 Weeks Pregnant • 60 Minutes • Fine-Art Lighting',
      desc: 'Masterful sculptural studio lighting and fluid couture gowns designed to celebrate the maternal curve. Partner and sibling portraits included.',
      feature: 'Sculptural Lighting & Couture Studio Wardrobe'
    },
    {
      id: 'family',
      title: 'Family Photography',
      url: '/services/family-photography',
      sub: '45-60 Minutes • All Ages • Natural Connection',
      desc: 'Unhurried, joyful sessions with playful guidance and breaks so children smile naturally without rigid posing or ticking timers.',
      feature: 'Play-Led Posing & Authentic Connection'
    },
    {
      id: 'cake-smash',
      title: 'Cake Smash Photography',
      url: '/services/cake-smash-photography',
      sub: 'First Birthday Milestone • 45 Minutes • Pure Joy',
      desc: 'Bespoke first birthday celebrations with themed backdrops, custom smash cake, celebratory portraits, warm splash bath, and full studio cleanup.',
      feature: 'Bespoke Styling, Smash Cake & Splash Bath'
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
              Boutique Northfield Studio
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

        {/* Quality & Expertise Pillar Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-4">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#EFD4CE] shadow-sm space-y-1.5 font-body">
            <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider block">Safety & Care</span>
            <h3 className="font-display text-lg font-medium text-[#423341]">Certified Infant Handling</h3>
            <p className="text-xs text-[#423341]/75 leading-relaxed">
              Trained in newborn physiology, airway safety, and calming reflex techniques in a warm 26°C sanctuary.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#EFD4CE] shadow-sm space-y-1.5 font-body">
            <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider block">Artful Anatomy</span>
            <h3 className="font-display text-lg font-medium text-[#423341]">Gentle, Baby-Led Posing</h3>
            <p className="text-xs text-[#423341]/75 leading-relaxed">
              Poses follow your baby’s natural flexibility and comfort, never forcing awkward positions.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#EFD4CE] shadow-sm space-y-1.5 font-body">
            <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider block">Fine-Art Aesthetics</span>
            <h3 className="font-display text-lg font-medium text-[#423341]">Sculptural Studio Lighting</h3>
            <p className="text-xs text-[#423341]/75 leading-relaxed">
              Soft feathered lighting designed to celebrate maternal curves and produce painterly skin tones.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#EFD4CE] shadow-sm space-y-1.5 font-body">
            <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider block">Heirloom Standard</span>
            <h3 className="font-display text-lg font-medium text-[#423341]">Museum-Grade Keepsakes</h3>
            <p className="text-xs text-[#423341]/75 leading-relaxed">
              Unhurried sessions paired with archival print finishes and bespoke heirloom box collections.
            </p>
          </div>
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
                <span className="font-semibold text-xs text-[#52796F]">{s.feature}</span>
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
