
import React from 'react';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  const { language, t } = useTranslation();
  const carName = language === 'en' && car.name_en ? car.name_en : car.name;

  return (
    <div className="group flex flex-col w-full h-full relative">
      <Link to={`/fleet/${car.id}`} className="block relative aspect-[16/9] overflow-hidden bg-dark-800 cursor-pointer">
        <img
          src={car.imageUrl}
          alt={carName}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
          {!car.available && (
            <span className="bg-dark-950/90 text-gray-400 px-2 py-1 text-[9px] uppercase tracking-widest border border-white/5">
              {t('carCard.booked')}
            </span>
          )}
          {car.isAvailableToday && car.available && (
            <span className="bg-gold-500 text-black px-2 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Zap size={10} fill="currentColor" /> {t('carCard.today')}
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />
      </Link>

      <div className="pt-4 pb-3 flex flex-col justify-between flex-1 border-b border-white/5 group-hover:border-gold-400/30 transition-colors duration-500">
        
        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-[9px] text-gold-400 uppercase tracking-widest block mb-1">{car.category}</span>
                <Link to={`/fleet/${car.id}`}>
                    <h3 className="font-serif text-xl text-white group-hover:text-gold-300 transition-colors duration-300 truncate pr-4">
                        {carName}
                    </h3>
                </Link>
            </div>
            
            <Link 
                to={`/fleet/${car.id}`}
                className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-white hover:text-black hover:border-white shrink-0"
            >
                <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
        </div>
        
        <div className="flex justify-between items-end mt-auto">
            <div>
                <p className="text-white text-base font-light">
                    {car.pricePerDay.toLocaleString('ru-RU')} <span className="text-[10px] text-gold-400 align-top">BYN</span>
                </p>
                <div className="flex gap-3 mt-1 text-[9px] text-gray-500 font-medium tracking-wide">
                    <span>{car.specs.zeroToSixty}s</span>
                    <span className="w-px h-2.5 bg-white/10"></span>
                    <span>{car.specs.hp} HP</span>
                </div>
            </div>

            <button
                onClick={() => onBook(car)}
                disabled={!car.available}
                className={`text-[9px] uppercase tracking-widest font-bold py-1.5 border-b transition-all ${
                    car.available 
                    ? 'border-white/30 text-white hover:text-gold-400 hover:border-gold-400' 
                    : 'border-transparent text-gray-700 cursor-not-allowed'
                }`}
            >
                {car.available ? t('carCard.booking') : t('carCard.unavailable')}
            </button>
        </div>
      </div>
    </div>
  );
};
