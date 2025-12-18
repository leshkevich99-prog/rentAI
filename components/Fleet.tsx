
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CarCategory, Car } from '../types';
import { CarCard } from './CarCard';
import { SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide, Zap, Gauge } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface FleetProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

type SortType = 'default' | 'price_asc' | 'price_desc' | 'power_desc' | 'acceleration_asc';

export const Fleet: React.FC<FleetProps> = ({ cars, onBookCar }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('filter') === 'today') {
      setActiveCategory('TODAY');
    }
  }, [location.search]);

  const filteredCars = useMemo(() => {
    let result = [...cars];
    
    if (activeCategory === 'TODAY') {
      result = result.filter(car => car.isAvailableToday && car.available);
    } else if (activeCategory !== 'ALL') {
      result = result.filter(car => car.category === activeCategory);
    }

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
        result.sort((a, b) => a.specs.zeroToSixty - b.specs.zeroToSixty);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, cars, sortBy]);

  const categories = ['ALL', 'TODAY', ...Object.values(CarCategory)];

  return (
    <section id="fleet" className="py-24 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm animate-fade-in-up">
            {t('fleet.subtitle')}
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t('fleet.title')}
          </h3>
          
          <div className="relative z-30 flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/10 pb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gold-500 text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  } ${cat === 'TODAY' && activeCategory !== 'TODAY' ? 'border border-gold-400/30' : ''}`}
                >
                  {cat === 'ALL' ? t('fleet.all') : cat === 'TODAY' ? t('fleet.availableToday') : cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-sm text-gold-400 hover:text-white transition-colors uppercase font-bold tracking-wider"
              >
                <SlidersHorizontal size={18} />
                <span>{t('fleet.sort')}</span>
              </button>

              {isFilterOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                  <div className="py-1 text-left">
                    <button onClick={() => { setSortBy('default'); setIsFilterOpen(false); }} className={`w-full px-4 py-3 text-sm hover:bg-white/5 ${sortBy === 'default' ? 'text-gold-400' : 'text-gray-300'}`}>Default</button>
                    <button onClick={() => { setSortBy('price_asc'); setIsFilterOpen(false); }} className={`w-full px-4 py-3 text-sm hover:bg-white/5 ${sortBy === 'price_asc' ? 'text-gold-400' : 'text-gray-300'}`}>Price Asc</button>
                    <button onClick={() => { setSortBy('price_desc'); setIsFilterOpen(false); }} className={`w-full px-4 py-3 text-sm hover:bg-white/5 ${sortBy === 'price_desc' ? 'text-gold-400' : 'text-gray-300'}`}>Price Desc</button>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
          {filteredCars.map((car) => (
            <div key={car.id} className="animate-fade-in-up">
               <CarCard car={car} onBook={onBookCar} />
            </div>
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-24 text-gray-500 bg-white/5 border border-white/5 rounded-xl animate-fade-in-up">
            <p className="text-lg">{t('fleet.empty')}</p>
            <button 
                onClick={() => setActiveCategory('ALL')} 
                className="mt-4 text-gold-400 hover:text-white underline text-sm uppercase tracking-widest"
            >
                {t('fleet.showAll')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
