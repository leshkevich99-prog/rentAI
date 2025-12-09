
import React from 'react';
import { ShieldCheck, Clock, CheckCircle, Briefcase, Gem, Plane } from 'lucide-react';

const services = [
  {
    icon: <ShieldCheck strokeWidth={1} className="w-6 h-6" />,
    title: "Полная Страховка",
    description: "КАСКО без франшизы. Ваше спокойствие — наш приоритет."
  },
  {
    icon: <Clock strokeWidth={1} className="w-6 h-6" />,
    title: "24/7 Поддержка",
    description: "Персональный менеджер на связи круглосуточно."
  },
  {
    icon: <CheckCircle strokeWidth={1} className="w-6 h-6" />,
    title: "Идеальное Состояние",
    description: "Детейлинг и технический осмотр перед каждой выдачей."
  },
  {
    icon: <Briefcase strokeWidth={1} className="w-6 h-6" />,
    title: "Для Бизнеса",
    description: "Полный пакет документов для юридических лиц."
  },
  {
    icon: <Gem strokeWidth={1} className="w-6 h-6" />,
    title: "Мероприятия",
    description: "Эскорт и кортежи для свадеб и особых событий."
  },
  {
    icon: <Plane strokeWidth={1} className="w-6 h-6" />,
    title: "VIP Трансфер",
    description: "Встреча в аэропорту с комфортом."
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 bg-dark-950 relative">
       <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Heading */}
            <div className="lg:col-span-4">
                <h2 className="text-gold-400 font-semibold uppercase tracking-luxury text-xs mb-6">
                    Сервис
                </h2>
                <h3 className="font-serif text-5xl text-white mb-8 leading-tight">
                    Стандарты <br/> Качества
                </h3>
                <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                    Мы уделяем внимание каждой детали, чтобы ваш опыт аренды был безупречным. От чистоты салона до прозрачности договора.
                </p>
            </div>

            {/* Grid */}
            <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {services.map((service, index) => (
                    <div key={index} className="group">
                        <div className="mb-6 text-gold-400 group-hover:text-white transition-colors duration-500">
                            {service.icon}
                        </div>
                        <h4 className="text-lg font-serif text-white mb-3">
                            {service.title}
                        </h4>
                        <p className="text-gray-500 text-sm font-light leading-relaxed group-hover:text-gray-400 transition-colors">
                            {service.description}
                        </p>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
