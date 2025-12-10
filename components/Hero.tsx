
import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroBg = "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop";

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-dark-950">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
            src={heroBg}
            alt="Premium Car Rental Minsk" 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-transparent to-dark-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center sm:text-left w-full pt-20">
        <div className="max-w-4xl">
          
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="flex text-gold-400 gap-1">
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
            </div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.25em]">Premium Service in Minsk</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-white mb-8 leading-[0.95] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Drive <br />
            <span className="italic font-light text-gray-400">The Exceptional</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-lg font-light leading-relaxed tracking-wide animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             Аренда элитных автомобилей в Минске. Lamborghini, Rolls-Royce, Ferrari. Подача 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/fleet"
              className="group relative px-8 py-4 bg-white text-black font-semibold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-gold-400"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Выбрать Авто <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            
            <a 
              href="https://wa.me/375257422222"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all text-center"
            >
              WhatsApp
            </a>
            <a 
              href="https://t.me/username"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all text-center"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
        <div className="w-16 h-px bg-gray-700"></div>
      </div>
    </div>
  );
};
