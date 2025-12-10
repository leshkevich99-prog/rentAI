
import React from 'react';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  return (
    <div className="group flex flex-col w-full h-full relative">
      {/* Image Area - Aspect ratio tailored for car stance */}
      <Link to={`/fleet/${car.id}`} className="block relative aspect-[16/9] overflow-hidden bg-dark-800 cursor-pointer">
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Status Badge */}
        {!car.available && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-dark-950/90 text-gray-400 px-3 py-1 text-[9px] uppercase tracking-widest border border-white/5">
              Забронировано
            </span>
          </div>
        )}

        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />
      </Link>

      {/* Content Area - Minimalist */}
      <div className="pt-6 pb-4 flex flex-col justify-between flex-1 border-b border-white/5 group-hover:border-gold-400/30 transition-colors duration-500">
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <span className="text-[9px] text-gold-400 uppercase tracking-widest block mb-2">{car.category}</span>
                <Link to={`/fleet/${car.id}`}>
                    <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-gold-300 transition-colors duration-300">
                        {car.name}
                    </h3>
                </Link>
            </div>
            
            {/* Minimal Arrow Link */}
            <Link 
                to={`/fleet/${car.id}`}
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            >
                <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
        </div>
        
        <div className="flex justify-between items-end mt-auto">
            <div>
                <p className="text-white text-lg font-light">
                    {car.pricePerDay.toLocaleString('ru-RU')} <span className="text-xs text-gold-400 align-top">BYN</span>
                </p>
                <div className="flex gap-4 mt-2 text-[10px] text-gray-500 font-medium tracking-wide">
                    <span>{car.specs.zeroToSixty}s</span>
                    <span className="w-px h-3 bg-white/10"></span>
                    <span>{car.specs.hp} HP</span>
                </div>
            </div>

            <button
                onClick={() => onBook(car)}
                disabled={!car.available}
                className={`text-[10px] uppercase tracking-widest font-bold py-2 border-b transition-all ${
                    car.available 
                    ? 'border-white/30 text-white hover:text-gold-400 hover:border-gold-400' 
                    : 'border-transparent text-gray-700 cursor-not-allowed'
                }`}
            >
                {car.available ? 'Бронирование' : 'Недоступно'}
            </button>
        </div>
      </div>
    </div>
  );
};
