import { LOCAL_NAP } from './siteData';

export interface RouteMetadata {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  ogType?: string;
  ogImage?: string;
  canonicalPath: string;
}

export const CENTRAL_SEO_CONFIG = {
  siteName: "Falguni's Photography",
  defaultTitle: "Newborn & Maternity Photographer Northfield | Falguni's Photography",
  titleTemplate: "%s | Falguni's Photography Northfield Adelaide",
  defaultDescription: "Gentle, unhurried newborn, maternity, family, and cake smash photography in Northfield, Adelaide SA. 56 five-star Google reviews. Sessions from $250.",
  siteUrl: "https://falgunicreativephotography.com.au",
  defaultImage: "/assets/newborn_floral_wreath.jpg",
  
  // Geotagging & Local Discovery Metadata
  geo: {
    region: "AU-SA",
    placename: "Northfield, Adelaide",
    position: "-34.8569;138.6253",
    icbm: "-34.8569, 138.6253",
    country: "AU",
    state: "SA",
    locality: "Northfield",
    city: "Adelaide",
    postalCode: "5085",
    streetAddress: "26 South Pkwy",
    serviceAreas: [
      "Northfield",
      "Lightsview",
      "Klemzig",
      "Walkerville",
      "Mawson Lakes",
      "Prospect",
      "Oakden",
      "Golden Grove",
      "Adelaide Northern Suburbs",
      "South Australia"
    ]
  },

  // Target Keywords Strategy for Local Search & AI Discovery
  globalKeywords: [
    "newborn photography Northfield",
    "maternity photography Adelaide",
    "family photographer Northfield SA",
    "cake smash photography Adelaide",
    "baby photographer Lightsview",
    "infant photographer Klemzig",
    "Falguni photography Northfield",
    "Adelaide newborn photo studio",
    "gentle baby photography Adelaide",
    "affordable newborn photoshoot Adelaide"
  ],

  // Route-Specific Centralized Metadata Engine
  routeMetadata: {
    '/': {
      title: "Newborn & Maternity Photographer Northfield | Falguni's Photography",
      description: "Gentle, unhurried newborn, maternity, family, and cake smash photography in Northfield, Adelaide SA. 56 five-star Google reviews. Sessions from $250.",
      keywords: [
        "newborn photography Northfield",
        "maternity photography Adelaide",
        "family photographer Northfield SA",
        "cake smash photography Adelaide",
        "baby photographer Lightsview"
      ],
      h1: "Newborn & Maternity Photography in Northfield, Adelaide",
      canonicalPath: "/"
    },
    '/services': {
      title: "Photography Services in Northfield, Adelaide | Falguni's Photography",
      description: "Explore newborn, maternity, family, and cake smash photography sessions in Northfield, Adelaide. Starting at $250 with full styling and props provided.",
      keywords: [
        "photography services Northfield",
        "baby photo packages Adelaide",
        "newborn photoshoot rates SA",
        "maternity packages Northfield"
      ],
      h1: "Newborn, Maternity & Family Photography Services in Northfield",
      canonicalPath: "/services"
    },
    '/services/newborn-photography': {
      title: "Newborn Photography Northfield Adelaide | Gentle & Unhurried Sessions",
      description: "Specialist newborn photography in Northfield SA. Gentle 2-3 hour sessions timed to baby's rhythm. All wraps, wreaths, and props provided. From $250.",
      keywords: [
        "newborn photography Northfield",
        "baby photographer Northfield SA",
        "newborn photoshoot Lightsview",
        "unhurried infant photography Adelaide"
      ],
      h1: "Newborn Photography Northfield, Adelaide",
      canonicalPath: "/services/newborn-photography"
    },
    '/services/maternity-photography': {
      title: "Maternity Photography Adelaide | Studio & Sunset Bump Shoots Northfield",
      description: "Celebrate pregnancy with elegant maternity photography in Northfield, Adelaide. Studio wardrobe gowns provided. Best booked at 28-34 weeks.",
      keywords: [
        "maternity photography Adelaide",
        "pregnancy photographer Northfield",
        "maternity shoot wardrobe Adelaide",
        "bump photoshoot SA"
      ],
      h1: "Maternity Photography in Northfield, Adelaide",
      canonicalPath: "/services/maternity-photography"
    },
    '/services/family-photography': {
      title: "Family Photography Northfield Adelaide | Relaxed Outdoor & Studio Sessions",
      description: "Relaxed, genuine family portraits in Northfield and northern Adelaide suburbs. No forced smiles or rushed timers. Sessions starting at $250.",
      keywords: [
        "family photography Northfield",
        "family photographer Adelaide",
        "kids portrait studio Lightsview",
        "family photoshoot SA"
      ],
      h1: "Family Photography in Northfield, Adelaide",
      canonicalPath: "/services/family-photography"
    },
    '/services/cake-smash-photography': {
      title: "Cake Smash Photography Adelaide | First Birthday Studio Sessions Northfield",
      description: "Fun, mess-free 1st birthday cake smash photography in Northfield, Adelaide. Includes theme backdrop, smash cake, and splash bath photos.",
      keywords: [
        "cake smash photography Adelaide",
        "first birthday photoshoot Northfield",
        "1st birthday studio Adelaide",
        "cake smash photography SA"
      ],
      h1: "Cake Smash Photography Northfield, Adelaide",
      canonicalPath: "/services/cake-smash-photography"
    },
    '/gallery': {
      title: "Photography Portfolio Northfield | Falguni's Photography Adelaide",
      description: "Browse our high-resolution gallery of newborn, maternity, family, and cake smash photos captured at our Northfield studio.",
      keywords: [
        "newborn photo gallery Northfield",
        "maternity portfolio Adelaide",
        "baby photography examples SA"
      ],
      h1: "Studio Portfolio & Gallery",
      canonicalPath: "/gallery"
    },
    '/about': {
      title: "About Falguni's Photography | Northfield Adelaide Studio Story",
      description: "Meet Falguni, the patient photographer behind Northfield's favorite newborn and maternity photography studio. 3+ years experience & 56 Google reviews.",
      keywords: [
        "about Falguni photography",
        "Northfield photographer bio",
        "Adelaide newborn photographer team"
      ],
      h1: "About Falguni's Photography Studio",
      canonicalPath: "/about"
    },
    '/contact': {
      title: "Book Photography Session Northfield | Contact Falguni's Studio",
      description: "Reserve your newborn, maternity, family, or cake smash session in Northfield, Adelaide SA. Call +61 469 753 238 or submit an online inquiry.",
      keywords: [
        "book photographer Northfield",
        "contact Falguni photography",
        "Northfield photography studio phone"
      ],
      h1: "Book Your Photography Session",
      canonicalPath: "/contact"
    }
  } as Record<string, RouteMetadata>
};
