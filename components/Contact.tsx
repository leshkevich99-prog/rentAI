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
              Мы всегда рады ответить на ваши вопросы и помочь с выбором автомобиля. Наш офис находится в центре Минска, но мы доставляем авто в любую удобную для вас локацию.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-gold-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Адрес</h4>
                  <p className="text-gray-500">пр-т Победителей 7а<br/>Минск, Беларусь, 220004</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="text-gold-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Телефон</h4>
                  <p className="text-gray-500">+375 (29) 123-45-67<br/>+375 (44) 765-43-21 (Telegram)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="text-gold-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Email</h4>
                  <p className="text-gray-500">info@elitedrive.by<br/>booking@elitedrive.by</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="text-gold-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Время работы</h4>
                  <p className="text-gray-500">Ежедневно: 09:00 - 22:00<br/>Поддержка 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 p-8 border border-white/5">
            <h4 className="text-white font-serif text-2xl mb-6">Оставить заявку</h4>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Имя</label>
                  <input type="text" className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="Ваше имя" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Телефон</label>
                  <input type="text" className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="+375 (__) ___-__-__" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="example@mail.by" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Сообщение</label>
                <textarea rows={4} className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="Интересует аренда Rolls-Royce..." />
              </div>
              <button className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors">
                Отправить
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};