
import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

const heroBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/premium_luxury_car_hero_v3_1765910239466-Picsart-AiImageEnhancer%20(1).jpg";

interface HeroProps {
  onRequestCallback?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestCallback }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative h-screen min-h-[600px] max-h-[1080px] w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
            src={heroBg}
            alt="Premium Car Rental Minsk" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/20" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-12 w-full pt-12">
        <div className="max-w-3xl">
          
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="h-px w-8 bg-gold-400"></div>
            <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.3em]">{t('hero.location')}</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.title')} <br />
            <span className="text-white font-light italic">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-md font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/fleet"
              className="group relative px-8 py-4 bg-white/85 backdrop-blur-sm text-black font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-gold-400 hover:backdrop-blur-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {t('hero.chooseBtn')} <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <button 
              onClick={() => navigate('/fleet?filter=today')}
              className="group relative px-8 py-4 bg-gold-500/10 backdrop-blur-sm border border-gold-400/30 text-gold-400 font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-gold-500 hover:text-black"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                 <Zap size={14} fill="currentColor" />
                 {t('hero.availableToday')}
               </span>
            </button>
            
            <button 
              onClick={onRequestCallback}
              className="group px-8 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>{t('hero.contactBtn')}</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 z-20 hidden md:flex flex-col items-center gap-6 pb-12 pr-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 -rotate-90 origin-center whitespace-nowrap mb-8">Scroll Down</span>
        <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </div>
    </div>
  );
};
