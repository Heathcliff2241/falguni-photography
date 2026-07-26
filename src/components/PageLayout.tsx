import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingScreen } from './LoadingScreen';
import { PoppyChatWidget } from './PoppyChatWidget';
import { SEOHead } from './SEOHead';
import { useBooking } from '../context/BookingContext';

interface PageLayoutProps {
  currentPath: string;
  metaTitle: string;
  metaDescription: string;
  jsonLdData?: object[];
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  currentPath,
  metaTitle,
  metaDescription,
  children
}) => {
  const { openBooking } = useBooking();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EF] text-[#423341] font-body selection:bg-[#EFD4CE] selection:text-[#423341]">
      <SEOHead
        currentPath={currentPath}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
      />

      <LoadingScreen />

      <Header currentPath={currentPath} onOpenBooking={openBooking} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <PoppyChatWidget onOpenBooking={openBooking} />
    </div>
  );
};
