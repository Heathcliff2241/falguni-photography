'use client';

import React, { useState } from 'react';
import { PORTFOLIO_IMAGES } from '../data/portfolioImages';
import { PortfolioImage } from '../types';
import { BotanicalRose } from './BotanicalAccents';
import { MaskingTape } from './MaskingTape';
import { X, CalendarCheck, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { useBooking } from '../context/BookingContext';

interface FloatingFilmstripGalleryProps {
  initialCategory?: string;
  onOpenBooking?: (service?: string) => void;
}

export const FloatingFilmstripGallery: React.FC<FloatingFilmstripGalleryProps> = ({
  initialCategory = 'all',
  onOpenBooking
}) => {
  const { openBookingModal } = useBooking();
  const [activeTab, setActiveTab] = useState<string>(initialCategory);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  const handleBooking = (service?: string) => {
    if (onOpenBooking) {
      onOpenBooking(service);
    } else {
      openBookingModal(service);
    }
  };

  const filteredImages = PORTFOLIO_IMAGES.filter(img => {
    if (activeTab === 'all') return true;
    return img.category === activeTab;
  });

  return (
    <section className="py-16 bg-[#FBF6EF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Title & Botanical doodle */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BotanicalRose color="sage" size={32} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#423341] tracking-tight">
              Scattered Prints Gallery
            </h2>
            <BotanicalRose color="blush" size={32} />
          </div>
          <p className="font-body text-[#423341]/80 text-base">
            Real sessions from our Northfield studio. Click any photo print to view full detail or request a session in that style.
          </p>

          {/* Filter Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 font-body text-xs sm:text-sm font-semibold">
            {[
              { id: 'all', label: 'All Session Prints' },
              { id: 'newborn', label: 'Newborn' },
              { id: 'maternity', label: 'Maternity' },
              { id: 'family', label: 'Family' },
              { id: 'cake-smash', label: 'Cake Smash' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#A7B596] text-[#423341] shadow-sm'
                    : 'bg-[#EFD4CE]/40 text-[#423341]/80 hover:bg-[#EFD4CE]/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scattered Filmstrip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-6 pb-8">
          {filteredImages.map((img, idx) => {
            const rotationClasses = [
              '-rotate-2 hover:rotate-0',
              'rotate-2 hover:rotate-0',
              '-rotate-1 hover:rotate-0',
              'rotate-1 hover:rotate-0'
            ];
            const rotationClass = rotationClasses[idx % rotationClasses.length];

            const tapeVariants: ('cream' | 'sage' | 'blush' | 'kraft')[] = ['cream', 'sage', 'blush', 'kraft'];
            const tapeVariant = tapeVariants[idx % tapeVariants.length];

            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`group cursor-pointer bg-white p-3.5 pt-4 pb-7 rounded-none shadow-[0_12px_32px_rgba(66,51,65,0.10)] border border-neutral-200/90 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_44px_rgba(66,51,65,0.16)] relative ${rotationClass}`}
              >
                {/* Washi / Masking Tape held on wall */}
                <MaskingTape variant={tapeVariant} rotation={idx % 2 === 0 ? '-rotate-1' : 'rotate-2'} />

                {/* Photo Frame Container - Uniform Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-200/60">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#423341]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-body font-medium flex items-center gap-1.5 bg-[#423341]/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <MagnifyingGlassPlus size={16} /> View Photo Print
                    </span>
                  </div>
                </div>

                {/* Print Title & Caption */}
                <div className="mt-3.5 px-1 flex items-center justify-between font-body">
                  <div>
                    <h3 className="font-display text-base text-[#423341] font-medium leading-snug">
                      {img.title}
                    </h3>
                    <p className="text-xs text-[#423341]/70 capitalize mt-0.5">
                      {img.category.replace('-', ' ')} Session • Northfield Studio
                    </p>
                  </div>
                  <span className="text-xs bg-[#EFD4CE]/50 text-[#423341] px-2.5 py-0.5 rounded-none border border-[#EFD4CE] font-medium shrink-0">
                    Sample
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#423341]/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-[#FBF6EF] max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-[#EFD4CE]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EFD4CE]/60 text-[#423341] flex items-center justify-center hover:bg-[#EFD4CE] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 rounded-2xl overflow-hidden bg-white p-2 border border-[#EFD4CE]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[400px] object-cover rounded-xl"
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-between font-body space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A7B596]">
                    {selectedImage.category.replace('-', ' ')} Session
                  </span>
                  <h3 className="font-display text-2xl font-medium text-[#423341] mt-1">
                    {selectedImage.title}
                  </h3>
                  <p className="text-sm text-[#423341]/80 mt-3 leading-relaxed">
                    {selectedImage.description}
                  </p>
                  <p className="text-xs text-[#423341]/60 mt-3">
                    Includes full access to Falguni's Northfield studio wardrobe, floral wreaths, hand-knit wraps, and custom color backdrops.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFD4CE]/60 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      const cat = selectedImage.category;
                      setSelectedImage(null);
                      handleBooking(cat);
                    }}
                    className="w-full sm:w-auto flex-1 bg-[#A7B596] text-[#423341] font-semibold text-sm px-5 py-3 rounded-full hover:bg-[#96a585] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck size={18} />
                    Book This Style ($250+)
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full sm:w-auto px-4 py-3 rounded-full border border-[#423341]/20 text-[#423341] text-sm hover:bg-[#EFD4CE]/30 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
