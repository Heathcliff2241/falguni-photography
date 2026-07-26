'use client';

import React from 'react';
import { CalendarCheck } from '@phosphor-icons/react';
import { useBooking } from '../../context/BookingContext';

interface BookSessionButtonProps {
  service?: string;
  label?: string;
  className?: string;
}

export const BookSessionButton: React.FC<BookSessionButtonProps> = ({
  service = 'newborn',
  label = 'Book Your Session ($250+)',
  className = ''
}) => {
  const { openBookingModal } = useBooking();

  return (
    <button
      onClick={() => openBookingModal(service)}
      className={`bg-[#A7B596] hover:bg-[#95a384] text-[#423341] font-semibold text-base px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      <CalendarCheck size={20} />
      {label}
    </button>
  );
};
