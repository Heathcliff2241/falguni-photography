import React from 'react';

interface TapeStripProps {
  className?: string;
  variant?: 'classic' | 'sage' | 'blush';
}

export const TapeStrip: React.FC<TapeStripProps> = ({ className = '', variant = 'classic' }) => {
  // High detail textured semi-translucent masking tape
  let bgColors = 'bg-[#EDE3D3]/90 border-[#D8C9B5]/80';
  if (variant === 'sage') {
    bgColors = 'bg-[#E1E7D8]/90 border-[#C7D3BB]/80';
  } else if (variant === 'blush') {
    bgColors = 'bg-[#F2E4DE]/90 border-[#E3CEC4]/80';
  }

  return (
    <div
      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 z-20 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] ${className}`}
      style={{
        // Realistic torn ripped tape edge clip-path
        clipPath:
          'polygon(0% 15%, 2% 0%, 98% 3%, 100% 18%, 97% 38%, 100% 58%, 97% 78%, 100% 96%, 98% 100%, 2% 97%, 0% 82%, 2% 62%, 0% 42%, 2% 22%)',
      }}
    >
      {/* Tape Body with paper texture pattern */}
      <div
        className={`w-full h-full ${bgColors} border-t border-b relative overflow-hidden backdrop-blur-[0.5px]`}
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.35) 0px, rgba(255, 255, 255, 0.35) 2px, transparent 2px, transparent 5px),
            repeating-linear-gradient(-45deg, rgba(140, 120, 100, 0.12) 0px, rgba(140, 120, 100, 0.12) 1px, transparent 1px, transparent 4px),
            linear-gradient(to bottom, rgba(255,255,255,0.4), transparent 40%, rgba(0,0,0,0.08))
          `,
        }}
      >
        {/* Subtle fibrous crease & translucency effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-60" />
      </div>
    </div>
  );
};
