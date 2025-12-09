
import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CarCard } from '../components/CarCard';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, ShieldCheck, FileText, Send, Phone, User, CheckCircle, Smartphone } from 'lucide-react';
import { ChauffeurModal } from '../components/ChauffeurModal';

interface HomeProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

const promoBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/maindown.png";

// Inline Contact Form Component for Homepage
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
    <div className="bg-dark-800 border border-white/10 p-8 md:p-12 rounded-2xl relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

       <h3 className="font-serif text-3xl text-white mb-2">Остались вопросы?</h3>
       <p className="text-gray-400 mb-8 max-w-md">Оставьте заявку, и мы перезвоним в течение 15 минут. Или напишите нам в мессенджеры.</p>

       {step === 'form' ? (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Ваше Имя"
                required
                className="w-full bg-dark-900 border border-white/10 p-4 text-white rounded-lg focus:border-gold-400 focus:outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Номер телефона (любая страна)"
                required
                className="w-full bg-dark-900 border border-white/10 p-4 text-white rounded-lg focus:border-gold-400 focus:outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <button className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest p-4 rounded-lg hover:bg-gold-400 transition-colors">
              Жду звонка
            </button>
         </form>
       ) : (
         <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-white font-bold text-xl">Заявка отправлена</h4>
            <p className="text-gray-400">Мы скоро свяжемся с вами.</p>
         </div>
       )}

       <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4">Для быстрой связи (24/7)</p>
          <div className="grid grid-cols-2 gap-4">
             <a href="https://wa.me/375290000000" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 py-3 rounded-lg hover:bg-[#25D366]/20 transition-colors font-bold">
                WhatsApp
             </a>
             <a href="https://t.me/username" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 py-3 rounded-lg hover:bg-[#0088cc]/20 transition-colors font-bold">
                <Send size={18} /> Telegram
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
      
      {/* Brands Ticker */}
      <div className="bg-dark-900 border-b border-white/5 py-8 overflow-hidden relative">
         <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-900 to-transparent z-10" />
         <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-900 to-transparent z-10" />
         
         <div className="flex gap-16 animate-[scroll_30s_linear_infinite] whitespace-nowrap px-4">
            {[...brands, ...brands, ...brands].map((brand, i) => (
                <span key={i} className="text-2xl font-serif text-gray-600 uppercase tracking-widest opacity-50 select-none">
                    {brand}
                </span>
            ))}
         </div>
      </div>
      
      {/* Featured Fleet Preview */}
      <section className="py-24 bg-dark-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
                        Автопарк
                    </h2>
                    <h3 className="font-serif text-4xl text-white max-w-xl text-balance">
                        Выберите автомобиль под ваш характер
                    </h3>
                </div>
                <Link to="/fleet" className="group hidden md:flex items-center gap-2 text-white border-b border-gold-400 pb-1 hover:text-gold-400 transition-colors text-sm font-bold uppercase tracking-widest">
                    Весь каталог <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={onBookCar} />
                ))}
            </div>

            <div className="text-center md:hidden">
                <Link to="/fleet" className="inline-flex items-center gap-2 bg-white/5 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs">
                    Смотреть все авто <ChevronRight size={16} />
                </Link>
            </div>
        </div>
      </section>

      {/* B2B & Benefits Section (Concrete info) */}
      <section className="py-24 bg-dark-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">Для Бизнеса и Частных лиц</h2>
                 <h3 className="font-serif text-4xl text-white mb-6 text-balance">
                    Прозрачные условия аренды без скрытых комиссий
                 </h3>
                 <p className="text-gray-400 mb-8 leading-relaxed">
                    Мы ценим ваше время. Оформление документов занимает 15 минут. Возможна оплата по безналичному расчету с НДС.
                 </p>
                 
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="bg-gold-500/10 p-3 rounded-lg h-fit">
                          <Building2 className="text-gold-400" size={24} />
                       </div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Юридическим лицам</h4>
                          <p className="text-gray-500 text-sm">Полный пакет закрывающих документов, работа с НДС, персональный менеджер.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="bg-gold-500/10 p-3 rounded-lg h-fit">
                          <ShieldCheck className="text-gold-400" size={24} />
                       </div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Страхование и Безопасность</h4>
                          <p className="text-gray-500 text-sm">Все авто застрахованы по КАСКО. Поддержка на дороге 24/7.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="bg-gold-500/10 p-3 rounded-lg h-fit">
                          <FileText className="text-gold-400" size={24} />
                       </div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Простое оформление</h4>
                          <p className="text-gray-500 text-sm">Нужен только паспорт и водительское удостоверение. Без лишних справок.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Contact Block on Homepage */}
              <div>
                 <HomeContactForm />
              </div>
           </div>
        </div>
      </section>

      {/* Promo Section: Personal Chauffeur */}
      <section className="relative py-32 bg-dark-950 overflow-hidden border-t border-white/5">
         <div className="absolute inset-0">
           <img src={promoBg} alt="Chauffeur Service" className="w-full h-full object-cover opacity-40" />
           <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-transparent" />
         </div>
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
           <div className="max-w-2xl">
             <div className="inline-block bg-gold-500 text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">VIP Service</div>
             <h3 className="font-serif text-4xl md:text-5xl text-white mb-6">Аренда с Водителем</h3>
             <p className="text-gray-300 mb-8 text-lg font-light leading-relaxed text-balance">
               Идеальное решение для деловых поездок, свадеб или трансфера из аэропорта. Наши водители — профессионалы с многолетним стажем, соблюдающие строгий дресс-код.
             </p>
             <button 
               onClick={() => setIsChauffeurOpen(true)}
               className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors"
             >
               Заказать трансфер
             </button>
           </div>
         </div>
      </section>

      {/* Trust / Clients Section */}
      <section className="py-24 bg-dark-900 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-4 text-sm">Нам доверяют</h2>
            <h3 className="font-serif text-3xl text-white mb-12">Наши клиенты в Instagram</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-dark-800 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <span className="text-white text-xs font-bold uppercase tracking-widest">@leon_rental</span>
                      </div>
                      <span className="text-gray-600 font-serif italic text-4xl opacity-20 group-hover:scale-110 transition-transform">LÉON</span>
                  </div>
               ))}
            </div>
            <div className="mt-8">
               <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm uppercase tracking-widest border-b border-gray-600 hover:border-white pb-1 transition-all">
                  Подписаться на Instagram
               </a>
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
