import { PageData } from '../types';
import {
  newbornWreath,
  newbornBlue,
  maternityPurple,
  familyBlue,
  cakeSmash,
  studioCouple,
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
  starting_price: "$250"
};

export const SITE_PAGES: Record<string, PageData> = {
  home: {
    name: "Home",
    url: "/",
    purpose: "Introduce the studio, establish the patient/gentle positioning, and route visitors to the right service page or straight to booking.",
    meta_title: "Newborn & Maternity Photographer Northfield | Falguni's",
    meta_description: "Gentle, unhurried newborn, maternity, and family photography in Northfield, Adelaide. 56 five-star reviews. Sessions from $250. Book online today.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn & Maternity Photography in Northfield, Adelaide",
        subheadline: "Specialist newborn, maternity, and family photographer who's spent 3+ years learning exactly how to keep a newborn calm, a toddler smiling, and a mom-to-be glowing in front of the camera.",
        body_copy: "Falguni's Photography is a newborn, maternity, and family photography studio in Northfield, serving Adelaide families from Lightsview to Klemzig and beyond. Sessions start at $250 and include a full range of wraps, backdrops, and props. Every shoot is unhurried, so your baby sets the pace, not the clock.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: newbornWreath,
        image_alt_text: "Newborn baby asleep on a green floral wreath backdrop with white roses, Northfield photography studio",
        seo_notes: "Primary keyword 'newborn photography Northfield' and 'maternity photography Adelaide' both present in h1 and body copy naturally."
      },
      {
        section_name: "services_overview",
        heading_tag: "h2",
        headline: "Four Sessions, One Patient Photographer",
        subheadline: "Every shoot is paced around your family, never a tight timer.",
        body_copy: "Newborn, maternity, family, and cake smash sessions, each shot from the Northfield studio with the same unhurried approach. Every package starts at $250 and includes a private online gallery.",
        cta_text: "View All Services",
        cta_path: "/services",
        image_source: newbornBlue,
        image_alt_text: "Grid of newborn, maternity, and family photography samples from Falguni's Photography",
        seo_notes: "Internal links to each service silo page with descriptive anchor text."
      },
      {
        section_name: "testimonials",
        heading_tag: "h2",
        headline: "What Adelaide Parents Say",
        subheadline: "56 five-star reviews and counting on Google",
        body_copy: "Parents consistently highlight Falguni's incredible patience, gentle technique with fussy newborns, and the peaceful, welcoming environment of her Northfield studio.",
        cta_text: "Read More Reviews",
        image_source: studioCouple,
        image_alt_text: "Five-star Google review rating for Falguni's Photography",
        seo_notes: "AggregateRating structured data reflects 5.0 rating from 56 reviews."
      },
      {
        section_name: "cta_closing",
        heading_tag: "h2",
        headline: "Ready to Book Your Session?",
        subheadline: "Sessions fill up fast—especially for newborn dates.",
        body_copy: "Chat with Poppy below to check availability, or call directly at +61 469 753 238. Newborn sessions fill up fast, so if you're expecting, it's worth reaching out before your due date.",
        cta_text: "Chat With Poppy",
        image_source: familyBlue,
        image_alt_text: "Family portrait session at Falguni's Photography studio in Northfield",
        seo_notes: ""
      }
    ],
    faq_block: []
  },
  services: {
    name: "Services Overview",
    url: "/services",
    purpose: "Route visitors to the correct service silo page based on what they're looking for.",
    meta_title: "Photography Services in Northfield | Falguni's Photography",
    meta_description: "Newborn, maternity, family, and cake smash photography in Northfield, Adelaide. Sessions from $250, styling and props included. See all sessions.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn, Maternity & Family Photography Services in Northfield",
        subheadline: "Four ways to capture the moments that don't come back around.",
        body_copy: "Falguni's Photography offers four core sessions: newborn, maternity, family, and cake smash photography, all shot from her Northfield studio and serving families across Adelaide's northern suburbs. Every package starts at $250 and includes styling, props, and a private online gallery.",
        cta_text: "",
        image_source: maternityPurple,
        image_alt_text: "Maternity photography session against purple backdrop in Northfield studio",
        seo_notes: "Links to all four service pages with anchor text matching each service name exactly."
      }
    ],
    faq_block: []
  },
  newborn: {
    name: "Newborn Photography",
    url: "/services/newborn-photography",
    purpose: "Convert expecting parents into booked newborn sessions.",
    meta_title: "Newborn Photography Northfield, Adelaide | Falguni's",
    meta_description: "Gentle newborn photography in Northfield, Adelaide. Sessions booked for the first 5-14 days. Wraps and props included, from $250. Book while pregnant.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn Photography in Northfield, Adelaide",
        subheadline: "Gentle, unhurried sessions timed to your baby's first two weeks, because that's when they still curl up like they did in the womb.",
        body_copy: "Newborn sessions are booked for the first 5-14 days after birth, when babies sleep deepest and pose most naturally. Falguni works around feeding and settling breaks, with a full range of wraps, headbands, and baskets included. Most sessions run 2-3 hours, giving your baby plenty of time to rest between setups.",
        cta_text: "Book Your Newborn Session",
        cta_path: "/contact",
        image_source: newbornBlue,
        image_alt_text: "Newborn baby wrapped in blue fabric asleep with a teddy bear, Northfield newborn photography",
        seo_notes: "Direct answer to 'when should I book newborn photos' appears in first sentence of body copy."
      }
    ],
    faq_block: [
      {
        question: "When should I book my newborn photoshoot?",
        answer: "Book while you're still pregnant, ideally by your third trimester. Newborn sessions happen 5-14 days after birth, and that window fills up fast, so reserving your date early means Falguni can plan around your due date instead of squeezing you in last minute."
      },
      {
        question: "What if my baby won't settle during the shoot?",
        answer: "That's normal, and it's planned for. Sessions are booked with extra time built in for feeding, soothing, and naps. Falguni has photographed hundreds of newborns and works at your baby's pace, not a fixed schedule, so nobody feels rushed."
      },
      {
        question: "How much does a newborn session cost?",
        answer: "Newborn sessions start at $250, which includes styling, props, and a private online gallery. Add-on packages with prints or albums are available. Exact pricing depends on the package you choose, and Falguni can walk you through options before you book."
      }
    ]
  },
  maternity: {
    name: "Maternity Photography",
    url: "/services/maternity-photography",
    purpose: "Convert expecting mothers into booked maternity sessions.",
    meta_title: "Maternity Photography Northfield, Adelaide | Falguni's",
    meta_description: "Maternity photography in Northfield, Adelaide. Best booked 28-34 weeks. Gowns and backdrops included, sessions from $250. Partners welcome.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Maternity Photography in Northfield, Adelaide",
        subheadline: "Soft draped fabrics, flattering light, and a photographer who knows how to make a third-trimester body feel celebrated, not just documented.",
        body_copy: "Maternity sessions are best booked between 28 and 34 weeks, when the bump is full but you're still comfortable moving and posing. Sessions include a choice of backdrops and flowing gowns, with partners and older siblings welcome to join for a few family frames.",
        cta_text: "Book Your Maternity Session",
        cta_path: "/contact",
        image_source: maternityPurple,
        image_alt_text: "Maternity portrait in flowing purple gown against purple backdrop, Northfield studio",
        seo_notes: "Direct answer to 'when to book maternity photos' in first sentence."
      }
    ],
    faq_block: [
      {
        question: "What should I wear for my maternity shoot?",
        answer: "Falguni has a wardrobe of flowing gowns and wraps to choose from on the day, so you don't need to buy anything new. If you'd rather wear your own outfit, form-fitting pieces that show your bump work best, and solid colors photograph better than busy patterns."
      },
      {
        question: "Can my partner or other kids be in the photos?",
        answer: "Yes. Many maternity sessions include a few frames with your partner or older children, so just mention it when booking. It's a nice way to capture the whole family before your newest member arrives."
      }
    ]
  },
  family: {
    name: "Family Photography",
    url: "/services/family-photography",
    purpose: "Convert families looking for portrait sessions into bookings.",
    meta_title: "Family Photography Northfield, Adelaide | Falguni's",
    meta_description: "Relaxed family photography in Northfield, Adelaide. 45-60 minute sessions from $250, works with kids of all ages. Book your family session today.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Family Photography in Northfield, Adelaide",
        subheadline: "The kind of family session where the kids actually smile, because nobody's rushing them to sit still and say cheese.",
        body_copy: "Family sessions run 45-60 minutes and work well for growing families, milestone birthdays, or simply an update to the photos on your wall. Falguni keeps young kids engaged with props and games between poses, so the shots feel natural instead of stiff and posed.",
        cta_text: "Book Your Family Session",
        cta_path: "/contact",
        image_source: familyBlue,
        image_alt_text: "Family portrait session in formal blue attire, Northfield photography studio",
        seo_notes: "Direct answer to 'how long does a family session take' in first sentence."
      }
    ],
    faq_block: [
      {
        question: "My kids don't sit still for photos, is that a problem?",
        answer: "Not at all, most families who book have the same worry. Falguni works around kids' energy levels rather than fighting them, using games and short breaks to get natural smiles instead of forced ones. Some of the best shots happen between the posed ones."
      },
      {
        question: "How far in advance should we book a family session?",
        answer: "Two to three weeks' notice is usually enough for family sessions, though weekends and school holidays fill up faster. If you have a specific date in mind, reach out as early as you can."
      }
    ]
  },
  cake_smash: {
    name: "Cake Smash Photography",
    url: "/services/cake-smash-photography",
    purpose: "Convert parents planning a first birthday into cake smash bookings.",
    meta_title: "Cake Smash Photography Northfield, Adelaide | Falguni's",
    meta_description: "Cake smash and first birthday photography in Northfield, Adelaide. Themed backdrops, cleanup included, sessions from $250. Book your date now.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Cake Smash Photography in Northfield, Adelaide",
        subheadline: "One cake, one very messy baby, and a set of photos you'll still be laughing about at their eighteenth birthday.",
        body_copy: "Cake smash sessions celebrate a baby's first birthday with a themed backdrop, a smash cake, and full cleanup included afterward. Sessions run about 45 minutes, split between a clean outfit for portraits and the messier cake portion at the end.",
        cta_text: "Book Your Cake Smash Session",
        cta_path: "/contact",
        image_source: cakeSmash,
        image_alt_text: "Baby's first birthday cake smash session at Northfield photography studio",
        seo_notes: "Direct answer to 'what is included in a cake smash session' in first sentence."
      }
    ],
    faq_block: [
      {
        question: "Do I need to bring the cake myself?",
        answer: "You can bring your own or ask Falguni to arrange one when you book, whichever is easier for you. Either way, let her know your color theme in advance so the backdrop and styling can match."
      },
      {
        question: "Is the studio cleaned up after the cake smash?",
        answer: "Yes, cleanup is included in every cake smash session. You're welcome to bring a change of clothes for your baby afterward, but there's nothing for you to clean up before you head home."
      }
    ]
  },
  gallery: {
    name: "Gallery",
    url: "/gallery",
    purpose: "Showcase real session work across all service types to build trust before booking.",
    meta_title: "Photography Gallery Northfield, Adelaide | Falguni's",
    meta_description: "Browse real newborn, maternity, and family photography sessions from Falguni's Photography in Northfield, Adelaide. See the style before you book.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Newborn, Maternity & Family Photography Gallery, Northfield",
        subheadline: "A look at real sessions, real families, real Adelaide babies.",
        body_copy: "Browse recent newborn, maternity, and family sessions shot at the Northfield studio. Every photo here is from an actual Falguni's Photography client, not a stock library, so you can see the real lighting, real backdrops, and real style you'll get on your own session day.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: studioInterior,
        image_alt_text: "Gallery grid of newborn, maternity, and family photography from Falguni's Photography",
        seo_notes: "Each image needs unique, descriptive alt text, not repeated across the grid."
      }
    ],
    faq_block: []
  },
  about: {
    name: "About",
    url: "/about",
    purpose: "Build trust in Falguni as the passionate photographer behind the camera.",
    meta_title: "About Falguni's Photography | Northfield, Adelaide",
    meta_description: "Meet Falguni, the patient photographer behind Falguni's Photography in Northfield, Adelaide. 3+ years, 56 five-star reviews, newborn and maternity specialist.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "About Falguni's Photography, Northfield SA",
        subheadline: "A dedicated photographer who's turned holding fussy babies into an actual art form.",
        body_copy: "Falguni's Photography is led by Falguni from her boutique Northfield studio, serving Adelaide families for 3+ years. What started as a passion for capturing newborns has grown into 56 five-star reviews from parents who come back for maternity, first birthdays, and everything in between.",
        cta_text: "Book Your Session",
        cta_path: "/contact",
        image_source: studioCouple,
        image_alt_text: "Falguni in her Northfield studio, owner of Falguni's Photography",
        seo_notes: ""
      }
    ],
    faq_block: [
      {
        question: "Do you only shoot in the studio, or can you come to us?",
        answer: "Sessions are typically held at the Northfield studio, where the lighting and setup are ready to go. If you're interested in an in-home or outdoor session, ask when you book and Falguni can let you know if that's an option for your session type."
      }
    ]
  },
  contact: {
    name: "Contact",
    url: "/contact",
    purpose: "Give visitors a direct path to booking via chat, phone, or the studio address.",
    meta_title: "Contact Falguni's Photography | Northfield, Adelaide",
    meta_description: "Contact Falguni's Photography at 26 South Pkwy, Northfield SA 5085. Call +61 469 753 238 or chat online to book your newborn or maternity session.",
    sections: [
      {
        section_name: "hero",
        heading_tag: "h1",
        headline: "Contact Falguni's Photography, Northfield SA",
        subheadline: "Questions about a session, or ready to lock in your date? Start here.",
        body_copy: "Reach Falguni's Photography at 26 South Pkwy, Northfield SA 5085, or call +61 469 753 238. You can also chat with Poppy, the booking assistant below, to check availability and get a session started without waiting for a callback.",
        cta_text: "Chat With Poppy",
        image_source: studioInterior,
        image_alt_text: "Falguni's Photography studio location, 26 South Pkwy, Northfield SA",
        seo_notes: "NAP block matches footer and Google Business Profile character-for-character."
      }
    ],
    faq_block: []
  }
};
