import React from 'react';
import { Check } from 'lucide-react';

const aboutImgSvg = `
<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradAbout" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#202020;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradAbout)" />
  <path d="M0 0 L800 1000" stroke="#333" stroke-width="1" opacity="0.5"/>
  <path d="M800 0 L0 1000" stroke="#333" stroke-width="1" opacity="0.5"/>
  <rect x="100" y="200" width="600" height="600" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.2"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="60" opacity="0.1" transform="rotate(-90, 400, 500)">LUXURY</text>
</svg>
`;

const aboutImg = `data:image/svg+xml;base64,${btoa(aboutImgSvg)}`;

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-dark-800 to-transparent opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="relative z-10 border border-white/10 p-2">
               <img 
                 src={aboutImg}
                 alt="Luxury Abstract" 
                 className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold-500/10 z-0 hidden md:block" />
            <div className="absolute -top-10 -right-10 w-48 h-48 border border-gold-400/20 z-0 hidden md:block" />
          </div>

          <div>
            <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
              О Компании
            </h2>
            <h3 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
              Мы создаем стандарты <br />
              <span className="italic text-gold-400">премиальной аренды</span>
            </h3>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              EliteDrive была основана в 2015 году с одной целью: предоставить сервис, который превосходит ожидания самых требовательных клиентов. Мы не просто сдаем автомобили в аренду, мы дарим эмоции и свободу передвижения на высшем уровне.
            </p>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              В нашем автопарке собраны лучшие образцы мирового автопрома. Каждый автомобиль — это шедевр инженерной мысли, готовый стать вашим надежным спутником, будь то деловая встреча, свадьба или путешествие.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold-400/20 p-1 rounded-full"><Check size={12} className="text-gold-400" /></div>
                <div>
                  <h4 className="text-white font-bold text-2xl">50+</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Автомобилей</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold-400/20 p-1 rounded-full"><Check size={12} className="text-gold-400" /></div>
                <div>
                  <h4 className="text-white font-bold text-2xl">5000+</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Клиентов</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
               <div className="font-serif italic text-2xl text-gray-500 opacity-50">Alexander Volkov</div>
               <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Александр Волков, CEO EliteDrive</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};