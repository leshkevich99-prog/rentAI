import React from 'react';
import { Shield, Clock, Award, Briefcase, Gem, Plane } from 'lucide-react';

const services = [
  {
    icon: <Shield className="w-8 h-8 text-gold-400" />,
    title: "Полная Страховка",
    description: "Все автомобили застрахованы по КАСКО без франшизы. Ваше спокойствие — наш приоритет."
  },
  {
    icon: <Clock className="w-8 h-8 text-gold-400" />,
    title: "24/7 Поддержка",
    description: "Персональный менеджер на связи круглосуточно для решения любых вопросов в дороге."
  },
  {
    icon: <Award className="w-8 h-8 text-gold-400" />,
    title: "Безупречное Состояние",
    description: "Каждое авто проходит детейлинг и технический осмотр перед выдачей клиенту."
  },
  {
    icon: <Briefcase className="w-8 h-8 text-gold-400" />,
    title: "Корпоративным Клиентам",
    description: "Специальные условия для юридических лиц, полный пакет закрывающих документов."
  },
  {
    icon: <Gem className="w-8 h-8 text-gold-400" />,
    title: "Свадьбы и Мероприятия",
    description: "Роскошные кортежи для особых случаев. Услуги профессиональных водителей."
  },
  {
    icon: <Plane className="w-8 h-8 text-gold-400" />,
    title: "VIP Трансфер",
    description: "Встреча в аэропорту на автомобиле премиум-класса. Ожидание рейса бесплатно."
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-dark-800 relative border-t border-white/5">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
            Сервис Высшего Класса
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-white">
            Наши Преимущества
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 bg-dark-900 border border-white/5 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="mb-6 bg-dark-800 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-serif text-white mb-4 group-hover:text-gold-400 transition-colors">
                {service.title}
              </h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};