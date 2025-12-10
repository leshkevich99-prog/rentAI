
import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CarCard } from '../components/CarCard';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, ShieldCheck, FileText, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { ChauffeurModal } from '../components/ChauffeurModal';

interface HomeProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

const promoBg = "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2940&auto=format&fit=crop";

// Inline Contact Form Component
const HomeContactForm = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'callback', booking: formData }),
      });
      setStep('success');
    } catch (e) {
      alert('Ошибка. Свяжитесь с нами через мессенджеры.');
    }
  };

  return (
    <div className="bg-dark-900/50 backdrop-blur-sm border border-white/5 p-10 md:p-14 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

       <h3 className="font-serif text-3xl text-white mb-4">Персональный менеджер</h3>
       <p className="text-gray-400 mb-10 max-w-md font-light text-sm leading-relaxed">
         Оставьте свои контакты, мы перезвоним в течение 15 минут.
       </p>

       {step === 'form' ? (
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Ваше Имя"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-600 focus:border-gold-400 focus:outline-none text-sm font-light transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Номер телефона"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-600 focus:border-gold-400 focus:outline-none text-sm font-light transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <button className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors text-xs mt-4">
              Отправить
            </button>
         </form>
       ) : (
         <div className="p-8 text-center border border-green-500/20 bg-green-500/5">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" strokeWidth={1} />
            <h4 className="text-white font-bold text-lg font-serif">Принято</h4>
            <p className="text-gray-400 text-sm mt-2">Скоро свяжемся.</p>
         </div>
       )}

       <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-6">Мессенджеры (24/7)</p>
          <div className="flex gap-6">
             <a href="https://wa.me/375257422222" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-xs uppercase tracking-wider border-b border-transparent hover:border-white pb-1 transition-all">
                WhatsApp
             </a>
             <a href="https://t.me/username" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-xs uppercase tracking-wider border-b border-transparent hover:border-white pb-1 transition-all">
                Telegram
             </a>
          </div>
       </div>
    </div>
  );
}

export const Home: React.FC<HomeProps> = ({ cars, onBookCar }) => {
  const [isChauffeurOpen, setIsChauffeurOpen] = useState(false);
  const featuredCars = cars.slice(0, 3);

  const brands = ["Lamborghini", "Rolls-Royce", "Ferrari", "Bentley", "Porsche", "Mercedes-Benz", "BMW", "Audi"];

  return (
    <div>
      <Hero />
      
      {/* Brands Ticker - Cleaner */}
      <div className="bg-black border-b border-white/5 py-10 overflow-hidden relative">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
         
         <div className="flex gap-24 animate-[scroll_40s_linear_infinite] whitespace-nowrap px-4 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {[...brands, ...brands].map((brand, i) => (
                <span key={i} className="text-lg font-sans font-light tracking-[0.2em] text-white select-none">
                    {brand}
                </span>
            ))}
         </div>
      </div>
      
      {/* Featured Fleet */}
      <section className="py-32 bg-dark-950 relative">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <h2 className="text-gold-400 font-bold uppercase tracking-luxury text-[10px] mb-4 pl-1">
                        Выбор
                    </h2>
                    <h3 className="font-serif text-5xl md:text-6xl text-white max-w-xl leading-none">
                        Избранные модели
                    </h3>
                </div>
                <Link to="/fleet" className="group hidden md:flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest pb-2 border-b border-white/20 hover:border-gold-400 hover:text-gold-400 transition-all">
                    Смотреть все <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-16">
                {featuredCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={onBookCar} />
                ))}
            </div>

            <div className="text-center md:hidden">
                <Link to="/fleet" className="inline-block border border-white/20 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs">
                    Каталог
                </Link>
            </div>
        </div>
      </section>

      {/* B2B & Benefits - More space */}
      <section className="py-32 bg-dark-900 border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="pr-0 lg:pr-12">
                 <h2 className="text-gold-400 font-bold uppercase tracking-luxury text-[10px] mb-4">Сервис</h2>
                 <h3 className="font-serif text-4xl md:text-5xl text-white mb-8">
                    Условия аренды
                 </h3>
                 <p className="text-gray-400 mb-16 leading-relaxed font-light text-lg">
                    Минимум бюрократии, максимум комфорта. Оформление за 15 минут, возможность оплаты с НДС и полная конфиденциальность.
                 </p>
                 
                 <div className="space-y-12">
                    <div className="flex gap-8 group">
                       <Building2 size={32} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors" />
                       <div>
                          <h4 className="text-white font-serif text-xl mb-2">Для бизнеса</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">Полный пакет закрывающих документов, работа с НДС, выделенный менеджер 24/7.</p>
                       </div>
                    </div>
                    <div className="flex gap-8 group">
                       <ShieldCheck size={32} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors" />
                       <div>
                          <h4 className="text-white font-serif text-xl mb-2">Полная защита</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">Все автомобили застрахованы по КАСКО. Поддержка на дороге в любой ситуации.</p>
                       </div>
                    </div>
                    <div className="flex gap-8 group">
                       <FileText size={32} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors" />
                       <div>
                          <h4 className="text-white font-serif text-xl mb-2">Минимум документов</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">Паспорт и водительское удостоверение. Без скрытых условий и мелкого шрифта.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Contact Block */}
              <div>
                 <HomeContactForm />
              </div>
           </div>
        </div>
      </section>

      {/* Promo Section - Parallax vibe */}
      <section className="relative py-40 bg-dark-950 overflow-hidden">
         <div className="absolute inset-0">
           <img src={promoBg} alt="Chauffeur Service" className="w-full h-full object-cover opacity-50 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
         </div>
         <div className="relative max-w-[1920px] mx-auto px-6 lg:px-12 flex items-center">
           <div className="max-w-xl">
             <div className="text-gold-400 text-[10px] font-bold uppercase tracking-luxury mb-6">LÉON Chauffeur</div>
             <h3 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-none">Аренда с Водителем</h3>
             <p className="text-gray-300 mb-10 text-lg font-light leading-relaxed">
               Ваш личный водитель на автомобиле премиум-класса. Идеально для деловых встреч, трансферов и особых событий.
             </p>
             <button 
               onClick={() => setIsChauffeurOpen(true)}
               className="bg-white text-black px-12 py-5 font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors text-xs"
             >
               Оставить заявку
             </button>
           </div>
         </div>
      </section>

      {/* Chauffeur Modal */}
      {isChauffeurOpen && (
        <ChauffeurModal onClose={() => setIsChauffeurOpen(false)} />
      )}
    </div>
  );
};
