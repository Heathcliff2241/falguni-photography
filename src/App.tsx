import React, { useState, useEffect } from 'react';
import { PageLayout } from './components/PageLayout';
import { SITE_PAGES } from './data/siteData';
import { HomeView } from './views/HomeView';
import { ServicesOverviewView } from './views/ServicesOverviewView';
import { NewbornView } from './views/NewbornView';
import { MaternityView } from './views/MaternityView';
import { FamilyView } from './views/FamilyView';
import { CakeSmashView } from './views/CakeSmashView';
import { GalleryView } from './views/GalleryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminLeadsView } from './views/AdminLeadsView';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');

  useEffect(() => {
    // Initial path load
    setCurrentPath(window.location.pathname || '/');

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);

    // Intercept internal link clicks for single page navigation smoothness
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.origin === window.location.origin && !anchor.hasAttribute('download') && anchor.getAttribute('target') !== '_blank') {
        const path = anchor.pathname;
        if (path && path !== window.location.pathname) {
          e.preventDefault();
          window.history.pushState({}, '', path);
          setCurrentPath(path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Determine current page data and view
  let view = <HomeView onOpenBooking={() => {}} />;
  let metaTitle = SITE_PAGES.home.meta_title;
  let metaDescription = SITE_PAGES.home.meta_description;

  switch (currentPath) {
    case '/':
      view = <HomeView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.home.meta_title;
      metaDescription = SITE_PAGES.home.meta_description;
      break;
    case '/services':
      view = <ServicesOverviewView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.services.meta_title;
      metaDescription = SITE_PAGES.services.meta_description;
      break;
    case '/services/newborn-photography':
      view = <NewbornView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.newborn.meta_title;
      metaDescription = SITE_PAGES.newborn.meta_description;
      break;
    case '/services/maternity-photography':
      view = <MaternityView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.maternity.meta_title;
      metaDescription = SITE_PAGES.maternity.meta_description;
      break;
    case '/services/family-photography':
      view = <FamilyView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.family.meta_title;
      metaDescription = SITE_PAGES.family.meta_description;
      break;
    case '/services/cake-smash-photography':
      view = <CakeSmashView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.cake_smash.meta_title;
      metaDescription = SITE_PAGES.cake_smash.meta_description;
      break;
    case '/gallery':
      view = <GalleryView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.gallery.meta_title;
      metaDescription = SITE_PAGES.gallery.meta_description;
      break;
    case '/about':
      view = <AboutView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.about.meta_title;
      metaDescription = SITE_PAGES.about.meta_description;
      break;
    case '/contact':
      view = <ContactView onOpenBooking={() => {}} />;
      metaTitle = SITE_PAGES.contact.meta_title;
      metaDescription = SITE_PAGES.contact.meta_description;
      break;
    case '/admin/leads':
      view = <AdminLeadsView />;
      metaTitle = "Studio Admin Leads | Falguni's Photography";
      metaDescription = "Lead capture log and Poppy conversation transcripts.";
      break;
    default:
      view = <HomeView onOpenBooking={() => {}} />;
      break;
  }

  return (
    <PageLayout
      currentPath={currentPath}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
    >
      {view}
    </PageLayout>
  );
}

export default App;
