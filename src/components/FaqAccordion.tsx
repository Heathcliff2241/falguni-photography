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
            <h2 className="font-display text-3xl text-[#423341] tracking-tight">
              {title}
            </h2>
            <BotanicalRose color="blush" size={28} />
          </div>
          {subtitle && (
            <p className="font-body text-sm text-[#423341]/80 max-w-xl mx-auto">
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
                className="bg-white rounded-2xl border border-[#EFD4CE] overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-medium text-lg text-[#423341] hover:bg-[#EFD4CE]/20 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="w-8 h-8 rounded-full bg-[#EFD4CE]/40 flex items-center justify-center text-[#423341] shrink-0">
                    {isOpen ? <CaretUp size={18} /> : <CaretDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-[#423341]/80 leading-relaxed border-t border-[#EFD4CE]/40 pt-4 animate-fade-in">
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
