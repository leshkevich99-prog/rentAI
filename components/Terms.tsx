
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-white mb-8">{t('legal.termsTitle')}</h1>
        
        <div className="text-gray-400 space-y-6 leading-relaxed">
          <p>{t('legal.termsP1')}</p>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">{t('legal.reqTitle')}</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('legal.req1')}</li>
            <li>{t('legal.req2')}</li>
            <li>{t('legal.req3')}</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">{t('legal.payTitle')}</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('legal.pay1')}</li>
            <li>{t('legal.pay2')}</li>
            <li>{t('legal.pay3')}</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">{t('legal.useTitle')}</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('legal.use1')}</li>
            <li>{t('legal.use2')}</li>
            <li>{t('legal.use3')}</li>
          </ul>

          <h3 className="text-xl text-white font-bold mt-6 mb-3">{t('legal.insTitle')}</h3>
          <p>{t('legal.insDesc')}</p>
        </div>
      </div>
    </section>
  );
};
