
import React, { useState, useMemo } from 'react';
import { CarCategory, Car } from '../types';
import { CarCard } from './CarCard';
import { SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide, Zap, Gauge } from 'lucide-react';

interface FleetProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

type SortType = 'default' | 'price_asc' | 'price_desc' | 'power_desc' | 'acceleration_asc';

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
      case 'acceleration_asc':
        // Sort by 0-100 time (ascending = faster)
        result.sort((a, b) => a.specs.zeroToSixty - b.specs.zeroToSixty);
        break;
      default:
        // Default Supabase order or ID based
        break;
    }

    return result;
  }, [activeCategory, cars, sortBy]);

  const categories = ['ALL', ...Object.values(CarCategory)];

  return (
    <section id="fleet" className="py-24 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm animate-fade-in-up">
            Ваш Выбор
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Наш Автопарк
          </h3>
          
          {/* Controls Container - Added z-30 to stay above grid */}
          <div className="relative z-30 flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/10 pb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gold-500 text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'Все' : cat}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-sm text-gold-400 hover:text-white transition-colors uppercase font-bold tracking-wider"
              >
                <SlidersHorizontal size={18} />
                <span>Сортировка</span>
              </button>

              {isFilterOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                  <div className="py-1">
                    <button 
                      onClick={() => { setSortBy('default'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center justify-between ${sortBy === 'default' ? 'text-gold-400' : 'text-gray-300'}`}
                    >
                      <span>По умолчанию</span>
                    </button>
                    <button 
                      onClick={() => { setSortBy('price_asc'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center justify-between ${sortBy === 'price_asc' ? 'text-gold-400' : 'text-gray-300'}`}
                    >
                      <span>Сначала дешевле</span>
                      <ArrowDownWideNarrow size={14} />
                    </button>
                    <button 
                      onClick={() => { setSortBy('price_desc'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center justify-between ${sortBy === 'price_desc' ? 'text-gold-400' : 'text-gray-300'}`}
                    >
                      <span>Сначала дороже</span>
                      <ArrowUpNarrowWide size={14} />
                    </button>
                    <button 
                      onClick={() => { setSortBy('power_desc'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center justify-between ${sortBy === 'power_desc' ? 'text-gold-400' : 'text-gray-300'}`}
                    >
                      <span>Самые мощные</span>
                      <Zap size={14} />
                    </button>
                     <button 
                      onClick={() => { setSortBy('acceleration_asc'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center justify-between ${sortBy === 'acceleration_asc' ? 'text-gold-400' : 'text-gray-300'}`}
                    >
                      <span>Самые быстрые (0-100)</span>
                      <Gauge size={14} />
                    </button>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grid - relative z-0 implied, so controls z-30 sits on top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
          {filteredCars.map((car) => (
            <div key={car.id} className="animate-fade-in-up">
               <CarCard car={car} onBook={onBookCar} />
            </div>
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-24 text-gray-500 bg-white/5 border border-white/5 rounded-xl animate-fade-in-up">
            <p className="text-lg">В данной категории пока нет доступных автомобилей.</p>
            <button 
                onClick={() => setActiveCategory('ALL')} 
                className="mt-4 text-gold-400 hover:text-white underline text-sm uppercase tracking-widest"
            >
                Показать все авто
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
