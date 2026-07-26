import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingScreen } from './LoadingScreen';
import { PoppyChatWidget } from './PoppyChatWidget';
import { BookingModal } from './BookingModal';
import { SEOHead } from './SEOHead';

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
  jsonLdData,
  children
}) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState('newborn');

  const handleOpenBooking = (serviceRequested?: string) => {
    if (serviceRequested) {
      setBookingService(serviceRequested);
    }
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EF] text-[#423341] font-body selection:bg-[#EFD4CE] selection:text-[#423341]">
      <SEOHead
        currentPath={currentPath}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
      />

      <LoadingScreen />

      {/* SEO Title & Meta tags injection for client hydration */}
      <Header currentPath={currentPath} onOpenBooking={handleOpenBooking} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <PoppyChatWidget onOpenBooking={handleOpenBooking} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={bookingService}
      />
    </div>
  );
};
