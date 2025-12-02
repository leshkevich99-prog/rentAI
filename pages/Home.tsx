import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CarCard } from '../components/CarCard';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone } from 'lucide-react';
import { CallbackModal } from '../components/CallbackModal';

interface HomeProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

const promoBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/maindown.png";

export const Home: React.FC<HomeProps> = ({ cars, onBookCar }) => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  // Select top 3 cars for display (ensure we have at least some cars if array is empty)
  const featuredCars = cars.slice(0, 3);

  return (
    <div>
      <Hero />
      
      {/* Featured Fleet Preview */}
      <section className="py-24 bg-dark-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
                        Избранное
                    </h2>
                    <h3 className="font-serif text-4xl text-white">
                        Популярные Модели
                    </h3>
                </div>
                <Link to="/fleet" className="hidden md:flex items-center gap-2 text-gold-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    Весь автопарк <ChevronRight size={16} />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={onBookCar} />
                ))}
                {featuredCars.length === 0 && (
                  <p className="text-gray-500 col-span-full text-center">Автомобили временно отсутствуют.</p>
                )}
            </div>
            
            <div className="mt-12 text-center md:hidden">
                <Link to="/fleet" className="inline-flex items-center gap-2 text-gold-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    Смотреть все авто <ChevronRight size={16} />
                </Link>
            </div>
        </div>
      </section>

      {/* Promo Section: Personal Chauffeur */}
      <section className="relative py-32 bg-dark-900 overflow-hidden border-t border-white/5">
         <div className="absolute inset-0">
           <img src={promoBg} alt="Road Abstract" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
         </div>
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
           <div className="max-w-2xl">
             <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-4 text-sm">Эксклюзивный Сервис</h2>
             <h3 className="font-serif text-4xl md:text-5xl text-white mb-6">Аренда с Водителем</h3>
             <p className="text-gray-300 mb-8 text-lg font-light leading-relaxed">
               Позвольте себе роскошь расслабиться в пути. Наши профессиональные водители обеспечат максимальный комфорт и безопасность, пока вы занимаетесь своими делами или просто наслаждаетесь поездкой на заднем сиденье Rolls-Royce или Maybach.
             </p>
             <button 
               onClick={() => setIsCallbackOpen(true)}
               className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors"
             >
               Обсудить условия
             </button>
           </div>
         </div>
      </section>

      {/* Floating Callback Button (Bottom Left) */}
      <button
        onClick={() => setIsCallbackOpen(true)}
        className="fixed bottom-8 left-8 z-40 bg-white text-black p-4 rounded-full shadow-lg shadow-white/10 hover:bg-gold-400 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <Phone className="w-6 h-6 animate-pulse" />
        <span className="absolute left-full ml-4 bg-dark-900 border border-white/10 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Заказать звонок
        </span>
      </button>

      {/* Callback Modal */}
      {isCallbackOpen && (
        <CallbackModal onClose={() => setIsCallbackOpen(false)} />
      )}
    </div>
  );
};