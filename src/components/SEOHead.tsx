import React, { useEffect } from 'react';
import { LOCAL_NAP, SITE_PAGES } from '../data/siteData';

interface SEOHeadProps {
  currentPath: string;
  metaTitle?: string;
  metaDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  currentPath,
  metaTitle,
  metaDescription
}) => {
  useEffect(() => {
    // 1. Update Title
    const title = metaTitle || "Newborn & Maternity Photographer Northfield | Falguni's Photography";
    document.title = title;

    // 2. Helper to set or update meta tag
    const updateMeta = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const description = metaDescription || "Gentle, unhurried newborn, maternity, family, and cake smash photography in Northfield, Adelaide SA. 56 five-star Google reviews. Sessions from $250.";

    updateMeta('name', 'description', description);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', window.location.origin + currentPath);
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);

    // 3. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + currentPath);

    // 4. Inject Dynamic Schema.org JSON-LD for AI Discovery and GEO Search
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["Photographer", "LocalBusiness"],
      "@id": `${window.location.origin}/#studio`,
      "name": LOCAL_NAP.business_name,
      "description": "Boutique newborn, maternity, family, and cake smash photography studio in Northfield, Adelaide SA. 56 five-star Google reviews.",
      "url": window.location.origin,
      "telephone": LOCAL_NAP.phone,
      "priceRange": "$250 - $800",
      "currenciesAccepted": "AUD",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "26 South Pkwy",
        "addressLocality": "Northfield",
        "addressRegion": "SA",
        "postalCode": "5085",
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -34.8569,
        "longitude": 138.6253
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ],
      "areaServed": [
        "Northfield",
        "Lightsview",
        "Klemzig",
        "Walkerville",
        "Mawson Lakes",
        "Prospect",
        "Oakden",
        "Golden Grove",
        "Adelaide Northern Suburbs"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": LOCAL_NAP.rating,
        "reviewCount": LOCAL_NAP.review_count.toString()
      },
      "knowsAbout": [
        "Newborn Photography",
        "Maternity Photography",
        "Family Portraits",
        "Cake Smash Photography",
        "Infant Soothing & Posing",
        "Studio Styling & Props"
      ]
    };

    // FAQ Schema if applicable
    let faqSchema: any = null;
    const pageKeyMap: Record<string, string> = {
      '/services/newborn-photography': 'newborn',
      '/services/maternity-photography': 'maternity',
      '/services/family-photography': 'family',
      '/services/cake-smash-photography': 'cake_smash',
      '/about': 'about'
    };

    const key = pageKeyMap[currentPath];
    if (key && SITE_PAGES[key]?.faq_block?.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": SITE_PAGES[key].faq_block.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    const schemasToInject = [localBusinessSchema];
    if (faqSchema) schemasToInject.push(faqSchema);

    let scriptEl = document.getElementById('json-ld-client') as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-client';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemasToInject);

  }, [currentPath, metaTitle, metaDescription]);

  return null;
};
