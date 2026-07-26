import React from 'react';

interface MaskingTapeProps {
  className?: string;
  variant?: 'cream' | 'sage' | 'blush' | 'kraft';
  rotation?: string;
  width?: string;
}

export const MaskingTape: React.FC<MaskingTapeProps> = ({
  className = '',
  variant = 'cream',
  rotation = '-rotate-1',
  width = 'w-24'
}) => {
  // Natural torn edges clip-path for realistic masking tape ends
  const tornClipPath = "polygon(0% 15%, 2% 0%, 98% 3%, 100% 18%, 97% 38%, 100% 58%, 98% 82%, 100% 100%, 97% 96%, 2% 98%, 0% 85%, 2% 62%, 0% 40%, 3% 22%)";

  const getVariantBg = () => {
    switch (variant) {
      case 'sage':
        return '#C2CDB6';
      case 'blush':
        return '#F2DED9';
      case 'kraft':
        return '#D4C5B0';
      case 'cream':
      default:
        return '#E6DFCE';
    }
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 -top-3.5 ${width} h-7 z-20 pointer-events-none select-none ${rotation} ${className}`}
      style={{
        filter: 'drop-shadow(0px 2px 4px rgba(66, 51, 65, 0.18))'
      }}
    >
      <div
        className="w-full h-full relative overflow-hidden opacity-90 backdrop-blur-[1px] transition-all"
        style={{
          clipPath: tornClipPath,
          backgroundColor: getVariantBg()
        }}
      >
        {/* SVG Paper Grain / Fiber Noise Texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="maskingTapeTexture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#maskingTapeTexture)" />
        </svg>

        {/* Diagonal Micro Fibers & Adhesive Creases */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(
              125deg,
              rgba(255, 255, 255, 0.8) 0px,
              rgba(255, 255, 255, 0.8) 1px,
              transparent 1px,
              transparent 3px,
              rgba(66, 51, 65, 0.12) 3px,
              rgba(66, 51, 65, 0.12) 4px
            )`
          }}
        />

        {/* Translucent Wrinkles and Paper Edge Highlights */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/60" />
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-black/15" />
        <div className="absolute left-1/5 top-0 bottom-0 w-[1px] bg-white/50 blur-[0.5px]" />
        <div className="absolute right-1/4 top-0 bottom-0 w-[1px] bg-black/10 blur-[0.5px]" />
        <div className="absolute left-2/3 top-0 bottom-0 w-[1.5px] bg-white/30 blur-[0.5px]" />
      </div>
    </div>
  );
};
