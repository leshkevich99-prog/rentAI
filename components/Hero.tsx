import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroBgSvg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gradHero" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#050505;stop-opacity:1" />
    </radialGradient>
    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#222" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradHero)" />
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
  <circle cx="960" cy="540" r="300" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.05" />
  <circle cx="960" cy="540" r="400" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.03" />
  <circle cx="960" cy="540" r="500" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.02" />
</svg>
`;

const heroBg = `data:image/svg+xml;base64,${btoa(heroBgSvg)}`;

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-dark-900">
        <img 
            src={heroBg}
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center sm:text-left w-full">
        <div className="max-w-3xl">
          <h2 className="text-gold-400 uppercase tracking-[0.2em] mb-4 text-sm font-bold animate-fade-in-up">
            Искусство Движения
          </h2>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Ощутите <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Совершенство
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl font-light leading-relaxed">
            Эксклюзивная коллекция автомобилей премиум-класса для тех, кто не привык к компромиссам.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/fleet"
              className="group relative px-8 py-4 bg-gold-500 text-black font-bold text-sm uppercase tracking-widest overflow-hidden hover:bg-gold-400 transition-colors flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Выбрать Авто</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/terms"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Условия Аренды
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold-400 to-transparent"></div>
      </div>
    </div>
  );
};