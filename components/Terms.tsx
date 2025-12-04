import React from 'react';

export const Terms: React.FC = () => {
  return (
    <section className="py-24 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-white mb-8">Условия аренды</h1>
        
        <div className="text-gray-400 space-y-6 leading-relaxed">
          <p>
            Мы стремимся сделать процесс аренды автомобиля максимально простым и удобным для вас. Пожалуйста, ознакомьтесь с основными условиями предоставления услуг.
          </p>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">Требования к арендатору</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Возраст от 23 лет.</li>
            <li>Водительский стаж от 2-х лет.</li>
            <li>Наличие действительного водительского удостоверения категории «B» и паспорта.</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">Оплата и условия</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Оплата производится в полном объеме при подписании договора.</li>
            <li>Принимаются наличные, банковские карты и безналичный расчет.</li>
            <li><b>Аренда без залога</b> (для граждан РБ и иностранных граждан).</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">Использование автомобиля</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Суточный лимит пробега — <b>300 км</b> (превышение оплачивается отдельно).</li>
            <li>Выезд за пределы Республики Беларусь возможен только по предварительному согласованию.</li>
            <li>Курение в салоне автомобиля запрещено.</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">Страхование</h3>
          <p>
            Все автомобили застрахованы по системе КАСКО и ОСАГО. Ваша ответственность минимальна.
          </p>
        </div>
      </div>
    </section>
  );
};