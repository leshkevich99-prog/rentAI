
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Container */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Back Glow */}
        <div className="absolute inset-0 bg-gold-500/10 blur-xl rounded-full" />
        
        {/* Heraldic Shield Lion Icon */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="gold-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E3C588" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8F6F30" />
            </linearGradient>
            <linearGradient id="shield-fill" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Shield Outline */}
          <path 
            d="M12 2L4 5.5V11.5C4 16.8 7.6 21.6 12 23C16.4 21.6 20 16.8 20 11.5V5.5L12 2Z" 
            stroke="url(#gold-gradient)" 
            strokeWidth="1.2" 
            fill="url(#shield-fill)"
          />

          {/* Abstract Lion Face inside Shield */}
          <g transform="translate(0, 1)">
             {/* Brow / Eyes */}
             <path 
                d="M8 9.5C8 9.5 9.5 11 12 11C14.5 11 16 9.5 16 9.5" 
                stroke="url(#gold-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
             />
             {/* Nose Bridge */}
             <path 
                d="M12 11V14.5" 
                stroke="url(#gold-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round"
             />
             {/* Nose Tip / Mouth */}
             <path 
                d="M10.5 16L12 14.5L13.5 16" 
                stroke="url(#gold-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
             />
             {/* Crown / Mane Top */}
             <path 
                d="M12 5.5L13.5 7.5H10.5L12 5.5Z" 
                fill="url(#gold-gradient)" 
             />
          </g>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <span className="text-2xl font-serif font-bold tracking-widest text-white leading-none flex items-center">
            LÉON
          </span>
          <span className="text-[8px] uppercase tracking-[0.35em] text-gray-500 font-bold ml-0.5 mt-1 border-t border-gray-800 pt-0.5 inline-block">
            Premium
          </span>
        </div>
      )}
    </div>
  );
};