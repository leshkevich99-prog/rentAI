import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-dark-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
              Свяжитесь с Нами
            </h2>
            <h3 className="font-serif text-4xl text-white mb-8">
              Контакты
            </h3>
            <p className="text-gray-400 mb-12">
              Мы всегда рады ответить на ваши вопросы и помочь с выбором автомобиля. Наш офис находится в престижном районе Минска, но мы также доставляем авто в любую удобную для вас локацию.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-dark-900 p-3 border border-white/10 rounded-lg">
                  <MapPin className="text-gold-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Наш Офис</h4>
                  <p className="text-gray-400 text-sm">г. Минск, Dana Center<br />ул. П. Мстиславца, 9</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-dark-900 p-3 border border-white/10 rounded-lg">
                  <Phone className="text-gold-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Телефон</h4>
                  <a href="tel:+375290000000" className="text-gray-400 text-sm hover:text-gold-400 transition-colors">
                    +375 (29) 000-00-00
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-dark-900 p-3 border border-white/10 rounded-lg">
                  <Mail className="text-gold-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email</h4>
                  <a href="mailto:avtoprokat.minsk@yandex.by" className="text-gray-400 text-sm hover:text-gold-400 transition-colors">
                    avtoprokat.minsk@yandex.by
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-dark-900 p-3 border border-white/10 rounded-lg">
                  <Clock className="text-gold-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Время работы</h4>
                  <p className="text-gray-400 text-sm">Ежедневно: 09:00 - 22:00<br />Поддержка: 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full min-h-[400px] bg-dark-900 rounded-2xl border border-white/10 overflow-hidden relative group">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.037943560783!2d27.648358177114674!3d53.93121513083654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35b1e6add%3A0x6767073215234930!2sDana%20Center!5e0!3m2!1sen!2sby!4v1709400000000!5m2!1sen!2sby"
                width="100%"
                height="100%"
                style={{ border: 0, opacity: 0.6, filter: 'grayscale(100%) invert(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-10 hover:opacity-100 hover:filter-none transition-all duration-500"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};