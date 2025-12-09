
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      {/* Icon Container */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            <linearGradient id="gold-gradient-logo" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E5C575" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8F6F30" />
            </linearGradient>
          </defs>

          {/* Minimalist Shield/Lion Abstraction */}
          <path 
            d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z" 
            stroke="url(#gold-gradient-logo)" 
            strokeWidth="1.5"
            fill="none"
          />
          <path 
            d="M12 6V18M7 11H17" 
            stroke="url(#gold-gradient-logo)" 
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <span className="text-2xl font-serif font-bold tracking-widest text-white leading-none">
            LÉON
          </span>
        </div>
      )}
    </div>
  );
};
