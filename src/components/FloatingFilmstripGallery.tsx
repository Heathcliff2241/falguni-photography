'use client';

import React, { useState } from 'react';
import { PORTFOLIO_IMAGES } from '../data/portfolioImages';
import { PortfolioImage } from '../types';
import { BotanicalRose } from './BotanicalAccents';
import { TapeStrip } from './TapeStrip';
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
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C121B] font-bold tracking-tight">
              Scattered Prints Gallery
            </h2>
            <BotanicalRose color="blush" size={32} />
          </div>
          <p className="font-body text-[#2D1D2C] text-base font-medium">
            Real sessions from our Northfield studio. Click any photo print to view full detail or request a session in that style.
          </p>

          {/* Filter Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 font-body text-xs sm:text-sm font-bold">
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
                className={`px-4.5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2D1D2C] text-[#FBF6EF] shadow-md font-bold'
                    : 'bg-white border border-[#D8C2B8] text-[#1C121B] font-semibold hover:bg-[#EFD4CE]/60'
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

            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`group cursor-pointer bg-white p-3.5 pt-4 pb-7 rounded-none shadow-[0_12px_32px_rgba(33,20,32,0.12)] border border-neutral-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_44px_rgba(33,20,32,0.20)] relative ${rotationClass}`}
              >
                {/* Washi / Textured Masking Tape held on wall */}
                <TapeStrip variant={idx % 2 === 0 ? 'classic' : 'sage'} />

                {/* Photo Frame Container - Uniform Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden bg-[#FBF6EF] border border-neutral-300">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C121B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-body font-bold flex items-center gap-1.5 bg-[#1C121B]/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <MagnifyingGlassPlus size={16} weight="bold" /> View Photo Print
                    </span>
                  </div>
                </div>

                {/* Print Title & Caption */}
                <div className="mt-3.5 px-1 flex items-center justify-between font-body">
                  <div>
                    <h3 className="font-display text-base text-[#1C121B] font-bold leading-snug">
                      {img.title}
                    </h3>
                    <p className="text-xs text-[#3B2B3A] font-medium capitalize mt-0.5">
                      {img.category.replace('-', ' ')} Session • Northfield Studio
                    </p>
                  </div>
                  <span className="text-xs bg-[#EFD4CE] text-[#1C121B] px-2.5 py-0.5 rounded-none border border-[#D8C2B8] font-bold shrink-0">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C121B]/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-[#FBF6EF] max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border-2 border-[#D8C2B8]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EFD4CE] text-[#1C121B] font-bold flex items-center justify-center hover:bg-[#E2BEB5] transition-colors cursor-pointer shadow-sm"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 rounded-2xl overflow-hidden bg-white p-2 border border-[#D8C2B8]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[400px] object-cover rounded-xl"
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-between font-body space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E4323] bg-[#E1E7D8] px-2.5 py-1 rounded-md inline-block">
                    {selectedImage.category.replace('-', ' ')} Session
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#1C121B] mt-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-sm text-[#231522] font-medium mt-3 leading-relaxed">
                    {selectedImage.description}
                  </p>
                  <p className="text-xs text-[#3B2B3A] font-medium mt-3">
                    Includes full access to Falguni's Northfield studio wardrobe, floral wreaths, hand-knit wraps, and custom color backdrops.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8C2B8] flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      const cat = selectedImage.category;
                      setSelectedImage(null);
                      handleBooking(cat);
                    }}
                    className="w-full sm:w-auto flex-1 bg-[#2D1D2C] text-[#FBF6EF] font-bold text-sm px-5 py-3 rounded-full hover:bg-[#1E121D] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck size={18} weight="bold" />
                    Book This Style ($250+)
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full border-2 border-[#1C121B] text-[#1C121B] font-bold text-sm hover:bg-[#EFD4CE]/50 transition-colors cursor-pointer"
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
