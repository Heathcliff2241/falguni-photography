'use client';

import React, { useState } from 'react';
import { FaqItem } from '../types';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { BotanicalRose } from './BotanicalAccents';

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know before booking your Northfield photography session.'
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 bg-[#FBF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BotanicalRose color="sage" size={28} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C121B] font-bold tracking-tight">
              {title}
            </h2>
            <BotanicalRose color="blush" size={28} />
          </div>
          {subtitle && (
            <p className="font-body text-base text-[#2D1D2C] font-semibold max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4 font-body">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#D8C2B8] overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-bold text-lg text-[#1C121B] hover:bg-[#EFD4CE]/30 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="w-8 h-8 rounded-full bg-[#2D1D2C] flex items-center justify-center text-[#FBF6EF] shrink-0 font-bold">
                    {isOpen ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-[#231522] font-medium leading-relaxed border-t border-[#D8C2B8] pt-4 animate-fade-in">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
