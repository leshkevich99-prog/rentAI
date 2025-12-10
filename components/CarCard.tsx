
import React from 'react';
import { Car } from '../types';
import { Link } from 'react-router-dom';

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  return (
    <div className="group flex flex-col w-full h-full">
      {/* Image Area */}
      <Link to={`/fleet/${car.id}`} className="block relative aspect-[16/10] overflow-hidden bg-dark-800 cursor-pointer">
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {!car.available && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-dark-950/80 backdrop-blur text-white px-3 py-1 text-[10px] uppercase tracking-widest">
              Занято
            </span>
          </div>
        )}

        {/* Hover Overlay with Specs */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between text-white text-[10px] tracking-wider border-t border-white/20 pt-4 font-medium uppercase">
                    <span>{car.specs.hp} HP</span>
                    <span>{car.specs.zeroToSixty}s (0-100)</span>
                    <span>{car.specs.maxSpeed} km/h</span>
                </div>
            </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="pt-6 pb-2 border-b border-white/10 group-hover:border-gold-400/50 transition-colors duration-500 flex-1 flex flex-col justify-between">
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest">{car.category}</span>
            </div>
            <Link to={`/fleet/${car.id}`}>
                <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-gold-300 transition-colors leading-tight">
                    {car.name}
                </h3>
            </Link>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
            <div className="flex flex-col">
                <span className="text-gold-400 font-medium text-lg">
                    {car.pricePerDay.toLocaleString('ru-RU')} BYN
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">За сутки</span>
            </div>

            <button
                onClick={() => onBook(car)}
                disabled={!car.available}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                    car.available 
                    ? 'border-white/20 text-white hover:bg-white hover:text-black' 
                    : 'border-white/5 text-gray-600 cursor-not-allowed'
                }`}
            >
                Бронь
            </button>
        </div>
      </div>
    </div>
  );
};
