
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/mainback.png";

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950 select-none">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
            src={heroBg}
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite] opacity-60 grayscale-[0.2]"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/20 to-transparent z-10" />
      </div>

      <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pt-20">
        <div className="max-w-4xl">
          <div className="overflow-hidden mb-6">
            <h2 className="text-gold-400 uppercase tracking-super-wide text-xs font-semibold animate-fade-in-up">
              Premium Car Rental
            </h2>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Drive <br />
            <span className="italic font-light text-gray-400">The Exceptional</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base mb-12 max-w-lg font-light leading-relaxed tracking-wide animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Исключительная коллекция автомобилей для тех, кто ценит эстетику движения. LÉON предлагает не просто аренду, а новый уровень свободы.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link 
              to="/fleet"
              className="group relative px-10 py-4 bg-white text-black font-semibold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-gold-400"
            >
              <span className="relative z-10 flex items-center gap-2">
                Выбрать Авто <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link 
              to="/services"
              className="px-10 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all"
            >
              Услуги
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
        <div className="w-12 h-px bg-gray-700"></div>
      </div>
    </div>
  );
};
