import React from 'react';
import { FileText, CreditCard, ShieldCheck, UserCheck, Map } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <section className="py-32 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-3 text-sm">
            Важно знать
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-white">
            Условия Аренды
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div className="bg-dark-800 p-8 border border-white/5 hover:border-gold-400/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-3">Требования к арендатору</h4>
                  <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Возраст от 25 лет
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Стаж вождения от 3-х лет
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Отсутствие грубых нарушений ПДД
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-8 border border-white/5 hover:border-gold-400/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-3">Необходимые документы</h4>
                  <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Паспорт (Гражданина РБ или иностранного гражданина)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Водительское удостоверение категории "B" (международного образца)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                      Талон к водительскому удостоверению (для граждан РБ)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 p-8 border border-white/5 hover:border-gold-400/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg">
                  <Map className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-3">Территория эксплуатации</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    Автомобили разрешено эксплуатировать на территории Республики Беларусь.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Выезд за пределы РБ возможен только по предварительному письменному согласованию с компанией и оформлении «Зеленой карты».
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-dark-800 p-8 border border-white/5 hover:border-gold-400/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-3">Оплата и залог</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Оплата производится в белорусских рублях (BYN). Принимаем банковские карты, наличные и безналичный расчет.
                  </p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white font-medium text-sm mb-2">Депозит (Залог)</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Сумма залога зависит от класса автомобиля и возвращается в полном объеме после сдачи автомобиля. Обычно составляет от 1000 до 3500 BYN.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-8 border border-white/5 hover:border-gold-400/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-3">Страхование</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    Все автомобили EliteDrive застрахованы по системе "АвтоКАСКО".
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    В случае ДТП по вине арендатора, ответственность ограничивается размером франшизы (залога), при условии соблюдения условий договора и оформления всех документов ГАИ.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 p-6 bg-gold-400/5 border border-gold-400/20 rounded text-center">
            <p className="text-gold-400 text-sm">
                Остались вопросы? Наш менеджер с радостью проконсультирует вас по всем нюансам аренды.
            </p>
        </div>
      </div>
    </section>
  );
};