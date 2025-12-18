
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const UserAgreement: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-white mb-8">{t('legal.agreementTitle')}</h1>
        
        <div className="text-gray-400 space-y-6 leading-relaxed">
          <p>{t('legal.agreementIntro')}</p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.agreementS1')}</h2>
          <p>
            {t('legal.agreementS1_1')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.agreementS2')}</h2>
          <p>
            {t('legal.agreementS2_1')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.agreementS3')}</h2>
          <p>
            {t('legal.agreementS3_1')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.agreementS4')}</h2>
          <p>
            {t('legal.agreementS4_1')}
          </p>
        </div>
      </div>
    </section>
  );
};
