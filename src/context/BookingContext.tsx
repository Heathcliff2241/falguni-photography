import React, { createContext, useContext, useState } from 'react';
import { BookingModal } from '../components/BookingModal';

interface BookingContextType {
  openBooking: (service?: string) => void;
  closeBooking: () => void;
  openBookingModal: (service?: string) => void;
  closeBookingModal: () => void;
  isBookingOpen: boolean;
  selectedService: string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('newborn');

  const openBooking = (service = 'newborn') => {
    setSelectedService(service);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ 
      openBooking, 
      closeBooking, 
      openBookingModal: openBooking, 
      closeBookingModal: closeBooking, 
      isBookingOpen: isOpen, 
      selectedService 
    }}>
      {children}
      <BookingModal />
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    // Graceful fallback so it never crashes even if called outside provider
    return {
      openBooking: () => {},
      closeBooking: () => {},
      openBookingModal: () => {},
      closeBookingModal: () => {},
      isBookingOpen: false,
      selectedService: 'newborn'
    };
  }
  return context;
};
