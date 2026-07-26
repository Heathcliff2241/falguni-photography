import React from 'react';
import { SITE_PAGES } from '../data/siteData';
import { BotanicalRose, BotanicalVineDivider } from '../components/BotanicalAccents';
import { FloatingFilmstripGallery } from '../components/FloatingFilmstripGallery';

interface GalleryViewProps {
  onOpenBooking: (service?: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onOpenBooking }) => {
  const page = SITE_PAGES.gallery;
  const hero = page.sections[0];

  return (
    <div className="py-12 bg-[#FBF6EF] space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
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
      </div>

      {/* Scattered Filmstrip Gallery */}
      <FloatingFilmstripGallery onOpenBooking={onOpenBooking} />
    </div>
  );
};
