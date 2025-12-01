import React, { useState, useMemo } from 'react';
import { CarCategory, Car } from '../types';
import { CarCard } from './CarCard';

interface FleetProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

export const Fleet: React.FC<FleetProps> = ({ cars, onBookCar }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredCars = useMemo(() => {
    if (activeCategory === 'ALL') return cars;
    return cars.filter((car) => car.category === activeCategory);
  }, [activeCategory, cars]);

  const categories = ['ALL', ...Object.values(CarCategory)];

  return (
    <section id="fleet" className="py-24 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
            Ваш Выбор
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-white mb-8">
            Наш Автопарк
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 border rounded-full text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Все авто' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onBook={onBookCar} />
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            В данной категории пока нет доступных автомобилей.
          </div>
        )}
      </div>
    </section>
  );
};