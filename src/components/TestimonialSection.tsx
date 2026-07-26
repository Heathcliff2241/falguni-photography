import React from 'react';
import { BotanicalRose } from './BotanicalAccents';
import { Quotes, Star } from '@phosphor-icons/react';

export const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Our baby was so fussy on the day and wouldn't stop crying, but Falguni was incredibly patient and calm. She took extra time for feeding breaks and we never felt rushed once. The final gallery exceeded every expectation!",
      author: "Adelaide Parent (Google Review)",
      detail: "Newborn Session • Northfield Studio",
      rating: 5
    },
    {
      id: 2,
      quote: "Falguni and her husband made us feel right at home from the moment we walked in. She has magic hands with newborns and knew exactly how to wrap and settle our 9-day-old daughter safely.",
      author: "Lightsview Family (Google Review)",
      detail: "Newborn & Maternity Package",
      rating: 5
    },
    {
      id: 3,
      quote: "We were worried our toddler wouldn't sit still for family photos, but Falguni turned it into a fun game. We got so many beautiful, natural smiles instead of forced poses. Highly recommend!",
      author: "Klemzig Family (Google Review)",
      detail: "Family Portrait Session",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-[#EFD4CE]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BotanicalRose color="sage" size={32} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#423341] tracking-tight">
              What Adelaide Parents Say
            </h2>
            <BotanicalRose color="blush" size={32} />
          </div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#EFD4CE] shadow-sm mt-3">
            <div className="flex text-[#A7B596]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} weight="fill" />
              ))}
            </div>
            <span className="font-body text-xs font-semibold text-[#423341]">
              56 Five-Star Google Reviews and Counting
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-[#FBF6EF] p-6 sm:p-8 rounded-3xl border border-[#EFD4CE] shadow-[0_8px_30px_rgba(66,51,65,0.05)] relative flex flex-col justify-between font-body hover:shadow-md transition-shadow"
            >
              <Quotes size={36} weight="fill" className="text-[#EFD4CE] mb-3" />
              <p className="text-sm text-[#423341] leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="border-t border-[#EFD4CE]/60 pt-4">
                <div className="flex text-[#A7B596] mb-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} weight="fill" />
                  ))}
                </div>
                <p className="font-display font-medium text-base text-[#423341]">
                  {t.author}
                </p>
                <p className="text-xs text-[#423341]/60">
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#423341]/60 font-body mt-8">
          Reviews verified from Falguni's Photography Google Business Profile (Northfield, SA).
        </p>
      </div>
    </section>
  );
};
