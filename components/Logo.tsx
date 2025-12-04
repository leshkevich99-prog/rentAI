
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Container */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full" />
        
        {/* Geometric Lion Icon */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gold-400 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
        >
          <path 
            d="M5.5 4C5.5 4 4 6 4 9C4 13 6 16 9 17L12 21L15 17C18 16 20 13 20 9C20 6 18.5 4 18.5 4" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="opacity-50"
          />
          <path 
            d="M12 21V9M12 9L9 6M12 9L15 6" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M12 4C10 4 9 5.5 9 7C9 8.5 12 11 12 11C12 11 15 8.5 15 7C15 5.5 14 4 12 4Z" 
            fill="currentColor"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <span className="text-2xl font-serif font-bold tracking-widest text-white leading-none flex items-center gap-1">
            LÉ<span className="text-transparent bg-clip-text bg-gradient-to-br from-gold-300 to-gold-600">ON</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold ml-0.5">
            Premium Rental
          </span>
        </div>
      )}
    </div>
  );
};
