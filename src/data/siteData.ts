import { PageData } from '../types';
import {
  newbornWreath,
  newbornBlue,
  maternityPurple,
  familyBlue,
  cakeSmash,
  studioCouple,
  falguniPortrait,
  studioInterior
} from './portfolioImages';

export const LOCAL_NAP = {
  business_name: "Falguni's Photography",
  address: "26 South Pkwy, Northfield SA 5085, Australia",
  phone: "+61 469 753 238",
  phone_clean: "+61469753238",
  service_area: "Northfield, Lightsview, Klemzig, and greater Adelaide northern suburbs",
  rating: "5.0",
  review_count: 56,
  experience: "3+ Years Specialized Experience",
  inclusions: "Certified newborn handling safety, baby-led gentle posing, sculptural maternity lighting, and full studio wardrobe included"
};

export const SITE_PAGES: Record<string, PageData> = {
  home: {
    name: "Home",
    url: "/",
    purpose: "Introduce the studio, establish the patient and gentle positioning, and route visitors directly to session details or booking.",
    meta_title: "Newborn & Maternity Photographer Northfield | Falguni's Photography",
    meta_description: "Gentle, unhurried newborn, maternity, family, and cake smash photography in Northfield, Adelaide SA. 56 five-star Google reviews. Certified infant safety, baby-led posing, and sculpted lighting. Book online.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn, Maternity and Family Photography in Northfield",
        subheadline: "Artful, unhurried portraiture guided by certified newborn handling, gentle posing, and sculpted studio light.",
        body_copy: "Hosted in our warm 26°C Northfield sanctuary, every session is crafted around your baby's comfort and your family's rhythm. Falguni brings specialized expertise in delicate infant soothing, physiological safety, and flattering maternity lighting, with a curated wardrobe of organic wraps and couture gowns so you never have to prepare props or feel rushed.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: newbornWreath,
        image_alt_text: "Newborn baby safely asleep on a green floral wreath backdrop with white roses, Northfield photography studio",
        seo_notes: "Target keywords newborn photography Northfield and maternity photographer Adelaide featured naturally."
      },
      {
        section_name: "services_overview",
        heading_tag: "h2",
        headline: "Boutique Artistry, One Patient Specialist",
        subheadline: "Paced around your family with dedicated safety, gentle posing, and studio lighting expertise.",
        body_copy: "From delicate 5-day-old infant posing to luminous maternity portraits, every session at our Northfield studio reflects Falguni's mastery of physiological baby safety, gentle calming techniques, and flattering lighting design.",
        cta_text: "View All Services",
        cta_path: "/services",
        image_source: newbornBlue,
        image_alt_text: "Grid of newborn, maternity, and family photography samples from Falguni's Photography in Northfield",
        seo_notes: "Internal links to each service page with clear anchor text."
      },
      {
        section_name: "testimonials",
        heading_tag: "h2",
        headline: "What Adelaide Parents Say",
        subheadline: "56 five-star reviews on Google",
        body_copy: "Parents consistently highlight Falguni's gentle patience with fussy newborns, thoughtful pacing, and the calm atmosphere of our Northfield studio.",
        cta_text: "Read More Reviews",
        image_source: studioCouple,
        image_alt_text: "Five-star Google review rating for Falguni's Photography",
        seo_notes: "Structured data reflects 5.0 rating from 56 verified reviews."
      },
      {
        section_name: "cta_closing",
        heading_tag: "h2",
        headline: "Ready to Reserve Your Session?",
        subheadline: "Newborn dates fill quickly around estimated due dates.",
        body_copy: "Chat with Poppy below to check availability, or call directly on +61 469 753 238. If you are expecting, we recommend reserving your date during pregnancy so we can secure time around your due date.",
        cta_text: "Chat With Poppy",
        image_source: familyBlue,
        image_alt_text: "Family portrait session at Falguni's Photography studio in Northfield Adelaide",
        seo_notes: ""
      }
    ],
    faq_block: []
  },
  services: {
    name: "Services Overview",
    url: "/services",
    purpose: "Route visitors to specific session pages based on what they need.",
    meta_title: "Photography Services in Northfield, Adelaide | Falguni's Photography",
    meta_description: "Explore boutique newborn, maternity, family, and cake smash photography in Northfield, Adelaide. Certified newborn safety, baby-led posing, and fine-art maternity lighting.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Boutique Newborn, Maternity & Family Photography in Northfield",
        subheadline: "Mastery in newborn handling, baby-led gentle posing, and sculpted studio lighting.",
        body_copy: "Falguni's Photography offers dedicated studio sessions designed around comfort, patience, and authentic family connection. Serving families across Northfield, Lightsview, Klemzig, and northern Adelaide, Falguni pairs certified newborn handling and gentle soothing methods with artful directional lighting that flatters every expectant mother. Every session includes curated prop styling, unhurried studio time, and fine-art gallery delivery.",
        cta_text: "",
        image_source: maternityPurple,
        image_alt_text: "Maternity photography session in flowing purple gown, Northfield studio",
        seo_notes: "Direct navigational links to all four photography service silos."
      }
    ],
    faq_block: []
  },
  newborn: {
    name: "Newborn Photography",
    url: "/services/newborn-photography",
    purpose: "Convert expecting parents into booked newborn sessions.",
    meta_title: "Newborn Photography Northfield Adelaide | Gentle & Unhurried Sessions",
    meta_description: "Specialist newborn photography in Northfield SA. Certified gentle infant handling, baby-led posing, and warm 26°C sanctuary. All wraps and props provided. Book online.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn Photography in Northfield, Adelaide",
        subheadline: "Certified gentle infant handling, soothing care, and natural baby-led posing in a heated sanctuary.",
        body_copy: "Newborn sessions are best scheduled between 5 and 14 days after birth, while babies naturally curl into peaceful womb-like positions. Trained in physiological infant safety, Falguni employs calm soothing rhythms, gentle head-and-neck support, and breathable organic wraps to ensure baby remains content and deeply relaxed. Our dedicated Northfield studio is heated to an optimal 26°C with built-in pauses for feeding and snuggles, spanning 2 to 3 unhurried hours so your baby dictates the tempo.",
        cta_text: "Book Your Newborn Session",
        cta_path: "/contact",
        image_source: newbornBlue,
        image_alt_text: "Newborn baby wrapped in soft blue fabric sleeping soundly, Northfield newborn photography studio",
        seo_notes: "Direct answer to the newborn scheduling window in the opening paragraph."
      }
    ],
    faq_block: [
      {
        question: "How does Falguni ensure baby safety and gentle handling during the session?",
        answer: "Baby safety and physiological comfort are Falguni's highest priorities. Every pose is completely baby-led and anatomically supported, never forcing limbs or straining joints. Falguni is experienced in certified infant handling, temperature regulation, and soothing reflex techniques. Our studio is maintained at 26°C, and a parent or assistant is always within arm's reach."
      },
      {
        question: "When should I book my newborn photoshoot?",
        answer: "Book while you are still pregnant, ideally in your second or third trimester. Newborn sessions happen 5 to 14 days after birth. Reserving early means Falguni reserves time around your estimated due date, then confirms the exact day once baby arrives."
      },
      {
        question: "What if my baby is fussy, cluster-feeding, or won't settle?",
        answer: "That is completely natural and warmly accommodated. Every session is planned with generous buffers for nursing, bottle breaks, burping, and gentle rocking. Falguni never rushes a session; your baby's calm comfort always leads the way."
      },
      {
        question: "What is included in a newborn photography session?",
        answer: "Every newborn session covers complete prop styling, organic hand-knitted wraps, floral wreaths, 2-3 hours in our heated 26°C studio, parent and sibling poses, and a private online proofing gallery. Archival heirloom print boxes, museum-grade canvas, and full digital collections are available."
      }
    ]
  },
  maternity: {
    name: "Maternity Photography",
    url: "/services/maternity-photography",
    purpose: "Convert expecting mothers into booked maternity sessions.",
    meta_title: "Maternity Photography Adelaide | Studio Bump Shoots Northfield",
    meta_description: "Celebrate pregnancy with fine-art maternity photography in Northfield, Adelaide. Directional studio lighting, couture gowns, and flattering gentle posing. Book online.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Maternity Photography in Northfield, Adelaide",
        subheadline: "Celebrating motherhood with sculptural studio lighting, fluid couture silks, and gentle guided posing.",
        body_copy: "Maternity sessions are scheduled between 28 and 34 weeks, when your bump is beautifully rounded and you can move with comfort. Falguni specializes in delicate directional lighting crafted to sculpt maternal contours and flatter skin tones with painterly elegance. You enjoy complete access to our luxury studio wardrobe of chiffon gowns, lace dresses, and silk drapery, paired with gentle posing guidance that feels natural and empowering. Partners and older siblings are warmly included.",
        cta_text: "Book Your Maternity Session",
        cta_path: "/contact",
        image_source: maternityPurple,
        image_alt_text: "Maternity portrait in flowing purple gown against studio backdrop, Northfield Adelaide",
        seo_notes: "Direct guidance on booking between 28 and 34 weeks."
      }
    ],
    faq_block: [
      {
        question: "How does Falguni's studio lighting flatter the maternal form?",
        answer: "Falguni uses specialized directional and feathered studio lighting techniques designed specifically for maternity photography. This softly sculpts the bump silhouette, highlights natural contours, and casts a luminous, gentle glow over skin, creating timeless fine-art portraits."
      },
      {
        question: "What should I wear for my maternity shoot?",
        answer: "Falguni provides an extensive studio wardrobe of couture flowing gowns, lace wraps, and silk drapes at no extra charge. If you prefer to bring personal outfits, form-fitting solid neutrals and textured knits photograph beautifully."
      },
      {
        question: "Can my partner and children join the photos?",
        answer: "Yes, warmly. Partner connection and sibling moments are integral to celebrating your growing family and are seamlessly included in every maternity session."
      },
      {
        question: "When should I schedule my maternity shoot?",
        answer: "Between 28 and 34 weeks is the ideal window. Your bump is gorgeously defined, while you still feel energized and comfortable moving through gentle poses."
      }
    ]
  },
  family: {
    name: "Family Photography",
    url: "/services/family-photography",
    purpose: "Convert families looking for portrait sessions into bookings.",
    meta_title: "Family Photography Northfield Adelaide | Relaxed Studio Sessions",
    meta_description: "Relaxed, genuine family portraits in Northfield and northern Adelaide suburbs. No forced smiles or rushed timers. Full styling guidance included.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Family Photography in Northfield, Adelaide",
        subheadline: "Genuine smiles and natural connection without rigid posing.",
        body_copy: "Family sessions run 45 to 60 minutes, keeping things engaging for young children before anyone gets tired or hungry. Falguni keeps kids engaged with playful interactions and short pauses, capturing real moments rather than forced poses.",
        cta_text: "Book Your Family Session",
        cta_path: "/contact",
        image_source: familyBlue,
        image_alt_text: "Family portrait session in formal blue attire, Northfield photography studio",
        seo_notes: "Details session length and kid-friendly approach."
      }
    ],
    faq_block: [
      {
        question: "My kids do not sit still for photos. Will this work?",
        answer: "Yes, absolutely. Falguni works with kids' natural energy rather than fighting it. Some of the best family portraits happen while kids are playing and laughing naturally."
      },
      {
        question: "How far in advance should we book a family session?",
        answer: "Two to three weeks in advance is ideal, especially for weekend times and school holiday periods."
      }
    ]
  },
  cake_smash: {
    name: "Cake Smash Photography",
    url: "/services/cake-smash-photography",
    purpose: "Convert parents planning a first birthday into cake smash bookings.",
    meta_title: "Cake Smash Photography Adelaide | First Birthday Studio Sessions",
    meta_description: "Fun, mess-free 1st birthday cake smash photography in Northfield, Adelaide. Includes themed backdrop, smash cake, and splash bath photos.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Cake Smash Photography in Northfield, Adelaide",
        subheadline: "Milestone portraits, a fun cake smash, and zero cleanup for parents.",
        body_copy: "Celebrate your baby's first birthday with a custom-styled set, a smash cake, and a warm splash bath in a vintage tub. Sessions run 45 minutes, split into three parts so your baby stays happy throughout.",
        cta_text: "Book Your Cake Smash Session",
        cta_path: "/contact",
        image_source: cakeSmash,
        image_alt_text: "Baby first birthday cake smash photoshoot in Northfield Adelaide studio",
        seo_notes: "Clear 3-part session breakdown explained."
      }
    ],
    faq_block: [
      {
        question: "Do I need to bring the smash cake myself?",
        answer: "You can bring your own cake or ask Falguni to arrange one for you. Let us know your preferred theme or color palette in advance so the backdrop matches."
      },
      {
        question: "Who handles the cleanup after the session?",
        answer: "We handle all studio cleanup. You only need to bring a dry change of clothes for the ride home."
      }
    ]
  },
  gallery: {
    name: "Gallery",
    url: "/gallery",
    purpose: "Showcase real session work across all service types to build trust before booking.",
    meta_title: "Photography Portfolio Northfield | Falguni's Photography Adelaide",
    meta_description: "Browse real newborn, maternity, family, and cake smash photos captured at our Northfield studio. 56 five-star reviews.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn, Maternity & Family Photography Gallery, Northfield",
        subheadline: "Real sessions, real families, and real Adelaide babies.",
        body_copy: "Browse recent newborn, maternity, and family sessions photographed at our Northfield studio. Every photo here is from an actual client session, showing the genuine lighting, wraps, and styling you will enjoy on your own shoot.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: studioInterior,
        image_alt_text: "Gallery grid of newborn, maternity, and family photography from Falguni's Photography in Northfield",
        seo_notes: "Descriptive alt texts for all portfolio images."
      }
    ],
    faq_block: []
  },
  about: {
    name: "About",
    url: "/about",
    purpose: "Build trust in Falguni as the passionate photographer behind the camera.",
    meta_title: "About Falguni's Photography | Northfield Adelaide Studio Story",
    meta_description: "Meet Falguni, the patient photographer behind Northfield's favorite newborn and maternity photography studio. 3+ years experience & 56 Google reviews.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "About Falguni's Photography, Northfield SA",
        subheadline: "A dedicated portrait photographer who puts patience and comfort first.",
        body_copy: "Located at 26 South Pkwy in Northfield, Falguni has spent more than 3 years photographing Adelaide newborns, expecting mothers, and growing families. Rather than running a rushed commercial studio, she photographs one family at a time so every shoot feels peaceful, relaxed, and welcoming.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: falguniPortrait,
        image_alt_text: "Falguni in her Northfield studio, owner of Falguni's Photography",
        seo_notes: ""
      }
    ],
    faq_block: [
      {
        question: "Do you only shoot in the studio, or do you offer on-location sessions?",
        answer: "Most sessions are held at our dedicated Northfield studio where infant heating, lighting, and props are fully prepared. Outdoor sunset sessions can be arranged upon request."
      }
    ]
  },
  contact: {
    name: "Contact",
    url: "/contact",
    purpose: "Give visitors a direct path to booking via form, phone, or direct studio visit.",
    meta_title: "Book Photography Session Northfield | Contact Falguni's Studio",
    meta_description: "Contact Falguni's Photography at 26 South Pkwy, Northfield SA 5085. Call +61 469 753 238 or submit an online booking inquiry. Studio visits by appointment.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Contact Falguni's Photography, Northfield SA",
        subheadline: "Have questions about a session or ready to reserve your date? Get in touch today.",
        body_copy: "Visit us at 26 South Pkwy, Northfield SA 5085, or call +61 469 753 238. You can also chat with Poppy, our studio assistant below, or submit an online booking request.",
        cta_text: "Chat With Poppy",
        image_source: studioInterior,
        image_alt_text: "Falguni's Photography studio location, 26 South Pkwy, Northfield SA",
        seo_notes: "NAP block matches footer and Google Business Profile character-for-character."
      }
    ],
    faq_block: []
  }
};
