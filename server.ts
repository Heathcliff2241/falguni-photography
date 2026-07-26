import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { processPoppyChat } from './server/poppyAgent';
import { saveLead, getAllLeads } from './server/db';
import { sendLeadNotificationEmail } from './server/email';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await processPoppyChat(message, history || []);
    res.json(result);
  });

  app.post('/api/booking', async (req, res) => {
    try {
      const { fullName, phone, email, serviceRequested, preferredDate, babyDueDateOrBirthDate, notes, source } = req.body;

      if (!fullName || !phone || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const lead = saveLead({
        fullName,
        phone,
        email,
        serviceRequested: serviceRequested || 'newborn',
        preferredDate,
        babyDueDateOrBirthDate,
        notes,
        source: source || 'direct_form'
      });

      await sendLeadNotificationEmail(lead);

      res.json({
        status: 'ok',
        message: "Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours. If your dates are flexible, mention that and she'll do her best to work around them.",
        leadId: lead.id
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      res.status(500).json({ error: 'Failed to process booking' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const { fullName, phone, email, serviceRequested, notes } = req.body;

      if (!fullName || !phone || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const lead = saveLead({
        fullName,
        phone,
        email,
        serviceRequested: serviceRequested || 'general',
        notes,
        source: 'contact_page'
      });

      await sendLeadNotificationEmail(lead);

      res.json({
        status: 'ok',
        message: "Got it, thank you! I've passed your details along to Falguni. She'll confirm your session by phone or email within 24 hours.",
        leadId: lead.id
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      res.status(500).json({ error: 'Failed to submit contact message' });
    }
  });

  app.get('/api/leads', (req, res) => {
    const leads = getAllLeads();
    res.json({ leads });
  });

  // SEO Robots.txt Endpoint
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Specialized AI Crawler Access
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`);
  });

  // SEO Sitemap.xml Endpoint
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const urls = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/services', priority: '0.9', changefreq: 'monthly' },
      { loc: '/services/newborn-photography', priority: '0.9', changefreq: 'monthly' },
      { loc: '/services/maternity-photography', priority: '0.9', changefreq: 'monthly' },
      { loc: '/services/family-photography', priority: '0.8', changefreq: 'monthly' },
      { loc: '/services/cake-smash-photography', priority: '0.8', changefreq: 'monthly' },
      { loc: '/gallery', priority: '0.8', changefreq: 'weekly' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.9', changefreq: 'monthly' }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  // Page SSR / HTML Template Renderer
  const pageMeta: Record<string, { title: string; desc: string }> = {
    '/': {
      title: "Newborn & Maternity Photographer Northfield | Falguni's",
      desc: "Gentle, unhurried newborn, maternity, and family photography in Northfield, Adelaide. 56 five-star reviews. Sessions from $250. Book online today."
    },
    '/services': {
      title: "Photography Services in Northfield | Falguni's Photography",
      desc: "Newborn, maternity, family, and cake smash photography in Northfield, Adelaide. Sessions from $250, styling and props included. See all sessions."
    },
    '/services/newborn-photography': {
      title: "Newborn Photography Northfield, Adelaide | Falguni's",
      desc: "Gentle newborn photography in Northfield, Adelaide. Sessions booked for the first 5-14 days. Wraps and props included, from $250. Book while pregnant."
    },
    '/services/maternity-photography': {
      title: "Maternity Photography Northfield, Adelaide | Falguni's",
      desc: "Maternity photography in Northfield, Adelaide. Best booked 28-34 weeks. Gowns and backdrops included, sessions from $250. Partners welcome."
    },
    '/services/family-photography': {
      title: "Family Photography Northfield, Adelaide | Falguni's",
      desc: "Relaxed family photography in Northfield, Adelaide. 45-60 minute sessions from $250, works with kids of all ages. Book your family session today."
    },
    '/services/cake-smash-photography': {
      title: "Cake Smash Photography Northfield, Adelaide | Falguni's",
      desc: "Cake smash and first birthday photography in Northfield, Adelaide. Themed backdrops, cleanup included, sessions from $250. Book your date now."
    },
    '/gallery': {
      title: "Photography Gallery Northfield, Adelaide | Falguni's",
      desc: "Browse real newborn, maternity, and family photography sessions from Falguni's Photography in Northfield, Adelaide. See the style before you book."
    },
    '/about': {
      title: "About Falguni's Photography | Northfield, Adelaide",
      desc: "Meet the husband-and-wife team behind Falguni's Photography in Northfield, Adelaide. 3+ years, 56 five-star reviews, newborn and maternity specialists."
    },
    '/contact': {
      title: "Contact Falguni's Photography | Northfield, Adelaide",
      desc: "Contact Falguni's Photography at 26 South Pkwy, Northfield SA 5085. Call +61 469 753 238 or chat online to book your newborn or maternity session."
    },
    '/admin/leads': {
      title: "Studio Admin Dashboard | Falguni's Photography",
      desc: "Admin view for saved lead bookings and Poppy conversation transcripts."
    }
  };

  const getStructuredData = (url: string, baseUrl: string) => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["Photographer", "LocalBusiness"],
      "@id": `${baseUrl}/#studio`,
      "name": "Falguni's Photography",
      "legalName": "Falguni's Photography Studio",
      "url": baseUrl,
      "telephone": "+61 469 753 238",
      "priceRange": "$250 - $800",
      "currenciesAccepted": "AUD",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer, Afterpay",
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
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "56"
      },
      "areaServed": [
        { "@type": "City", "name": "Northfield" },
        { "@type": "City", "name": "Lightsview" },
        { "@type": "City", "name": "Klemzig" },
        { "@type": "City", "name": "Walkerville" },
        { "@type": "City", "name": "Mawson Lakes" },
        { "@type": "City", "name": "Prospect" },
        { "@type": "City", "name": "Oakden" },
        { "@type": "City", "name": "Adelaide" }
      ],
      "knowsAbout": [
        "Newborn Photography",
        "Maternity Photography",
        "Family Portraits",
        "Cake Smash Photography",
        "Baby Props & Wardrobe",
        "Infant Soothing"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Studio Photography Sessions",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Newborn Photography Session",
              "description": "2-3 hour gentle newborn shoot with full props, wraps, and parent poses."
            },
            "price": "250.00",
            "priceCurrency": "AUD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Maternity Photography Session",
              "description": "Studio maternity session with gown wardrobe and partner inclusion."
            },
            "price": "250.00",
            "priceCurrency": "AUD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Family Photography Session",
              "description": "45-60 minute relaxed family portrait session in studio."
            },
            "price": "250.00",
            "priceCurrency": "AUD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Cake Smash First Birthday Session",
              "description": "First birthday portrait, cake smash, and full cleanup included."
            },
            "price": "250.00",
            "priceCurrency": "AUD"
          }
        ]
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${baseUrl}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": `${baseUrl}/services`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": url.replace('/services/', '').replace(/-/g, ' '),
          "item": `${baseUrl}${url}`
        }
      ]
    };

    const schemas: any[] = [localBusinessSchema];
    if (url.startsWith('/services/')) {
      schemas.push(breadcrumbSchema);
    }

    return schemas;
  };

  // Vite Development Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(async (req, res, next) => {
      // Exclude API routes
      if (req.url.startsWith('/api')) {
        return next();
      }

      try {
        const url = req.url.split('?')[0];
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const meta = pageMeta[url] || pageMeta['/'];
        const schemas = getStructuredData(url, baseUrl);

        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);

        // Inject page-specific title, meta description, Google Fonts, and JSON-LD schema
        const headHtml = `
          <title>${meta.title}</title>
          <meta name="description" content="${meta.desc}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="canonical" href="${baseUrl}${url}" />
          <meta property="og:title" content="${meta.title}" />
          <meta property="og:description" content="${meta.desc}" />
          <meta property="og:url" content="${baseUrl}${url}" />
          ${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
        `;

        template = template.replace(/<title>.*?<\/title>/i, headHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      const url = req.url.split('?')[0];
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const meta = pageMeta[url] || pageMeta['/'];
      const schemas = getStructuredData(url, baseUrl);

      let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      const headHtml = `
        <title>${meta.title}</title>
        <meta name="description" content="${meta.desc}" />
        <link rel="canonical" href="${baseUrl}${url}" />
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.desc}" />
        <meta property="og:url" content="${baseUrl}${url}" />
        ${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
      `;

      html = html.replace(/<title>.*?<\/title>/i, headHtml);
      res.status(200).send(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Running Falguni's Photography studio backend on http://0.0.0.0:${PORT}`);
  });
}

startServer();
