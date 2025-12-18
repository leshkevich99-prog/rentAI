
import React from 'react';
import { Shield, Clock, Award, Briefcase, Gem, Plane } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const Services: React.FC = () => {
  const { t } = useTranslation();
  
  const icons = [
    <Shield className="w-6 h-6 text-gold-400" />,
    <Clock className="w-6 h-6 text-gold-400" />,
    <Award className="w-6 h-6 text-gold-400" />,
    <Briefcase className="w-6 h-6 text-gold-400" />,
    <Gem className="w-6 h-6 text-gold-400" />,
    <Plane className="w-6 h-6 text-gold-400" />
  ];

  const serviceItems = t('services.items') as unknown as { title: string, desc: string }[];

  return (
    <section id="services" className="py-20 bg-dark-900 relative border-t border-white/5">
       <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-gold-400 font-semibold uppercase tracking-luxury mb-2 text-[10px]">
            {t('services.subtitle')}
          </h2>
          <h3 className="font-serif text-3xl md:text-4xl text-white">
            {t('services.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service, index) => (
            <div key={index} className="p-6 bg-dark-950 border border-white/5 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="mb-4 bg-dark-900 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5">
                {icons[index]}
              </div>
              <h4 className="text-lg font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                {service.title}
              </h4>
              <p className="text-gray-400 leading-relaxed text-sm font-light">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
