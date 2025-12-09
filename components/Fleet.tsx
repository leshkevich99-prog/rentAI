
import React, { useState, useMemo } from 'react';
import { CarCategory, Car } from '../types';
import { CarCard } from './CarCard';
import { ListFilter } from 'lucide-react';

interface FleetProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

type SortType = 'default' | 'price_asc' | 'price_desc' | 'power_desc';

export const Fleet: React.FC<FleetProps> = ({ cars, onBookCar }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCars = useMemo(() => {
    let result = activeCategory === 'ALL' 
      ? [...cars] 
      : cars.filter((car) => car.category === activeCategory);

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price_desc':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'power_desc':
        result.sort((a, b) => b.specs.hp - a.specs.hp);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, cars, sortBy]);

  const categories = ['ALL', ...Object.values(CarCategory)];

  return (
    <section id="fleet" className="py-32 bg-dark-950 min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-gold-400 font-semibold uppercase tracking-luxury text-xs mb-4">
              Collection
            </h2>
            <h3 className="font-serif text-5xl md:text-6xl text-white leading-none">
              Автопарк
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-8 lg:mt-0">
             {/* Categories */}
             <div className="flex flex-wrap gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    activeCategory === cat
                      ? 'text-white border-b border-gold-400 pb-1'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'Все' : cat}
                </button>
              ))}
            </div>

            {/* Simple Sort */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
                >
                    <ListFilter size={14} /> Фильтр
                </button>
                
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-4 w-48 bg-dark-900 border border-white/10 p-2 z-30 shadow-2xl">
                        <button onClick={() => {setSortBy('default'); setIsFilterOpen(false)}} className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5">По умолчанию</button>
                        <button onClick={() => {setSortBy('price_asc'); setIsFilterOpen(false)}} className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5">Цена (возрастание)</button>
                        <button onClick={() => {setSortBy('price_desc'); setIsFilterOpen(false)}} className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5">Цена (убывание)</button>
                        <button onClick={() => {setSortBy('power_desc'); setIsFilterOpen(false)}} className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5">Мощность</button>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredCars.map((car) => (
            <div key={car.id} className="animate-fade-in-up">
               <CarCard car={car} onBook={onBookCar} />
            </div>
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="py-32 text-center border-t border-b border-white/5">
            <p className="font-serif text-2xl text-gray-500">В данной категории автомобили временно отсутствуют.</p>
          </div>
        )}
      </div>
    </section>
  );
};
