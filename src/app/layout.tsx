import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { PoppyChatWidget } from '../components/PoppyChatWidget';
import { BookingProvider } from '../context/BookingContext';

export const metadata: Metadata = {
  title: "Falguni's Photography | Newborn & Maternity Photographer Northfield Adelaide",
  description: "Gentle, unhurried newborn, maternity, family, and cake smash photography in Northfield, Adelaide. 56 five-star Google reviews. Sessions from $250.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#FBF6EF] text-[#423341] min-h-screen flex flex-col antialiased selection:bg-[#EFD4CE] selection:text-[#423341]">
        <BookingProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BookingModal />
          <PoppyChatWidget />
        </BookingProvider>
      </body>
    </html>
  );
}
