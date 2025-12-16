
import React from 'react';
import { Check } from 'lucide-react';

const aboutImg = "https://hntlasaimmgbiruvxzyf.supabase.co/storage/v1/object/public/car-images/about.jpg";

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-dark-900 to-transparent opacity-30 pointer-events-none" />
      
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative max-w-lg mx-auto lg:mx-0 w-full lg:w-4/5">
            <div className="relative z-10 border border-white/10 p-2">
               <img 
                 src={aboutImg}
                 alt="Luxury Abstract" 
                 className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-500/10 z-0 hidden md:block" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-gold-400/20 z-0 hidden md:block" />
          </div>

          <div>
            <h2 className="text-gold-400 font-semibold uppercase tracking-luxury mb-2 text-[10px]">
              О Компании
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
              Мы создаем стандарты <br />
              <span className="italic text-gold-400">премиальной аренды</span>
            </h3>
            
            <p className="text-gray-400 text-base mb-6 leading-relaxed font-light">
              LÉON была основана в 2025 году с одной целью: предоставить сервис, который превосходит ожидания самых требовательных клиентов. Мы не просто сдаем автомобили в аренду, мы дарим эмоции и свободу передвижения на высшем уровне.
            </p>
            
            <p className="text-gray-500 mb-8 leading-relaxed font-light text-sm">
              В нашем автопарке собраны лучшие образцы мирового автопрома. Каждый автомобиль — это шедевр инженерной мысли, готовый стать вашим надежным спутником, будь то деловая встреча, свадьба или путешествие.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold-400/20 p-1 rounded-full"><Check size={12} className="text-gold-400" /></div>
                <div>
                  <h4 className="text-white font-bold text-xl font-serif">15+</h4>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Автомобилей</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold-400/20 p-1 rounded-full"><Check size={12} className="text-gold-400" /></div>
                <div>
                  <h4 className="text-white font-bold text-xl font-serif">500+</h4>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Клиентов</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
               <div className="font-serif italic text-xl text-gray-500 opacity-50">Roman Romanov</div>
               <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest">Роман Романов, CEO LÉON</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
