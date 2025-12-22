
import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CarCard } from '../components/CarCard';
import { Car } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, ShieldCheck, FileText, CheckCircle, ArrowRight, Send, MessageCircle } from 'lucide-react';
import { ChauffeurModal } from '../components/ChauffeurModal';
import { CallbackModal } from '../components/CallbackModal';
import { useTranslation } from '../context/LanguageContext';

interface HomeProps {
  cars: Car[];
  onBookCar: (car: Car) => void;
}

const promoBg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/freepik__the-style-is-candid-image-photography-with-natural__33412.jpeg";

const HomeContactForm = () => {
  const { t } = useTranslation();
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
      alert('Error. Contact via messengers.');
    }
  };

  return (
    <div className="bg-dark-900/50 backdrop-blur-sm border border-white/5 p-8 relative overflow-hidden rounded-xl">
       <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

       <h3 className="font-serif text-2xl text-white mb-2">{t('home.callback')}</h3>
       <p className="text-gray-400 mb-6 max-w-xs font-light text-xs leading-relaxed">
         {t('home.callbackDesc')}
       </p>

       {step === 'form' ? (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder={t('home.formName')}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-600 focus:border-gold-400 focus:outline-none text-sm font-light transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder={t('home.formPhone')}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-600 focus:border-gold-400 focus:outline-none text-sm font-light transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <button className="w-full bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest py-3.5 hover:bg-white hover:text-black transition-all text-[10px] mt-2 rounded-lg">
              {t('home.formSend')}
            </button>
         </form>
       ) : (
         <div className="p-6 text-center border border-green-500/20 bg-green-500/5 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" strokeWidth={1} />
            <h4 className="text-white font-bold text-base font-serif">{t('home.formAccepted')}</h4>
            <p className="text-gray-400 text-xs mt-2">{t('home.formSuccess')}</p>
         </div>
       )}

       <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest mb-4">{t('home.directContact')}</p>
          <div className="grid grid-cols-2 gap-3">
             <a 
                href="https://wa.me/375257422222" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] text-white py-2.5 rounded-lg transition-all duration-300 group"
             >
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
             </a>
             <a 
                href="https://t.me/leonrental" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 bg-[#0088cc]/10 border border-[#0088cc]/30 hover:bg-[#0088cc] text-white py-2.5 rounded-lg transition-all duration-300 group"
             >
                <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Telegram</span>
             </a>
          </div>
       </div>
    </div>
  );
}

export const Home: React.FC<HomeProps> = ({ cars, onBookCar }) => {
  const { t } = useTranslation();
  const [isChauffeurOpen, setIsChauffeurOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const featuredCars = cars.slice(0, 3);

  const brands = ["Lamborghini", "Rolls-Royce", "Ferrari", "Bentley", "Porsche", "Mercedes-Benz", "BMW", "Audi"];

  return (
    <div>
      <Hero onRequestCallback={() => setIsCallbackOpen(true)} />
      
      <div className="bg-black border-b border-white/5 py-6 overflow-hidden relative">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
         
         <div className="flex gap-24 animate-[scroll_40s_linear_infinite] whitespace-nowrap px-4 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {[...brands, ...brands].map((brand, i) => (
                <span key={i} className="text-sm font-sans font-light tracking-[0.2em] text-white select-none">
                    {brand}
                </span>
            ))}
         </div>
      </div>
      
      <section className="py-20 bg-dark-950 relative">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                <div>
                    <h2 className="text-gold-400 font-bold uppercase tracking-luxury text-[10px] mb-2 pl-1">
                        {t('home.selection')}
                    </h2>
                    <h3 className="font-serif text-4xl md:text-5xl text-white max-w-xl leading-none">
                        {t('home.featured')}
                    </h3>
                </div>
                <Link to="/fleet" className="group hidden md:flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest pb-1 border-b border-white/20 hover:border-gold-400 hover:text-gold-400 transition-all">
                    {t('home.viewAll')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-10">
                {featuredCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={onBookCar} />
                ))}
            </div>

            <div className="text-center md:hidden mt-8">
                <Link to="/fleet" className="inline-block border border-white/20 text-white px-8 py-3 font-bold uppercase tracking-widest text-[10px]">
                    {t('home.catalog')}
                </Link>
            </div>
        </div>
      </section>

      <section className="py-20 bg-dark-900 border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="pr-0 lg:pr-12">
                 <h2 className="text-gold-400 font-bold uppercase tracking-luxury text-[10px] mb-2">{t('home.selection')}</h2>
                 <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">
                    {t('home.conditions')}
                 </h3>
                 <p className="text-gray-400 mb-10 leading-relaxed font-light text-base">
                    {t('home.conditionsDesc')}
                 </p>
                 
                 <div className="space-y-8">
                    <div className="flex gap-6 group">
                       <Building2 size={24} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors mt-1" />
                       <div>
                          <h4 className="text-white font-serif text-lg mb-1">{t('home.b2b')}</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">{t('home.b2bDesc')}</p>
                       </div>
                    </div>
                    <div className="flex gap-6 group">
                       <ShieldCheck size={24} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors mt-1" />
                       <div>
                          <h4 className="text-white font-serif text-lg mb-1">{t('home.safety')}</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">{t('home.safetyDesc')}</p>
                       </div>
                    </div>
                    <div className="flex gap-6 group">
                       <FileText size={24} strokeWidth={1} className="text-gray-600 group-hover:text-gold-400 transition-colors mt-1" />
                       <div>
                          <h4 className="text-white font-serif text-lg mb-1">{t('home.docs')}</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">{t('home.docsDesc')}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:mt-4">
                 <HomeContactForm />
              </div>
           </div>
        </div>
      </section>

      <section className="relative py-24 bg-dark-950 overflow-hidden">
         <div className="absolute inset-0">
           <img src={promoBg} alt="Chauffeur Service" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
         </div>
         <div className="relative max-w-[1920px] mx-auto px-6 lg:px-12 flex items-center">
           <div className="max-w-xl">
             <div className="text-gold-400 text-[10px] font-bold uppercase tracking-luxury mb-4">LÉON Chauffeur</div>
             <h3 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-none">{t('home.promoTitle')}</h3>
             <p className="text-gray-300 mb-8 text-base font-light leading-relaxed">
               {t('home.promoDesc')}
             </p>
             <button 
               onClick={() => setIsChauffeurOpen(true)}
               className="bg-transparent border border-white/40 text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-[10px]"
             >
               {t('home.promoBtn')}
             </button>
           </div>
         </div>
      </section>

      {isChauffeurOpen && (
        <ChauffeurModal onClose={() => setIsChauffeurOpen(false)} />
      )}
      {isCallbackOpen && (
        <CallbackModal onClose={() => setIsCallbackOpen(false)} />
      )}
    </div>
  );
};
