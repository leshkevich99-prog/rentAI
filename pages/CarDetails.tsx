
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Car } from '../types';
import { ChevronLeft, Gauge, Zap, Wind, CheckCircle, Clock } from 'lucide-react';
import { NotFound } from './NotFound';
import { useTranslation } from '../context/LanguageContext';

interface CarDetailsProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ cars, onBookCar }) => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  const car = cars.find(c => c.id === id);

  if (!car) {
    return <NotFound />;
  }

  const discountRules = car.discountRules && car.discountRules.length > 0 
    ? car.discountRules 
    : [
        { days: 3, discount: 10 },
        { days: 5, discount: 15 },
        { days: 15, discount: 20 }
    ];

  const sortedRules = [...discountRules].sort((a, b) => a.days - b.days);
  const carName = language === 'en' && car.name_en ? car.name_en : car.name;
  const carDesc = language === 'en' && car.description_en ? car.description_en : car.description;

  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <Link to="/fleet" className="inline-flex items-center text-gray-400 hover:text-gold-400 transition-colors uppercase text-xs font-bold tracking-widest">
                <ChevronLeft size={16} className="mr-2" /> {t('fleet.back')}
            </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10 group">
                        <img 
                            src={car.imageUrl} 
                            alt={carName} 
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10">
                            <span className="text-gold-400 font-bold uppercase text-xs tracking-wider">{car.category}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-dark-900 border border-white/5 p-4 rounded-xl text-center">
                            <Zap className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                            <p className="text-white font-bold text-lg">{car.specs.hp}</p>
                            <p className="text-gray-500 text-xs uppercase">{t('carCard.hp')}</p>
                        </div>
                        <div className="bg-dark-900 border border-white/5 p-4 rounded-xl text-center">
                            <Wind className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                            <p className="text-white font-bold text-lg">{car.specs.zeroToSixty}s</p>
                            <p className="text-gray-500 text-xs uppercase">{t('carCard.acceleration')}</p>
                        </div>
                        <div className="bg-dark-900 border border-white/5 p-4 rounded-xl text-center">
                            <Gauge className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                            <p className="text-white font-bold text-lg">{car.specs.maxSpeed}</p>
                            <p className="text-gray-500 text-xs uppercase">{t('carCard.speed')}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">{carName}</h1>
                    <p className="text-2xl font-bold text-gold-400 mb-8">
                        {car.pricePerDay.toLocaleString()} {t('carCard.currency')} <span className="text-sm font-normal text-gray-500">{t('carCard.perDay')}</span>
                    </p>

                    <div className="prose prose-invert mb-8">
                        <h3 className="text-white font-serif text-xl mb-4">{t('carCard.about')}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {carDesc || (language === 'en' ? "Luxury driving experience with unmatched style and power." : car.description)}
                        </p>
                    </div>

                    <div className="bg-dark-900 border border-white/5 rounded-xl p-6 mb-8">
                         <div className="flex items-center gap-3 mb-4">
                             <Clock className="text-gold-400" size={20} />
                             <h3 className="text-white font-bold uppercase text-sm tracking-wider">{t('carCard.discounts')}</h3>
                         </div>
                         
                         <div className="space-y-3">
                             {sortedRules.map((rule, idx) => (
                                 <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                     <span className="text-gray-400 text-sm">{t('carCard.moreThan')} {rule.days} {t('carCard.days')}</span>
                                     <span className="text-green-400 font-bold">-{rule.discount}%</span>
                                 </div>
                             ))}
                             {sortedRules.length === 0 && <p className="text-gray-500 text-sm">{t('carCard.contactManager')}</p>}
                         </div>
                    </div>

                    <div className="flex flex-col gap-4">
                         <button
                            onClick={() => onBookCar(car)}
                            disabled={!car.available}
                            className={`w-full py-4 font-bold uppercase tracking-widest text-center transition-all ${
                                car.available 
                                ? 'bg-gold-500 text-black hover:bg-gold-400' 
                                : 'bg-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                         >
                            {car.available ? t('carCard.booking') : t('carCard.unavailable')}
                         </button>
                         <p className="text-center text-xs text-gray-500">
                             <CheckCircle size={12} className="inline mr-1 text-green-500" />
                             {t('booking.noDeposit')}
                         </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
