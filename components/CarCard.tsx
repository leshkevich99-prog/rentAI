import React from 'react';
import { Car } from '../types';
import { Gauge, Zap, Wind } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  return (
    <div className="group relative bg-dark-800 border border-white/5 overflow-hidden transition-transform duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 animate-pulse" />
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        {!car.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="border border-white/30 px-4 py-2 text-white/70 uppercase text-xs tracking-widest font-bold">
              Недоступно
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 border border-white/10">
          <span className="text-gold-400 text-xs font-bold tracking-widest uppercase">
            {car.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-gold-400 transition-colors">
          {car.name}
        </h3>
        
        <div className="flex items-center gap-6 my-6 text-gray-400 text-sm">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-gold-500" />
            <span>{car.specs.hp} л.с.</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <Wind className="w-4 h-4 text-gold-500" />
            <span>{car.specs.zeroToSixty}с</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 text-gold-500" />
            <span>{car.specs.maxSpeed} км/ч</span>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-white/5 pt-6">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Стоимость</p>
            <p className="text-xl font-bold text-white">
              {car.pricePerDay.toLocaleString('ru-RU')} BYN <span className="text-sm font-normal text-gray-500">/ сутки</span>
            </p>
          </div>
          <button
            onClick={() => onBook(car)}
            disabled={!car.available}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
              car.available
                ? 'bg-white text-black hover:bg-gold-400 hover:text-black'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
};