
import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Более конкретное изображение (интерьер/экстерьер премиум авто), вместо абстракции
const heroBg = "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop";

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-dark-900">
        <img 
            src={heroBg}
            alt="Premium Car Rental Minsk" 
            className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-transparent to-dark-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center sm:text-left w-full pt-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
            <div className="flex text-gold-400">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
            </div>
            <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Premium Service in Minsk</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] text-balance animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Аренда Элитных <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
              Автомобилей
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl font-light leading-relaxed text-balance animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Lamborghini, Rolls-Royce, Ferrari в Минске. Подача 24/7. Работаем с физическими и юридическими лицами.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/fleet"
              className="group relative px-8 py-4 bg-gold-500 text-black font-bold text-sm uppercase tracking-widest overflow-hidden hover:bg-gold-400 transition-colors flex items-center justify-center gap-2 min-w-[200px]"
            >
              <span className="relative z-10">Выбрать Авто</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Direct Social Links for Foreigners */}
            <a 
              href="https://wa.me/375290000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              WhatsApp
            </a>
            <a 
              href="https://t.me/username"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block opacity-50">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold-400 to-transparent"></div>
      </div>
    </div>
  );
};
