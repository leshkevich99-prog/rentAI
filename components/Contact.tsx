
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-20 bg-dark-950 border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-gold-400 font-semibold uppercase tracking-luxury text-[10px] mb-2">
              {t('contact.subtitle')}
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">
              {t('contact.title')}
            </h3>
            <p className="text-gray-400 mb-8 font-light leading-relaxed max-w-md text-sm">
              {t('contact.desc')}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <MapPin size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-base mb-1">{t('contact.office')}</h4>
                  <p className="text-gray-400 text-sm font-light">{t('contact.address')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Phone size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-base mb-1">{t('contact.phone')}</h4>
                  <a href="tel:+375257422222" className="text-gray-400 text-sm hover:text-white transition-colors font-light">
                    +375 (25) 742-22-22
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Mail size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-base mb-1">{t('contact.email')}</h4>
                  <a href="mailto:avtoprokat.minsk@yandex.by" className="text-gray-400 text-sm hover:text-white transition-colors font-light">
                    avtoprokat.minsk@yandex.by
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Clock size={24} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-base mb-1">{t('contact.hours')}</h4>
                  <p className="text-gray-400 text-sm font-light">{t('contact.hoursVal')}<br />{t('contact.support')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] lg:h-auto bg-dark-900 border border-white/5 overflow-hidden relative group rounded-sm">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.037943560783!2d27.648358177114674!3d53.93121513083654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35b1e6add%3A0x6767073215234930!2sDana%20Center!5e0!3m2!1sen!2sby!4v1709400000000!5m2!1sen!2sby"
                width="100%"
                height="100%"
                style={{ border: 0, opacity: 0.6, filter: 'grayscale(100%) invert(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-10 hover:opacity-100 hover:filter-none transition-all duration-700"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};
