import React, { useState } from 'react';
import { BotanicalRose } from './BotanicalAccents';
import { Quotes, Star, CheckCircle, CaretDown, CaretUp, ThumbsUp } from '@phosphor-icons/react';

interface Review {
  id: string;
  name: string;
  badge?: string;
  time: string;
  text: string;
  rating: number;
  category: 'newborn' | 'maternity' | 'gentle' | 'attentive' | 'cake_family';
  likes?: number;
  ownerReply?: string;
  ownerReplyTime?: string;
}

export const TestimonialSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const realReviews: Review[] = [
    {
      id: 'r1',
      name: 'Prabhjot Gill',
      badge: '2 reviews',
      time: '3 months ago',
      text: 'I am happy with experience of getting my 5weeks baby photoshoot done by Falguni. She is excellent amazing and wonderful. Falguni was professional, patient and captured every moment perfectly. Highly recommended.',
      rating: 5,
      category: 'newborn',
      likes: 1,
      ownerReply: 'Thank you prabh for choosing falguni_photography and wonderful Review. Your baby is super cute, God bless her',
      ownerReplyTime: '3 months ago'
    },
    {
      id: 'r2',
      name: 'Gaurangi Anand',
      badge: 'Local Guide · 26 reviews',
      time: 'a year ago',
      text: "I'm happy with the experience of getting my newborn's photoshoot done by Falguni. She is absolutely amazing! The way she gently handled my baby and took utmost care throughout the photoshoot is incredible. She is passionate about her work.",
      rating: 5,
      category: 'newborn',
      likes: 1,
      ownerReply: 'Thank you for your detailed feedback. We truly appreciate the time you took to share your thoughts and the insights you’ve provided.',
      ownerReplyTime: 'a year ago'
    },
    {
      id: 'r3',
      name: 'Ashika Dharmesh Patel',
      badge: '4 reviews',
      time: 'a year ago',
      text: 'We had a wonderful experience with Falguni! They were incredibly patient and gentle with our newborn, taking the time to make sure everything was perfect without ever making us feel rushed. Their calm and caring nature made a big difference during the session. The photos turned out absolutely beautiful. Highly recommend!',
      rating: 5,
      category: 'attentive',
      likes: 3,
      ownerReply: 'Thank you for the fantastic 5 star Review. We’re so glad to hear that you were satisfied with our service and had a great experience with us. Your feedback is the great encouragement to us. We look forward to meeting you again.',
      ownerReplyTime: 'a year ago'
    },
    {
      id: 'r4',
      name: 'Veerpal Kaur Sidhu',
      badge: '5 reviews',
      time: '2 years ago',
      text: 'Thanks Falguni for beautiful pictures. It was wonderful experience..you are so nice and sweet. You did really good job… I really enjoyed my maternity shoot. I highly recommend your photography to everyone. Thanks again for lovely pictures',
      rating: 5,
      category: 'maternity',
      likes: 2,
      ownerReply: 'We are incredibly grateful that you took the time out to leave us a 5 star review and sharing your experience with us and community.',
      ownerReplyTime: '2 years ago'
    },
    {
      id: 'r5',
      name: 'Kuljeet SINGH',
      badge: '15 reviews · 3 photos',
      time: 'a year ago',
      text: 'We are so grateful to Falguni photography for capturing such beautiful memories during our family photoshoot. The way she worked with our kids was simply amazing—patient, kind, and creative, bringing out their genuine smiles and moments.',
      rating: 5,
      category: 'cake_family',
      likes: 1,
      ownerReply: "Seeing that you had a 5-Star experience is the best thing we could hope for! Thank you for acknowledging all of the time and effort I put into working on Photoshoot! I'm happy to hear this positive feedback as it means a lot to me.",
      ownerReplyTime: 'a year ago'
    },
    {
      id: 'r6',
      name: 'Sahil Sethi',
      badge: 'Local Guide · 17 reviews',
      time: 'a year ago',
      text: 'We had a baby shoot done with Falguni Photography, and it was absolutely fabulous! The attention to detail, patience, and creativity made the entire experience unforgettable. Falguni captured every precious moment so beautifully.',
      rating: 5,
      category: 'newborn',
      likes: 1,
      ownerReply: "Thank you again for your 5-star rating and for being an amazing part of our journey. Your continued support means everything to us, and we can't wait to exceed your expectations every time you choose us.",
      ownerReplyTime: 'a year ago'
    },
    {
      id: 'r7',
      name: 'Nisha Modh',
      badge: '9 reviews · 1 photo',
      time: '8 months ago',
      text: 'This photography studio is run by Falguni and she is extremely passionate about her work. Very good person and very serious about what she does. I would absolutely recommend this place',
      rating: 5,
      category: 'gentle',
      likes: 3,
      ownerReply: 'Thank you so much for your 5-star review! We truly appreciate your support and are glad you had a great experience with us',
      ownerReplyTime: '8 months ago'
    },
    {
      id: 'r8',
      name: 'Belinda Reuben',
      badge: '16 reviews',
      time: '2 years ago',
      text: 'She did a phenomenal job of the newborn photoshoot so I booked her for the family shoot as well. I absolutely loved her work. She was very thorough and took the time and care to make everything perfect during the photoshoot. I highly recommend her services.',
      rating: 5,
      category: 'newborn',
      likes: 2,
      ownerReply: 'Thanks so much for taking the time to let me know you feel this way!',
      ownerReplyTime: '2 years ago'
    },
    {
      id: 'r9',
      name: 'catherene jos',
      badge: '1 review',
      time: '2 years ago',
      text: 'I did my baby\'s cake smash photography with Falguni and I must say it was a wonderful experience. Falguni made us very comfortable throughout the photoshoot and my baby enjoyed it too. I definitely recommend her.',
      rating: 5,
      category: 'cake_family',
      likes: 1,
      ownerReply: 'Thank you for your lovely feedback',
      ownerReplyTime: '2 years ago'
    },
    {
      id: 'r10',
      name: 'Gurpreet Singh',
      badge: 'Local Guide · 36 reviews',
      time: '3 years ago',
      text: 'Very professional & Very calm , especially needed this kind of patience when it is newborns or month old baby\'s photoshoot. Falguni was really patient with everything, from wrapping baby to clicking photos.',
      rating: 5,
      category: 'attentive',
      likes: 2,
      ownerReply: 'Thank you so much Gurpreet Singh for your lovely words and positive feedback',
      ownerReplyTime: '3 years ago'
    },
    {
      id: 'r11',
      name: 'Sabreen Kaur',
      badge: '4 reviews',
      time: 'a year ago',
      text: 'Best experience for photography I Have had. Too friendly and experienced lady with magic in her fingers and camera',
      rating: 5,
      category: 'gentle',
      likes: 1,
      ownerReply: 'Thanks for your glowing review! We\'re so happy you enjoyed your time with us and hope to see you again soon.',
      ownerReplyTime: 'a year ago'
    },
    {
      id: 'r12',
      name: 'Kiranjot Kaur',
      badge: '2 reviews',
      time: '10 months ago',
      text: 'I had a great experience with this photo shoot ! Falguni is incredibly friendly and helpful, making the whole process smooth and enjoyable. It was also very convenient to get everything done on time. Highly recommend them for anyone looking for quality service with a personal touch!',
      rating: 5,
      category: 'gentle',
      likes: 1,
      ownerReply: 'Thank you for taking the time to share your positive experience. Your feedback inspires our team to keep delivering excellent service.',
      ownerReplyTime: '10 months ago'
    }
  ];

  const filteredReviews = realReviews.filter(r => {
    if (selectedTag === 'all') return true;
    return r.category === selectedTag;
  });

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 6);

  const toggleReply = (id: string) => {
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-16 bg-[#EFD4CE]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BotanicalRose color="sage" size={32} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#1C121B] font-bold tracking-tight">
              Real Google Reviews
            </h2>
            <BotanicalRose color="blush" size={32} />
          </div>
          <p className="text-base text-[#2D1D2C] font-body font-semibold">
            Read authentic feedback from parents who trusted Falguni's Photography with their most cherished milestones.
          </p>
        </div>

        {/* Google Summary Rating Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D8C2B8] shadow-md mb-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#2D1D2C] text-[#FBF6EF] flex flex-col items-center justify-center shadow-md">
              <span className="font-display text-2xl font-bold leading-none">5.0</span>
              <span className="text-[10px] uppercase tracking-wider text-[#EFD4CE] font-bold mt-1">Google</span>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start text-[#D97706] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} weight="fill" />
                ))}
              </div>
              <h3 className="font-display font-bold text-lg text-[#1C121B]">
                falguni’s photography
              </h3>
              <p className="text-xs text-[#2D1D2C] font-semibold flex items-center justify-center md:justify-start gap-1 mt-0.5">
                <CheckCircle size={15} className="text-[#2E4323]" weight="fill" />
                Verified Google Business Profile • 56 Reviews
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {[
              { id: 'all', label: `All (${realReviews.length})` },
              { id: 'newborn', label: 'Newborn Photoshoot' },
              { id: 'maternity', label: 'Maternity' },
              { id: 'attentive', label: 'Attentive with Babies' },
              { id: 'gentle', label: 'Gentle Photographers' },
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setSelectedTag(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedTag === pill.id
                    ? 'bg-[#2D1D2C] text-[#FBF6EF] shadow-sm'
                    : 'bg-white text-[#1C121B] hover:bg-[#EFD4CE]/60 border border-[#D8C2B8]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map(r => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-3xl border-2 border-[#D8C2B8] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow font-body"
            >
              <div>
                {/* Reviewer Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D1D2C] text-[#FBF6EF] font-display font-bold flex items-center justify-center text-sm shadow-sm">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-[#1C121B] leading-snug">
                        {r.name}
                      </h4>
                      {r.badge && (
                        <p className="text-xs text-[#3B2B3A] font-semibold">
                          {r.badge}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#3B2B3A] font-semibold font-mono">
                    {r.time}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#D97706] mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} weight="fill" />
                  ))}
                  <CheckCircle size={15} className="text-[#2E4323] ml-1" weight="fill" />
                </div>

                {/* Review Body */}
                <p className="text-sm text-[#1C121B] font-medium leading-relaxed mb-4">
                  "{r.text}"
                </p>
              </div>

              <div>
                {/* Like Pill */}
                {r.likes && (
                  <div className="flex items-center gap-1 text-xs text-[#1C121B] font-semibold mb-3 bg-[#EFD4CE] w-fit px-3 py-1 rounded-full border border-[#D8C2B8]">
                    <ThumbsUp size={13} className="text-[#1C121B]" weight="bold" />
                    <span>{r.likes} parent liked this review</span>
                  </div>
                )}

                {/* Studio Response Accordion */}
                {r.ownerReply && (
                  <div className="border-t border-[#D8C2B8] pt-3">
                    <button
                      onClick={() => toggleReply(r.id)}
                      className="text-xs font-bold text-[#1C121B] hover:text-[#2E4323] flex items-center gap-1.5 transition-colors w-full text-left"
                    >
                      <span>falguni’s photography (Owner)</span>
                      {expandedReplies[r.id] ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
                    </button>
                    {expandedReplies[r.id] && (
                      <div className="mt-2 bg-[#FBF6EF] p-3 rounded-2xl border border-[#D8C2B8] text-xs text-[#1C121B] font-medium italic">
                        "{r.ownerReply}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Toggle */}
        {filteredReviews.length > 6 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-[#2D1D2C] text-[#FBF6EF] hover:bg-[#1E121D] px-7 py-3.5 rounded-full font-body text-xs font-bold tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2 border border-[#D8C2B8]"
            >
              {showAll ? 'Show Fewer Reviews' : `View All ${filteredReviews.length} Google Reviews`}
              {showAll ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-[#2D1D2C] font-semibold font-body mt-8">
          Reviews verified from Falguni's Photography Google Business Profile (26 South Pkwy, Northfield SA 5085).
        </p>
      </div>
    </section>
  );
};
