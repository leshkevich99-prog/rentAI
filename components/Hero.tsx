
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/premium_luxury_car_hero_v3_1765910239466.png";

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] max-h-[1080px] w-full overflow-hidden flex items-center">
      {/* Background with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <img 
            src={heroBg}
            alt="Premium Car Rental Minsk" 
            className="w-full h-full object-cover"
        />
        {/* Complex gradient for better text readability and mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/20" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-12 w-full pt-12">
        <div className="max-w-3xl">
          
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="h-px w-8 bg-gold-400"></div>
            <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.3em]">Minsk Premium Rental</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Beyond <br />
            <span className="text-gray-500 font-light italic">Luxury.</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-md font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             Исключительная коллекция автомобилей для тех, кто ценит комфорт, статус и безупречный стиль.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/fleet"
              className="group relative px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-gold-400"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Выбрать Авто <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            <a 
              href="https://wa.me/375257422222"
              target="_blank"
              rel="noreferrer"
              className="group px-8 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Связаться</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - Right aligned vertical */}
      <div className="absolute bottom-0 right-0 z-20 hidden md:flex flex-col items-center gap-6 pb-12 pr-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 -rotate-90 origin-center whitespace-nowrap mb-8">Scroll Down</span>
        <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </div>
    </div>
  );
};
