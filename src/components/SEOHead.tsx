import React, { useEffect } from 'react';
import { LOCAL_NAP, SITE_PAGES } from '../data/siteData';
import { CENTRAL_SEO_CONFIG } from '../data/seoConfig';

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
    // Lookup centralized route metadata or fallback to default configuration
    const routeConfig = CENTRAL_SEO_CONFIG.routeMetadata[currentPath];
    
    const title = metaTitle || routeConfig?.title || CENTRAL_SEO_CONFIG.defaultTitle;
    const description = metaDescription || routeConfig?.description || CENTRAL_SEO_CONFIG.defaultDescription;
    const keywordsList = routeConfig?.keywords || CENTRAL_SEO_CONFIG.globalKeywords;

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or update head meta tag
    const updateMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywordsList.join(', '));
    updateMeta('name', 'robots', 'index, follow');

    // Geo-Tagging Meta Tags for Local Discovery in Northfield & Greater Adelaide
    updateMeta('name', 'geo.region', CENTRAL_SEO_CONFIG.geo.region);
    updateMeta('name', 'geo.placename', CENTRAL_SEO_CONFIG.geo.placename);
    updateMeta('name', 'geo.position', CENTRAL_SEO_CONFIG.geo.position);
    updateMeta('name', 'ICBM', CENTRAL_SEO_CONFIG.geo.icbm);

    // OpenGraph Protocol Metadata
    const absoluteUrl = `${CENTRAL_SEO_CONFIG.siteUrl}${currentPath}`;
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', absoluteUrl);
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:site_name', CENTRAL_SEO_CONFIG.siteName);
    updateMeta('property', 'og:locale', 'en_AU');
    updateMeta('property', 'og:region', CENTRAL_SEO_CONFIG.geo.state);
    updateMeta('property', 'og:country-name', CENTRAL_SEO_CONFIG.geo.country);
    updateMeta('property', 'og:locality', CENTRAL_SEO_CONFIG.geo.locality);
    updateMeta('property', 'og:postal-code', CENTRAL_SEO_CONFIG.geo.postalCode);

    // Twitter Card Metadata
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);

    // 3. Update Canonical Link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteUrl);

    // 4. Schema.org JSON-LD Structured Data Injection for Local Business & Geo Discovery
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["Photographer", "LocalBusiness"],
      "@id": `${CENTRAL_SEO_CONFIG.siteUrl}/#studio`,
      "name": LOCAL_NAP.business_name,
      "description": description,
      "url": CENTRAL_SEO_CONFIG.siteUrl,
      "telephone": LOCAL_NAP.phone,
      "priceRange": "$250 - $800",
      "currenciesAccepted": "AUD",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CENTRAL_SEO_CONFIG.geo.streetAddress,
        "addressLocality": CENTRAL_SEO_CONFIG.geo.locality,
        "addressRegion": CENTRAL_SEO_CONFIG.geo.state,
        "postalCode": CENTRAL_SEO_CONFIG.geo.postalCode,
        "addressCountry": CENTRAL_SEO_CONFIG.geo.country
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
      "areaServed": CENTRAL_SEO_CONFIG.geo.serviceAreas,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": LOCAL_NAP.rating,
        "reviewCount": LOCAL_NAP.review_count.toString()
      },
      "knowsAbout": [
        "Newborn Photography Northfield",
        "Maternity Photography Adelaide",
        "Family Portraits Northfield",
        "Cake Smash Photography Adelaide",
        "Infant Soothing & Posing",
        "Studio Styling & Props"
      ]
    };

    // Dynamic FAQ Schema Injection
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
