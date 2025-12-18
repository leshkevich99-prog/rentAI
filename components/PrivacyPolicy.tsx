
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-white mb-8">{t('legal.privacyTitle')}</h1>
        
        <div className="text-gray-400 space-y-6 leading-relaxed">
          <p>{t('legal.privacyIntro')}</p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.privacyS1')}</h2>
          <p>
            {t('legal.privacyS1_1')}
            <br />
            {t('legal.privacyS1_2')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.privacyS2')}</h2>
          <p>
            {t('legal.privacyS2_1')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.privacyS3')}</h2>
          <p>
            {t('legal.privacyS3_1')}
          </p>

          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.privacyS4')}</h2>
          <p>
            {t('legal.privacyS4_1')}
          </p>
          
          <h2 className="text-xl text-white font-bold mt-8 mb-4">{t('legal.privacyS5')}</h2>
          <p>
            {t('legal.privacyS5_1')}
          </p>
        </div>
      </div>
    </section>
  );
};
