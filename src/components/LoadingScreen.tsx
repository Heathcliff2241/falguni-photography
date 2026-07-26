import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check session storage so it only plays once per session or on reload
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 300);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FBF6EF] transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Animated Botanical Line Art Drawing */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28 text-[#A7B596]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M50 20 C40 10, 25 15, 25 30 C25 45, 45 55, 50 75 C55 55, 75 45, 75 30 C75 15, 60 10, 50 20 Z"
            className="animate-draw-path"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: 'drawPath 1.2s ease-in-out forwards'
            }}
          />
          <path
            d="M50 32 C45 28, 40 35, 48 42 C52 42, 58 35, 50 32 Z"
            stroke="#EFD4CE"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation: 'drawPath 1.2s ease-in-out 0.2s forwards'
            }}
          />
          <path
            d="M50 75 L50 90 M50 82 C42 80, 35 84, 32 88 M50 85 C58 83, 65 87, 68 91"
            stroke="#A7B596"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation: 'drawPath 1.2s ease-in-out 0.4s forwards'
            }}
          />
        </svg>
      </div>
      <p className="font-display text-lg text-[#423341] tracking-wide mt-2 animate-pulse">
        Falguni's Photography
      </p>
      <span className="font-body text-xs text-[#423341]/60 tracking-wider uppercase mt-1">
        Northfield, Adelaide
      </span>

      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
