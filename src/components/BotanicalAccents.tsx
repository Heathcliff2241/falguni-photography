import React from 'react';

interface BotanicalRoseProps {
  className?: string;
  color?: 'sage' | 'blush' | 'lavender';
  size?: number;
}

export const BotanicalRose: React.FC<BotanicalRoseProps> = ({
  className = '',
  color = 'sage',
  size = 48
}) => {
  const strokeColor = color === 'sage' ? '#A7B596' : color === 'blush' ? '#EFD4CE' : '#D2C6E3';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block transition-transform duration-700 ease-out hover:scale-110 ${className}`}
    >
      {/* Rose Bloom contour */}
      <path d="M32 16C28 12 22 14 20 18C18 22 20 28 24 30C22 34 26 40 32 40C38 40 42 34 40 30C44 28 46 22 44 18C42 14 36 12 32 16Z" />
      <path d="M32 16C32 22 28 25 24 25" />
      <path d="M32 20C34 22 36 26 34 30" />
      <path d="M28 28C30 30 32 30 35 28" />
      {/* Stem & Leaves */}
      <path d="M32 40V56" />
      <path d="M32 46C26 44 20 46 16 50C22 52 28 50 32 46Z" fill={strokeColor} fillOpacity="0.1" />
      <path d="M32 48C38 46 44 48 48 52C42 54 36 52 32 48Z" fill={strokeColor} fillOpacity="0.1" />
    </svg>
  );
};

export const BotanicalVineDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-4 py-6 ${className}`}>
      <svg width="120" height="20" viewBox="0 0 120 20" fill="none" stroke="#A7B596" strokeWidth="1.2">
        <path d="M0 10 Q 30 2, 60 10 T 120 10" strokeLinecap="round" />
        <path d="M25 6 Q 20 0, 15 5" fill="#A7B596" fillOpacity="0.2" />
        <path d="M45 12 Q 50 18, 55 13" fill="#A7B596" fillOpacity="0.2" />
        <path d="M75 6 Q 70 0, 65 5" fill="#A7B596" fillOpacity="0.2" />
        <path d="M95 12 Q 100 18, 105 13" fill="#A7B596" fillOpacity="0.2" />
      </svg>
      <BotanicalRose color="blush" size={28} />
      <svg width="120" height="20" viewBox="0 0 120 20" fill="none" stroke="#A7B596" strokeWidth="1.2">
        <path d="M0 10 Q 30 18, 60 10 T 120 10" strokeLinecap="round" />
        <path d="M25 14 Q 20 20, 15 15" fill="#A7B596" fillOpacity="0.2" />
        <path d="M45 8 Q 50 2, 55 7" fill="#A7B596" fillOpacity="0.2" />
        <path d="M75 14 Q 70 20, 65 15" fill="#A7B596" fillOpacity="0.2" />
        <path d="M95 8 Q 100 2, 105 7" fill="#A7B596" fillOpacity="0.2" />
      </svg>
    </div>
  );
};
