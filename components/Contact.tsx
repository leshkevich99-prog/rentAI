
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-dark-950 border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-gold-400 font-semibold uppercase tracking-luxury text-xs mb-3">
              Свяжитесь с Нами
            </h2>
            <h3 className="font-serif text-5xl text-white mb-8">
              Контакты
            </h3>
            <p className="text-gray-400 mb-12 font-light leading-relaxed max-w-md">
              Мы всегда рады ответить на ваши вопросы и помочь с выбором автомобиля. Наш офис находится в престижном районе Минска.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <MapPin size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-lg mb-1">Наш Офис</h4>
                  <p className="text-gray-400 text-sm font-light">г. Минск, Dana Center<br />ул. П. Мстиславца, 9</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Phone size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-lg mb-1">Телефон</h4>
                  <a href="tel:+375257422222" className="text-gray-400 text-sm hover:text-white transition-colors font-light">
                    +375 (25) 742-22-22
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Mail size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-lg mb-1">Email</h4>
                  <a href="mailto:avtoprokat.minsk@yandex.by" className="text-gray-400 text-sm hover:text-white transition-colors font-light">
                    avtoprokat.minsk@yandex.by
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="text-gold-400 group-hover:text-white transition-colors">
                  <Clock size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white font-serif text-lg mb-1">Время работы</h4>
                  <p className="text-gray-400 text-sm font-light">Ежедневно: 09:00 - 22:00<br />Поддержка: 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full min-h-[500px] bg-dark-900 border border-white/5 overflow-hidden relative group">
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
