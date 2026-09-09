# Onpage SEO & Page Titles Overhaul

## Goal
Improve onpage SEO, search rankings, click-through rates (CTR), and page titles across Falguni's Photography website. Establish a single source of truth for all SEO metadata across both SSR/server-injected HTML and client SPA navigation, enforce strict semantic heading hierarchies, optimize LCP image loading, inject enriched Schema.org JSON-LD structured data (LocalBusiness, Service, BreadcrumbList, FAQPage), and remove legacy copy.

---

## 1. Page Title & Meta Description Optimization

Each title is tailored for high click-through rates, optimal character length (50–60 chars), local SEO geo-modifiers (*Northfield, Adelaide SA 5085*), and core differentiators (*Gentle, Unhurried, Certified Safety*).

| Page / Route | Optimized Title | Meta Description Target (150–160 chars) |
|---|---|---|
| **Home (`/`)** | `Newborn & Maternity Photographer Northfield SA \| Falguni's` | Gentle, unhurried newborn, maternity & family photography in Northfield, Adelaide SA. 56 5-star reviews. Heated 26°C sanctuary & full wardrobe. Book online. |
| **Services (`/services`)** | `Boutique Photography Services Northfield SA \| Falguni's` | Explore boutique newborn, maternity, family & cake smash photography in Northfield, Adelaide. Certified infant handling safety & fine-art studio lighting. |
| **Newborn (`/services/newborn-photography`)** | `Newborn Photographer Northfield Adelaide \| Gentle Sessions` | Specialist newborn photography in Northfield, Adelaide. Certified gentle infant handling, warm 26°C sanctuary & all props included. Book during pregnancy. |
| **Maternity (`/services/maternity-photography`)** | `Maternity Photographer Adelaide \| Studio Bump Shoots Northfield` | Fine-art maternity photography in Northfield, Adelaide. Sculptural studio lighting, luxury couture gowns & gentle guided posing. Partners & siblings welcome. |
| **Family (`/services/family-photography`)** | `Family Photographer Northfield Adelaide \| Relaxed Sessions` | Relaxed, joyful family portraits in Northfield & Adelaide. Paced around your children with natural posing & no forced smiles. Reserve your family session. |
| **Cake Smash (`/services/cake-smash-photography`)** | `Cake Smash Photography Adelaide \| 1st Birthday Studio Sessions` | Fun, mess-free 1st birthday cake smash photos in Northfield, Adelaide. Includes custom set, smash cake, portrait photos & warm splash bath. Zero cleanup. |
| **Gallery (`/gallery`)** | `Photo Gallery & Portfolio \| Falguni's Photography Northfield` | Browse our portfolio of real Adelaide newborns, maternity portraits, family moments & first birthday cake smashes captured in our boutique Northfield studio. |
| **About (`/about`)** | `About Falguni \| Certified Adelaide Newborn & Portrait Specialist` | Meet Falguni, the patient photographer behind Northfield's beloved studio. 3+ years experience, certified infant safety & 56 five-star Google reviews. |
| **Contact (`/contact`)** | `Book a Session \| Contact Falguni's Photography Northfield SA` | Reserve your session with Falguni's Photography at 26 South Pkwy, Northfield SA 5085. Call +61 469 753 238 or submit an online booking inquiry today. |
| **Admin (`/admin/leads`)** | `Studio Admin Dashboard \| Falguni's Photography` | Internal studio dashboard for lead management. *(Robots: `noindex, nofollow`)* |

---

## 2. Architecture & Technical SEO Improvements

### A. Single Source of Truth
Currently, titles and descriptions exist in 3 out-of-sync places: `server.ts`, `src/data/siteData.ts`, and `src/data/seoConfig.ts`.
- Centralize all route metadata into [`src/data/seoConfig.ts`](file:///home/cesar/Desktop/Programming%20Work/falguni-photography/src/data/seoConfig.ts).
- Have `src/data/siteData.ts`, `SEOHead.tsx`, `App.tsx`, and `server.ts` read from this centralized configuration.

### B. Eliminate Duplicate `<meta>` tags on SSR / initial HTML
- In `server.ts`, replace the full `<title>`, `<meta name="description">`, and OpenGraph block rather than appending a title and leaving original meta tags intact.

### C. Technical Robots & Indexing
- Ensure `/admin/*` and `/api/*` are `noindex, nofollow` and disallowed in `robots.txt`.
- Set `robots` meta to `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` on all public pages.
- Ensure canonical URL tags (`<link rel="canonical">`) dynamically point to the absolute URL on every route.

### D. Enriched Structured Data (Schema.org)
- **LocalBusiness & Photographer Schema**: Complete NAP, coordinates, service areas, 56 5-star aggregate rating, price range (`$$`), currencies (`AUD`), and opening hours.
- **Service Schema**: Dedicated `@type: "Service"` for each service route with `provider`, `areaServed`, `serviceType`, and `description`.
- **BreadcrumbList Schema**: Proper position, name, and URL list on all subpages.
- **FAQPage Schema**: Automatically generated from the verified FAQ block on service & about pages.

---

## 3. On-Page HTML & Semantic Structure

### A. Heading Hierarchy (`h1` → `h2` → `h3`)
- Fix skipped heading levels in `NewbornView.tsx`, `MaternityView.tsx`, `FamilyView.tsx`, and `CakeSmashView.tsx`: change "The Falguni Quality Standard & Inclusions" from `<h3>` to `<h2>`.
- In `ServicesOverviewView.tsx`: wrap the 4 quality pillars under an `<h2>` ("Our Standards & Expertise") so `<h3>` elements have a semantic parent.

### B. Image Performance & Accessibility (Core Web Vitals)
- **Hero Image (LCP)**: Add `fetchpriority="high"`, `loading="eager"`, and `decoding="async"` to the hero image on all pages.
- **Gallery & Below-the-fold Images**: Add `loading="lazy"` and `decoding="async"`.
- **Services Overview Cards**: Fix image references so Family and Cake Smash cards display their actual corresponding imagery (`familyBlue` and `cakeSmash`) instead of duplicating `maternityPurple`.

### C. Outdated Copy Clean-up
- Replace all remaining references to "Poppy" in user-facing copy (e.g., CTA sections in `siteData.ts`, `ContactView.tsx`, `App.tsx`) with "Aria, our AI receptionist".

---

## Verification Plan

### Automated Checks
1. `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
2. `npm run build` to verify production bundling.

### Functional & SEO Verification
1. Fetch and inspect `http://localhost:3000/` and subpages via `curl` to verify:
   - Exactly one `<title>` and `<meta name="description">` per page
   - Correct canonical URL
   - Correct OpenGraph tags (`og:title`, `og:description`, `og:url`, `og:image`)
   - Schema.org JSON-LD scripts (`LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`)
2. Verify `/admin/leads` has `noindex, nofollow`.
3. Verify `/robots.txt` and `/sitemap.xml` response headers and syntax.
